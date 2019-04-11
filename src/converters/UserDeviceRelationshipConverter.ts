import { User } from "../jamf";
import {
  MOBILE_DEVICE_ENTITY_TYPE,
  USER_DEVICE_RELATIONSHIP_CLASS,
  USER_DEVICE_RELATIONSHIP_TYPE,
  USER_ENTITY_TYPE,
  UserDeviceRelationship,
} from "../jupiterone/entities";
import generateKey from "../utils/generateKey";

export function createUserDeviceRelationships(users: User[]) {
  const defaultValue: UserDeviceRelationship[] = [];

  return users.reduce((acc, user) => {
    if (
      !user.links ||
      !user.links.mobile_devices ||
      !user.links.mobile_devices.mobile_device
    ) {
      return acc;
    }

    const parentKey = generateKey(USER_ENTITY_TYPE, user.id);
    const childKey = generateKey(
      MOBILE_DEVICE_ENTITY_TYPE,
      user.links.mobile_devices.mobile_device.id,
    );

    const relationship: UserDeviceRelationship = {
      _class: USER_DEVICE_RELATIONSHIP_CLASS,
      _type: USER_DEVICE_RELATIONSHIP_TYPE,
      _fromEntityKey: parentKey,
      _key: `${parentKey}_has_${childKey}`,
      _toEntityKey: childKey,
    };

    return [...acc, relationship];
  }, defaultValue);
}
