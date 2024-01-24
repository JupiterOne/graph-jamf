import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { instanceConfigFields, IntegrationConfig } from './config';
import { accountSteps } from './steps/accounts';
import { deviceSteps } from './steps/devices';
import { groupSteps } from './steps/groups';
import { userSteps } from './steps/users';
import { validateInvocation } from './validator';
import { ingestionConfig } from './ingestionConfig';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> =
  {
    instanceConfigFields,
    validateInvocation,
    integrationSteps: [
      ...accountSteps,
      ...groupSteps,
      ...userSteps,
      ...deviceSteps,
    ],
    ingestionConfig,
  };
