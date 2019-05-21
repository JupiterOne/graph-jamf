import {
  IntegrationActionName,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
  summarizePersisterOperationsResults,
} from "@jupiterone/jupiter-managed-integration-sdk";
import deleteDeprecatedTypes from "./deleteDeprecatedTypes";

import initializeContext from "./initializeContext";
import fetchJamfData from "./jamf/fetchJamfData";
import fetchEntitiesAndRelationships from "./jupiterone/fetchEntitiesAndRelationships";
import publishChanges from "./persister/publishChanges";
import { JamfIntegrationContext } from "./types";

export default async function executionHandler(
  context: IntegrationExecutionContext,
): Promise<IntegrationExecutionResult> {
  const actionFunction = ACTIONS[context.event.action.name];
  if (actionFunction) {
    return await actionFunction(await initializeContext(context));
  } else {
    return {};
  }
}

async function synchronize(
  context: JamfIntegrationContext,
): Promise<IntegrationExecutionResult> {
  const { graph, persister, provider, account } = context;

  const oldData = await fetchEntitiesAndRelationships(graph);
  const jamfData = await fetchJamfData(provider);

  return {
    operations: summarizePersisterOperationsResults(
      await publishChanges(persister, oldData, jamfData, account),
      await deleteDeprecatedTypes(graph, persister),
    ),
  };
}

type ActionFunction = (
  context: JamfIntegrationContext,
) => Promise<IntegrationExecutionResult>;

interface ActionMap {
  [actionName: string]: ActionFunction | undefined;
}

const ACTIONS: ActionMap = {
  [IntegrationActionName.INGEST]: synchronize,
};
