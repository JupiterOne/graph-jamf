import { User } from "../jamf/JamfClient";
import { USER_ENTITY_CLASS, USER_ENTITY_TYPE, UserEntity } from "../jupiterone";

import generateKey from "../utils/generateKey";

export function createUserEntities(data: User[]): UserEntity[] {
  return data.map(user => {
    return {
      _key: generateKey(USER_ENTITY_TYPE, user.id),
      _type: USER_ENTITY_TYPE,
      _class: USER_ENTITY_CLASS,
      id: user.id,
      username: user.name,
    };
  });
}
