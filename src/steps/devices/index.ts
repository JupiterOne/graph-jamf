import {
  createDirectRelationship,
  createMappedRelationship,
  Entity,
  IntegrationError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  JobState,
  RelationshipClass,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';
import { createClient, JamfClient } from '../../jamf/client';
import { IntegrationConfig } from '../../config';
import {
  Entities,
  Relationships,
  MAC_OS_CONFIGURATION_DETAILS_BY_ID_KEY,
  IntegrationSteps,
} from '../constants';
import {
  createMobileDeviceEntity,
  createComputerEntity,
  createMacOsConfigurationEntity,
} from './converters';
import {
  Computer,
  ComputerDetail,
  Configuration,
  MobileDevice,
  OSXConfigurationDetailParsed,
} from '../../jamf/types';
import { getAccountEntity } from '../../util/account';
import { toOSXConfigurationDetailParsed } from '../../util/toOSXConfigurationParsed';
import { generateEntityKey, generateRelationKey } from '../../util/generateKey';

type MacOsConfigurationDetailsById = Map<number, OSXConfigurationDetailParsed>;

async function iterateMobileDevices(
  client: JamfClient,
  iteratee: (user: MobileDevice) => Promise<void>,
) {
  for (const device of await client.fetchMobileDevices()) {
    await iteratee(device);
  }
}

async function iterateComputerDetails(
  client: JamfClient,
  iteratee: (
    computer: Computer,
    computerDetail: ComputerDetail,
  ) => Promise<void>,
) {
  for (const computer of await client.fetchComputers()) {
    await iteratee(computer, await client.fetchComputerById(computer.id));
  }
}

async function iterateMacOsConfigurationDetails(
  client: JamfClient,
  iteratee: (
    configuration: Configuration,
    parsedConfiguration: OSXConfigurationDetailParsed,
  ) => Promise<void>,
) {
  const macOsConfigurationProfiles = await client.fetchOSXConfigurationProfiles();

  for (const profile of macOsConfigurationProfiles) {
    const details = await client.fetchOSXConfigurationProfileById(profile.id);
    const parsed = toOSXConfigurationDetailParsed(details);
    await iteratee(profile, parsed);
  }
}

async function createComputerUsesProfileRelationships(
  jobState: JobState,
  computerEntity: Entity,
  computerDetail: ComputerDetail,
) {
  for (const profile of computerDetail.configuration_profiles || []) {
    const profileEntity = await jobState.findEntity(
      generateEntityKey(
        Entities.MAC_OS_CONFIGURATION_PROFILE._type,
        profile.id,
      ),
    );

    if (!profileEntity) {
      continue;
    }

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.USES,
        from: computerEntity,
        to: profileEntity,
      }),
    );
  }
}

async function createComputerInstalledApplicationRelationships(
  jobState: JobState,
  computerEntity: Entity,
  computerDetail: ComputerDetail,
) {
  const mappedRelationshipKeySet = new Set<string>();

  for (const application of computerDetail.software.applications || []) {
    const childKey = generateEntityKey(
      Entities.MAC_OS_APPLICATION._type,
      `${application.name}_${application.version}`,
    );

    const mappedRelationshipKey = generateRelationKey(
      computerEntity._key,
      RelationshipClass.INSTALLED,
      childKey,
    );

    if (mappedRelationshipKeySet.has(mappedRelationshipKey)) {
      continue;
    }

    await jobState.addRelationship(
      createMappedRelationship({
        _key: mappedRelationshipKey,
        _class: RelationshipClass.INSTALLED,
        _type: Relationships.COMPUTER_INSTALLED_APPLICATION._type,
        _mapping: {
          relationshipDirection: RelationshipDirection.FORWARD,
          sourceEntityKey: computerEntity._key,
          skipTargetCreation: false,
          targetFilterKeys: [['_type', 'name']],
          targetEntity: {
            _class: Entities.MAC_OS_APPLICATION._class,
            _type: Entities.MAC_OS_APPLICATION._type,
            displayName: application.name,
            name: application.name,
            path: application.path,
            version: application.version,
          },
        },
        properties: {
          path: application.path,
          version: application.version,
        },
      }),
    );

    mappedRelationshipKeySet.add(mappedRelationshipKey);
  }
}

