import { User } from "../../jamf";
import {
  USER_ENTITY_CLASS,
  USER_ENTITY_TYPE,
  UserEntity,
} from "../../jupiterone";

import { generateEntityKey } from "../../utils/generateKey";

export function createUserEntities(data: User[]): UserEntity[] {
  return data.map(user => {
    const os: string[] = [];
    if (user.links) {
      if (user.links.mobile_devices.length > 0) {
        os.push("iOS");
      }
      if (user.links.computers.length > 0) {
        os.push("macOS");
      }
    }
    return {
      _key: generateEntityKey(USER_ENTITY_TYPE, user.id),
      _type: USER_ENTITY_TYPE,
      _class: USER_ENTITY_CLASS,
      id: user.id,
      displayName: user.name,
      username: user.name,
      fullName: user.full_name,
      email: user.email,
      emailAddress: user.email_address,
      phoneNumber: user.phone_number,
      position: user.position,
      enableCustomPhotoUrl: user.enable_custom_photo_url,
      customPhotoUrl: user.custom_photo_url,
      ldapServer: user.ldap_server && user.ldap_server.name,
      totalVppCodeCount: user.links && user.links.total_vpp_code_count,
      os,
    };
  });
}
