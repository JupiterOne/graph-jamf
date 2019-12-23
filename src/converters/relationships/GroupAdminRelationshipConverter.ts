import {
  ADMIN_ENTITY_TYPE,
  GROUP_ADMIN_RELATIONSHIP_CLASS,
  GROUP_ADMIN_RELATIONSHIP_TYPE,
  GROUP_ENTITY_TYPE,
  GroupAdminRelationship,
} from "../../jupiterone";
import { Group } from "../../types";
import {
  generateEntityKey,
  generateRelationKey,
} from "../../utils/generateKey";

export function createGroupAdminRelationships(
  groups: Group[],
): GroupAdminRelationship[] {
  const defaultRelationships: GroupAdminRelationship[] = [];
  return groups.reduce((acc, group) => {
    if (!group.members) {
      return acc;
    }
    const relationships = group.members.map(member => {
      const parentKey = generateEntityKey(GROUP_ENTITY_TYPE, group.id);
      const childKey = generateEntityKey(ADMIN_ENTITY_TYPE, member.id);
      const relationKey = generateRelationKey(
        parentKey,
        GROUP_ADMIN_RELATIONSHIP_TYPE,
        childKey,
      );

      const relationship: GroupAdminRelationship = {
        _class: GROUP_ADMIN_RELATIONSHIP_CLASS,
        _type: GROUP_ADMIN_RELATIONSHIP_TYPE,
        _scope: GROUP_ADMIN_RELATIONSHIP_TYPE,
        _fromEntityKey: parentKey,
        _key: relationKey,
        _toEntityKey: childKey,
      };

      return relationship;
    });
    return acc.concat(relationships);
  }, defaultRelationships);
}
