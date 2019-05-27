import {
  CONFIGURATION_ENTITY_CLASS,
  CONFIGURATION_ENTITY_TYPE,
  ConfigurationEntity,
} from "../../jupiterone";
import { ConfigurationDetail } from "../../types";
import { generateEntityKey } from "../../utils/generateKey";

export function createConfigurationEntities(
  data: ConfigurationDetail[],
): ConfigurationEntity[] {
  return data.map(item => {
    return {
      _key: generateEntityKey(CONFIGURATION_ENTITY_TYPE, item.general.id),
      _type: CONFIGURATION_ENTITY_TYPE,
      _class: CONFIGURATION_ENTITY_CLASS,
      id: item.general.id,
      name: item.general.name,
      description: item.general.description,
      type: item.general.type,
    };
  });
}
