import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Group } from '../../jamf/types';
import { generateEntityKey } from '../../util/generateKey';
import { skippedRawDataSource } from '../../util/graphObject';
import { Entities } from '../constants';

export function createGroupEntity(data: Group) {
  return createIntegrationEntity({
    entityData: {
      source: skippedRawDataSource,
      assign: {
        _class: Entities.GROUP._class,
        _type: Entities.GROUP._type,
        _key: generateEntityKey(Entities.GROUP._type, data.id),
        id: data.id.toString(),
        displayName: data.name,
        name: data.name,
        accessLevel: data.access_level,
        privilegeSet: data.privilege_set,
      },
    },
  });
}
