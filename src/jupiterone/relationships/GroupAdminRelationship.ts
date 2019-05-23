import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export type GroupAdminRelationship = RelationshipFromIntegration;

export const GROUP_ADMIN_RELATIONSHIP_TYPE = "jamf_group_has_jamf_user";
export const GROUP_ADMIN_RELATIONSHIP_CLASS = "HAS";
