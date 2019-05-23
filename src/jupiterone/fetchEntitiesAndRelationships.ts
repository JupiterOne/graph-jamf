import { GraphClient } from "@jupiterone/jupiter-managed-integration-sdk";
import * as Entities from "./entities";
import * as Relationships from "./relationships";

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
  accountAdminRelationships: Relationships.AccountAdminRelationship[];
  accountGroupRelationships: Relationships.AccountGroupRelationship[];
  accountUserRelationships: Relationships.AccountUserRelationship[];
  groupAdminRelationships: Relationships.GroupAdminRelationship[];
  userDeviceRelationships: Relationships.UserDeviceRelationship[];
  userComputerRelationships: Relationships.UserComputerRelationship[];
  computerApplicationRelationships: Relationships.ComputerApplicationRelationship[];
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
    computerApplicationRelationships,
  ] = await Promise.all([
    graph.findRelationshipsByType<Relationships.AccountAdminRelationship>(
      Relationships.ACCOUNT_ADMIN_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<Relationships.AccountGroupRelationship>(
      Relationships.ACCOUNT_GROUP_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<Relationships.GroupAdminRelationship>(
      Relationships.GROUP_ADMIN_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<Relationships.AccountUserRelationship>(
      Relationships.ACCOUNT_USER_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<Relationships.UserDeviceRelationship>(
      Relationships.USER_DEVICE_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<Relationships.UserComputerRelationship>(
      Relationships.USER_COMPUTER_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<
      Relationships.ComputerApplicationRelationship
    >(Relationships.COMPUTER_APPLICATION_RELATIONSHIP_TYPE),
  ]);
  return {
    accountAdminRelationships,
    accountGroupRelationships,
    groupAdminRelationships,
    accountUserRelationships,
    userDeviceRelationships,
    userComputerRelationships,
    computerApplicationRelationships,
  };
}
