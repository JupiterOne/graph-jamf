import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const USER_ENTITY_TYPE = "jamf_user";
export const USER_ENTITY_CLASS = "Person";

export interface UserEntity extends EntityFromIntegration {
  id: number;
  username: string;
}
