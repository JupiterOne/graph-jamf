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
  encrypted: boolean;
  gatekeeperEnabled: boolean;
  gatekeeperStatus?: string;
  systemIntegrityProtectionEnabled: boolean;
  firewallEnabled?: boolean;
  firewallBlockAllIncoming?: boolean;
  firewallStealthModeEnabled?: boolean;
  screensaverLockEnabled?: boolean;
  screensaverIdleTime?: number;
}
