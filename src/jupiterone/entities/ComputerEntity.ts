import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const COMPUTER_ENTITY_TYPE = "jamf_computer";
export const COMPUTER_ENTITY_CLASS = "Device";

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
}
