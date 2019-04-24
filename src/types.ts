import {
  GraphClient,
  IntegrationExecutionContext,
  PersisterClient,
} from "@jupiterone/jupiter-managed-integration-sdk";

import JamfClient from "./jamf/JamfClient";

export interface JamfIntegrationContext extends IntegrationExecutionContext {
  graph: GraphClient;
  persister: PersisterClient;
  provider: JamfClient;
  account: Account;
}

export interface Account {
  id: string;
  name: string;
}

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
      computer?: {
        id: number;
        name: string;
      };
    };
    peripherals: {
      peripheral?: {
        id: number;
        name: string;
      };
    };
    mobile_devices: {
      mobile_device?: {
        id: number;
        name: string;
      };
    };
    vpp_assignments: {
      vpp_assignment?: {
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

export interface UsersResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
}

export interface MobileDevicesResponse {
  mobile_devices: MobileDevice[];
}

export interface JamfDataModel {
  users: User[];
  mobileDevices: MobileDevice[];
}

export enum Method {
  GET = "get",
  POST = "post",
}
