import { fetchAdminUsers, fetchDeviceUsers } from '.';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { fetchAccounts } from '../accounts';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';
import {
  setComputerDeviceIdToGraphObjectKeyMap,
  setMobileDeviceIdToGraphObjectKeyMap,
} from '../../util/device';

describe('#fetchAdminUsers', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchAdminUsers',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchAccounts, fetchAdminUsers],
      entitySchemaMatchers: [
        {
          _type: Entities.USER_ADMIN._type,
          matcher: {
            _class: ['User'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'jamf_user' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                username: { type: 'string' },
                admin: {
                  const: true,
                },
                directoryUser: { type: 'boolean' },
                fullName: { type: 'string' },
                email: { type: 'string' },
                emailAddress: { type: 'string' },
                enabled: { type: 'string' },
                forcePasswordChange: { type: 'boolean' },
                accessLevel: { type: 'string' },
                privilegeSet: { type: 'string' },
                permissions: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.ACCOUNT_HAS_USER_ADMIN._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'jamf_account_has_user' },
              },
            },
          },
        },
      ],
    });
  }, 10000);
});

describe('#fetchDeviceUsers', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      async beforeRecord(context) {
        await setMobileDeviceIdToGraphObjectKeyMap(context.jobState, new Map());
        await setComputerDeviceIdToGraphObjectKeyMap(
          context.jobState,
          new Map(),
        );
      },
      recordingName: 'fetchDeviceUsers',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchAccounts, fetchDeviceUsers],
      entitySchemaMatchers: [
        {
          _type: Entities.DEVICE_USER._type,
          matcher: {
            _class: ['User'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'device_user' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                username: { type: 'string' },
                fullName: { type: 'string' },
                email: { type: 'string' },
                emailAddress: { type: 'string' },
                phoneNumber: { type: 'string' },
                position: { type: 'string' },
                enableCustomPhotoUrl: { type: 'boolean' },
                customPhotoUrl: { type: 'string' },
                ldapServer: { type: 'string' },
                totalVppCodeCount: { type: 'number' },
                os: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.ACCOUNT_HAS_DEVICE_USER._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'jamf_account_has_device_user' },
              },
            },
          },
        },
      ],
    });
  }, 10000);
});