export async function fetchMobileDevices({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;

  const client = createClient({
    host: config.jamfHost,
    username: config.jamfUsername,
    password: config.jamfPassword,
    logger,
  });

  const accountEntity = await getAccountEntity(jobState);

  await iterateMobileDevices(client, async (device) => {
    const mobileDeviceEntity = await jobState.addEntity(
      createMobileDeviceEntity(device),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: mobileDeviceEntity,
      }),
    );
  });
}

export async function fetchMacOsConfigurationDetails({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;

  const client = createClient({
    host: config.jamfHost,
    username: config.jamfUsername,
    password: config.jamfPassword,
    logger,
  });

  // This map is used in a later step
  const macOsConfigurationDetailsById: MacOsConfigurationDetailsById = new Map();

  const accountEntity = await getAccountEntity(jobState);
  await iterateMacOsConfigurationDetails(
    client,
    async (configuration, parsedMacOsConfigurationDetail) => {
      const configurationEntity = await jobState.addEntity(
        createMacOsConfigurationEntity(parsedMacOsConfigurationDetail),
      );

      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: configurationEntity,
        }),
      );

      macOsConfigurationDetailsById.set(
        configuration.id,
        parsedMacOsConfigurationDetail,
      );
    },
  );

  await jobState.setData(
    MAC_OS_CONFIGURATION_DETAILS_BY_ID_KEY,
    macOsConfigurationDetailsById,
  );
}

export async function fetchComputers({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;

  const client = createClient({
    host: config.jamfHost,
    username: config.jamfUsername,
    password: config.jamfPassword,
    logger,
  });

  const accountEntity = await getAccountEntity(jobState);
  const macOsConfigurationDetailByIdMap = await jobState.getData<
    MacOsConfigurationDetailsById | undefined
  >(MAC_OS_CONFIGURATION_DETAILS_BY_ID_KEY);

  if (!macOsConfigurationDetailByIdMap) {
    throw new IntegrationError({
      message: 'Could not find macOS configuration details in job state',
      code: 'MAC_OS_CONFIGURATION_DETAILS_NOT_FOUND',
    });
  }

  await iterateComputerDetails(client, async (computer, computerDetail) => {
    const computerEntity = await jobState.addEntity(
      createComputerEntity(
        computer,
        macOsConfigurationDetailByIdMap,
        computerDetail,
      ),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: computerEntity,
      }),
    );

    await createComputerUsesProfileRelationships(
      jobState,
      computerEntity,
      computerDetail,
    );

    await createComputerInstalledApplicationRelationships(
      jobState,
      computerEntity,
      computerDetail,
    );
  });
}

export const deviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.MACOS_CONFIGURATION_PROFILES,
    name: 'Fetch macOS Configuration Profiles',
    entities: [Entities.MAC_OS_CONFIGURATION_PROFILE],
    relationships: [Relationships.ACCOUNT_HAS_MAC_OS_CONFIGURATION_PROFILE],
    executionHandler: fetchMacOsConfigurationDetails,
    dependsOn: [IntegrationSteps.ACCOUNTS],
  },
  {
    id: IntegrationSteps.MOBILE_DEVICES,
    name: 'Fetch Mobile Devices',
    entities: [Entities.MOBILE_DEVICE],
    relationships: [Relationships.ACCOUNT_HAS_MOBILE_DEVICE],
    executionHandler: fetchMobileDevices,
    dependsOn: [IntegrationSteps.ACCOUNTS],
  },
  {
    id: IntegrationSteps.COMPUTERS,
    name: 'Fetch Computers',
    entities: [Entities.COMPUTER],
    relationships: [
      Relationships.ACCOUNT_HAS_COMPUTER,
      Relationships.COMPUTER_USES_PROFILE,
      Relationships.COMPUTER_INSTALLED_APPLICATION,
    ],
    executionHandler: fetchComputers,
    dependsOn: [
      IntegrationSteps.ACCOUNTS,
      IntegrationSteps.MACOS_CONFIGURATION_PROFILES,
    ],
  },
];
