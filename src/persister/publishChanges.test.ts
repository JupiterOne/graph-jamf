import { createTestIntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";
import nock from "nock";
import initializeContext from "../initializeContext";
import fetchJamfData from "../jamf/fetchJamfData";
import { convert } from "./publishChanges";

const JAMF_LOCAL_EXECUTION_ACCOUNT_HOST =
  process.env.JAMF_LOCAL_EXECUTION_ACCOUNT_HOST || "example.jamfcloud.com";

function prepareScope(def: nock.NockDefinition) {
  def.scope = `https://${JAMF_LOCAL_EXECUTION_ACCOUNT_HOST}`;
}

async function initialize() {
  const context = {
    instance: {
      config: {
        jamfHost: JAMF_LOCAL_EXECUTION_ACCOUNT_HOST,
        jamfName: process.env.JAMF_LOCAL_EXECUTION_ACCOUNT_NAME,
        jamfPassword: process.env.JAMF_LOCAL_EXECUTION_ACCOUNT_PASSWORD,
      },
    },
  };

  const executionContext = {
    ...createTestIntegrationExecutionContext(context as any),
  };

  return await initializeContext(executionContext);
}

describe("Convert data after fetching", () => {
  beforeAll(() => {
    nock.back.fixtures = `${__dirname}/../../test/fixtures/`;
    process.env.CI
      ? nock.back.setMode("lockdown")
      : nock.back.setMode("record");
  });

  test("convert full users profiles", async () => {
    const { nockDone } = await nock.back("full-user-profiles.json", {
      before: prepareScope,
    });

    const { provider } = await initialize();

    provider.fetchMobileDevices = jest.fn().mockReturnValue([]);

    const jamfData = await fetchJamfData(provider);

    nockDone();

    const newData = convert(jamfData);
    expect(newData.entities.users).toEqual([
      {
        _class: "Person",
        _key: "jamf_user_5",
        _type: "jamf_user",
        customPhotoUrl: "",
        email: "heriberto.truby@gmail.com",
        emailAddress: "heriberto.truby@gmail.com",
        enableCustomPhotoUrl: false,
        fullName: "",
        id: 5,
        ldapServer: "None",
        mobileDevice: '{"id":35,"name":"Update 1-3"}',
        phoneNumber: "",
        position: "",
        totalVppCodeCount: 0,
        username: "Heriberto Truby",
      },
      {
        _class: "Person",
        _key: "jamf_user_2",
        _type: "jamf_user",
        customPhotoUrl: "",
        email: "lael.buresh@gmail.com",
        emailAddress: "lael.buresh@gmail.com",
        enableCustomPhotoUrl: false,
        fullName: "",
        id: 2,
        ldapServer: "None",
        phoneNumber: "",
        position: "",
        totalVppCodeCount: 0,
        username: "Lael Buresh",
      },
      {
        _class: "Person",
        _key: "jamf_user_4",
        _type: "jamf_user",
        customPhotoUrl: "",
        email: "maira.fillman@gmail.com",
        emailAddress: "maira.fillman@gmail.com",
        enableCustomPhotoUrl: false,
        fullName: "",
        id: 4,
        ldapServer: "None",
        phoneNumber: "",
        position: "",
        totalVppCodeCount: 0,
        username: "Maira Fillman",
      },
      {
        _class: "Person",
        _key: "jamf_user_3",
        _type: "jamf_user",
        customPhotoUrl: "",
        email: "rory.overbey@gmail.com",
        emailAddress: "rory.overbey@gmail.com",
        enableCustomPhotoUrl: false,
        fullName: "",
        id: 3,
        ldapServer: "None",
        mobileDevice: '{"id":28,"name":"Update 1-2"}',
        phoneNumber: "",
        position: "",
        totalVppCodeCount: 0,
        username: "Rory Overbey",
      },
      {
        _class: "Person",
        _key: "jamf_user_1",
        _type: "jamf_user",
        customPhotoUrl: "",
        email: "test@gmail.com",
        emailAddress: "test@gmail.com",
        enableCustomPhotoUrl: false,
        fullName: "Test User",
        id: 1,
        ldapServer: "None",
        mobileDevice: '{"id":16,"name":"Update 1-1"}',
        phoneNumber: "",
        position: "",
        totalVppCodeCount: 0,
        username: "Test",
      },
    ]);
  });

  test("convert mobile devices", async () => {
    const { nockDone } = await nock.back("mobile-devices.json", {
      before: prepareScope,
    });

    const { provider } = await initialize();

    provider.fetchUsers = jest.fn().mockReturnValue([]);

    const jamfData = await fetchJamfData(provider);

    nockDone();

    const newData = convert(jamfData);
    expect(newData.entities.mobileDevices).toEqual([
      {
        _class: "Device",
        _key: "jamf_mobile_device_16",
        _type: "jamf_mobile_device",
        deviceName: "Update 1-1",
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
        deviceName: "Update 1-2",
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
        deviceName: "Update 1-3",
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

  test("convert 'user has mobile device' relationships", async () => {
    const { nockDone } = await nock.back("user-has-mobile-device.json", {
      before: prepareScope,
    });

    const { provider } = await initialize();

    const jamfData = await fetchJamfData(provider);

    nockDone();

    const newData = convert(jamfData);
    expect(newData.relationships.userDeviceRelationships).toEqual([
      {
        _class: "HAS",
        _fromEntityKey: "jamf_user_5",
        _key: "jamf_user_5_has_jamf_mobile_device_35",
        _toEntityKey: "jamf_mobile_device_35",
        _type: "jamf_user_has_jamf_mobile_device",
      },
      {
        _class: "HAS",
        _fromEntityKey: "jamf_user_3",
        _key: "jamf_user_3_has_jamf_mobile_device_28",
        _toEntityKey: "jamf_mobile_device_28",
        _type: "jamf_user_has_jamf_mobile_device",
      },
      {
        _class: "HAS",
        _fromEntityKey: "jamf_user_1",
        _key: "jamf_user_1_has_jamf_mobile_device_16",
        _toEntityKey: "jamf_mobile_device_16",
        _type: "jamf_user_has_jamf_mobile_device",
      },
    ]);
  });

  afterAll(() => {
    nock.restore();
  });
});
