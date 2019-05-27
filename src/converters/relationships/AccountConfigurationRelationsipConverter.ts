import {
  ACCOUNT_CONFIGURATION_RELATIONSHIP_CLASS,
  ACCOUNT_CONFIGURATION_RELATIONSHIP_TYPE,
  ACCOUNT_ENTITY_TYPE,
  AccountConfigurationRelationship,
  CONFIGURATION_ENTITY_TYPE,
} from "../../jupiterone";
import { Account, ConfigurationDetail } from "../../types";
import {
  generateEntityKey,
  generateRelationKey,
} from "../../utils/generateKey";

export function createAccountConfigurationRelationships(
  account: Account,
  configurations: ConfigurationDetail[],
): AccountConfigurationRelationship[] {
  const defaultValue: AccountConfigurationRelationship[] = [];

  return configurations.reduce((acc, configuration) => {
    const parentKey = generateEntityKey(ACCOUNT_ENTITY_TYPE, account.id);
    const childKey = generateEntityKey(
      CONFIGURATION_ENTITY_TYPE,
      configuration.general.id,
    );
    const relationKey = generateRelationKey(
      parentKey,
      ACCOUNT_CONFIGURATION_RELATIONSHIP_CLASS,
      childKey,
    );

    const relationship: AccountConfigurationRelationship = {
      _class: ACCOUNT_CONFIGURATION_RELATIONSHIP_CLASS,
      _fromEntityKey: parentKey,
      _key: relationKey,
      _type: ACCOUNT_CONFIGURATION_RELATIONSHIP_TYPE,
      _toEntityKey: childKey,
    };

    return [...acc, relationship];
  }, defaultValue);
}
