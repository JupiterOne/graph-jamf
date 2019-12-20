import {
  GraphClient,
  IntegrationActionName,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
  PersisterClient,
  PersisterOperationsResult,
  summarizePersisterOperationsResults,
} from "@jupiterone/jupiter-managed-integration-sdk";

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
    return await actionFunction(initializeContext(context));
  } else {
    return {};
  }
}

async function removeDeprecatedEntities(
  graph: GraphClient,
  persister: PersisterClient,
): Promise<PersisterOperationsResult> {
  const results = await Promise.all(
    ["jamf_configuration_profile"].map(async t => {
      const entitiesToDelete = await graph.findEntitiesByType(t);
      return persister.publishPersisterOperations([
        persister.processEntities(entitiesToDelete, []),
        [],
      ]);
    }),
  );
  return summarizePersisterOperationsResults(...results);
}

async function synchronize(
  context: JamfIntegrationContext,
): Promise<IntegrationExecutionResult> {
  const { graph, persister, provider, account } = context;

  const oldData = await fetchEntitiesAndRelationships(graph);
  const jamfData = await fetchJamfData(provider);

  return {
    operations: summarizePersisterOperationsResults(
      await removeDeprecatedEntities(graph, persister),
      await publishChanges(persister, oldData, jamfData, account),
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
