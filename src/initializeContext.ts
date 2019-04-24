import { IntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";

import { Account, JamfClient } from "./jamf";
import { JamfIntegrationContext } from "./types";

export default async function initializeContext(
  context: IntegrationExecutionContext,
): Promise<JamfIntegrationContext> {
  const { config } = context.instance;

  const provider = new JamfClient(
    config.jamfHost,
    config.jamfUsername,
    config.jamfPassword,
  );

  const { persister, graph } = context.clients.getClients();

  const account: Account = {
    id: context.instance.id,
    name: config.jamfHost || context.instance.name,
  };

  return {
    ...context,
    graph,
    persister,
    provider,
    account,
  };
}
