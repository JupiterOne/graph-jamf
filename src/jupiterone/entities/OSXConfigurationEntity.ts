import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const OSX_CONFIGURATION_ENTITY_TYPE = "jamf_osx_configuration_profile";
export const OSX_CONFIGURATION_ENTITY_CLASS = "Configuration";

export interface OSXConfigurationEntity extends EntityFromIntegration {
  id: number;
  name: string;
  description: string;
  siteName: string;
  categoryName: string;
  distributionMethod: string;
  userRemovable: boolean;
  level: string;
  redeployOnUpdate: string;
  allComputers: boolean;
  allJSSUsers: boolean;
  firewallEnabled: boolean;
  firewallBlockAllIncoming: boolean;
  firewallStealthModeEnabled: boolean;
}
