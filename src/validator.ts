import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { createClient } from './jamf/client';
import { IntegrationConfig } from './config';

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { instance, logger } = context;
  const { config } = instance;

  if (!config.jamfHost || !config.jamfUsername || !config.jamfPassword) {
    throw new IntegrationValidationError(
      'Config requires all of {jamfHost, jamfUsername, jamfPassword}',
    );
  }

  const client = createClient({
    host: config.jamfHost,
    username: config.jamfUsername,
    password: config.jamfPassword,
    logger,
  });

  try {
    await client.fetchUsers();
  } catch (err) {
    throw new IntegrationValidationError(err.message);
  }
}
