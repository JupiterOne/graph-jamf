import {
  ADMIN_ENTITY_CLASS,
  ADMIN_ENTITY_TYPE,
  AdminEntity,
} from "../../jupiterone";
import { Admin } from "../../types";
import { generateEntityKey } from "../../utils/generateKey";

export function createAdminEntities(data: Admin[]): AdminEntity[] {
  return data.map(item => ({
    _key: generateEntityKey(ADMIN_ENTITY_TYPE, item.id),
    _type: ADMIN_ENTITY_TYPE,
    _class: ADMIN_ENTITY_CLASS,
    displayName: item.name,
    name: item.name,
    admin: true,
    directoryUser: item.directory_user!,
    fullName: item.full_name!,
    email: item.email!,
    emailAddress: item.email_address!,
    enabled: item.enabled!,
    forcePasswordChange: item.force_password_change!,
    accessLevel: item.access_level!,
    privilegeSet: item.privilege_set!,
    permissions:
      item.privilege_set === "Administrator" ? [item.privilege_set] : undefined,
  }));
}
