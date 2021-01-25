import {
  EntityFromIntegration,
  EntityOperation,
  IntegrationRelationship,
  PersisterClient,
  PersisterOperationsResult,
  RelationshipOperation,
} from "@jupiterone/jupiter-managed-integration-sdk";

import {
  createAccountAdminRelationships,
  createAccountEntity,
  createAccountGroupRelationships,
  createAccountOSXConfigurationRelationships,
  createAccountUserRelationships,
  createAdminEntities,
  createComputerApplicationRelationships,
  createComputerEntities,
  createComputersOSXConfigurationsRelationships,
  createGroupAdminRelationships,
  createGroupEntities,
  createMobileDeviceEntities,
  createOSXConfigurationEntities,
  createUserComputerRelationships,
  createUserDeviceRelationships,
  createUserEntities,
} from "../converters";
import { Account, JamfDataModel } from "../jamf";
import {
  JupiterOneDataModel,
  JupiterOneEntitiesData,
  JupiterOneRelationshipsData,
} from "../jupiterone";

type EntitiesKeys = keyof JupiterOneEntitiesData;
type RelationshipsKeys = keyof JupiterOneRelationshipsData;

export default async function publishChanges(
  persister: PersisterClient,
  oldData: JupiterOneDataModel,
  jamfData: JamfDataModel,
  account: Account,
): Promise<PersisterOperationsResult> {
  const newData = convert(jamfData, account);

  const entities = createEntitiesOperations(
    oldData.entities,
    newData.entities,
    persister,
  );
  const relationships = createRelationshipsOperations(
    oldData.relationships,
    newData.relationships,
    persister,
  );

  return await persister.publishPersisterOperations([entities, relationships]);
}

function createEntitiesOperations(
  oldData: JupiterOneEntitiesData,
  newData: JupiterOneEntitiesData,
  persister: PersisterClient,
): EntityOperation[] {
  const defaultOperations: EntityOperation[] = [];
  const entities: EntitiesKeys[] = Object.keys(oldData) as EntitiesKeys[];

  return entities.reduce((operations, entityName) => {
    const oldEntities = oldData[entityName];
    const newEntities = newData[entityName];

    return [
      ...operations,
      ...persister.processEntities<EntityFromIntegration>({
        oldEntities,
        newEntities,
      }),
    ];
  }, defaultOperations);
}

function createRelationshipsOperations(
  oldData: JupiterOneRelationshipsData,
  newData: JupiterOneRelationshipsData,
  persister: PersisterClient,
): RelationshipOperation[] {
  const defatultOperations: RelationshipOperation[] = [];
  const relationships: RelationshipsKeys[] = Object.keys(
    oldData,
  ) as RelationshipsKeys[];

  return relationships.reduce((operations, relationshipName) => {
    const oldRelationships = oldData[relationshipName];
    const newRelationships = newData[relationshipName];

    return [
      ...operations,
      ...persister.processRelationships<IntegrationRelationship>({
        oldRelationships,
        newRelationships,
      }),
    ];
  }, defatultOperations);
}

export function convert(
  jamfDataModel: JamfDataModel,
  account: Account,
): JupiterOneDataModel {
  return {
    entities: convertEntities(jamfDataModel, account),
    relationships: convertRelationships(jamfDataModel, account),
  };
}

export function convertEntities(
  jamfDataModel: JamfDataModel,
  account: Account,
): JupiterOneEntitiesData {
  return {
    accounts: [createAccountEntity(account)],
    admins: createAdminEntities(jamfDataModel.admins),
    groups: createGroupEntities(jamfDataModel.groups),
    users: createUserEntities(jamfDataModel.users),
    mobileDevices: createMobileDeviceEntities(jamfDataModel.mobileDevices),
    computers: createComputerEntities(
      jamfDataModel.computers,
      jamfDataModel.computerDetails,
      jamfDataModel.osxConfigurationDetailsById,
    ),
    osxConfigurations: createOSXConfigurationEntities(
      jamfDataModel.osxConfigurationDetails,
    ),
  };
}

export function convertRelationships(
  jamfDataModel: JamfDataModel,
  account: Account,
): JupiterOneRelationshipsData {
  return {
    accountAdminRelationships: createAccountAdminRelationships(
      account,
      jamfDataModel.admins,
    ),
    accountOSXConfigurationRelationships: createAccountOSXConfigurationRelationships(
      account,
      jamfDataModel.osxConfigurationDetails,
    ),
    accountGroupRelationships: createAccountGroupRelationships(
      account,
      jamfDataModel.groups,
    ),
    groupAdminRelationships: createGroupAdminRelationships(
      jamfDataModel.groups,
    ),
    accountUserRelationships: createAccountUserRelationships(
      account,
      jamfDataModel.users,
    ),
    userDeviceRelationships: createUserDeviceRelationships(jamfDataModel.users),
    userComputerRelationships: createUserComputerRelationships(
      jamfDataModel.users,
    ),
    computerApplicationRelationships: createComputerApplicationRelationships(
      jamfDataModel.computerDetails,
    ),
    computerOSXConfigurationRelationships: createComputersOSXConfigurationsRelationships(
      jamfDataModel.computerDetails,
    ),
  };
}
