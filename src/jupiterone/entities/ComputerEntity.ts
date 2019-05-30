import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const COMPUTER_ENTITY_TYPE = "user_endpoint";
export const COMPUTER_ENTITY_CLASS = ["Host", "Device"];

export interface ComputerEntity extends EntityFromIntegration {
  id: number;
  name: string;
  managed: boolean;
  username: string;
  model: string;
  department: string;
  building: string;
  macAddress: string;
  udid: string;
  serialNumber: string;
  reportDateUtc: string;
  reportDateEpoch: number;
  disks: StorageEntity[];
  encrypted: boolean;
}

export interface StorageEntity {
  disk: string;
  model: string;
  revision: string;
  serialNumber: string;
  size: number;
  driveCapacityMb: number;
  connectionType: string;
  smartStatus: string;
  partitionName: string;
  partitionSsize: number;
  partitionType: string;
  partitionCapacityMb: number;
  partitionPercentageFull: number;
  partitionFilevaultStatus: string;
  partitionFilevaultPercent: number;
  partitionFilevault2Status: string;
  partitionFilevault2Percent: number;
  partitionBootDriveAvailableMb: number;
  partitionLvgUUID: string;
  partitionLvUUID: string;
  partitionPvUUID: string;
}
