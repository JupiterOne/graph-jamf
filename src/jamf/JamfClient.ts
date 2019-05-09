import fetch, { RequestInit } from "node-fetch";
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

    const response = await fetch(
      `https://${this.host}/JSSResource${url}`,
      options,
    );

    if (response.status === 401) {
      const err = new Error(response.statusText) as any;
      err.code = "AccessDenied";
      err.statusCode = response.status;
      throw err;
    }

    return response.json();
  }
}
