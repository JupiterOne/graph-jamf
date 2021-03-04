import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Account } from '../../jamf/types';
import { generateEntityKey } from '../../util/generateKey';
import { Entities } from '../constants';

export function getAccountEntityKey(accountId: string) {
  return generateEntityKey(Entities.ACCOUNT._type, accountId);
}

export function createAccountEntity(data: Account) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.ACCOUNT._class,
        _type: Entities.ACCOUNT._type,
        _key: getAccountEntityKey(data.id),
        displayName: data.name,
        name: data.name,
      },
    },
  });
}
