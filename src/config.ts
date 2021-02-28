import {
  IntegrationInstanceConfig,
  IntegrationInstanceConfigFieldMap,
} from '@jupiterone/integration-sdk-core';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  jamfHost: {
    type: 'string',
  },
  jamfUsername: {
    type: 'string',
  },
  jamfPassword: {
    type: 'string',
    mask: true,
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  jamfHost: string;
  jamfUsername: string;
  jamfPassword: string;
}
