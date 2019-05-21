import {
  GraphClient,
  PersisterClient,
  PersisterOperationsResult,
} from "@jupiterone/jupiter-managed-integration-sdk";

export default async function deleteDeprecatedTypes(
  graph: GraphClient,
  persister: PersisterClient,
): Promise<PersisterOperationsResult> {
  const deprecatedEntityTypes = ["jamf_user", "jamf_computer"];

  const deprecatedRelationshipTypes = [
    "jamf_account_has_jamf_user",
    "jamf_user_has_jamf_mobile_device",
    "jamf_user_has_jamf_computer",
  ];

  const deprecatedEntities = [];
  const deprecatedRelationships = [];

  for (const type of deprecatedEntityTypes) {
    deprecatedEntities.push(...(await graph.findEntitiesByType(type)));
  }

  for (const type of deprecatedRelationshipTypes) {
    deprecatedRelationships.push(
      ...(await graph.findRelationshipsByType(type)),
    );
  }

  return persister.publishPersisterOperations([
    persister.processEntities(deprecatedEntities, []),
    persister.processRelationships(deprecatedRelationships, []),
  ]);
}
