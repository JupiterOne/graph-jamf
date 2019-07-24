import {
  COMPUTER_ENTITY_CLASS,
  COMPUTER_ENTITY_TYPE,
  ComputerEntity,
} from "../../jupiterone";
import { Computer, ComputerDetail } from "../../types";

import { generateEntityKey } from "../../utils/generateKey";

export function createComputerEntities(
  data: Computer[],
  detailData: ComputerDetail[],
): ComputerEntity[] {
  return data.map(device => {
    const baseComputerEntity: ComputerEntity = {
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
      encrypted: false,
      gatekeeperEnabled: false,
      systemIntegrityProtectionEnabled: false,
    };

    const detailInfoItem = detailData.find(
      item => item.general.id === device.id,
    );

    if (!detailInfoItem) {
      return baseComputerEntity;
    }

    const primaryDisk = detailInfoItem.hardware.storage.find(
      disk => !!disk.partition && disk.partition.type === "boot",
    );

    const encrypted =
      !!primaryDisk &&
      !!primaryDisk.partition &&
      primaryDisk.partition.filevault_status === "Encrypted";

    const gatekeeperStatus = detailInfoItem.hardware.gatekeeper_status;
    // gatekeeperStatus can be one of three things: "App Store", "App Store and
    // identified developers", or "Anywhere"
    const gatekeeperEnabled =
      !!gatekeeperStatus && /^App Store/.test(gatekeeperStatus);

    const systemIntegrityProtectionEnabled =
      detailInfoItem.hardware.sip_status === "Enabled";

    return {
      ...baseComputerEntity,
      encrypted,
      gatekeeperEnabled,
      gatekeeperStatus,
      systemIntegrityProtectionEnabled,
    };
  });
}
