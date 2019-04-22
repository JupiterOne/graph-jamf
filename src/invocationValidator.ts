import {
  IntegrationExecutionContext,
  IntegrationInstanceAuthenticationError,
  IntegrationInstanceConfigError,
  IntegrationInvocationEvent,
} from "@jupiterone/jupiter-managed-integration-sdk";

import { JamfClient } from "./jamf";

/**
 * Performs validation of the execution before the execution handler function is
 * invoked.
 *
 * At a minimum, integrations should ensure that the
 * `executionContext.instance.config` is valid. Integrations that require
 * additional information in `executionContext.invocationArgs` should also
 * validate those properties. It is also helpful to perform authentication with
 * the provider to ensure that credentials are valid.
 *
 * The function will be awaited to support connecting to the provider for this
 * purpose.
 *
 * @param executionContext
 */
export default async function invocationValidator(
  executionContext: IntegrationExecutionContext<IntegrationInvocationEvent>,
) {
  const { config } = executionContext.instance;
  if (!config.jamfHost || !config.jamfName || !config.jamfPassword) {
    throw new IntegrationInstanceConfigError(
      "config requires all of { jamfHost, jamfName, jamfPassword }",
    );
  }

  const provider = new JamfClient(
    config.jamfHost,
    config.jamfName,
    config.jamfPassword,
  );

  try {
    await provider.fetchUsers();
  } catch (err) {
    throw new IntegrationInstanceAuthenticationError(err);
  }
}
