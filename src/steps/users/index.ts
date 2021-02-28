import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  JobState,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createClient, JamfClient } from '../../jamf/client';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships } from '../constants';
import { createAdminEntity, createDeviceUserEntity } from './converters';
import { Admin, User } from '../../jamf/types';
import { getAccountData, getAccountEntity } from '../../util/account';
import { generateEntityKey } from '../../util/generateKey';

async function iterateAdminUserProfiles(
  client: JamfClient,
  jobState: JobState,
  iteratee: (user: Admin) => Promise<void>,
) {
  const accountData = await getAccountData(jobState);

  for (const user of accountData.users) {
    await iteratee(await client.fetchAccountUserById(user.id));
  }
}

async function iterateUserProfiles(
  client: JamfClient,
  iteratee: (user: User) => Promise<void>,
) {
  const users = await client.fetchUsers();

  for (const user of users) {
    await iteratee(await client.fetchUserById(user.id));
  }
}

async function createUserHasMobileDeviceRelationships(
  jobState: JobState,
  userEntity: Entity,
  user: User,
) {
  for (const mobileDevice of user.links?.mobile_devices || []) {
    const mobileDeviceEntity = await jobState.findEntity(
      generateEntityKey(Entities.MOBILE_DEVICE._type, mobileDevice.id),
    );

    if (!mobileDeviceEntity) {
      continue;
    }

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: userEntity,
        to: mobileDeviceEntity,
      }),
    );
  }
}

async function createUserHasComputerDeviceRelationships(
  jobState: JobState,
  userEntity: Entity,
  user: User,
) {
  for (const computerDevice of user.links?.computers || []) {
    const computerDeviceEntity = await jobState.findEntity(
      generateEntityKey(Entities.COMPUTER._type, computerDevice.id),
    );

    if (!computerDeviceEntity) {
      continue;
    }

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: userEntity,
        to: computerDeviceEntity,
      }),
    );
  }
}

export async function fetchAdminUsers({
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

  await iterateAdminUserProfiles(client, jobState, async (user) => {
    const adminEntity = await jobState.addEntity(createAdminEntity(user));

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: adminEntity,
      }),
    );
  });
}

export async function fetchDeviceUsers({
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

  await iterateUserProfiles(client, async (user) => {
    const userEntity = await jobState.addEntity(createDeviceUserEntity(user));

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: userEntity,
      }),
    );

    await createUserHasMobileDeviceRelationships(jobState, userEntity, user);

    await createUserHasComputerDeviceRelationships(jobState, userEntity, user);
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'fetch-admins',
    name: 'Fetch Admins',
    entities: [Entities.USER_ADMIN],
    relationships: [Relationships.ACCOUNT_HAS_USER_ADMIN],
    executionHandler: fetchAdminUsers,
    dependsOn: ['fetch-accounts'],
  },
  {
    id: 'fetch-device-users',
    name: 'Fetch Device Users',
    entities: [Entities.DEVICE_USER],
    relationships: [
      Relationships.ACCOUNT_HAS_DEVICE_USER,
      Relationships.DEVICE_USER_HAS_MOBILE_DEVICE,
      Relationships.DEVICE_USER_HAS_COMPUTER,
    ],
    executionHandler: fetchDeviceUsers,
    dependsOn: ['fetch-accounts', 'fetch-mobile-devices', 'fetch-computers'],
  },
];
