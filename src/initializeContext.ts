import {
  IntegrationExecutionContext,
  IntegrationInvocationEvent,
} from "@jupiterone/jupiter-managed-integration-sdk";

import { JamfClient } from "./jamf";

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

  return {
    graph,
    persister,
    provider,
  };
}
