/* eslint-disable @typescript-eslint/camelcase */

import { MobileDevice } from "../../types";
import { createMobileDeviceEntities } from "./MobileDeviceEntityConverter";

test("convert mobile device entity", () => {
  const mobileDevices: MobileDevice[] = [
    {
      id: 16,
      name: "Update 1-1",
      device_name: "Update 1-1",
      udid: "ca44c66860a311e490b812df261f2c7e",
      serial_number: "CA44C68660A3",
      phone_number: "612-356-4364",
      wifi_mac_address: "0C:3E:9F:49:99:67",
      managed: true,
      supervised: false,
      model: "iPhone 5S (GSM)",
      model_identifier: "iPhone6,1",
      model_display: "iPhone 5S (GSM)",
      username: "Test",
    },
    {
      id: 28,
      name: "Update 1-2",
      device_name: "Update 1-2",
      udid: "ca44c88e60a311e490b812df261f2c7e",
      serial_number: "CA44C89860A3",
      phone_number: "224-688-2736",
      wifi_mac_address: "AC:3C:0B:5E:50:93",
      managed: true,
      supervised: false,
      model: "iPad mini (CDMA)",
      model_identifier: "iPad2,7",
      model_display: "iPad mini (CDMA)",
      username: "Rory Overbey",
    },
    {
      id: 35,
      name: "Update 1-3",
      device_name: "Update 1-3",
      udid: "ca44c96060a311e490b812df261f2c7e",
      serial_number: "CA44C96A60A3",
      phone_number: "916-521-9321",
      wifi_mac_address: "54:EA:A8:3A:DC:E3",
      managed: true,
      supervised: false,
      model: "iPhone 5 (CDMA)",
      model_identifier: "iPhone5,2",
      model_display: "iPhone 5 (CDMA)",
      username: "Heriberto Truby",
    },
  ];

  const entities = createMobileDeviceEntities(mobileDevices);

  expect(entities).toEqual([
    {
      _class: "Device",
      _key: "jamf_mobile_device_16",
      _type: "jamf_mobile_device",
      _scope: "jamf_mobile_device",
      _rawData: [{ name: "default", rawData: mobileDevices[0] }],
      deviceName: "Update 1-1",
      displayName: "Test's iPhone 5S (GSM)",
      id: 16,
      managed: true,
      model: "iPhone 5S (GSM)",
      modelDisplay: "iPhone 5S (GSM)",
      modelIdentifier: "iPhone6,1",
      phoneNumber: "612-356-4364",
      serialNumber: "CA44C68660A3",
      supervised: false,
      udid: "ca44c66860a311e490b812df261f2c7e",
      username: "Test",
      wifiMacAddress: "0C:3E:9F:49:99:67",
    },
    {
      _class: "Device",
      _key: "jamf_mobile_device_28",
      _type: "jamf_mobile_device",
      _scope: "jamf_mobile_device",
      _rawData: [{ name: "default", rawData: mobileDevices[1] }],
      deviceName: "Update 1-2",
      displayName: "Rory Overbey's iPad mini (CDMA)",
      id: 28,
      managed: true,
      model: "iPad mini (CDMA)",
      modelDisplay: "iPad mini (CDMA)",
      modelIdentifier: "iPad2,7",
      phoneNumber: "224-688-2736",
      serialNumber: "CA44C89860A3",
      supervised: false,
      udid: "ca44c88e60a311e490b812df261f2c7e",
      username: "Rory Overbey",
      wifiMacAddress: "AC:3C:0B:5E:50:93",
    },
    {
      _class: "Device",
      _key: "jamf_mobile_device_35",
      _type: "jamf_mobile_device",
      _scope: "jamf_mobile_device",
      _rawData: [{ name: "default", rawData: mobileDevices[2] }],
      deviceName: "Update 1-3",
      displayName: "Heriberto Truby's iPhone 5 (CDMA)",
      id: 35,
      managed: true,
      model: "iPhone 5 (CDMA)",
      modelDisplay: "iPhone 5 (CDMA)",
      modelIdentifier: "iPhone5,2",
      phoneNumber: "916-521-9321",
      serialNumber: "CA44C96A60A3",
      supervised: false,
      udid: "ca44c96060a311e490b812df261f2c7e",
      username: "Heriberto Truby",
      wifiMacAddress: "54:EA:A8:3A:DC:E3",
    },
  ]);
});
