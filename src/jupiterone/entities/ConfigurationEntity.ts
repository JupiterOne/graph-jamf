import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const CONFIGURATION_ENTITY_TYPE = "jamf_configuration_profile";
export const CONFIGURATION_ENTITY_CLASS = "Configuration";

export interface ConfigurationEntity extends EntityFromIntegration {
  id: number;
  name: string;
  description: string;
  type: string;
}
