import { IntegrationLogger } from '@jupiterone/integration-sdk-core';

export interface WrapWithTimerParams {
  operationName: string;
  logger: IntegrationLogger;
  metadata?: Record<string, any>;
}

export async function wrapWithTimer<T>(
  fn: () => Promise<T>,
  { operationName, logger, metadata }: WrapWithTimerParams,
) {
  const operationLogger = logger.child({ operationName, metadata });
  const start = Date.now();
  operationLogger.info('Began operation');

  const result = await fn();

  const totalTime = Date.now() - start;
  operationLogger.info({ totalTime }, 'Operation complete');

  return result;
}
