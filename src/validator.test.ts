import { IntegrationValidationError } from '@jupiterone/integration-sdk-core';
import { createMockExecutionContext } from '@jupiterone/integration-sdk-testing';

import { IntegrationConfig } from './config';
import { validateInvocation } from './validator';

describe('#validateInvocation', () => {
  it('requires valid config', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {} as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      IntegrationValidationError,
    );
  });
});
