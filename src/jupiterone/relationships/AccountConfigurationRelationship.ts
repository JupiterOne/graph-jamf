import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export type AccountConfigurationRelationship = RelationshipFromIntegration;

export const ACCOUNT_CONFIGURATION_RELATIONSHIP_TYPE =
  "jamf_account_has_jamf_configuration_profile";
export const ACCOUNT_CONFIGURATION_RELATIONSHIP_CLASS = "HAS";
