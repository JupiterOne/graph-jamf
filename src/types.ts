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

export interface Application {
  name: string;
  path: string;
  version: string;
}

export interface ApplicationComputer {
  id: number;
  name: string;
  udid: string;
  serial_number: string;
  mac_address: string;
}

export interface ApplicationDetail {
  versions: Array<{
    number: string;
    computers: ApplicationComputer[];
  }>;
  unique_computers: ApplicationComputer[];
}

export interface Storage {
  disk: string;
  model: string;
  revision: string;
  serial_number: string;
  size: number;
  drive_capacity_mb: number;
  connection_type: string;
  smart_status: string;
  partition: {
    name: string;
    size: number;
    type: string;
    partition_capacity_mb: number;
    percentage_full: number;
    filevault_status: string;
    filevault_percent: number;
    filevault2_status: string;
    filevault2_percent: number;
    boot_drive_available_mb: number;
    lvgUUID: string;
    lvUUID: string;
    pvUUID: string;
  };
}

export interface Printer {
  name: string;
  uri: string;
  type: string;
  location: string;
}

export interface ComputerDetail {
  general: {
    id: number;
    name: string;
    mac_address: string;
    alt_mac_address: string;
    ip_address: string;
    last_reported_ip: string;
    serial_number: string;
    udid: string;
    jamf_version: string;
    platform: string;
    barcode_1: string;
    barcode_2: string;
    asset_tag: string;
    remote_management: {
      managed: boolean;
      management_username: string;
      management_password_sha256: string;
    };
    mdm_capable: boolean;
    mdm_capable_users: { mdm_capable_user: string };
    management_status: {
      enrolled_via_dep: boolean;
      user_approved_enrollment: boolean;
      user_approved_mdm: boolean;
    };
    report_date: string;
    report_date_epoch: number;
    report_date_utc: string;
    last_contact_time: string;
    last_contact_time_epoch: number;
    last_contact_time_utc: string;
    initial_entry_date: string;
    initial_entry_date_epoch: number;
    initial_entry_date_utc: string;
    last_cloud_backup_date_epoch: 0;
    last_cloud_backup_date_utc: string;
    last_enrolled_date_epoch: number;
    last_enrolled_date_utc: string;
    distribution_point: string;
    sus: string;
    netboot_server: string;
    site: { id: number; name: string };
    itunes_store_account_is_active: boolean;
  };
  software: {
    unix_executables: any[];
    licensed_software: any[];
    installed_by_casper: any[];
    installed_by_installer_swu: string[];
    cached_by_casper: any[];
    available_software_updates: any[];
    available_updates: any;
    running_services: string[];
    applications: Application[];
    fonts: any[];
    plugins: any[];
  };
  hardware: {
    make: string;
    model: string;
    model_identifier: string;
    os_name: string;
    os_version: string;
    os_build: string;
    master_password_set: boolean;
    active_directory_status: string;
    service_pack: string;
    processor_type: string;
    processor_architecture: string;
    processor_speed: number;
    processor_speed_mhz: number;
    number_processors: number;
    number_cores: number;
    total_ram: number;
    total_ram_mb: number;
    boot_rom: string;
    bus_speed: number;
    bus_speed_mhz: number;
    battery_capacity: number;
    cache_size: number;
    cache_size_kb: number;
    available_ram_slots: number;
    optical_drive: string;
    nic_speed: string;
    smc_version: string;
    ble_capable: boolean;
    sip_status: string;
    gatekeeper_status: string;
    xprotect_version: string;
    institutional_recovery_key: string;
    disk_encryption_configuration: string;
    filevault2_users: string[];
    storage: Storage[];
    mapped_printers: Printer[];
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

export interface ApplicationDetailResponse {
  computer_applications: ApplicationDetail;
}

export interface ComputerResponse {
  computers: Computer[];
}

export interface ComputerDetailResponse {
  computer: ComputerDetail;
}

export interface MobileDevicesResponse {
  mobile_devices: MobileDevice[];
}

export interface JamfDataModel {
  users: User[];
  mobileDevices: MobileDevice[];
  computers: Computer[];
  computerDetails: ComputerDetail[];
  admins: Admin[];
  groups: Group[];
}

export enum Method {
  GET = "get",
  POST = "post",
}
