import {
  Admin,
  AdminsAndGroups,
  ApplicationDetail,
  Computer,
  ComputerDetail,
  Configuration,
  Group,
  MobileDevice,
  OSXConfigurationDetail,
  OSXConfigurationDetailParsed,
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

export interface OSXConfigurationResponse {
  os_x_configuration_profiles: Configuration[];
}

export interface OSXConfigurationDetailResponse {
  os_x_configuration_profile: OSXConfigurationDetail;
}

export interface MobileDevicesResponse {
  mobile_devices: MobileDevice[];
}

export interface JamfDataModel {
  users: User[];
  mobileDevices: MobileDevice[];
  computers: Computer[];
  computerDetails: ComputerDetail[];
  osxConfigurationDetails: OSXConfigurationDetailParsed[];
  admins: Admin[];
  groups: Group[];

  osxConfigurationDetailsById: DataByID<OSXConfigurationDetailParsed>;
}

export interface DataByID<T> {
  [id: number]: T;
}
