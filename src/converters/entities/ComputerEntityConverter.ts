import {
  COMPUTER_ENTITY_CLASS,
  COMPUTER_ENTITY_TYPE,
  ComputerEntity,
  StorageEntity,
} from "../../jupiterone";
import { Computer, ComputerDetail } from "../../types";

import { generateEntityKey } from "../../utils/generateKey";

export function createComputerEntities(
  data: Computer[],
  detailData: ComputerDetail[],
): ComputerEntity[] {
  return data.map(device => {
    const baseComputerEntity = {
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
      disks: "",
      encrypted: false,
      gatekeeperEnabled: false,
      gatekeeperStatus: "",
    };

    const detailInfoItem = detailData.find(
      item => item.general.id === device.id,
    );

    if (!detailInfoItem) {
      return baseComputerEntity;
    }

    const disks: StorageEntity[] = detailInfoItem.hardware.storage.map(
      item => ({
        disk: item.disk,
        partitionName: item.partition && item.partition.name,
      }),
    );

    const primaryDisk = detailInfoItem.hardware.storage.find(
      item => item.disk === "disk0",
    );

    const encrypted =
      !!primaryDisk &&
      !!primaryDisk.partition &&
      primaryDisk.partition.filevault_status === "Encrypted";

    const gatekeeperStatus = detailInfoItem.hardware.gatekeeper_status;
    const gatekeeperEnabled =
      !!gatekeeperStatus &&
      (gatekeeperStatus === "App Store and identified developers" ||
        gatekeeperStatus === "App Store");

    return {
      ...baseComputerEntity,
      disks: JSON.stringify(disks),
      encrypted,
      gatekeeperEnabled,
      gatekeeperStatus,
    };
  });
}
