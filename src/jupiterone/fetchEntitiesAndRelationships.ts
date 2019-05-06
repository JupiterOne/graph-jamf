import { GraphClient } from "@jupiterone/jupiter-managed-integration-sdk";
import * as Entities from "./entities";

export interface JupiterOneEntitiesData {
  accounts: Entities.AccountEntity[];
  users: Entities.UserEntity[];
  mobileDevices: Entities.MobileDeviceEntity[];
  computers: Entities.ComputerEntity[];
}

export interface JupiterOneDataModel {
  entities: JupiterOneEntitiesData;
  relationships: JupiterOneRelationshipsData;
}

export interface JupiterOneRelationshipsData {
  accountUserRelationships: Entities.AccountUserRelationship[];
  userDeviceRelationships: Entities.UserDeviceRelationship[];
  userComputerRelationships: Entities.UserComputerRelationship[];
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
  const [accounts, users, mobileDevices, computers] = await Promise.all([
    graph.findEntitiesByType<Entities.AccountEntity>(
      Entities.ACCOUNT_ENTITY_TYPE,
    ),
    graph.findEntitiesByType<Entities.UserEntity>(Entities.USER_ENTITY_TYPE),
    graph.findEntitiesByType<Entities.MobileDeviceEntity>(
      Entities.MOBILE_DEVICE_ENTITY_TYPE,
    ),
    graph.findEntitiesByType<Entities.ComputerEntity>(
      Entities.COMPUTER_ENTITY_TYPE,
    ),
  ]);

  return {
    accounts,
    users,
    mobileDevices,
    computers,
  };
}

export async function fetchRelationships(
  graph: GraphClient,
): Promise<JupiterOneRelationshipsData> {
  const [
    accountUserRelationships,
    userDeviceRelationships,
    userComputerRelationships,
  ] = await Promise.all([
    graph.findRelationshipsByType<Entities.AccountUserRelationship>(
      Entities.ACCOUNT_USER_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<Entities.UserDeviceRelationship>(
      Entities.USER_DEVICE_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<Entities.UserComputerRelationship>(
      Entities.USER_COMPUTER_RELATIONSHIP_TYPE,
    ),
  ]);
  return {
    accountUserRelationships,
    userDeviceRelationships,
    userComputerRelationships,
  };
}
