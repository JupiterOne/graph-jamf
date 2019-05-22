import { GraphClient } from "@jupiterone/jupiter-managed-integration-sdk";
import * as Entities from "./entities";

export interface JupiterOneEntitiesData {
  accounts: Entities.AccountEntity[];
  admins: Entities.AdminEntity[];
  groups: Entities.GroupEntity[];
  users: Entities.UserEntity[];
  mobileDevices: Entities.MobileDeviceEntity[];
  computers: Entities.ComputerEntity[];
}

export interface JupiterOneDataModel {
  entities: JupiterOneEntitiesData;
  relationships: JupiterOneRelationshipsData;
}

export interface JupiterOneRelationshipsData {
  accountAdminRelationships: Entities.AccountAdminRelationship[];
  accountGroupRelationships: Entities.AccountGroupRelationship[];
  accountUserRelationships: Entities.AccountUserRelationship[];
  groupAdminRelationships: Entities.GroupAdminRelationship[];
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
  const [
    accounts,
    admins,
    groups,
    users,
    mobileDevices,
    computers,
  ] = await Promise.all([
    graph.findEntitiesByType<Entities.AccountEntity>(
      Entities.ACCOUNT_ENTITY_TYPE,
    ),
    graph.findEntitiesByType<Entities.AdminEntity>(Entities.ADMIN_ENTITY_TYPE),
    graph.findEntitiesByType<Entities.GroupEntity>(Entities.GROUP_ENTITY_TYPE),
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
    admins,
    groups,
    users,
    mobileDevices,
    computers,
  };
}

export async function fetchRelationships(
  graph: GraphClient,
): Promise<JupiterOneRelationshipsData> {
  const [
    accountAdminRelationships,
    accountGroupRelationships,
    groupAdminRelationships,
    accountUserRelationships,
    userDeviceRelationships,
    userComputerRelationships,
  ] = await Promise.all([
    graph.findRelationshipsByType<Entities.AccountAdminRelationship>(
      Entities.ACCOUNT_ADMIN_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<Entities.AccountGroupRelationship>(
      Entities.ACCOUNT_GROUP_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<Entities.GroupAdminRelationship>(
      Entities.GROUP_ADMIN_RELATIONSHIP_TYPE,
    ),
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
    accountAdminRelationships,
    accountGroupRelationships,
    groupAdminRelationships,
    accountUserRelationships,
    userDeviceRelationships,
    userComputerRelationships,
  };
}
