import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { JamfClient } from './jamf/client';
import { IntegrationConfig } from './config';

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { instance } = context;
  const { config } = instance;

  if (!config.jamfHost || !config.jamfUsername || !config.jamfPassword) {
    throw new IntegrationValidationError(
      'Config requires all of {jamfHost, jamfUsername, jamfPassword}',
    );
  }

  const client = JamfClient.getInstance({
    host: config.jamfHost,
    username: config.jamfUsername,
    password: config.jamfPassword,
  });
  await client.initialize();

  try {
    await client.fetchUsers();
  } catch (err) {
    throw new IntegrationValidationError(err.message);
  }
}
