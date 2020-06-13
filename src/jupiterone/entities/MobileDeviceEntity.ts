import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const MOBILE_DEVICE_ENTITY_TYPE = "mobile_device";
export const MOBILE_DEVICE_ENTITY_CLASS = "Device";

export interface MobileDeviceEntity extends EntityFromIntegration {
  id: string;
  deviceName: string;
  udid: string;
  serialNumber: string;
  phoneNumber: string;
  wifiMacAddress: string;
  managed: boolean;
  supervised: boolean;
  model: string;
  modelIdentifier: string;
  modelDisplay: string;
  username: string | undefined;
}
