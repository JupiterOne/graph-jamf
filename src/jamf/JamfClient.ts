import fetch, { RequestInit } from "node-fetch";
import {
  Method,
  MobileDevice,
  MobileDevicesResponse,
  User,
  UserResponse,
  UsersResponse,
} from "../types";

export default class JamfClient {
  private readonly host: string;
  private readonly login: string;
  private readonly password: string;

  constructor(host: string, login: string, password: string) {
    this.host = host;
    this.login = login;
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
          this.login + ":" + this.password,
        ).toString("base64")}`,
        "Accept-Encoding": "identity",
        ...headers,
      },
    };

    const response = await fetch(
      `https://${this.host}/JSSResource${url}`,
      options,
    );

    return response.json();
  }
}
