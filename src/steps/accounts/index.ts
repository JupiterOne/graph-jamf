import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createClient } from '../../jamf/client';
import { IntegrationConfig } from '../../config';
import { Entities, ACCOUNT_DATA_KEY, ACCOUNT_ENTITY_KEY, IntegrationSteps } from '../constants';
import { createAccountEntity } from './converters';

export async function fetchAccounts({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config, id, name } = instance;

  const client = createClient({
    host: config.jamfHost,
    username: config.jamfUsername,
    password: config.jamfPassword,
    logger,
  });

  await jobState.setData(
    ACCOUNT_ENTITY_KEY,
    await jobState.addEntity(
      createAccountEntity({
        id,
        name,
      }),
    ),
  );

  await jobState.setData(ACCOUNT_DATA_KEY, await client.fetchAccounts());
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ACCOUNTS,
    name: 'Fetch Accounts',
    entities: [Entities.ACCOUNT],
    relationships: [],
    executionHandler: fetchAccounts,
  },
];
