import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Admin, User } from '../../jamf/types';
import { generateEntityKey } from '../../util/generateKey';
import { skippedRawDataSource } from '../../util/graphObject';
import { Entities } from '../constants';

export function createAdminEntity(data: Admin) {
  return createIntegrationEntity({
    entityData: {
      source: skippedRawDataSource,
      assign: {
        _class: Entities.USER_ADMIN._class,
        _type: Entities.USER_ADMIN._type,
        _key: generateEntityKey(Entities.USER_ADMIN._type, data.id),
        id: data.id.toString(),
        username: data.name,
        displayName: data.name,
        name: data.name,
        admin: true,
        directoryUser: data.directory_user,
        fullName: data.full_name,
        email: data.email?.toLowerCase() || undefined,
        emailAddress: data.email_address?.toLowerCase(),
        active: data.enabled === 'Enabled',
        enabled: data.enabled,
        forcePasswordChange: data.force_password_change,
        accessLevel: data.access_level,
        privilegeSet: data.privilege_set,
        permissions:
          data.privilege_set === 'Administrator'
            ? [data.privilege_set]
            : undefined,
      },
    },
  });
}

export function getUserOperatingSystems(data: User) {
  const os: string[] = [];

  if (data.links) {
    if (data.links.mobile_devices.length > 0) {
      os.push('iOS');
    }

    if (data.links.computers.length > 0) {
      os.push('macOS');
    }
  }

  return os;
}

export function createDeviceUserEntity(data: User) {
  return createIntegrationEntity({
    entityData: {
      source: skippedRawDataSource,
      assign: {
        _class: Entities.DEVICE_USER._class,
        _type: Entities.DEVICE_USER._type,
        _key: generateEntityKey(Entities.DEVICE_USER._type, data.id),
        id: data.id.toString(),
        displayName: data.name,
        name: data.name,
        username: data.name,
        fullName: data.full_name,
        // Jamf device users are always considered active. Jamf _admins_ can
        // be explicitly disabled
        active: true,
        email: data.email?.toLowerCase() || undefined,
        emailAddress: data.email_address?.toLowerCase(),
        phoneNumber: data.phone_number,
        position: data.position,
        enableCustomPhotoUrl: data.enable_custom_photo_url,
        customPhotoUrl: data.custom_photo_url,
        ldapServer: data.ldap_server && data.ldap_server.name,
        totalVppCodeCount: data.links && data.links.total_vpp_code_count,
        os: getUserOperatingSystems(data),
      },
    },
  });
}
