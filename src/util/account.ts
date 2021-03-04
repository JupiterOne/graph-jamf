import {
  Entity,
  IntegrationError,
  JobState,
} from '@jupiterone/integration-sdk-core';
import { AdminsAndGroups } from '../jamf/types';
import { ACCOUNT_DATA_KEY, ACCOUNT_ENTITY_KEY } from '../steps/constants';

/**
 * The account entity is created in the "fetch-accounts" step and is later used
 * in many steps to build relationships.
 *
 * @param jobState
 */
export async function getAccountEntity(jobState: JobState): Promise<Entity> {
  const accountEntity = await jobState.getData<Entity | undefined>(
    ACCOUNT_ENTITY_KEY,
  );

  if (!accountEntity) {
    throw new IntegrationError({
      message: 'Could not find account entity in job state',
      code: 'ACCOUNT_ENTITY_NOT_FOUND',
      fatal: true,
    });
  }

  return accountEntity;
}

/**
 * The account data is created in the "fetch-accounts" step and is later used
 * in many steps to fetch more data
 *
 * @param jobState
 */
export async function getAccountData(
  jobState: JobState,
): Promise<AdminsAndGroups> {
  const accountData = await jobState.getData<AdminsAndGroups | undefined>(
    ACCOUNT_DATA_KEY,
  );

  if (!accountData) {
    throw new IntegrationError({
      message: 'Could not find account data in job state',
      code: 'ACCOUNT_DATA_NOT_FOUND',
      fatal: true,
    });
  }

  return accountData;
}
