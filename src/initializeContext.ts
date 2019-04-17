import {
  IntegrationExecutionContext,
  IntegrationInvocationEvent,
} from "@jupiterone/jupiter-managed-integration-sdk";

import { Account, JamfClient } from "./jamf";

export default async function initializeContext(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>,
) {
  const { config } = context.instance;

  const provider = new JamfClient(
    config.jamfHost,
    config.jamfName,
    config.jamfPassword,
  );

  const { persister, graph } = context.clients.getClients();

  const account: Account = {
    id: context.instance.id,
    name: config.jamfHost || context.instance.name,
  };

  return {
    graph,
    persister,
    provider,
    account,
  };
}
