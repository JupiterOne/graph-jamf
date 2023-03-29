import {
  IntegrationError,
  IntegrationLogger,
} from '@jupiterone/integration-sdk-core';
import { IJamfClient } from '../../jamf/client';
import { User } from '../../jamf/types';
import { wrapWithTimer } from '../../util/timer';
import pMap from 'p-map';

async function iterateUserProfiles(
  client: IJamfClient,
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

export const iterator = {
  iterateUserProfiles,
};
