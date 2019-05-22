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

export interface AdminsAndGroups {
  users: Admin[];
  groups: Group[];
}

export interface Admin {
  id: number;
  name: string;
  directory_user?: boolean;
  full_name?: string;
  email?: string;
  email_address?: string;
  password_sha256?: string;
  enabled?: string;
  force_password_change?: boolean;
  access_level?: string;
  privilege_set?: string;
  privileges?: Privileges;
  groups?: {
    group: {
      id: number;
      name: string;
      site: { id: number; name: string };
      privileges: {
        jss_objects?: any;
        jss_settings?: any;
        recon?: any;
        casper_admin?: any;
        casper_remote?: any;
        casper_imaging?: any;
      };
    };
  };
}

export interface Group {
  id: number;
  name: string;
  site: { id: number; name: string };
  access_level?: string;
  privilege_set?: string;
  privileges?: Privileges;
  members?: Array<{ id: number; name: string }>;
}

export interface Privileges {
  jss_objects: string[];
  jss_settings?: string[];
  jss_actions?: string[];
  recon: string[];
  casper_admin?: string[];
  casper_remote: string[];
  casper_imaging: string[];
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
    computers: Array<{
      id: number;
      name: string;
    }>;
    peripherals: Array<{
      id: number;
      name: string;
    }>;
    mobile_devices: Array<{
      id: number;
      name: string;
    }>;
    vpp_assignments: Array<{
      id: number;
      name: string;
    }>;
    total_vpp_code_count: number;
  };
}

export interface Computer {
  id: number;
  name: string;
  managed: boolean;
  username: string;
  model: string;
  department: string;
  building: string;
  mac_address: string;
  udid: string;
  serial_number: string;
  report_date_utc: string;
  report_date_epoch: number;
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

export interface AccountsResponse {
  accounts: AdminsAndGroups;
}

export interface AdminResponse {
  account: Admin;
}

export interface GroupResponse {
  group: Group;
}

export interface UsersResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
}

export interface ComputerResponse {
  computers: Computer[];
}

export interface MobileDevicesResponse {
  mobile_devices: MobileDevice[];
}

export interface JamfDataModel {
  users: User[];
  mobileDevices: MobileDevice[];
  computers: Computer[];
  admins: Admin[];
  groups: Group[];
}

export enum Method {
  GET = "get",
  POST = "post",
}
