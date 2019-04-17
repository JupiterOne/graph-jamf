import {
  EntityFromIntegration,
  EntityOperation,
  PersisterClient,
  RelationshipOperation,
} from "@jupiterone/jupiter-managed-integration-sdk";

import {
  createMobileDeviceEntities,
  createUserDeviceRelationships,
  createUserEntities,
} from "../converters";
import { createAccountEntity } from "../converters/AccountEntityConverter";
import { createAccountUserRelationships } from "../converters/AccountUserRelationshipsConverter";

import {
  JupiterOneDataModel,
  JupiterOneEntitiesData,
  JupiterOneRelationshipsData,
} from "../jupiterone";

import { Account, JamfDataModel } from "../jamf";

type EntitiesKeys = keyof JupiterOneEntitiesData;
type RelationshipsKeys = keyof JupiterOneRelationshipsData;

export default async function publishChanges(
  persister: PersisterClient,
  oldData: JupiterOneDataModel,
  jamfData: JamfDataModel,
  account: Account,
) {
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
  const defatultOperations: EntityOperation[] = [];
  const entities: EntitiesKeys[] = Object.keys(oldData) as EntitiesKeys[];

  return entities.reduce((operations, entityName) => {
    const oldEntities = oldData[entityName];
    const newEntities = newData[entityName];

    return [
      ...operations,
      ...persister.processEntities<EntityFromIntegration>(
        oldEntities,
        newEntities,
      ),
    ];
  }, defatultOperations);
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
    const oldRelationhips = oldData[relationshipName];
    const newRelationhips = newData[relationshipName];

    return [
      ...operations,
      ...persister.processRelationships(oldRelationhips, newRelationhips),
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
    users: createUserEntities(jamfDataModel.users),
    mobileDevices: createMobileDeviceEntities(jamfDataModel.mobileDevices),
  };
}

export function convertRelationships(
  jamfDataModel: JamfDataModel,
  account: Account,
): JupiterOneRelationshipsData {
  return {
    accountUserRelationships: createAccountUserRelationships(
      account,
      jamfDataModel.users,
    ),
    userDeviceRelationships: createUserDeviceRelationships(jamfDataModel.users),
  };
}
