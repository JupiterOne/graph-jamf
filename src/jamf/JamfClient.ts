import fetch, { RequestInit, Response } from "node-fetch";
import {
  Computer,
  ComputerResponse,
  Method,
  MobileDevice,
  MobileDevicesResponse,
  User,
  UserResponse,
  UsersResponse,
} from "../types";

export default class JamfClient {
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;

  constructor(host: string, username: string, password: string) {
    this.host = host;
    this.username = username;
    this.password = password;
  }

  public async fetchAccounts(): Promise<any> {
    const result = await this.makeRequest<any>(`/accounts`, Method.GET, {});

    return result.users;
  }

  public async fetchAccountUserById(id: number): Promise<any> {
    const result = await this.makeRequest<any>(
      `/accounts/userid/${id}`,
      Method.GET,
      {},
    );

    return result.users;
  }

  public async fetchAccountGroupById(id: number): Promise<any> {
    const result = await this.makeRequest<any>(
      `/accounts/groupid/${id}`,
      Method.GET,
      {},
    );

    return result.users;
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

    let response: Response;
    try {
      response = await fetch(`https://${this.host}/JSSResource${url}`, options);
    } catch (err) {
      if (err.code === "ETIMEDOUT") {
        const error = new Error(
          `Timed out trying to connect to ${this.host} (${err.code})`,
        ) as any;
        error.code = err.code;
        throw error;
      } else if (err.code === "ESOCKETTIMEDOUT") {
        const error = new Error(
          `Established connection to ${this.host} timed out (${err.code})`,
        ) as any;
        error.code = err.code;
        throw error;
      } else {
        throw err;
      }
    }

    if (response.status === 200) {
      return response.json();
    } else {
      const err = new Error(response.statusText) as any;
      err.code = "UnexpectedStatusCode";
      err.statusCode = response.status;
      throw err;
    }
  }
}
