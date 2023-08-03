import {
  createIntegrationEntity,
  parseTimePropertyValue,
  RawDataTracking,
  setRawData,
} from '@jupiterone/integration-sdk-core';
import {
  ExtensionAttribute,
  MobileDevice,
  MobileDeviceDetail,
  OSXConfigurationDetailParsed,
  OSXConfigurationFirewallPayload,
} from '../../jamf/types';
import { generateEntityKey } from '../../util/generateKey';
import { Entities, DEPLOYMENT_STATUS } from '../constants';
import { deviceNormalizer } from './normalizer';

export function createMobileDeviceEntity(
  device: MobileDevice,
  deviceDetail: MobileDeviceDetail,
  previouslyDiscoveredDevice: boolean,
) {
  const defaultDeviceKey = generateEntityKey(
    Entities.MOBILE_DEVICE._type,
    device.id,
  );
  const _key = previouslyDiscoveredDevice
    ? defaultDeviceKey
    : device.serial_number || defaultDeviceKey;

  const extensionAttributes = {};

  // Prevent all extensionAttributes from being uploaded due to the size of the
  // entities that can be generated as a result from uploading every property.
  if (deviceDetail && deviceDetail.extension_attributes) {
    extensionAttributes[`extensionAttribute.${DEPLOYMENT_STATUS}`] =
      getDeploymentStatus(deviceDetail.extension_attributes);
  }

  const mobileDeviceEntity = createIntegrationEntity({
    entityData: {
      source: device,
      assign: {
        _class: Entities.MOBILE_DEVICE._class,
        _type: Entities.MOBILE_DEVICE._type,
        _key,
        name: device.name,
        id: device.udid,
        deviceName: device.device_name,
        displayName: `${device.username || 'Unknown User'}'s ${device.model}`,
        category: 'mobile',
        make: null,
        udid: device.udid,
        deviceId: device.udid,
        serial: device.serial_number,
        serialNumber: device.serial_number,
        phoneNumber: device.phone_number,
        wifiMacAddress: device.wifi_mac_address,
        macAddress: device.wifi_mac_address?.toLowerCase(),
        managed: device.managed,
        supervised: device.supervised,
        model: device.model,
        modelIdentifier: device.model_identifier,
        modelDisplay: device.model_display,
        username: device.username,
        email: deviceDetail?.location?.email_address,
        lastSeenOn: parseTimePropertyValue(
          deviceDetail?.general?.last_inventory_update_epoch,
          'ms',
        ),
        createdOn: parseTimePropertyValue(
          deviceDetail?.general?.initial_entry_date_epoch,
          'ms',
        ),
        capacity: deviceDetail?.general?.capacity,
        osType: deviceDetail?.general?.os_type,
        osVersion: deviceNormalizer.normalizeOsVersion(
          deviceDetail?.general?.os_version,
        ),
        locatorServiceEnabled:
          deviceDetail?.general?.device_locator_service_enabled,
        cloudBackupEnabled: deviceDetail?.general?.cloud_backup_enabled,
        lastBackupOn: parseTimePropertyValue(
          deviceDetail?.general?.last_cloud_backup_date_epoch,
          'ms',
        ),
        dataProtectionEnabled: deviceDetail?.security?.data_protection,
        blockLevelEncryption:
          deviceDetail?.security?.block_level_encryption_capable,
        fileLevelEncryption:
          deviceDetail?.security?.file_level_encryption_capable,
        hasPasscode: deviceDetail?.security?.passcode_present,
        passcodeCompliant: deviceDetail?.security?.passcode_compliant,
        profileCompliant:
          deviceDetail?.security?.passcode_compliant_with_profile,
        passcodeLockGracePeriodEnforced:
          deviceDetail?.security?.passcode_lock_grace_period_enforced,
        activationLockEnabled: deviceDetail?.security?.activation_lock_enabled,
        jailbroken: deviceDetail?.security?.jailbreak_detected,
        ...extensionAttributes,
      },
    },
  });
  if (deviceDetail) {
    setRawData(mobileDeviceEntity as RawDataTracking, {
      name: 'detail',
      rawData: deviceDetail,
    });
  }
  return mobileDeviceEntity;
}

function getMacOsFirewallProperties(data: OSXConfigurationDetailParsed) {
  if (data.parsedPayload === undefined) {
    return;
  }

  const firewallPayload = data.parsedPayload.PayloadContent.find((item) => {
    return item.PayloadType === 'com.apple.security.firewall';
  }) as OSXConfigurationFirewallPayload;

  // I don't believe we need to check for firewallPayload.PayloadEnabled for
  // com.apple.security.firewall.  In the current payload, it doesn't contain
  // that value like other properties do.
  if (!firewallPayload) {
    return;
  }

  return {
    firewallEnabled: firewallPayload.EnableFirewall,
    firewallStealthModeEnabled: firewallPayload.EnableStealthMode,
    firewallBlockAllIncoming: firewallPayload.BlockAllIncoming,
  };
}

function getMacOsScreensaverProperties(data: OSXConfigurationDetailParsed) {
  if (data.parsedPayload === undefined) {
    return;
  }

  const screensaverPayload = data.parsedPayload.PayloadContent.find((item) => {
    return item.PayloadType === 'com.apple.screensaver';
  });

  if (!screensaverPayload || !screensaverPayload.PayloadEnabled) {
    return;
  }

  return {
    screensaverLockEnabled: true,
    screensaverIdleTime: screensaverPayload.loginWindowIdleTime,
  };
}

export function createMacOsConfigurationEntity(
  data: OSXConfigurationDetailParsed,
) {
  return createIntegrationEntity({
    entityData: {
      source: data, // prevent osx configuration map contents from getting mutated during rawData shrinking
      assign: {
        _key: generateEntityKey(
          Entities.MAC_OS_CONFIGURATION_PROFILE._type,
          data.general.id,
        ),
        _class: Entities.MAC_OS_CONFIGURATION_PROFILE._class,
        _type: Entities.MAC_OS_CONFIGURATION_PROFILE._type,
        id: data.general.id.toString(),
        name: data.general.name,
        displayName: data.general.name,
        description: data.general.description,
        siteName: data.general.site.name,
        categoryName: data.general.category.name,
        distributionMethod: data.general.distribution_method,
        userRemovable: data.general.user_removable,
        level: data.general.level,
        redeployOnUpdate: data.general.redeploy_on_update,
        allComputers: data.scope.all_computers,
        allJSSUsers: data.scope.all_jss_users,
        firewallEnabled: false,
        screensaverLockEnabled: false,
        ...getMacOsFirewallProperties(data),
        ...getMacOsScreensaverProperties(data),
      },
    },
  });
}

export function getDeploymentStatus(
  extensionAttributes: ExtensionAttribute[] = [],
) {
  if (!Array.isArray(extensionAttributes)) return [];

  const deploymentStatusAttribute = extensionAttributes.find(
    (attribute) => attribute.name === DEPLOYMENT_STATUS,
  );
  if (!deploymentStatusAttribute) return [];

  return deploymentStatusAttribute.value;
}

export function createComputerGroupEntity(groupName: string) {
  return createIntegrationEntity({
    entityData: {
      source: { groupName },
      assign: {
        _key: generateEntityKey(Entities.COMPUTER_GROUP._type, groupName),
        _type: Entities.COMPUTER_GROUP._type,
        _class: Entities.COMPUTER_GROUP._class,
        name: groupName,
      },
    },
  });
}
