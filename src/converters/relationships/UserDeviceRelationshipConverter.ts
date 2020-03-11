import { User } from "../../jamf";
import {
  MOBILE_DEVICE_ENTITY_TYPE,
  USER_DEVICE_RELATIONSHIP_CLASS,
  USER_DEVICE_RELATIONSHIP_TYPE,
  USER_ENTITY_TYPE,
  UserDeviceRelationship,
} from "../../jupiterone";
import {
  generateEntityKey,
  generateRelationKey,
} from "../../utils/generateKey";

export function createUserDeviceRelationships(
  users: User[],
): UserDeviceRelationship[] {
  const defaultValue: UserDeviceRelationship[] = [];

  return users.reduce((acc, user) => {
    if (isMobileDevice(user)) {
      return acc;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const relationships = user.links!.mobile_devices.map(device => {
      const parentKey = generateEntityKey(USER_ENTITY_TYPE, user.id);
      const childKey = generateEntityKey(MOBILE_DEVICE_ENTITY_TYPE, device.id);
      const relationKey = generateRelationKey(
        parentKey,
        USER_DEVICE_RELATIONSHIP_CLASS,
        childKey,
      );

      const relationship: UserDeviceRelationship = {
        _class: USER_DEVICE_RELATIONSHIP_CLASS,
        _type: USER_DEVICE_RELATIONSHIP_TYPE,
        _fromEntityKey: parentKey,
        _key: relationKey,
        _toEntityKey: childKey,
      };

      return relationship;
    });

    return acc.concat(relationships);
  }, defaultValue);
}

function isMobileDevice(user: User): boolean {
  return !(
    user.links &&
    user.links.mobile_devices &&
    user.links.mobile_devices.length > 0
  );
}
