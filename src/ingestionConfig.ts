import { IntegrationIngestionConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { IngestionSources } from './constants';

export const ingestionConfig: IntegrationIngestionConfigFieldMap = {
  [IngestionSources.MACOS_CONFIGURATION_PROFILES]: {
    title: 'MacOS configuration profiles',
    description: 'Device behavior settings including network and security',
  },
  [IngestionSources.MOBILE_DEVICES]: {
    title: 'Mobile devices',
    description: 'Apple devices, such as Macs, iPhones, and iPads',
  },
  [IngestionSources.COMPUTERS]: {
    title: 'Computers',
    description: 'Apple Macintosh device, such as a MacBook, iMac, or Mac mini',
  },
  [IngestionSources.ADMINS]: {
    title: 'Users',
    description: 'Users who have admin rights on the devices',
  },
};
