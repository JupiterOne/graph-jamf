import {
  ACCOUNT_ENTITY_TYPE,
  ACCOUNT_GROUP_RELATIONSHIP_CLASS,
  ACCOUNT_GROUP_RELATIONSHIP_TYPE,
  AccountGroupRelationship,
  GROUP_ENTITY_TYPE,
} from "../../jupiterone";
import { Account, Group } from "../../types";
import {
  generateEntityKey,
  generateRelationKey,
} from "../../utils/generateKey";

export function createAccountGroupRelationships(
  account: Account,
  groups: Group[],
): AccountGroupRelationship[] {
  const defaultValue: AccountGroupRelationship[] = [];

  return groups.reduce((acc, group) => {
    const parentKey = generateEntityKey(ACCOUNT_ENTITY_TYPE, account.id);
    const childKey = generateEntityKey(GROUP_ENTITY_TYPE, group.id);
    const relationKey = generateRelationKey(
      parentKey,
      ACCOUNT_GROUP_RELATIONSHIP_TYPE,
      childKey,
    );

    const relationship: AccountGroupRelationship = {
      _class: ACCOUNT_GROUP_RELATIONSHIP_CLASS,
      _fromEntityKey: parentKey,
      _key: relationKey,
      _type: ACCOUNT_GROUP_RELATIONSHIP_TYPE,
      _toEntityKey: childKey,
    };

    return [...acc, relationship];
  }, defaultValue);
}
