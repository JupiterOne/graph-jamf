import { IntegrationProviderAPIError } from '@jupiterone/integration-sdk-core';

interface CreateIntegrationProviderAPIErrorOptions {
  /**
   * An optional reference to the error that caused this error. The cause tree
   * will be included in logging of the error to assist problem resolution.
   */
  cause?: Error;
  endpoint: string;
  status: string | number;
  statusText: string;
}

/**
 * This class should be used when a provider API call should not be retried
 */
export class IntegrationProviderPermanentAPIError extends IntegrationProviderAPIError {
  public readonly retryable = false;

  constructor(options: CreateIntegrationProviderAPIErrorOptions) {
    super(options);
  }
}
