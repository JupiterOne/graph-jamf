import {
  COMPUTER_ENTITY_TYPE,
  OSX_CONFIGURATION_ENTITY_TYPE,
} from "../../jupiterone";
import {
  COMPUTER_OSX_CONFIGURATION_RELATIONSHIP_CLASS,
  COMPUTER_OSX_CONFIGURATION_RELATIONSHIP_TYPE,
  ComputerOSXConfigurationRelationship,
} from "../../jupiterone/relationships/ComputerOSXConfigurationRelationship";
import { ComputerDetail } from "../../types";
import {
  generateEntityKey,
  generateRelationKey,
} from "../../utils/generateKey";

function createComputerOSXConfigurationRelationships(
  computer: ComputerDetail,
): ComputerOSXConfigurationRelationship[] {
  const computerKey = generateEntityKey(
    COMPUTER_ENTITY_TYPE,
    computer.general.id,
  );

  return computer.configuration_profiles.reduce(
    (relationships: ComputerOSXConfigurationRelationship[], profile) => {
      const osxConfigurationKey = generateEntityKey(
        OSX_CONFIGURATION_ENTITY_TYPE,
        profile.id,
      );
      const relationshipKey = generateRelationKey(
        computerKey,
        COMPUTER_OSX_CONFIGURATION_RELATIONSHIP_CLASS,
        osxConfigurationKey,
      );
      const relationship: ComputerOSXConfigurationRelationship = {
        _class: COMPUTER_OSX_CONFIGURATION_RELATIONSHIP_CLASS,
        _key: relationshipKey,
        _type: COMPUTER_OSX_CONFIGURATION_RELATIONSHIP_TYPE,
        _scope: COMPUTER_OSX_CONFIGURATION_RELATIONSHIP_TYPE,
        _fromEntityKey: computerKey,
        _toEntityKey: osxConfigurationKey,
      };

      relationships.push(relationship);
      return relationships;
    },
    [],
  );
}

export function createComputersOSXConfigurationsRelationships(
  computers: ComputerDetail[],
): ComputerOSXConfigurationRelationship[] {
  return computers.reduce(
    (relationships: ComputerOSXConfigurationRelationship[], computer) => {
      return [
        ...relationships,
        ...createComputerOSXConfigurationRelationships(computer),
      ];
    },
    [],
  );
}
