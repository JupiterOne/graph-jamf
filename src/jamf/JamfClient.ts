import fetch, { RequestInit } from "node-fetch";

export interface User {
  id: number;
  name: string;
  full_name?: string;
  email?: string;
  email_address?: string;
  phone_number?: string;
  position?: string;
  enable_custom_photo_url?: boolean;
  custom_photo_url?: string;
  ldap_server?: {
    id: number;
    name: string;
  };
  extension_attributes?: Array<{
    extension_attribute: {
      id: number;
      name: string;
      type: string;
      value: string;
    };
  }>;
  sites?: Array<{
    site: {
      id: number;
      name: string;
    };
  }>;
  links?: {
    computers: {
      computer: {
        id: number;
        name: string;
      };
    };
    peripherals: {
      peripheral: {
        id: number;
        name: string;
      };
    };
    mobile_devices: {
      mobile_device: {
        id: number;
        name: string;
      };
    };
    vpp_assignments: {
      vpp_assignment: {
        id: number;
        name: string;
      };
    };
    total_vpp_code_count: number;
  };
}

export interface MobileDevice {
  id: number;
  name: string;
  device_name: string;
  udid: string;
  serial_number: string;
  phone_number: string;
  wifi_mac_address: string;
  managed: boolean;
  supervised: boolean;
  model: string;
  model_identifier: string;
  model_display: string;
  username: string;
}

interface UsersResponse {
  users: User[];
}

interface UserResponse {
  user: User;
}

interface MobileDevicesResponse {
  mobile_devices: MobileDevice[];
}

export interface JamfDataModel {
  users: User[];
  mobileDevices: MobileDevice[];
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
    )) as UsersResponse;

    return [...users, ...result.users];
  }

  public async fetchUserById(id: number): Promise<User> {
    const result = (await this.makeRequest(
      `/users/id/${id}`,
      Method.GET,
      {},
    )) as UserResponse;

    return result.user;
  }

  public async fetchMobileDevices(): Promise<MobileDevice[]> {
    const devices: MobileDevice[] = [];
    const result = (await this.makeRequest(
      "/mobiledevices",
      Method.GET,
      {},
    )) as MobileDevicesResponse;

    return [...devices, ...result.mobile_devices];
  }

  private async makeRequest(
    url: string,
    method: Method,
    params: {},
    headers?: {},
  ): Promise<UsersResponse | MobileDevicesResponse | UserResponse> {
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
