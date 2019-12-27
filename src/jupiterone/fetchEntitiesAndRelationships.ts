import {
  GraphClient,
  IntegrationError,
  IntegrationRelationship,
} from "@jupiterone/jupiter-managed-integration-sdk";

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
  const accountAdminRelationships = await findRelationshipsByType<
    Relationships.AccountAdminRelationship
  >(graph, Relationships.ACCOUNT_ADMIN_RELATIONSHIP_TYPE);

  const accountOSXConfigurationRelationships = await findRelationshipsByType<
    Relationships.AccountOSXConfigurationRelationship
  >(graph, Relationships.ACCOUNT_OSX_CONFIGURATION_RELATIONSHIP_TYPE);

  const accountGroupRelationships = await findRelationshipsByType<
    Relationships.AccountGroupRelationship
  >(graph, Relationships.ACCOUNT_GROUP_RELATIONSHIP_TYPE);

  const groupAdminRelationships = await findRelationshipsByType<
    Relationships.GroupAdminRelationship
  >(graph, Relationships.GROUP_ADMIN_RELATIONSHIP_TYPE);

  const accountUserRelationships = await findRelationshipsByType<
    Relationships.AccountUserRelationship
  >(graph, Relationships.ACCOUNT_USER_RELATIONSHIP_TYPE);

  const userDeviceRelationships = await findRelationshipsByType<
    Relationships.UserDeviceRelationship
  >(graph, Relationships.USER_DEVICE_RELATIONSHIP_TYPE);

  const userComputerRelationships = await findRelationshipsByType<
    Relationships.UserComputerRelationship
  >(graph, Relationships.USER_COMPUTER_RELATIONSHIP_TYPE);

  const computerApplicationRelationships = await findRelationshipsByType<
    Relationships.ComputerApplicationRelationship
  >(graph, Relationships.COMPUTER_APPLICATION_RELATIONSHIP_TYPE);

  const computerOSXConfigurationRelationships = await findRelationshipsByType<
    Relationships.ComputerOSXConfigurationRelationship
  >(graph, Relationships.COMPUTER_OSX_CONFIGURATION_RELATIONSHIP_TYPE);

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

async function findRelationshipsByType<T extends IntegrationRelationship>(
  graph: GraphClient,
  type: string,
): Promise<T[]> {
  try {
    const relationships = await graph.findRelationshipsByType<T>(type);
    return relationships;
  } catch (err) {
    throw new IntegrationError(
      `Failed to fetch relationships from graph (type=${type})`,
      err,
    );
  }
}
