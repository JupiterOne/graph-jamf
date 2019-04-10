import {
  GraphClient,
  IntegrationRelationship,
} from "@jupiterone/jupiter-managed-integration-sdk";
import * as Entities from "./entities";

export interface JupiterOneEntitiesData {
  users: Entities.UserEntity[];
}

export interface JupiterOneDataModel {
  entities: JupiterOneEntitiesData;
  relationships: JupiterOneRelationshipsData;
}

export interface JupiterOneRelationshipsData {
  userDeviceRelationships: IntegrationRelationship[];
}

export default async function fetchEntitiesAndRelationships(
  graph: GraphClient,
): Promise<JupiterOneDataModel> {
  const data: JupiterOneDataModel = {
    entities: await fetchEntities(graph),
    relationships: await fetchRelationships(graph),
  };

  return data;
}

async function fetchEntities(
  graph: GraphClient,
): Promise<JupiterOneEntitiesData> {
  const [users] = await Promise.all([
    graph.findEntitiesByType<Entities.UserEntity>(Entities.USER_ENTITY_TYPE),
  ]);

  return {
    users,
  };
}

export async function fetchRelationships(
  graph: GraphClient,
): Promise<JupiterOneRelationshipsData> {
  const [] = await Promise.all([]);
  return {
    userDeviceRelationships: [],
  };
}
