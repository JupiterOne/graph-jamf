import {
  createDirectRelationship,
  createMappedRelationship,
  Entity,
  IntegrationError,
  IntegrationLogger,
  IntegrationStep,
  IntegrationStepExecutionContext,
  JobState,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IJamfClient, JamfClient } from '../../jamf/client';
import { IntegrationConfig } from '../../config';
import {
  Entities,
  Relationships,
  MAC_OS_CONFIGURATION_DETAILS_BY_ID_KEY,
  IntegrationSteps,
  MappedRelationships,
} from '../constants';
import {
  createMobileDeviceEntity,
  createComputerEntity,
  createMacOsConfigurationEntity,
  createComputerGroupEntity,
} from './converters';
import {
  Computer,
  ComputerDetail,
  Configuration,
  MobileDevice,
  MobileDeviceDetail,
  OSXConfigurationDetail,
  OSXConfigurationDetailParsed,
} from '../../jamf/types';
import { getAccountEntity } from '../../util/account';
import { toOSXConfigurationDetailParsed } from '../../util/toOSXConfigurationParsed';
import { generateEntityKey, generateRelationKey } from '../../util/generateKey';
import {
  DeviceIdToGraphObjectKeyMap,
  setComputerDeviceIdToGraphObjectKeyMap,
  setMobileDeviceIdToGraphObjectKeyMap,
} from '../../util/device';

type MacOsConfigurationDetailsById = Map<number, OSXConfigurationDetailParsed>;

interface SortableDevice {
  id: number;
}

/**
 * Ensure that we always process the devices from newest record to oldest
 * record. Sometimes there are multiple devices with the same serial number. We
 * trust that the computer with a higher ID is the latest device record.
 */
function sortByDeviceIdDesc<T extends SortableDevice>(devices: T[]): T[] {
  return devices.sort((a, b) => b.id - a.id);
}

async function iterateMobileDevices(
  client: IJamfClient,
  logger: IntegrationLogger,
  iteratee: (
    device: MobileDevice,
    deviceDetail: MobileDeviceDetail,
  ) => Promise<void>,
) {
  const mobileDevices = sortByDeviceIdDesc(await client.fetchMobileDevices());
  logger.info(
    { numDevices: mobileDevices.length },
    'Successfully fetched mobile devices',
  );

  let numDeviceDetailFetchSuccess: number = 0;
  const deviceIdsFetchFailedSet = new Set<string>();

  for (const device of mobileDevices) {
    let deviceDetail: MobileDeviceDetail;

    if (typeof device.id === 'undefined') {
      logger.warn(`Found an "undefined" computer ID!`);
      continue;
    }

    try {
      deviceDetail = await client.fetchMobileDeviceById(device.id);
      numDeviceDetailFetchSuccess++;
    } catch (err) {
      // We sometimes see errors (e.g. 502 Bad Gateway) from the above API. If
      // we fail to fetch a single device, we should not just exit the entire
      // step.
      logger.warn(
        {
          err,
          deviceId: device.id,
        },
        'Could not fetch mobile device by id',
      );

      deviceIdsFetchFailedSet.add(device.id.toString());
      continue;
    }

    await iteratee(device, deviceDetail);
  }

  logger.info(
    {
      numDeviceDetailFetchSuccess,
      numDeviceDetailFetchFailed: deviceIdsFetchFailedSet.size,
    },
    'Number of computer details processed',
  );

  if (deviceIdsFetchFailedSet.size) {
    // The Jamf API is failing intermittemently with 500 errors. The same
    // device IDs are causing failures across integration executions. We'll
    // be reporting this issue to Jamf.
    logger.info(
      {
        deviceIdsFailed: Array.from(deviceIdsFetchFailedSet),
      },
      'Could not fetch computer details for IDs',
    );
  }
}

async function iterateComputerDetails(
  client: IJamfClient,
  logger: IntegrationLogger,
  iteratee: (
    computer: Computer,
    computerDetail: ComputerDetail,
  ) => Promise<void>,
) {
  const computers = sortByDeviceIdDesc(await client.fetchComputers());
  logger.info(
    { numComputer: computers.length },
    'Successfully fetched computers',
  );

  let numComputerDetailFetchSuccess: number = 0;
  const computerIdsFetchFailedSet = new Set<string>();

  for (const computer of computers) {
    let computerDetail: ComputerDetail;

    if (typeof computer.id === 'undefined') {
      logger.warn(`Found an "undefined" computer ID!`);
      continue;
    }

    try {
      computerDetail = await client.fetchComputerById(computer.id);
      numComputerDetailFetchSuccess++;
    } catch (err) {
      // We sometimes see errors (e.g. 502 Bad Gateway) from the above API. If
      // we fail to fetch a single computer, we should not just exit the entire
      // step.
      logger.warn(
        {
          err,
          computerId: computer.id,
        },
        'Could not fetch computer by id',
      );

      computerIdsFetchFailedSet.add(computer.id.toString());
      continue;
    }

    await iteratee(computer, computerDetail);
  }

  logger.info(
    {
      numComputerDetailFetchSuccess,
      numComputerDetailFetchFailed: computerIdsFetchFailedSet.size,
    },
    'Number of computer details processed',
  );

  if (computerIdsFetchFailedSet.size) {
    // The Jamf API is failing intermittemently with 500 errors. The same
    // computer IDs are causing failures across integration executions. We'll
    // be reporting this issue to Jamf.
    logger.info(
      {
        computerIdsFailed: Array.from(computerIdsFetchFailedSet),
      },
      'Could not fetch computer details for IDs',
    );
  }
}

