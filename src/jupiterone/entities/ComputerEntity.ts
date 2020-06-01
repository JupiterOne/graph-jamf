import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const COMPUTER_ENTITY_TYPE = "user_endpoint";
export const COMPUTER_ENTITY_CLASS = ["Host", "Device"];

export interface ComputerEntity extends EntityFromIntegration {
  id: string;
  name: string;
  managed: boolean;
  username: string;
  email?: string;
  make?: string;
  model: string;
  serial: string;
  platform?: string;
  osName?: string;
  osVersion?: string;
  osBuild?: string;
  department: string;
  building: string;
  macAddress: string;
  altMacAddress?: string;
  udid: string;
  createdOn?: number;
  enrolledOn?: number;
  reportedOn?: number;
  lastReportedOn?: number;
  lastSeenOn?: number;
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
