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
  Token,
  AuthType,
  JamfProVersion,
} from './types';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
  parseTimePropertyValue,
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
  private static _instance: JamfClient;

  private readonly host: string;
  private readonly username: string;
  private readonly password: string;

  private authType: AuthType;
  private token: string;
  private tokenExpiry: number;

  private constructor(options: CreateJamfClientParams) {
    this.host = options.host;
    this.username = options.username;
    this.password = options.password;
  }

  public async initialize() {
    // if authType has value, it means it already has been initialized
    if (this.authType) {
      return;
    }

    const version = await this.fetchJamfProVersion();
    if (!version) {
      // fallback to... basic auth?
      this.authType = AuthType.BasicAuthentication;
      return;
    }

    if ((version.major === 10 && version.minor >= 35) || version.major >= 11) {
      this.authType = AuthType.BearerToken;
    } else {
      this.authType = AuthType.BasicAuthentication;
    }
  }

  public static getInstance(options: CreateJamfClientParams) {
    return this._instance || (this._instance = new this(options));
  }

  private async fetchJamfProVersion(): Promise<JamfProVersion | undefined> {
    let version: string | null = null;

    try {
      // Let's try BearerToken strategy first
      this.authType = AuthType.BearerToken;
      const result = await this.makeRequest<any>(
        this.getResourceUrl(`api/v1/jamf-pro-version`, false),
        Method.GET,
        {},
      );
      version = result.version;
    } catch (err) {
      try {
        // if it fails, we have to try Basic Authentication one
        this.authType = AuthType.BasicAuthentication;
        const result = await this.makeRequest<any>(
          this.getResourceUrl(`api/v1/jamf-pro-version`, false),
          Method.GET,
          {},
        );
        version = result.version;
      } catch (err) {
        // TODO: this means both attempts at getting version failed (which is unexpected)
        // should we just return undefined value and let other pieces of code handle it
        // or throw some error in here?
      }
    }

    if (!version) {
      return undefined;
    }

    const versionParts = version.split('-')[0].split('.');
    return {
      major: parseInt(versionParts[0], 10),
      minor: parseInt(versionParts[1], 10),
      patch: parseInt(versionParts[2], 10),
    };
  }

  private async validateToken(): Promise<void> {
    if (!this.token || !this.tokenExpiry) {
      await this.generateToken();
    } else if (this.tokenExpiry - new Date().getTime() < 0) {
      await this.generateToken();
    }
  }

  private async generateToken(): Promise<void> {
    const url = this.getResourceUrl('/api/v1/auth/token', false);
    const requestOptions: GaxiosOptions = {
      url: url,
      method: Method.POST,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(
          this.username + ':' + this.password,
        ).toString('base64')}`,
        'Accept-Encoding': 'identity',
      },
      timeout: defaultApiTimeoutMs,
      // https://github.com/googleapis/gaxios
      // See README.md for default retry behavior
      retry: true,
    };

    try {
      const response = await request<Token>(requestOptions);
      this.token = response.data.token;
      this.tokenExpiry = parseTimePropertyValue(
        response.data.expires,
      ) as number;
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

  /**
   * Requires "Read - Jamf Pro User Accounts & Groups" permission
   */
  public async fetchAccounts(): Promise<AdminsAndGroups> {
    const result = await this.makeRequest<AccountsResponse>(
      this.getResourceUrl(`/accounts`),
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
      this.getResourceUrl(`/accounts/userid/${id}`),
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
      this.getResourceUrl(`/accounts/groupid/${id}`),
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
      this.getResourceUrl(`/users`),
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
      this.getResourceUrl(`/users/id/${id}`),
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
      this.getResourceUrl('/mobiledevices'),
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
      this.getResourceUrl('/computers/subset/basic'),
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
      this.getResourceUrl(`/computers/id/${id}`),
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
      this.getResourceUrl(`/computerapplications/application/${name}`),
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
      this.getResourceUrl(`/osxconfigurationprofiles`),
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
      this.getResourceUrl(`/osxconfigurationprofiles/id/${id}`),
      Method.GET,
      {},
    );

    return result.os_x_configuration_profile;
  }

  public getResourceUrl(path: string, isJSSResource: boolean = true): string {
    const url = new URL(
      this.host.startsWith('http') ? this.host : `https://${this.host}`,
    );
    if (isJSSResource) {
      url.pathname = `JSSResource${path}`;
    } else {
      url.pathname = path;
    }

    return url.href;
  }

  private async makeRequest<T>(
    path: string,
    method: Method,
    headers?: {},
  ): Promise<T> {
    if (this.authType === AuthType.BearerToken) {
      await this.validateToken();
    }

    const requestOptions: GaxiosOptions = {
      url: path,
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization:
          this.authType === AuthType.BasicAuthentication
            ? `Basic ${Buffer.from(
                this.username + ':' + this.password,
              ).toString('base64')}`
            : `Bearer ${this.token}`,
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
      if (!err.response || !err.response.status) {
        throw new IntegrationProviderAPIError({
          endpoint: path,
          status: 500,
          statusText: 'Failed to fetch response',
          cause: err,
        });
      }

      switch (err.response.status) {
        case 401:
          throw new IntegrationProviderAuthenticationError({
            endpoint: path,
            status: err.response.status,
            statusText: err.response.statusText,
          });
        case 403:
          throw new IntegrationProviderAuthorizationError({
            endpoint: path,
            status: err.response.status,
            statusText: err.response.statusText,
          });
        default:
          throw new IntegrationProviderAPIError({
            endpoint: path,
            status: err.response.status,
            statusText: err.response.statusText,
          });
      }
    }
  }
}
