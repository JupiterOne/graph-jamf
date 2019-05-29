import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const ADMIN_ENTITY_TYPE = "jamf_user";
export const ADMIN_ENTITY_CLASS = "User";

export interface AdminEntity extends EntityFromIntegration {
  name: string;
  admin: boolean;
  directoryUser: boolean;
  fullName: string;
  email: string;
  emailAddress: string;
  enabled: string;
  forcePasswordChange: boolean;
  accessLevel: string;
  privilegeSet: string;
  permissions?: string[];
}
