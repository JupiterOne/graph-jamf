import { fetchGroups } from '.';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { fetchAccounts } from '../accounts';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';
import { fetchAdminUsers } from '../users';

jest.setTimeout(5000000);

describe('#fetchGroups', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchGroups',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchAccounts, fetchAdminUsers, fetchGroups],
      entitySchemaMatchers: [
        {
          _type: Entities.GROUP._type,
          matcher: {
            _class: ['UserGroup'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'jamf_group' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                accessLevel: { type: 'string' },
                privilegeSet: { type: 'string' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.ACCOUNT_HAS_GROUP._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'jamf_account_has_group' },
              },
            },
          },
        },
        {
          _type: Relationships.GROUP_HAS_USER_ADMIN_MEMBER._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'jamf_group_has_user' },
              },
            },
          },
        },
      ],
    });
  }, 10000);
});
