import fetch, { RequestInit } from "node-fetch";

export interface User {
  id: number;
  name: string;
}

interface UserResponse {
  users: User[];
}

export interface JamfDataModel {
  users: User[];
}

enum Method {
  GET = "get",
  POST = "post",
}

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
    const users: User[] = [];
    const result = (await this.makeRequest(
      `/users`,
      Method.GET,
      {},
    )) as UserResponse;

    return [...users, ...result.users];
  }

  private async makeRequest(
    url: string,
    method: Method,
    params: {},
    headers?: {},
  ): Promise<UserResponse> {
    const options: RequestInit = {
      method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          this.login + ":" + this.password,
        ).toString("base64")}`,
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
