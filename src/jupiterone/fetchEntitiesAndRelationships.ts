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
  osxConfigurations: Entities.OSXConfigurationEntity[];
}

export interface JupiterOneDataModel {
  entities: JupiterOneEntitiesData;
  relationships: JupiterOneRelationshipsData;
}

export interface JupiterOneRelationshipsData {
  accountAdminRelationships: Relationships.AccountAdminRelationship[];
  accountOSXConfigurationRelationships: Relationships.AccountOSXConfigurationRelationship[];
  accountGroupRelationships: Relationships.AccountGroupRelationship[];
  accountUserRelationships: Relationships.AccountUserRelationship[];
  groupAdminRelationships: Relationships.GroupAdminRelationship[];
  userDeviceRelationships: Relationships.UserDeviceRelationship[];
  userComputerRelationships: Relationships.UserComputerRelationship[];
  computerApplicationRelationships: Relationships.ComputerApplicationRelationship[];
  computerOSXConfigurationRelationships: Relationships.ComputerOSXConfigurationRelationship[];
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
    osxConfigurations,
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
    graph.findEntitiesByType<Entities.OSXConfigurationEntity>(
      Entities.OSX_CONFIGURATION_ENTITY_TYPE,
    ),
  ]);

  return {
    accounts,
    admins,
    groups,
    users,
    mobileDevices,
    computers,
    osxConfigurations,
  } as any; // TS 3.7.2 bug https://github.com/microsoft/TypeScript/issues/33752
}

export async function fetchRelationships(
  graph: GraphClient,
): Promise<JupiterOneRelationshipsData> {
  const [
    accountAdminRelationships,
    accountOSXConfigurationRelationships,
    accountGroupRelationships,
    groupAdminRelationships,
    accountUserRelationships,
    userDeviceRelationships,
    userComputerRelationships,
    computerApplicationRelationships,
    computerOSXConfigurationRelationships,
  ] = await Promise.all([
    graph.findRelationshipsByType<Relationships.AccountAdminRelationship>(
      Relationships.ACCOUNT_ADMIN_RELATIONSHIP_TYPE,
    ),
    graph.findRelationshipsByType<
      Relationships.AccountOSXConfigurationRelationship
    >(Relationships.ACCOUNT_OSX_CONFIGURATION_RELATIONSHIP_TYPE),
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
    graph.findRelationshipsByType<
      Relationships.ComputerOSXConfigurationRelationship
    >(Relationships.COMPUTER_OSX_CONFIGURATION_RELATIONSHIP_TYPE),
  ]);
  return {
    accountAdminRelationships,
    accountOSXConfigurationRelationships,
    accountGroupRelationships,
    groupAdminRelationships,
    accountUserRelationships,
    userDeviceRelationships,
    userComputerRelationships,
    computerApplicationRelationships,
    computerOSXConfigurationRelationships,
  };
}
