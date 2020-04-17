/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  setRawData,
  convertProperties,
} from "@jupiterone/jupiter-managed-integration-sdk";

import { DataByID } from "../../jamf/types";
import {
  COMPUTER_ENTITY_CLASS,
  COMPUTER_ENTITY_TYPE,
  ComputerEntity,
} from "../../jupiterone";
import {
  Computer,
  ComputerDetail,
  DiskPartition,
  OSXConfigurationDetailParsed,
  OSXConfigurationPayloadItem,
} from "../../types";
import { generateEntityKey } from "../../utils/generateKey";

export function createComputerEntities(
  data: Computer[],
  detailData: ComputerDetail[],
  osxConfigurationDetailsById: DataByID<OSXConfigurationDetailParsed>,
): ComputerEntity[] {
  return data.map(device => {
    return createComputerEntity(
      device,
      osxConfigurationDetailsById,
      detailData.find(item => item.general.id === device.id),
    );
  });
}

function createComputerEntity(
  device: Computer,
  osxConfigurationDetailsById: DataByID<OSXConfigurationDetailParsed>,
  detailData?: ComputerDetail,
): ComputerEntity {
  const computer: ComputerEntity = {
    _key: generateEntityKey(COMPUTER_ENTITY_TYPE, device.id),
    _type: COMPUTER_ENTITY_TYPE,
    _class: COMPUTER_ENTITY_CLASS,
    _rawData: [{ name: "default", rawData: device }],
    id: device.udid,
    displayName: device.name,
    name: device.name,
    managed: device.managed,
    username: device.username,
    model: device.model,
    department: device.department,
    building: device.building,
    macAddress: device.mac_address,
    udid: device.udid,
    serialNumber: device.serial_number,
    reportDateUtc: device.report_date_utc,
    reportDateEpoch: device.report_date_epoch,
    lastReportedOn: device.report_date_epoch,
    encrypted: false,
    gatekeeperEnabled: false,
    systemIntegrityProtectionEnabled: false,
  };

  if (detailData) {
    setRawData(computer, { name: "detail", rawData: detailData });

    Object.assign(computer, {
      ...convertProperties(detailData.general),
    });

    if (!device.username || device.username.length === 0) {
      computer.username = detailData.location.username;
    }

    computer.email = detailData.location.email_address;
    computer.encrypted = encrypted(detailData);
    computer.gatekeeperStatus = detailData.hardware.gatekeeper_status;
    computer.gatekeeperEnabled = gatekeeperEnabled(detailData);
    computer.systemIntegrityProtectionEnabled = systemIntegrityProtectionEnabled(
      detailData,
    );

    const configurationProfiles = detailData.configuration_profiles
      .map(profile => osxConfigurationDetailsById[profile.id])
      .filter(profile => profile);

    if (configurationProfiles.length > 0) {
      const collapseFirewallBoolean = collapsePayloadBoolean.bind(
        null,
        configurationProfiles,
        "com.apple.security.firewall",
      );

      computer.firewallEnabled = collapseFirewallBoolean("EnableFirewall");
      computer.firewallStealthModeEnabled = collapseFirewallBoolean(
        "EnableStealthMode",
      );
      computer.firewallBlockAllIncoming = collapseFirewallBoolean(
        "BlockAllIncoming",
      );
      computer.screensaverLockEnabled = collapsePayloadBoolean(
        configurationProfiles,
        "com.apple.screensaver",
        "PayloadEnabled",
      );
      computer.screensaverIdleTime = collapsePayloadNumber(
        configurationProfiles,
        "com.apple.screensaver",
        "loginWindowIdleTime",
      );
    }
  }

  return computer;
}

function encrypted(detailData: ComputerDetail): boolean {
  const bootPartition = primaryDiskBootPartition(detailData);
  return (
    !!bootPartition &&
    ((bootPartition.filevault_status === "Encrypted" &&
      bootPartition.filevault_percent === 100) ||
      (bootPartition.filevault2_status === "Encrypted" &&
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
    const device = "device" in storage ? storage.device : storage;
    const partitionList = itemArray(device.partition);

    // If there is only one disk and one partition, returns it as the primary
    // regardless of the type property value
    if (storageList.length === 1 && partitionList.length === 1) {
      return partitionList[0];
    }
    // Otherwise check for type
    else {
      for (const p of partitionList) {
        if (p.type === "boot") {
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
    detailData.hardware.gatekeeper_status.startsWith("App Store")
  );
}

function systemIntegrityProtectionEnabled(detailData: ComputerDetail): boolean {
  return detailData.hardware.sip_status === "Enabled";
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
    payload => {
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
        typeof payload[property] === "number"
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
    const payload = profile.parsedPayload.PayloadContent.find(item => {
      return item.PayloadType === payloadType;
    }) as OSXConfigurationPayloadItem;

    value = getNewValue(payload, value) || value;
  }

  return value;
}
