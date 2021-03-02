import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_KEY = 'ACCOUNT_ENTITY';
export const ACCOUNT_DATA_KEY = 'ACCOUNT_DATA';
export const MAC_OS_CONFIGURATION_DETAILS_BY_ID_KEY =
  'MAC_OS_CONFIGURATION_DETAILS_BY_ID';

export enum IntegrationSteps {
  ACCOUNTS = 'fetch-accounts',
  MACOS_CONFIGURATION_PROFILES = 'fetch-macos-configuration-profiles',
  MOBILE_DEVICES = 'fetch-mobile-devices',
  COMPUTERS = 'fetch-computers',
  GROUPS = 'fetch-groups',
  ADMINS = 'fetch-admins',
  DEVICE_USERS = 'fetch-device-users'
}

export const Entities: Record<
  | 'ACCOUNT'
  | 'GROUP'
  | 'USER_ADMIN'
  | 'DEVICE_USER'
  | 'MOBILE_DEVICE'
  | 'COMPUTER'
  | 'MAC_OS_CONFIGURATION_PROFILE'
  | 'MAC_OS_APPLICATION',
  StepEntityMetadata
> = {
  ACCOUNT: {
    _type: 'jamf_account',
    _class: ['Account'],
    resourceName: 'Account',
  },
  GROUP: {
    _type: 'jamf_group',
    _class: ['UserGroup'],
    resourceName: 'Group',
  },
  USER_ADMIN: {
    _type: 'jamf_user',
    _class: ['User'],
    resourceName: 'Admin',
  },
  DEVICE_USER: {
    _type: 'device_user',
    _class: ['User'],
    resourceName: 'User',
  },
  MOBILE_DEVICE: {
    _type: 'mobile_device',
    _class: ['Device'],
    resourceName: 'Mobile Device',
  },
  COMPUTER: {
    _type: 'user_endpoint',
    _class: ['Host', 'Device'],
    resourceName: 'Computer',
  },
  MAC_OS_CONFIGURATION_PROFILE: {
    _type: 'jamf_osx_configuration_profile',
    _class: ['Configuration'],
    resourceName: 'macOS Configuration Profile',
  },
  MAC_OS_APPLICATION: {
    _type: 'macos_app',
    _class: ['Application'],
    resourceName: 'macOS Application',
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER_ADMIN'
  | 'ACCOUNT_HAS_GROUP'
  | 'ACCOUNT_HAS_DEVICE_USER'
  | 'ACCOUNT_HAS_MOBILE_DEVICE'
  | 'ACCOUNT_HAS_COMPUTER'
  | 'ACCOUNT_HAS_MAC_OS_CONFIGURATION_PROFILE'
  | 'COMPUTER_INSTALLED_APPLICATION'
  | 'COMPUTER_USES_PROFILE'
  | 'DEVICE_USER_HAS_MOBILE_DEVICE'
  | 'DEVICE_USER_HAS_COMPUTER'
  | 'GROUP_HAS_USER_ADMIN_MEMBER',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER_ADMIN: {
    _type: 'jamf_account_has_user',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.USER_ADMIN._type,
  },
  ACCOUNT_HAS_GROUP: {
    _type: 'jamf_account_has_group',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.GROUP._type,
  },
  ACCOUNT_HAS_DEVICE_USER: {
    _type: 'jamf_account_has_device_user',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.DEVICE_USER._type,
  },
  ACCOUNT_HAS_MOBILE_DEVICE: {
    _type: 'jamf_account_has_mobile_device',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.MOBILE_DEVICE._type,
  },
  ACCOUNT_HAS_COMPUTER: {
    _type: 'jamf_account_has_user_endpoint',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.COMPUTER._type,
  },
  ACCOUNT_HAS_MAC_OS_CONFIGURATION_PROFILE: {
    _type: 'jamf_account_has_osx_configuration_profile',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.MAC_OS_CONFIGURATION_PROFILE._type,
  },
  COMPUTER_USES_PROFILE: {
    _type: 'user_endpoint_uses_osx_configuration_profile',
    _class: RelationshipClass.USES,
    sourceType: Entities.COMPUTER._type,
    targetType: Entities.MAC_OS_CONFIGURATION_PROFILE._type,
  },
  COMPUTER_INSTALLED_APPLICATION: {
    _type: 'user_endpoint_installed_application',
    _class: RelationshipClass.INSTALLED,
    sourceType: Entities.COMPUTER._type,
    targetType: Entities.MAC_OS_APPLICATION._type,
  },
  DEVICE_USER_HAS_MOBILE_DEVICE: {
    _type: 'device_user_has_mobile_device',
    _class: RelationshipClass.HAS,
    sourceType: Entities.DEVICE_USER._type,
    targetType: Entities.MOBILE_DEVICE._type,
  },
  DEVICE_USER_HAS_COMPUTER: {
    _type: 'device_user_has_user_endpoint',
    _class: RelationshipClass.HAS,
    sourceType: Entities.DEVICE_USER._type,
    targetType: Entities.COMPUTER._type,
  },
  GROUP_HAS_USER_ADMIN_MEMBER: {
    _type: 'jamf_group_has_user',
    _class: RelationshipClass.HAS,
    sourceType: Entities.GROUP._type,
    targetType: Entities.USER_ADMIN._type,
  },
};
