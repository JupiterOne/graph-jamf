import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { fetchAccounts } from '../accounts';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';
import {
  fetchComputers,
  fetchMacOsConfigurationDetails,
  fetchMobileDevices,
} from '.';

describe('#fetchMacOsConfigurationDetails', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchMacOsConfigurationDetails',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchAccounts, fetchMacOsConfigurationDetails],
      entitySchemaMatchers: [
        {
          _type: Entities.MAC_OS_CONFIGURATION_PROFILE._type,
          matcher: {
            _class: ['Configuration'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'jamf_osx_configuration_profile' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                username: { type: 'string' },
                siteName: { type: 'string' },
                categoryName: { type: 'string' },
                distributionMethod: { type: 'string' },
                userRemovable: { type: 'boolean' },
                level: { type: 'string' },
                redeployOnUpdate: { type: 'string' },
                allComputers: { type: 'boolean' },
                allJSSUsers: { type: 'boolean' },

                // Firewall properties
                firewallEnabled: { type: 'boolean' },
                firewallStealthModeEnabled: { type: 'boolean' },
                firewallBlockAllIncoming: { type: 'boolean' },

                // Screensaver properties
                screensaverLockEnabled: { type: 'boolean' },
                screensaverIdleTime: { type: 'number' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.ACCOUNT_HAS_MAC_OS_CONFIGURATION_PROFILE._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'jamf_account_has_osx_configuration_profile' },
              },
            },
          },
        },
      ],
    });
  });
});

describe('#fetchMobileDevices', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchMobileDevices',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchAccounts, fetchMobileDevices],
      entitySchemaMatchers: [
        {
          _type: Entities.MOBILE_DEVICE._type,
          matcher: {
            _class: ['Device'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'mobile_device' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                deviceName: { type: 'string' },
                udid: { type: 'string' },
                serialNumber: { type: 'string' },
                phoneNumber: { type: 'string' },
                wifiMacAddress: { type: 'string' },
                managed: { type: 'boolean' },
                supervised: { type: 'boolean' },
                model: { type: 'string' },
                modelIdentifier: { type: 'string' },
                modelDisplay: { type: 'string' },
                username: { type: 'string' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.ACCOUNT_HAS_MOBILE_DEVICE._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'jamf_account_has_mobile_device' },
              },
            },
          },
        },
      ],
    });
  });
});

describe('#fetchComputers', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchComputers',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [
        fetchAccounts,
        fetchMacOsConfigurationDetails,
        fetchComputers,
      ],
      entitySchemaMatchers: [
        {
          _type: Entities.COMPUTER._type,
          matcher: {
            _class: ['Host', 'Device'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'user_endpoint' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                altMacAddress: { type: 'string' },
                altNetworkAdapterType: { type: 'string' },
                assetTag: { type: 'string' },
                barcode1: { type: 'string' },
                barcode2: { type: 'string' },
                building: { type: 'string' },
                department: { type: 'string' },
                deviceType: { type: 'string', enum: ['laptop', 'desktop'] },
                distributionPoint: { type: 'string' },
                email: { type: 'string' },
                encrypted: { type: 'boolean' },
                enrolledOn: { type: 'number' },
                gatekeeperEnabled: { type: 'boolean' },
                gatekeeperStatus: { type: 'string' },
                ipAddress: { type: 'string' },
                itunesStoreAccountIsActive: { type: 'boolean' },
                jamfVersion: { type: 'string' },
                lastCloudBackupDateEpoch: { type: 'number' },
                lastCloudBackupDateUtc: { type: 'string' },
                lastReportedIp: { type: 'string' },
                lastReportedOn: { type: 'number' },
                lastSeenOn: { type: 'number' },
                macAddress: { type: 'string' },
                make: { type: 'string' },
                managed: { type: 'boolean' },
                mdmCapable: { type: 'boolean' },
                mdmProfileExpirationEpoch: { type: 'number' },
                mdmProfileExpirationUtc: { type: 'string' },
                model: { type: 'string' },
                name: { type: 'string' },
                netbootServer: { type: 'string' },
                networkAdapterType: { type: 'string' },
                osBuild: { type: 'string' },
                osName: { type: 'string' },
                osVersion: { type: 'string' },
                serial: { type: 'string' },
                serialNumber: { type: 'string' },
                supervised: { type: 'boolean' },
                sus: { type: 'string' },
                systemIntegrityProtectionEnabled: { type: 'boolean' },
                udid: { type: 'string' },
                username: { type: 'string' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.ACCOUNT_HAS_COMPUTER._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'jamf_account_has_user_endpoint' },
              },
            },
          },
        },
        {
          _type: Relationships.COMPUTER_USES_PROFILE._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.USES },
                _type: {
                  const: 'user_endpoint_uses_osx_configuration_profile',
                },
              },
            },
          },
        },
        {
          _type: Relationships.COMPUTER_INSTALLED_APPLICATION._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.INSTALLED },
                _type: { const: 'user_endpoint_installed_application' },
                _mapping: { type: 'object' },
              },
            },
          },
        },
      ],
    });
  });
});
