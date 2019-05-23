import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export type AccountAdminRelationship = RelationshipFromIntegration;

export const ACCOUNT_ADMIN_RELATIONSHIP_TYPE = "jamf_account_has_jamf_user";
export const ACCOUNT_ADMIN_RELATIONSHIP_CLASS = "HAS";
