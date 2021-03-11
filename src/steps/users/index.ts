import {
  createDirectRelationship,
  Entity,
  IntegrationError,
  IntegrationLogger,
  IntegrationStep,
  IntegrationStepExecutionContext,
  JobState,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createClient, JamfClient } from '../../jamf/client';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createAdminEntity, createDeviceUserEntity } from './converters';
import { Admin, User } from '../../jamf/types';
import { getAccountData, getAccountEntity } from '../../util/account';
import { generateEntityKey } from '../../util/generateKey';
import { wrapWithTimer } from '../../util/timer';

async function iterateAdminUserProfiles(
  client: JamfClient,
  logger: IntegrationLogger,
  jobState: JobState,
  iteratee: (user: Admin) => Promise<void>,
) {
  const accountData = await getAccountData(jobState);
  logger.info({ numAdmins: accountData.users }, 'Iterating account admins');

  for (const user of accountData.users) {
    await iteratee(await client.fetchAccountUserById(user.id));
  }
}

async function iterateUserProfiles(
  client: JamfClient,
  logger: IntegrationLogger,
  iteratee: (user: User) => Promise<void>,
) {
  const users = await wrapWithTimer(() => client.fetchUsers(), {
    logger,
    operationName: 'client_fetch_users',
  });

  logger.info({ numUsers: users.length }, 'Successfully fetched users');

  let numUserProfileFetchSuccess: number = 0;
  let numUserProfileFetchFailed: number = 0;

  for (const user of users) {
    let userFullProfile: User;

    try {
      userFullProfile = await wrapWithTimer(
        async () => client.fetchUserById(user.id),
        {
          logger,
          operationName: 'client_fetch_user_by_id',
          metadata: {
            userId: user.id,
          },
        },
      );

      numUserProfileFetchSuccess++;
    } catch (err) {
      logger.error(
        {
          err,
          userId: user.id,
        },
        'Could not fetch user profile by id',
      );
      numUserProfileFetchFailed++;
      continue;
    }

    await iteratee(userFullProfile);
  }

  if (numUserProfileFetchFailed) {
    throw new IntegrationError({
      message: `Unable to fetch all user profiles (success=${numUserProfileFetchSuccess}, failed=${numUserProfileFetchFailed})`,
      code: 'ERROR_FETCH_USER_PROFILES',
    });
  }
}

async function createUserHasMobileDeviceRelationships(
  logger: IntegrationLogger,
  jobState: JobState,
  userEntity: Entity,
  user: User,
) {
  for (const mobileDevice of user.links?.mobile_devices || []) {
    const mobileDeviceEntityKey = generateEntityKey(
      Entities.MOBILE_DEVICE._type,
      mobileDevice.id,
    );

    // NOTE: This is probably a very a slow operation due to the way that
    // `findEntity` is currently implemented...
    const mobileDeviceEntity = await wrapWithTimer(
      async () => jobState.findEntity(mobileDeviceEntityKey),
      {
        logger,
        operationName: 'find_mobile_device_entity',
        metadata: {
          mobileDeviceEntityKey,
        },
      },
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
  logger: IntegrationLogger,
  jobState: JobState,
  userEntity: Entity,
  user: User,
) {
  for (const computerDevice of user.links?.computers || []) {
    const computerDeviceEntityKey = generateEntityKey(
      Entities.COMPUTER._type,
      computerDevice.id,
    );

    // NOTE: This is probably a very a slow operation due to the way that
    // `findEntity` is currently implemented...
    const computerDeviceEntity = await wrapWithTimer(
      async () => jobState.findEntity(computerDeviceEntityKey),
      {
        logger,
        operationName: 'find_computer_device_entity',
        metadata: {
          computerDeviceEntityKey,
        },
      },
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

  await iterateAdminUserProfiles(client, logger, jobState, async (user) => {
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

  await iterateUserProfiles(client, logger, async (user) => {
    const userEntity = await jobState.addEntity(createDeviceUserEntity(user));

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: userEntity,
      }),
    );

    await createUserHasMobileDeviceRelationships(
      logger,
      jobState,
      userEntity,
      user,
    );

    await createUserHasComputerDeviceRelationships(
      logger,
      jobState,
      userEntity,
      user,
    );
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ADMINS,
    name: 'Fetch Admins',
    entities: [Entities.USER_ADMIN],
    relationships: [Relationships.ACCOUNT_HAS_USER_ADMIN],
    executionHandler: fetchAdminUsers,
    dependsOn: [IntegrationSteps.ACCOUNTS],
  },
  {
    id: IntegrationSteps.DEVICE_USERS,
    name: 'Fetch Device Users',
    entities: [Entities.DEVICE_USER],
    relationships: [
      Relationships.ACCOUNT_HAS_DEVICE_USER,
      Relationships.DEVICE_USER_HAS_MOBILE_DEVICE,
      Relationships.DEVICE_USER_HAS_COMPUTER,
    ],
    executionHandler: fetchDeviceUsers,
    dependsOn: [
      IntegrationSteps.ACCOUNTS,
      IntegrationSteps.MOBILE_DEVICES,
      IntegrationSteps.COMPUTERS,
    ],
  },
];
