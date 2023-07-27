import {
  convertProperties,
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
  RawDataTracking,
  setRawData,
} from '@jupiterone/integration-sdk-core';
import {
  Computer,
  ComputerDetail,
  DiskPartition,
  ExtensionAttribute,
  MobileDevice,
  MobileDeviceDetail,
  OSXConfigurationDetailParsed,
  OSXConfigurationFirewallPayload,
  OSXConfigurationPayloadItem,
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
      source: { ...data }, // prevent osx configuration map contents from getting mutated during rawData shrinking
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

// TODO: Refactor this to be simpler!
export function createComputerEntity({
  device,
  macOsConfigurationDetailByIdMap,
  detailData,
  previouslyDiscoveredDevice,
}: {
  device: Computer;
  macOsConfigurationDetailByIdMap: Map<number, OSXConfigurationDetailParsed>;
  detailData?: ComputerDetail;
  previouslyDiscoveredDevice: boolean;
}): Entity {
  const defaultDeviceKey = generateEntityKey(
    Entities.COMPUTER._type,
    device.id,
  );

  const _key = previouslyDiscoveredDevice
    ? defaultDeviceKey
    : device.serial_number || defaultDeviceKey;

  const extensionAttributes = {};

  // 06/17/21 CRB
  // Making an update here to prevent all extensionAttributes from being uploaded
  // due to the size of the entity that can be generated as a result from uploading
  // every extensionAttribute property.
  if (detailData && detailData.extension_attributes) {
    extensionAttributes[`extensionAttribute.${DEPLOYMENT_STATUS}`] =
      getDeploymentStatus(detailData.extension_attributes);
  }

  const computer: Entity = {
    _key,
    _type: Entities.COMPUTER._type,
    _class: Entities.COMPUTER._class,
    _rawData: [{ name: 'default', rawData: device }],
    id: device.udid.toString(),
    displayName:
      device.name || `${device.username || 'Unknown User'}'s ${device.model}`,
    name: device.name,
    realName: detailData?.location.real_name || detailData?.location.realname,
    managed: device.managed,
    username: device.username,
    model: device.model,
    serial: device.serial_number,
    deviceType: /macbook/i.test(device.model) ? 'laptop' : 'desktop',
    department: device.department,
    building: device.building,
    macAddress: device.mac_address.toLowerCase(),
    udid: device.udid,
    deviceId: device.udid,
    lastReportedOn: device.report_date_epoch
      ? device.report_date_epoch
      : undefined,
    lastSeenOn: parseTimePropertyValue(
      detailData?.general?.last_contact_time_epoch ?? device.report_date_epoch,
      'ms',
    ),
    encrypted: false,
    gatekeeperEnabled: false,
    systemIntegrityProtectionEnabled: false,
    category: 'endpoint',
    hostname: null,
    ...extensionAttributes,
  };

  if (detailData) {
    setRawData(computer as RawDataTracking, {
      name: 'detail',
      rawData: detailData,
    });

    Object.assign(computer, {
      ...convertProperties(detailData.general),
      id: detailData.general.id.toString(),
    });

    computer.createdOn = detailData.general.initial_entry_date_epoch
      ? detailData.general.initial_entry_date_epoch
      : undefined;
    computer.enrolledOn = detailData.general.last_enrolled_date_epoch
      ? detailData.general.last_enrolled_date_epoch
      : undefined;

    computer.macAddress =
      detailData.general.mac_address &&
      detailData.general.mac_address.toLowerCase();
    computer.altMacAddress =
      detailData.general.alt_mac_address &&
      detailData.general.alt_mac_address.toLowerCase();

    delete (computer as any).initialEntryDate;
    delete (computer as any).initialEntryDateEpoch;
    delete (computer as any).initialEntryDateUtc;
    delete (computer as any).lastContactTime;
    delete (computer as any).lastContactTimeEpoch;
    delete (computer as any).lastContactTimeUtc;
    delete (computer as any).lastEnrolledDate;
    delete (computer as any).lastEnrolledDateEpoch;
    delete (computer as any).lastEnrolledDateUtc;
    delete (computer as any).reportDate;
    delete (computer as any).reportDateEpoch;
    delete (computer as any).reportDateUtc;

    computer.platform =
      detailData.general.platform === 'Mac'
        ? 'darwin'
        : detailData.general.platform.toLowerCase();
    computer.make = detailData.hardware.make;
    computer.osName =
      detailData.general.platform === 'Mac'
        ? 'macOS'
        : detailData.hardware.os_name;
    computer.osVersion = detailData.hardware.os_version;
    computer.osBuild = detailData.hardware.os_build;

    if (!device.username || device.username.length === 0) {
      computer.username = detailData.location.username;
    }

    computer.email = detailData.location.email_address?.toLowerCase();
    computer.encrypted = encrypted(detailData);
    computer.gatekeeperStatus = detailData.hardware.gatekeeper_status;
    computer.gatekeeperEnabled = gatekeeperEnabled(detailData);
    computer.systemIntegrityProtectionEnabled =
      systemIntegrityProtectionEnabled(detailData);

    const configurationProfiles = detailData.configuration_profiles
      .map((profile) => macOsConfigurationDetailByIdMap.get(profile.id))
      .filter((profile) => {
        return typeof profile !== 'undefined';
      }) as OSXConfigurationDetailParsed[];

    if (configurationProfiles.length > 0) {
      const collapseFirewallBoolean = collapsePayloadBoolean.bind(
        null,
        configurationProfiles,
        'com.apple.security.firewall',
      );

      computer.firewallEnabled = collapseFirewallBoolean('EnableFirewall');
      computer.firewallStealthModeEnabled =
        collapseFirewallBoolean('EnableStealthMode');
      computer.firewallBlockAllIncoming =
        collapseFirewallBoolean('BlockAllIncoming');
      computer.screensaverLockEnabled = collapsePayloadBoolean(
        configurationProfiles,
        'com.apple.screensaver',
        'PayloadEnabled',
      );
      computer.screensaverIdleTime = collapsePayloadNumber(
        configurationProfiles,
        'com.apple.screensaver',
        'loginWindowIdleTime',
      );
    }

    // TODO:  Should we let the Security tab Firewall value override the above
    // firewall data set by the profile (if one is attached)?  In theory, they
    // should always match
    if (
      detailData.security &&
      detailData.security.firewall_enabled !== undefined
    ) {
      computer.firewallEnabled = detailData.security.firewall_enabled;
    }
  }

  return computer;
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

function encrypted(detailData: ComputerDetail): boolean {
  const bootPartition = primaryDiskBootPartition(detailData);
  return (
    !!bootPartition &&
    ((bootPartition.filevault_status === 'Encrypted' &&
      bootPartition.filevault_percent === 100) ||
      (bootPartition.filevault2_status === 'Encrypted' &&
        bootPartition.filevault2_percent === 100))
  );
}

function itemArray(item: any): Array<any> {
  if (item) {
    return Array.isArray(item) ? item : [item];
  } else {
    return [];
  }
}

function primaryDiskBootPartition(
  detailData: ComputerDetail,
): DiskPartition | undefined {
  const storageList = itemArray(detailData.hardware.storage);

  for (const storage of storageList) {
    const device = 'device' in storage ? storage.device : storage;
    const partitionList = itemArray(device.partition || device.partitions);

    // If there is only one disk and one partition, returns it as the primary
    // regardless of the type property value
    if (storageList.length === 1 && partitionList.length === 1) {
      return partitionList[0];
    }
    // Otherwise check for type
    else {
      for (const p of partitionList) {
        if (p.type === 'boot') {
          return p;
        }
      }
    }
  }
}

function gatekeeperEnabled(detailData: ComputerDetail): boolean {
  // gatekeeperStatus can be one of three things: "App Store", "App Store and
  // identified developers", or "Anywhere"
  return (
    !!detailData.hardware.gatekeeper_status &&
    detailData.hardware.gatekeeper_status.startsWith('App Store')
  );
}

function systemIntegrityProtectionEnabled(detailData: ComputerDetail): boolean {
  return detailData.hardware.sip_status === 'Enabled';
}

function collapsePayloadBoolean(
  configurationProfiles: OSXConfigurationDetailParsed[],
  payloadType: string,
  property: string,
): boolean {
  return collapsePayloadValue(
    configurationProfiles,
    payloadType,
    false,
    (payload) => {
      if (payload && payload.PayloadEnabled && payload[property]) {
        return true;
      }
    },
  );
}

// This method assumes that lower = more restrictive.
function collapsePayloadNumber(
  configurationProfiles: OSXConfigurationDetailParsed[],
  payloadType: string,
  property: string,
): number | undefined {
  return collapsePayloadValue(
    configurationProfiles,
    payloadType,
    undefined,
    (payload, value) => {
      if (
        payload &&
        payload.PayloadEnabled &&
        payload[property] &&
        typeof payload[property] === 'number'
      ) {
        if (!value) {
          return payload[property];
        } else {
          return payload[property] < value ? payload[property] : value;
        }
      }
    },
  );
}

function collapsePayloadValue(
  configurationProfiles: OSXConfigurationDetailParsed[],
  payloadType: string,
  initialValue: any,
  getNewValue: (payload: OSXConfigurationPayloadItem, currentValue: any) => any,
): any {
  let value = initialValue;

  for (const profile of configurationProfiles) {
    const payload = profile?.parsedPayload?.PayloadContent.find((item) => {
      return item.PayloadType === payloadType;
    }) as OSXConfigurationPayloadItem;

    value = getNewValue(payload, value) || value;
  }

  return value;
}
