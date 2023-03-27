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
import { JamfClient } from '../../jamf/client';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createAdminEntity, createDeviceUserEntity } from './converters';
import { Admin, User } from '../../jamf/types';
import { getAccountData, getAccountEntity } from '../../util/account';
import { wrapWithTimer } from '../../util/timer';
import {
  getComputerDeviceIdToGraphObjectKeyMap,
  getMobileDeviceIdToGraphObjectKeyMap,
} from '../../util/device';
import pMap from 'p-map';

async function iterateAdminUserProfiles(
  client: JamfClient,
  logger: IntegrationLogger,
  jobState: JobState,
  iteratee: (user: Admin) => Promise<void>,
) {
  const accountData = await getAccountData(jobState);
  logger.info(
    {
      numAdmins: accountData.users.length,
    },
    'Iterating account admins',
  );

  let numUserAdminProfileFetchSuccess: number = 0;
  let numUserAdminProfileFetchFailed: number = 0;

  const batchSize = 5;

  const mapper = async (user) => {
    let userAdminFullProfile: Admin;
    try {
      userAdminFullProfile = await wrapWithTimer(
        async () => client.fetchAccountUserById(user.id),
        {
          logger,
          operationName: 'client_fetch_account_user_by_id',
          metadata: {
            userId: user.id,
          },
        },
      );
      await iteratee(userAdminFullProfile);
      numUserAdminProfileFetchSuccess++;
    } catch (err) {
      logger.error(
        {
          err,
          userId: user.id,
        },
        'Could not fetch user profile by id',
      );
      numUserAdminProfileFetchFailed++;
    }
  };

  await pMap(accountData.users, mapper, { concurrency: batchSize });

  if (numUserAdminProfileFetchFailed) {
    throw new IntegrationError({
      message: `Unable to fetch all admin user profiles (success=${numUserAdminProfileFetchSuccess}, failed=${numUserAdminProfileFetchFailed})`,
      code: 'ERROR_FETCH_ADMIN_USER_PROFILES',
    });
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

  const batchSize = 5;

  const mapper = async (user) => {
    let userFullProfile: User | undefined;
    try {
      userFullProfile = await wrapWithTimer(
        async () => {
          try {
            return await client.fetchUserById(user.id);
          } catch (err) {
            if (err.status === 401) {
              logger.error(
                { err, userId: user.id },
                `Could not feth user profile by id (userId=${user.id}). 401 Unauthorized.`,
              );
            } else {
              throw err;
            }
          }
        },
        {
          logger,
          operationName: 'client_fetch_user_by_id',
          metadata: {
            userId: user.id,
          },
        },
      );

      if (userFullProfile !== undefined) {
        await iteratee(userFullProfile);
        numUserProfileFetchSuccess++;
      }
    } catch (err) {
      logger.error(
        {
          err,
          userId: user.id,
        },
        'Could not fetch user profile by id',
      );
      numUserProfileFetchFailed++;
    }
  };

  await pMap(users, mapper, { concurrency: batchSize });

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
  const mobileDeviceIdToGraphObjectKeyMap =
    await getMobileDeviceIdToGraphObjectKeyMap(jobState);

  const mobileDeviceIdsNotFound: number[] = [];

  for (const mobileDevice of user.links?.mobile_devices || []) {
    const mobileDeviceEntityKey = mobileDeviceIdToGraphObjectKeyMap.get(
      mobileDevice.id,
    );

    if (!mobileDeviceEntityKey) {
      mobileDeviceIdsNotFound.push(mobileDevice.id);
      continue;
    }

    const mobileDeviceEntity = await jobState.findEntity(mobileDeviceEntityKey);

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

  if (mobileDeviceIdsNotFound.length) {
    logger.info(
      {
        mobileDeviceIdsNotFound,
      },
      'Missing mobile device IDs. Could not build relationships to user.',
    );
  }
}

async function createUserHasComputerDeviceRelationships(
  logger: IntegrationLogger,
  jobState: JobState,
  userEntity: Entity,
  user: User,
) {
  const computerDeviceIdToGraphObjectKeyMap =
    await getComputerDeviceIdToGraphObjectKeyMap(jobState);

  const computerDeviceIdsNotFound: number[] = [];

  for (const computerDevice of user.links?.computers || []) {
    const computerDeviceEntityKey = computerDeviceIdToGraphObjectKeyMap.get(
      computerDevice.id,
    );

    if (!computerDeviceEntityKey) {
      computerDeviceIdsNotFound.push(computerDevice.id);
      continue;
    }

    const computerDeviceEntity = await jobState.findEntity(
      computerDeviceEntityKey,
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

  if (computerDeviceIdsNotFound.length) {
    logger.info(
      {
        computerDeviceIdsNotFound,
      },
      'Missing computer device IDs. Could not build relationships to user.',
    );
  }
}

export async function fetchAdminUsers({
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

  const client = JamfClient.getInstance({
    host: config.jamfHost,
    username: config.jamfUsername,
    password: config.jamfPassword,
  });
  await client.initialize();

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
