import fetch, { RequestInit, Response, FetchError } from 'node-fetch';
import { retry } from '@lifeomic/attempt';
import PQueue from 'p-queue';
import {
  Admin,
  AdminsAndGroups,
  ApplicationDetail,
  Computer,
  ComputerDetail,
  Configuration,
  Group,
  Method,
  MobileDevice,
  OSXConfigurationDetail,
  User,
  AccountsResponse,
  AdminResponse,
  ApplicationDetailResponse,
  ComputerDetailResponse,
  ComputerResponse,
  GroupResponse,
  MobileDevicesResponse,
  OSXConfigurationDetailResponse,
  OSXConfigurationResponse,
  UserResponse,
  UsersResponse,
} from './types';
import {
  IntegrationLogger,
  IntegrationProviderAPIError,
} from '@jupiterone/integration-sdk-core';
import { URL } from 'url';
import { IntegrationProviderPermanentAPIError } from '../util/error';

interface OnApiRequestErrorParams {
  url: string;
  err: FetchError;
  attemptNum: number;
  attemptsRemaining: number;
  code?: string;
}

type RequestFunction = (
  url: string,
  options?: RequestInit | undefined,
) => Promise<Response>;

interface CreateJamfClientParams {
  host: string;
  username: string;
  password: string;
  request?: RequestFunction;
  onApiRequestError?: (params: OnApiRequestErrorParams) => void;
}

const defaultApiTimeoutMs = 60000; // 1 minute
const noRetryStatusCodes: number[] = [400, 401, 403, 404, 413];

function isSuccessfulStatusCode(status: number) {
  return status >= 200 && status < 400;
}

async function request(
  requestFn: RequestFunction,
  url: string,
  options?: RequestInit | undefined,
): Promise<Response> {
  const response = await requestFn(url, options);

  if (isSuccessfulStatusCode(response.status)) {
    return response;
  }

  if (noRetryStatusCodes.includes(response.status)) {
    throw new IntegrationProviderPermanentAPIError({
      endpoint: url,
      statusText: 'Received non-retryable status code in API response',
      status: response.status,
    });
  }

  throw new IntegrationProviderAPIError({
    endpoint: url,
    statusText: response.statusText,
    status: response.status,
  });
}

export class JamfClient {
  private readonly queue: PQueue;
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;
  private readonly request: RequestFunction;

  private readonly onApiRequestError:
    | ((params: OnApiRequestErrorParams) => void)
    | undefined;

  constructor(options: CreateJamfClientParams) {
    this.host = options.host;
    this.username = options.username;
    this.password = options.password;
    this.request = options.request || fetch;
    this.onApiRequestError = options.onApiRequestError;

    this.queue = new PQueue({ concurrency: 1, intervalCap: 1, interval: 50 });
  }

  /**
   * Requires "Read - Jamf Pro User Accounts & Groups" permission
   */
  public async fetchAccounts(): Promise<AdminsAndGroups> {
    const result = await this.makeRequest<AccountsResponse>(
      `/accounts`,
      Method.GET,
      {},
    );
    const { users, groups } = result.accounts;

    return { users, groups };
  }

  /**
   * Requires "Read - Jamf Pro User Accounts & Groups" permission
   */
  public async fetchAccountUserById(id: number): Promise<Admin> {
    const result = await this.makeRequest<AdminResponse>(
      `/accounts/userid/${id}`,
      Method.GET,
      {},
    );

    return result.account;
  }

  /**
   * Requires "Read - Jamf Pro User Accounts & Groups" permission
   */
  public async fetchAccountGroupById(id: number): Promise<Group> {
    const result = await this.makeRequest<GroupResponse>(
      `/accounts/groupid/${id}`,
      Method.GET,
      {},
    );

    return result.group;
  }

  /**
   * Requires "Read - Users" permission
   */
  public async fetchUsers(): Promise<User[]> {
    const result = await this.makeRequest<UsersResponse>(
      `/users`,
      Method.GET,
      {},
    );

    return result.users;
  }

  /**
   * Requires "Read - Users" permission
   */
  public async fetchUserById(id: number): Promise<User> {
    const result = await this.makeRequest<UserResponse>(
      `/users/id/${id}`,
      Method.GET,
      {},
    );

    return result.user;
  }

