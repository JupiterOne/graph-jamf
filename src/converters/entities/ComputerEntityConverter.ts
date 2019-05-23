import {
  COMPUTER_ENTITY_CLASS,
  COMPUTER_ENTITY_TYPE,
  ComputerEntity,
} from "../../jupiterone";
import { Computer } from "../../types";

import { generateEntityKey } from "../../utils/generateKey";

export function createComputerEntities(data: Computer[]): ComputerEntity[] {
  return data.map(device => {
    return {
      _key: generateEntityKey(COMPUTER_ENTITY_TYPE, device.id),
      _type: COMPUTER_ENTITY_TYPE,
      _class: COMPUTER_ENTITY_CLASS,
      id: device.id,
      displayName: device.name,
      name: device.name,
      managed: device.managed,
      username: device.username,
      model: device.model,
      department: device.department,
      building: device.building,
      macAddress: device.mac_address,
      udid: device.udid,
      serialNumber: device.serial_number,
      reportDateUtc: device.report_date_utc,
      reportDateEpoch: device.report_date_epoch,
    };
  });
}