async function iterateMacOsConfigurationDetails(
  client: IJamfClient,
  logger: IntegrationLogger,
  iteratee: (
    configuration: Configuration,
    parsedConfiguration: OSXConfigurationDetail,
  ) => Promise<void>,
) {
  const macOsConfigurationProfiles =
    await client.fetchOSXConfigurationProfiles();

  logger.info(
    { numProfiles: macOsConfigurationProfiles.length },
    'Successfully fetched configuration profiles',
  );

  for (const profile of macOsConfigurationProfiles) {
    const details = await client.fetchOSXConfigurationProfileById(profile.id);
    await iteratee(profile, details);
  }
}

async function createComputerUsesProfileRelationships(
  logger: IntegrationLogger,
  jobState: JobState,
  computerEntity: Entity,
  computerDetail: ComputerDetail,
) {
  const configurationProfileIdSet = new Set<number>();
  const duplicateConfigurationProfileIds: number[] = [];

  for (const profile of computerDetail.configuration_profiles || []) {
    // See https://github.com/JupiterOne/graph-jamf/issues/39
    //
    // It seems as if multiple configuration profiles share the same ID on an
    // individual `ComputerDetail`. We don't want to try creating a duplicate
    // relationship, so we'll skip ones that we've seen.
    if (configurationProfileIdSet.has(profile.id)) {
      duplicateConfigurationProfileIds.push(profile.id);
      continue;
    }

    configurationProfileIdSet.add(profile.id);

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

  if (duplicateConfigurationProfileIds.length) {
    logger.info(
      {
        computerEntityKey: computerEntity._key,
        duplicateConfigurationProfileIds,
      },
      'Found duplicate configuration profile IDs on computer',
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
        _type: MappedRelationships.COMPUTER_INSTALLED_APPLICATION._type,
        _mapping: {
          relationshipDirection:
            MappedRelationships.COMPUTER_INSTALLED_APPLICATION.direction,
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

  const client = JamfClient.getInstance({
    host: config.jamfHost,
    username: config.jamfUsername,
    password: config.jamfPassword,
  });
  await client.initialize();

  const accountEntity = await getAccountEntity(jobState);
  const mobileDeviceIdToGraphObjectKeyMap: DeviceIdToGraphObjectKeyMap =
    new Map();

  await iterateMobileDevices(client, logger, async (device, deviceDetail) => {
    const previouslyDiscoveredDevice = await jobState.hasKey(
      device.serial_number,
    );

    const mobileDeviceEntity = await jobState.addEntity(
      createMobileDeviceEntity(
        device,
        deviceDetail,
        previouslyDiscoveredDevice,
      ),
    );

    mobileDeviceIdToGraphObjectKeyMap.set(device.id, mobileDeviceEntity._key);

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: mobileDeviceEntity,
      }),
    );
  });

  await setMobileDeviceIdToGraphObjectKeyMap(
    jobState,
    mobileDeviceIdToGraphObjectKeyMap,
  );
}

export async function fetchMacOsConfigurationDetails({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;

  const client = JamfClient.getInstance({
    host: config.jamfHost,
    username: config.jamfUsername,
    password: config.jamfPassword,
  });
  await client.initialize();

  // This map is used in a later step
  const macOsConfigurationDetailsById: MacOsConfigurationDetailsById =
    new Map();

  const accountEntity = await getAccountEntity(jobState);
  await iterateMacOsConfigurationDetails(
    client,
    logger,
    async (configuration, macOsConfigurationDetail) => {
      const parsedPayload = toOSXConfigurationDetailParsed(
        macOsConfigurationDetail.general.payloads,
      );

      const parsedMacOsConfigurationDetail: OSXConfigurationDetailParsed = {
        ...macOsConfigurationDetail,
        parsedPayload,
      };

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

async function createComputerGroupEntities({
  computerDetail,
  computerEntity,
  jobState,
}: {
  computerDetail: ComputerDetail;
  computerEntity: Entity;
  jobState: JobState;
}) {
  for (const group of computerDetail.groups_accounts
    .computer_group_memberships) {
    let computerGroupEntity = await jobState.findEntity(
      generateEntityKey(Entities.COMPUTER_GROUP._type, group),
    );
    if (computerGroupEntity === null) {
      //Add additional groups if they don't yet exist in the jobState
      computerGroupEntity = await jobState.addEntity(
        createComputerGroupEntity(group),
      );
    }

    // Some large Jamf datasets are causing issues with duplicate relationships,
    // so check that we won't have a duplicate before creating.
    const groupHasComputerRelatioinship = createDirectRelationship({
      _class: RelationshipClass.HAS,
      from: computerGroupEntity,
      to: computerEntity,
    });

    if (!(await jobState.hasKey(groupHasComputerRelatioinship._key))) {
      await jobState.addRelationship(groupHasComputerRelatioinship);
    }
  }
}

export async function fetchComputers({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;

  const client = JamfClient.getInstance({
    host: config.jamfHost,
    username: config.jamfUsername,
    password: config.jamfPassword,
  });
  await client.initialize();

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

  const computerDeviceIdToGraphObjectKeyMap: DeviceIdToGraphObjectKeyMap =
    new Map();

  await iterateComputerDetails(
    client,
    logger,
    async (computer, computerDetail) => {
      const previouslyDiscoveredDevice = await jobState.hasKey(
        computer.serial_number,
      );

      const computerEntity = await jobState.addEntity(
        createComputerEntity({
          device: computer,
          macOsConfigurationDetailByIdMap,
          detailData: computerDetail,
          previouslyDiscoveredDevice,
        }),
      );

      computerDeviceIdToGraphObjectKeyMap.set(computer.id, computerEntity._key);

      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: computerEntity,
        }),
      );

      await createComputerUsesProfileRelationships(
        logger,
        jobState,
        computerEntity,
        computerDetail,
      );

      await createComputerInstalledApplicationRelationships(
        jobState,
        computerEntity,
        computerDetail,
      );

      await createLocalAccountUsesComputerRelationships(
        jobState,
        computerEntity,
        computerDetail,
      );

      await createComputerGroupEntities({
        jobState,
        computerDetail,
        computerEntity,
      });
    },
  );

  await setComputerDeviceIdToGraphObjectKeyMap(
    jobState,
    computerDeviceIdToGraphObjectKeyMap,
  );
}

async function createLocalAccountUsesComputerRelationships(
  jobState: JobState,
  computerEntity: Entity,
  computerDetail: ComputerDetail,
) {
  const mappedRelationshipKeySet = new Set<string>();

  for (const localAccount of computerDetail.groups_accounts.local_accounts ||
    []) {
    const childKey = generateEntityKey(
      Entities.LOCAL_ACCOUNT._type,
      `${localAccount.name}_${localAccount.uid}_${localAccount.home}`,
    );

    const mappedRelationshipKey = generateRelationKey(
      childKey,
      RelationshipClass.USES,
      computerEntity._key,
    );

    if (mappedRelationshipKeySet.has(mappedRelationshipKey)) {
      continue;
    }

    await jobState.addRelationship(
      createMappedRelationship({
        _key: mappedRelationshipKey,
        _class: RelationshipClass.USES,
        _type: MappedRelationships.LOCAL_ACCOUNT_USES_COMPUTER._type,
        _mapping: {
          relationshipDirection:
            MappedRelationships.LOCAL_ACCOUNT_USES_COMPUTER.direction,
          sourceEntityKey: computerEntity._key,
          skipTargetCreation: false,
          targetFilterKeys: [['_type', 'name', 'uid', 'home']],
          targetEntity: {
            _class: Entities.LOCAL_ACCOUNT._class,
            _type: Entities.LOCAL_ACCOUNT._type,
            displayName: localAccount.name,
            name: localAccount.name,
            realName: localAccount.realname,
            uid: localAccount.uid,
            home: localAccount.home,
          },
        },
        properties: {
          homeSize: localAccount.home_size,
          homeSizeMb: localAccount.home_size_mb,
          administrator: localAccount.administrator,
          filevaultEnabled: localAccount.filevault_enabled,
        },
      }),
    );

    mappedRelationshipKeySet.add(mappedRelationshipKey);
  }
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
    entities: [Entities.COMPUTER, Entities.COMPUTER_GROUP],
    relationships: [
      Relationships.ACCOUNT_HAS_COMPUTER,
      Relationships.COMPUTER_USES_PROFILE,
      Relationships.COMPUTER_GROUP_HAS_COMPUTER,
    ],
    mappedRelationships: [
      MappedRelationships.COMPUTER_INSTALLED_APPLICATION,
      MappedRelationships.LOCAL_ACCOUNT_USES_COMPUTER,
    ],
    executionHandler: fetchComputers,
    dependsOn: [
      IntegrationSteps.ACCOUNTS,
      IntegrationSteps.MACOS_CONFIGURATION_PROFILES,
    ],
  },
];
