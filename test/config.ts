import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

export const integrationConfig: IntegrationConfig = {
  jamfHost: process.env.JAMF_HOST || 'https://jupiteronedev.jamfcloud.com/',
  jamfUsername: process.env.JAMF_USERNAME || 'test-username',
  jamfPassword: process.env.JAMF_PASSWORD || 'test-password',
};
