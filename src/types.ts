import {
  GraphClient,
  IntegrationExecutionContext,
  IntegrationInvocationEvent,
  PersisterClient,
} from "@jupiterone/jupiter-managed-integration-sdk";

import JamfClient, { Account } from "./jamf/JamfClient";

export interface JamfIntegrationContext
  extends IntegrationExecutionContext<IntegrationInvocationEvent> {
  graph: GraphClient;
  persister: PersisterClient;
  provider: JamfClient;
  account: Account;
}
