import fetch, { RequestInit, Response, FetchError } from "node-fetch";
import PQueue from "p-queue";

import { retry } from "@lifeomic/attempt";

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
} from "../types";
import {
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
} from "./types";
import { IntegrationLogger } from "@jupiterone/jupiter-managed-integration-sdk";

type LoggerContext = {
  logger: IntegrationLogger;
};

export default class JamfClient {
  private readonly context: LoggerContext;
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;
  private readonly queue: PQueue;

  constructor(
    context: {
      logger: IntegrationLogger;
    },
    host: string,
    username: string,
    password: string,
  ) {
    this.context = context;
    this.host = host;
    this.username = username;
    this.password = password;
    this.queue = new PQueue({ concurrency: 1, intervalCap: 1, interval: 50 });
  }

  public async fetchAccounts(): Promise<AdminsAndGroups> {
    const result = await this.makeRequest<AccountsResponse>(
      `/accounts`,
      Method.GET,
      {},
    );
    const { users, groups } = result.accounts;

    return { users, groups };
  }

  public async fetchAccountUserById(id: number): Promise<Admin> {
    const result = await this.makeRequest<AdminResponse>(
      `/accounts/userid/${id}`,
      Method.GET,
      {},
    );

    return result.account;
  }

  public async fetchAccountGroupById(id: number): Promise<Group> {
    const result = await this.makeRequest<GroupResponse>(
      `/accounts/groupid/${id}`,
      Method.GET,
      {},
    );

    return result.group;
  }

  public async fetchUsers(): Promise<User[]> {
    const result = await this.makeRequest<UsersResponse>(
      `/users`,
      Method.GET,
      {},
    );

    return result.users;
  }

  public async fetchUserById(id: number): Promise<User> {
    const result = await this.makeRequest<UserResponse>(
      `/users/id/${id}`,
      Method.GET,
      {},
    );

    return result.user;
  }

  public async fetchMobileDevices(): Promise<MobileDevice[]> {
    const result = await this.makeRequest<MobileDevicesResponse>(
      "/mobiledevices",
      Method.GET,
      {},
    );

    return result.mobile_devices;
  }

  public async fetchComputers(): Promise<Computer[]> {
    const result = await this.makeRequest<ComputerResponse>(
      "/computers/subset/basic",
      Method.GET,
      {},
    );

    return result.computers;
  }

  public async fetchComputerById(id: number): Promise<ComputerDetail> {
    const result = await this.makeRequest<ComputerDetailResponse>(
      `/computers/id/${id}`,
      Method.GET,
      {},
    );

    return result.computer;
  }

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

  public async fetchOSXConfigurationProfiles(): Promise<Configuration[]> {
    const result = await this.makeRequest<OSXConfigurationResponse>(
      `/osxconfigurationprofiles`,
      Method.GET,
      {},
    );

    return result.os_x_configuration_profiles;
  }

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

  private async makeRequest<T>(
    url: string,
    method: Method,
    params: {},
    headers?: {},
  ): Promise<T> {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          this.username + ":" + this.password,
        ).toString("base64")}`,
        "Accept-Encoding": "identity",
        ...headers,
      },
    };

    // The goal here is to retry and ensure the final error includes information
    // about the host we could not connect to, since users define the host and
    // may mis-type the value.
    const request = (): Promise<Response | undefined> =>
      retry(
        async () => {
          const fullUrl = `https://${this.host}/JSSResource${url}`;

          try {
            return await fetch(fullUrl, options);
          } catch (err) {
            const fetchErr = err as FetchError;

            this.context.logger.error(
              {
                url: fullUrl,
                errorCode: fetchErr.code,
                err,
              },
              "Jamf API request failed",
            );

            if (err.code === "ETIMEDOUT") {
              throw Object.assign(new Error(), {
                message: `Timed out trying to connect to ${this.host} (${err.code})`,
                code: err.code,
              });
            } else if (err.code === "ESOCKETTIMEDOUT") {
              throw Object.assign(new Error(), {
                message: `Established connection to ${this.host} timed out (${err.code})`,
                code: err.code,
              });
            } else {
              throw err;
            }
          }
        },
        { maxAttempts: 3 },
      );

    const response = await this.queue.add(request);

    /* istanbul ignore next line */
    if (!response) {
      throw new Error("Did not obtain a response!");
    }

    if (response.status === 200) {
      return response.json();
    } else {
      throw Object.assign(new Error(), {
        message: response.statusText,
        code: "UnexpectedStatusCode",
        statusCode: response.status,
      });
    }
  }
}
