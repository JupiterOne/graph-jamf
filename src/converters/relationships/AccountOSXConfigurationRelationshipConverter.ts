import {
  ACCOUNT_ENTITY_TYPE,
  ACCOUNT_OSX_CONFIGURATION_RELATIONSHIP_CLASS,
  ACCOUNT_OSX_CONFIGURATION_RELATIONSHIP_TYPE,
  AccountOSXConfigurationRelationship,
  OSX_CONFIGURATION_ENTITY_TYPE,
} from "../../jupiterone";
import { Account, OSXConfigurationDetail } from "../../types";
import {
  generateEntityKey,
  generateRelationKey,
} from "../../utils/generateKey";

export function createAccountOSXConfigurationRelationships(
  account: Account,
  osxConfigurations: OSXConfigurationDetail[],
): AccountOSXConfigurationRelationship[] {
  const defaultValue: AccountOSXConfigurationRelationship[] = [];

  return osxConfigurations.reduce((acc, configuration) => {
    const parentKey = generateEntityKey(ACCOUNT_ENTITY_TYPE, account.id);
    const childKey = generateEntityKey(
      OSX_CONFIGURATION_ENTITY_TYPE,
      configuration.general.id,
    );
    const relationKey = generateRelationKey(
      parentKey,
      ACCOUNT_OSX_CONFIGURATION_RELATIONSHIP_CLASS,
      childKey,
    );

    const relationship: AccountOSXConfigurationRelationship = {
      _class: ACCOUNT_OSX_CONFIGURATION_RELATIONSHIP_CLASS,
      _fromEntityKey: parentKey,
      _key: relationKey,
      _type: ACCOUNT_OSX_CONFIGURATION_RELATIONSHIP_TYPE,
      _toEntityKey: childKey,
    };

    return [...acc, relationship];
  }, defaultValue);
}
