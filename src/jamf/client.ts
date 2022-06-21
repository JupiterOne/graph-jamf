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
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';
import { URL } from 'url';
import { GaxiosOptions, request } from 'gaxios';

interface CreateJamfClientParams {
  host: string;
  username: string;
  password: string;
}

const defaultApiTimeoutMs = 60000; // 1 minute

export class JamfClient {
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;

  constructor(options: CreateJamfClientParams) {
    this.host = options.host;
    this.username = options.username;
    this.password = options.password;
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
    const url = this.getResourceUrl(path);
    const requestOptions: GaxiosOptions = {
      url: url,
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(
          this.username + ':' + this.password,
        ).toString('base64')}`,
        'Accept-Encoding': 'identity',
        ...headers,
      },
      timeout: defaultApiTimeoutMs,
      // https://github.com/googleapis/gaxios
      // See README.md for default retry behavior
      retry: true,
    };

    try {
      const response = await request<T>(requestOptions);
      return response.data;
    } catch (err) {
      switch (err.response.status) {
        case 401:
          throw new IntegrationProviderAuthenticationError({
            endpoint: url,
            status: err.response.status,
            statusText: err.response.statusText,
          });
        case 403:
          throw new IntegrationProviderAuthorizationError({
            endpoint: url,
            status: err.response.status,
            statusText: err.response.statusText,
          });
        default:
          throw new IntegrationProviderAPIError({
            endpoint: url,
            status: err.response.status,
            statusText: err.response.statusText,
          });
      }
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
  });

  return client;
}
