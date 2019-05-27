import {
  COMPUTER_CONFIGURATION_RELATIONSHIP_CLASS,
  COMPUTER_CONFIGURATION_RELATIONSHIP_TYPE,
  COMPUTER_ENTITY_TYPE,
  ComputerConfigurationRelationship,
  CONFIGURATION_ENTITY_TYPE,
} from "../../jupiterone";
import { ComputerDetail } from "../../types";
import {
  generateEntityKey,
  generateRelationKey,
} from "../../utils/generateKey";

export function createComputerConfigurationRelationships(
  computers: ComputerDetail[],
): ComputerConfigurationRelationship[] {
  const defaultRelationships: ComputerConfigurationRelationship[] = [];
  return computers.reduce((acc, item) => {
    const parentKey = generateEntityKey(COMPUTER_ENTITY_TYPE, item.general.id);
    const relationships: ComputerConfigurationRelationship[] = item.configuration_profiles.map(
      configuration => {
        const childKey = generateEntityKey(
          CONFIGURATION_ENTITY_TYPE,
          configuration.id,
        );
        const relationKey = generateRelationKey(
          parentKey,
          COMPUTER_CONFIGURATION_RELATIONSHIP_CLASS,
          childKey,
        );
        const relationship: ComputerConfigurationRelationship = {
          _class: COMPUTER_CONFIGURATION_RELATIONSHIP_CLASS,
          _key: relationKey,
          _type: COMPUTER_CONFIGURATION_RELATIONSHIP_TYPE,
          _fromEntityKey: parentKey,
          _toEntityKey: childKey,
        };
        return relationship;
      },
    );
    return acc.concat(relationships);
  }, defaultRelationships);
}
