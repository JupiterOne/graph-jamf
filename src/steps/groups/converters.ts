import {
  IntegrationLogger,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
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
//INT-8912
export function printSizeOfField(data: Group, logger: IntegrationLogger) {
  logger.info(
    {
      _class: Entities.GROUP._class.length,
      _type: Entities.GROUP._type.length,
      _key: generateEntityKey(Entities.GROUP._type, data.id).length,
      id: data.id.toString().length,
      displayName: data.name.length,
      name: data.name.length,
      accessLevel: data.access_level?.length,
      privilegeSet: data.privilege_set?.length,
    },
    'Size of Group fields',
  );
}