  /**
   * Requires "Read - Mobile Devices" permission
   */
  public async fetchMobileDevices(): Promise<MobileDevice[]> {
    const result = await this.makeRequest<MobileDevicesResponse>(
      '/mobiledevices',
      Method.GET,
      {},
    );

    return result.mobile_devices;
  }

  /**
   * Requires "Read - Computers" permission
   */
  public async fetchComputers(): Promise<Computer[]> {
    const result = await this.makeRequest<ComputerResponse>(
      '/computers/subset/basic',
      Method.GET,
      {},
    );

    return result.computers;
  }

  /**
   * Requires "Read - Computers" permission
   */
  public async fetchComputerById(id: number): Promise<ComputerDetail> {
    const result = await this.makeRequest<ComputerDetailResponse>(
      `/computers/id/${id}`,
      Method.GET,
      {},
    );

    return result.computer;
  }

  /**
   * Requires "Read - Advanced Computer Searches" permission
   */
  public async fetchComputerApplicationByName(
    name: string,
  ): Promise<ApplicationDetail> {
    const result = await this.makeRequest<ApplicationDetailResponse>(
      `/computerapplications/application/${name}`,
      Method.GET,
      {},
    );

    return result.computer_applications;
  }

  /**
   * Requires "Read - macOS Configuration Profiles" permission
   */
  public async fetchOSXConfigurationProfiles(): Promise<Configuration[]> {
    const result = await this.makeRequest<OSXConfigurationResponse>(
      `/osxconfigurationprofiles`,
      Method.GET,
      {},
    );

    return result.os_x_configuration_profiles;
  }

  /**
   * Requires "Read - macOS Configuration Profiles" permission
   */
  public async fetchOSXConfigurationProfileById(
    id: number,
  ): Promise<OSXConfigurationDetail> {
    const result = await this.makeRequest<OSXConfigurationDetailResponse>(
      `/osxconfigurationprofiles/id/${id}`,
      Method.GET,
      {},
    );

    return result.os_x_configuration_profile;
  }

  public getResourceUrl(path: string): string {
    const url = new URL(
      this.host.startsWith('http') ? this.host : `https://${this.host}`,
    );
    url.pathname = `JSSResource${path}`;
    return url.href;
  }

  private async makeRequest<T>(
    path: string,
    method: Method,
    params: {},
    headers?: {},
  ): Promise<T> {
    const options: RequestInit = {
      method,
      timeout: defaultApiTimeoutMs,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(
          this.username + ':' + this.password,
        ).toString('base64')}`,
        'Accept-Encoding': 'identity',
        ...headers,
      },
    };

    const fullUrl = this.getResourceUrl(path);

    // The goal here is to retry and ensure the final error includes information
    // about the host we could not connect to, since users define the host and
    // may mis-type the value.
    const requestWithRetry = (): Promise<Response> =>
      retry(async () => request(this.request, fullUrl, options), {
        maxAttempts: 5,
        handleError: (err, attemptContext) => {
          if (err.retryable === false) {
            attemptContext.abort();
            return;
          }

          const fetchErr = err as FetchError;

          if (attemptContext.attemptsRemaining && this.onApiRequestError) {
            // If there are no attempts remaining, we will just bubble up the
            // entire error by default.
            this.onApiRequestError({
              url: fullUrl,
              code: fetchErr.code,
              err,
              attemptNum: attemptContext.attemptNum,
              attemptsRemaining: attemptContext.attemptsRemaining,
            });
          }
        },
      });

    const response = await this.queue.add(requestWithRetry);

    if (response.status === 200) {
      return response.json();
    } else {
      throw new IntegrationProviderAPIError({
        endpoint: fullUrl,
        statusText: response.statusText,
        status: response.status,
      });
    }
  }
}

interface CreateJamfClientHelperParams {
  host: string;
  username: string;
  password: string;
  logger: IntegrationLogger;
}

export function createClient({
  host,
  username,
  password,
  logger,
}: CreateJamfClientHelperParams) {
  const client = new JamfClient({
    host,
    username,
    password,
    onApiRequestError(requestError) {
      logger.info(requestError, 'Error making API requests (will retry)');
    },
  });

  return client;
}
