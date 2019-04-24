import {
  IntegrationInstanceAuthenticationError,
  IntegrationInstanceConfigError,
  IntegrationValidationContext,
} from "@jupiterone/jupiter-managed-integration-sdk";

import { JamfClient } from "./jamf";

/**
 * Performs validation of the execution before the execution handler function is
 * invoked.
 *
 * At a minimum, integrations should ensure that the
 * `context.instance.config` is valid. Integrations that require
 * additional information in `context.invocationArgs` should also
 * validate those properties. It is also helpful to perform authentication with
 * the provider to ensure that credentials are valid.
 *
 * The function will be awaited to support connecting to the provider for this
 * purpose.
 *
 * @param context
 */
export default async function invocationValidator(
  context: IntegrationValidationContext,
) {
  const { config } = context.instance;
  if (!config.jamfHost || !config.jamfUsername || !config.jamfPassword) {
    throw new IntegrationInstanceConfigError(
      "config requires all of { jamfHost, jamfUsername, jamfPassword }",
    );
  }

  const provider = new JamfClient(
    config.jamfHost,
    config.jamfUsername,
    config.jamfPassword,
  );

  try {
    await provider.fetchUsers();
  } catch (err) {
    throw new IntegrationInstanceAuthenticationError(err);
  }
}
