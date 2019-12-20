import { User } from "../../jamf";
import {
  COMPUTER_ENTITY_TYPE,
  USER_COMPUTER_RELATIONSHIP_CLASS,
  USER_COMPUTER_RELATIONSHIP_TYPE,
  USER_ENTITY_TYPE,
  UserComputerRelationship,
} from "../../jupiterone";
import {
  generateEntityKey,
  generateRelationKey,
} from "../../utils/generateKey";

export function createUserComputerRelationships(
  users: User[],
): UserComputerRelationship[] {
  const defaultValue: UserComputerRelationship[] = [];

  return users.reduce((acc, user) => {
    if (isComputer(user)) {
      return acc;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const relationships = user.links!.computers.map(device => {
      const parentKey = generateEntityKey(USER_ENTITY_TYPE, user.id);
      const childKey = generateEntityKey(COMPUTER_ENTITY_TYPE, device.id);
      const relationKey = generateRelationKey(
        parentKey,
        USER_COMPUTER_RELATIONSHIP_CLASS,
        childKey,
      );

      const relationship: UserComputerRelationship = {
        _class: USER_COMPUTER_RELATIONSHIP_CLASS,
        _type: USER_COMPUTER_RELATIONSHIP_TYPE,
        _scope: USER_COMPUTER_RELATIONSHIP_TYPE,
        _fromEntityKey: parentKey,
        _key: relationKey,
        _toEntityKey: childKey,
      };

      return relationship;
    });

    return acc.concat(relationships);
  }, defaultValue);
}

function isComputer(user: User): boolean {
  return !(
    user.links &&
    user.links.computers &&
    user.links.computers.length > 0
  );
}
