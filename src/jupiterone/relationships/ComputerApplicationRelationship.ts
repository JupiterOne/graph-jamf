import { MappedRelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface ComputerApplicationRelationship
  extends MappedRelationshipFromIntegration {
  version: string;
}

export const COMPUTER_APPLICATION_RELATIONSHIP_TYPE =
  "user_endpoint_installed_application";
export const COMPUTER_APPLICATION_RELATIONSHIP_CLASS = "INSTALLED";
