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
      disks: [],
      encrypted: false,
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
        model: item.model,
        revision: item.revision,
        serialNumber: item.serial_number,
        size: item.size,
        driveCapacityMb: item.drive_capacity_mb,
        connectionType: item.connection_type,
        smartStatus: item.smart_status,
        partitionName: item.partition.name,
        partitionSsize: item.partition.size,
        partitionType: item.partition.type,
        partitionCapacityMb: item.partition.partition_capacity_mb,
        partitionPercentageFull: item.partition.percentage_full,
        partitionFilevaultStatus: item.partition.filevault_status,
        partitionFilevaultPercent: item.partition.filevault_percent,
        partitionFilevault2Status: item.partition.filevault2_status,
        partitionFilevault2Percent: item.partition.filevault2_percent,
        partitionBootDriveAvailableMb: item.partition.boot_drive_available_mb,
        partitionLvgUUID: item.partition.lvgUUID,
        partitionLvUUID: item.partition.lvUUID,
        partitionPvUUID: item.partition.pvUUID,
      }),
    );

    const primaryDisk = detailInfoItem.hardware.storage.find(
      item => item.disk === "disk0",
    );

    const encrypted =
      !!primaryDisk && primaryDisk.partition.filevault_status === "Encrypted";

    return {
      ...baseComputerEntity,
      disks,
      encrypted,
    };
  });
}
