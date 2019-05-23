import { RelationshipDirection } from "@jupiterone/jupiter-managed-integration-sdk";
import {
  APPLICATION_ENTITY_CLASS,
  APPLICATION_ENTITY_TYPE,
  COMPUTER_APPLICATION_RELATIONSHIP_CLASS,
  COMPUTER_APPLICATION_RELATIONSHIP_TYPE,
  COMPUTER_ENTITY_TYPE,
  ComputerApplicationRelationship,
} from "../../jupiterone";
import { ComputerDetail } from "../../types";
import {
  generateEntityKey,
  generateRelationKey,
} from "../../utils/generateKey";

export function createComputerApplicationRelationship(
  computers: ComputerDetail[],
): ComputerApplicationRelationship[] {
  const defaultRelationships: ComputerApplicationRelationship[] = [];
  return computers.reduce((acc, item) => {
    const parentKey = generateEntityKey(COMPUTER_ENTITY_TYPE, item.general.id);
    const relationships: ComputerApplicationRelationship[] = item.software.applications.map(
      application => {
        const childKey = generateEntityKey(
          APPLICATION_ENTITY_TYPE,
          `${application.name}_${application.version}`,
        );
        const relationKey = generateRelationKey(
          parentKey,
          COMPUTER_APPLICATION_RELATIONSHIP_CLASS,
          childKey,
        );
        const relationship: ComputerApplicationRelationship = {
          _class: COMPUTER_APPLICATION_RELATIONSHIP_CLASS,
          _key: relationKey,
          _type: COMPUTER_APPLICATION_RELATIONSHIP_TYPE,
          version: application.version,
          _mapping: {
            relationshipDirection: RelationshipDirection.FORWARD,
            sourceEntityKey: parentKey,
            skipTargetCreation: false,
            targetFilterKeys: [["_class", "name"]],
            targetEntity: {
              _class: APPLICATION_ENTITY_CLASS,
              displayName: application.name,
              name: application.name,
              path: application.path,
            },
          },
        };
        return relationship;
      },
    );
    return acc.concat(relationships);
  }, defaultRelationships);
}
