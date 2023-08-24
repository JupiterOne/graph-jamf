import {
  convertProperties,
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
  OSXConfigurationDetailParsed,
  OSXConfigurationPayloadItem,
} from '../../jamf/types';
import { generateEntityKey } from '../../util/generateKey';
import { Entities, DEPLOYMENT_STATUS } from '../constants';
import { deviceNormalizer } from './normalizer';

function getDeploymentStatus(extensionAttributes: ExtensionAttribute[] = []) {
  if (!Array.isArray(extensionAttributes)) return [];

  const deploymentStatusAttribute = extensionAttributes.find(
    (attribute) => attribute.name === DEPLOYMENT_STATUS,
  );
  if (!deploymentStatusAttribute) return [];

  return deploymentStatusAttribute.value;
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

export const getConfigurationProfileData = (
  detailData,
  macOsConfigurationDetailByIdMap,
) => {
  const configurationProfiles = detailData.configuration_profiles
    .map((profile) => macOsConfigurationDetailByIdMap.get(profile.id))
    .filter(
      (profile) => typeof profile !== 'undefined',
    ) as OSXConfigurationDetailParsed[];

  const collapseFirewallBoolean = collapsePayloadBoolean.bind(
    null,
    configurationProfiles,
    'com.apple.security.firewall',
  );

  if (configurationProfiles.length > 0) {
    return {
      firewallEnabled: collapseFirewallBoolean('EnableFirewall'),
      firewallStealthModeEnabled: collapseFirewallBoolean('EnableStealthMode'),
      firewallBlockAllIncoming: collapseFirewallBoolean('BlockAllIncoming'),
      screensaverLockEnabled: collapsePayloadBoolean(
        configurationProfiles,
        'com.apple.screensaver',
        'PayloadEnabled',
      ),
      screensaverIdleTime: collapsePayloadNumber(
        configurationProfiles,
        'com.apple.screensaver',
        'loginWindowIdleTime',
      ),
    };
  }

  return {};
};

export const getUserNameData = (
  username: string,
  detailData: ComputerDetail,
) => {
  if (!username || username.length === 0) {
    return { username: detailData.location.username };
  }

  return {};
};

const getFirewallEnabledData = (detailData) => {
  // TODO:  Should we let the Security tab Firewall value override the above
  // firewall data set by the profile (if one is attached)?  In theory, they
  // should always match
  if (
    detailData.security &&
    detailData.security.firewall_enabled !== undefined
  ) {
    return { firewallEnabled: detailData.security.firewall_enabled };
  }

  return {};
};

const getDetailedData = (
  detailData: ComputerDetail,
  device: Computer,
  macOsConfigurationDetailByIdMap: Map<number, OSXConfigurationDetailParsed>,
) => {
  const convertedProperties = convertProperties(detailData.general);
  // eslint-disable-next-line prefer-const
  let data: any = {
    id: detailData.general.id.toString(),
    name: convertedProperties.name,
    networkAdapterType: convertedProperties.networkAdapterType,
    ipAddress: convertedProperties.ipAddress,
    altNetworkAdapterType: convertedProperties.altNetworkAdapterType,
    lastReportedIp: convertedProperties.lastReportedIp,
    serialNumber: convertedProperties.serialNumber,
    udid: convertedProperties.udid,
    jamfVersion: convertedProperties.jamfVersion,
    barcode1: convertedProperties.barcode1,
    barcode2: convertedProperties.barcode2,
    assetTag: convertedProperties.assetTag,
    supervised: convertedProperties.supervised,
    mdmCapable: convertedProperties.mdmCapable,
    lastCloudBackupDateEpoch: convertedProperties.lastCloudBackupDateEpoch,
    lastCloudBackupDateUtc: convertedProperties.lastCloudBackupDateUtc,
    mdmProfileExpirationEpoch: convertedProperties.mdmProfileExpirationEpoch,
    mdmProfileExpirationUtc: convertedProperties.mdmProfileExpirationUtc,
    distributionPoint: convertedProperties.distributionPoint,
    sus: convertedProperties.sus,
    netbootServer: convertedProperties.netbootServer || '',
    itunesStoreAccountIsActive: convertedProperties.itunesStoreAccountIsActive,
    platform:
      detailData.general.platform === 'Mac'
        ? 'darwin'
        : detailData.general.platform.toLowerCase(),
    createdOn: detailData.general.initial_entry_date_epoch
      ? detailData.general.initial_entry_date_epoch
      : undefined,
    enrolledOn: detailData.general.last_enrolled_date_epoch
      ? detailData.general.last_enrolled_date_epoch
      : undefined,
    macAddress:
      detailData.general.mac_address &&
      detailData.general.mac_address.toLowerCase(),
    altMacAddress:
      detailData.general.alt_mac_address &&
      detailData.general.alt_mac_address.toLowerCase(),
    make: detailData.hardware.make,
    osName:
      detailData.general.platform === 'Mac'
        ? 'macOS'
        : detailData.hardware.os_name,
    osVersion: deviceNormalizer.normalizeOsVersion(
      detailData.hardware.os_version,
    ),
    osBuild: detailData.hardware.os_build,
    systemIntegrityProtectionEnabled:
      systemIntegrityProtectionEnabled(detailData),
    email: detailData.location.email_address?.toLowerCase(),
    encrypted: encrypted(detailData),
    gatekeeperStatus: detailData.hardware.gatekeeper_status,
    gatekeeperEnabled: gatekeeperEnabled(detailData),
  };

  const configurationProfileData = getConfigurationProfileData(
    detailData,
    macOsConfigurationDetailByIdMap,
  );
  const firewallEnabledData = getFirewallEnabledData(detailData);
  const usernameData = getUserNameData(device.username, detailData);

  return {
    ...data,
    ...configurationProfileData,
    ...usernameData,
    ...firewallEnabledData,
  };
};

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

    const data = getDetailedData(
      detailData,
      device,
      macOsConfigurationDetailByIdMap,
    );

    return { ...computer, ...data };
  }

  return computer;
}
