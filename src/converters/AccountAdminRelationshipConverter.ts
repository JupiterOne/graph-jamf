import {
  ACCOUNT_ADMIN_RELATIONSHIP_CLASS,
  ACCOUNT_ADMIN_RELATIONSHIP_TYPE,
  ACCOUNT_ENTITY_TYPE,
  AccountAdminRelationship,
  ADMIN_ENTITY_TYPE,
} from "../jupiterone/entities";
import { Account, Admin } from "../types";
import { generateEntityKey, generateRelationKey } from "../utils/generateKey";

export function createAccountAdminRelationships(
  account: Account,
  admins: Admin[],
): AccountAdminRelationship[] {
  const defaultValue: AccountAdminRelationship[] = [];

  return admins.reduce((acc, admin) => {
    const parentKey = generateEntityKey(ACCOUNT_ENTITY_TYPE, account.id);
    const childKey = generateEntityKey(ADMIN_ENTITY_TYPE, admin.id);
    const relationKey = generateRelationKey(
      parentKey,
      ACCOUNT_ADMIN_RELATIONSHIP_TYPE,
      childKey,
    );

    const relationship: AccountAdminRelationship = {
      _class: ACCOUNT_ADMIN_RELATIONSHIP_CLASS,
      _fromEntityKey: parentKey,
      _key: relationKey,
      _type: ACCOUNT_ADMIN_RELATIONSHIP_TYPE,
      _toEntityKey: childKey,
    };

    return [...acc, relationship];
  }, defaultValue);
}
