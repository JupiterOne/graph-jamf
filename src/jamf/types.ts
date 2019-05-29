import {
  Admin,
  AdminsAndGroups,
  ApplicationDetail,
  Computer,
  ComputerDetail,
  Configuration,
  ConfigurationDetail,
  Group,
  MobileDevice,
  User,
} from "../types";

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

export interface ConfigurationResponse {
  computer_configurations: Configuration[];
}

export interface ConfigurationDetailResponse {
  computer_configuration: ConfigurationDetail;
}

export interface MobileDevicesResponse {
  mobile_devices: MobileDevice[];
}

export interface JamfDataModel {
  users: User[];
  mobileDevices: MobileDevice[];
  computers: Computer[];
  computerDetails: ComputerDetail[];
  configurationDetails: ConfigurationDetail[];
  admins: Admin[];
  groups: Group[];
}
