import {
  GROUP_ENTITY_CLASS,
  GROUP_ENTITY_TYPE,
  GroupEntity,
} from "../../jupiterone/entities";
import { Group } from "../../types";
import { generateEntityKey } from "../../utils/generateKey";

export function createGroupEntities(data: Group[]): GroupEntity[] {
  return data.map(item => ({
    _key: generateEntityKey(GROUP_ENTITY_TYPE, item.id),
    _type: GROUP_ENTITY_TYPE,
    _class: GROUP_ENTITY_CLASS,
    _rawData: [{ name: "default", rawData: item }],
    displayName: item.name,
    name: item.name,
    accessLevel: item.access_level!,
    privilegeSet: item.privilege_set!,
  }));
}
