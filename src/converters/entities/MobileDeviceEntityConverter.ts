import {
  MOBILE_DEVICE_ENTITY_CLASS,
  MOBILE_DEVICE_ENTITY_TYPE,
  MobileDeviceEntity,
} from "../../jupiterone";
import { MobileDevice } from "../../types";

import { generateEntityKey } from "../../utils/generateKey";

export function createMobileDeviceEntities(
  data: MobileDevice[],
): MobileDeviceEntity[] {
  return data.map(device => {
    return {
      _key: generateEntityKey(MOBILE_DEVICE_ENTITY_TYPE, device.id),
      _type: MOBILE_DEVICE_ENTITY_TYPE,
      _class: MOBILE_DEVICE_ENTITY_CLASS,
      _rawData: [{ name: "default", rawData: device }],
      id: device.id,
      deviceName: device.device_name,
      displayName: `${device.username || "Unknown User"}'s ${device.model}`,
      udid: device.udid,
      serialNumber: device.serial_number,
      phoneNumber: device.phone_number,
      wifiMacAddress: device.wifi_mac_address,
      managed: device.managed,
      supervised: device.supervised,
      model: device.model,
      modelIdentifier: device.model_identifier,
      modelDisplay: device.model_display,
      username: device.username,
    };
  });
}
