/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */

import { ComputerEntity } from "../../jupiterone";
import { Computer } from "../../types";
import { createComputerEntities } from "./ComputerEntityConverter";
import { convertProperties } from "@jupiterone/jupiter-managed-integration-sdk";

function OSXConfigurationProfileDetails(
  id: number,
  name: string,
  firewallPayloadOverrides: any = {},
  screensaverPayloadOverrides: any = {},
): any {
  return {
    general: {
      id,
      name,
      description: "",
      site: {
        id: -1,
        name: "None",
      },
      category: {
        id: -1,
        name: "No category assigned",
      },
      distribution_method: "Make Available in Self Service",
      user_removable: false,
      level: "computer",
      redeploy_on_update: "Newly Assigned",
      payloads: "a very long plist payload",
    },
    scope: {
      all_computers: false,
      all_jss_users: false,
    },
    parsedPayload: {
      PayloadDisplayName: "Test Configuration",
      PayloadContent: [
        {
          PayloadUUID: "A5BB2304-1191-40B8-A15C-69E1757D0F5B",
          PayloadType: "com.apple.security.firewall",
          PayloadOrganization: "JupiterOne",
          PayloadIdentifier: "A5BB2304-1191-40B8-A15C-69E1757D0F5B",
          PayloadDisplayName: "Firewall",
          PayloadDescription: "",
          PayloadVersion: 1,
          PayloadEnabled: true,
          EnableFirewall: true,
          BlockAllIncoming: true,
          EnableStealthMode: true,
          Applications: [],
          ...firewallPayloadOverrides,
        },
        {
          PayloadUUID: "E29F040C-1058-4F3F-BB53-327A95EAE7AB",
          PayloadType: "com.apple.screensaver",
          PayloadOrganization: "JupiterOne",
          PayloadIdentifier: "E29F040C-1058-4F3F-BB53-327A95EAE7AB",
          PayloadDisplayName: "Login Window:  Screen Saver Preferences",
          PayloadDescription: "",
          PayloadVersion: 1,
          PayloadEnabled: true,
          loginWindowIdleTime: 1200,
          idleTime: 1200,
          loginWindowModulePath: "/System/Library/Screen Savers/Flurry.saver",
          ...screensaverPayloadOverrides,
        },
      ],
    },
  };
}

const osxConfigurationDetailsById = {
  1: OSXConfigurationProfileDetails(1, "Test Configuration"),
  2: OSXConfigurationProfileDetails(
    2,
    "Other Configuration",
    { BlockAllIncoming: false, EnableStealthMode: false },
    { loginWindowIdleTime: 600 },
  ),
  3: OSXConfigurationProfileDetails(
    3,
    "The Third",
    {
      EnableFirewall: false,
      BlockAllIncoming: false,
      EnableStealthMode: false,
    },
    { loginWindowIdleTime: 1600 },
  ),
};

const computers: Computer[] = [
  {
    id: 1,
    name: "PlayerOne’s MacBook",
    managed: true,
    username: "player.one",
    model: "MacBookPro13,3",
    department: "",
    building: "",
    mac_address: "78:4F:43:7F:7D:CB",
    udid: "1234TE12-3STT-1234-E1ST-23TE412ST341",
    serial_number: "5EGTF1C02T70",
    report_date_utc: "2019-05-06T13:33:08.196+0000",
    report_date_epoch: 1557149588196,
  },
  {
    id: 2,
    name: "PlayerTwo’s MacBook",
    managed: true,
    username: "player.two",
    model: "MacBookPro13,3",
    department: "",
    building: "",
    mac_address: "78:4F:43:7F:7D:CB",
    udid: "8195CA16-7FFE-5855-A3DD-53FD76ABC123",
    serial_number: "5EGTF1C02T71",
    report_date_utc: "2019-05-06T13:33:08.196+0000",
    report_date_epoch: 1557149588196,
  },
];

const playerOneDetails: any = {
  general: {
    id: 1,
    name: "PlayerOne’s MacBook",
    mac_address: "78:4F:43:7F:7D:CB",
    alt_mac_address: "11:22:33:44:55:66",
    ip_address: "11.22.33.4",
    last_reported_ip: "111.22.33.44",
    serial_number: "5EGTF1C02T70",
    udid: "1234TE12-3STT-1234-E1ST-23TE412ST341",
    jamf_version: "10.12.0-t1555503901",
    platform: "Mac",
    barcode_1: "",
    barcode_2: "",
    asset_tag: "",
    remote_management: {
      managed: true,
      management_username: "macOS",
    },
    mdm_capable: true,
    mdm_capable_users: {
      mdm_capable_user: "jhon.doe",
    },
    management_status: {
      enrolled_via_dep: false,
      user_approved_enrollment: true,
      user_approved_mdm: true,
    },
    report_date: "2019-05-20 14:53:27",
    report_date_utc: "2019-05-06T13:33:08.196+0000",
    report_date_epoch: 1557149588196,
    last_contact_time: "2019-05-23 11:25:05",
    last_contact_time_epoch: 1558610705298,
    last_contact_time_utc: "2019-05-23T11:25:05.298+0000",
    initial_entry_date: "2019-04-22",
    initial_entry_date_epoch: 1555937998405,
    initial_entry_date_utc: "2019-04-22T12:59:58.405+0000",
    last_cloud_backup_date_epoch: 0,
    last_cloud_backup_date_utc: "",
    last_enrolled_date_epoch: 1555938179240,
    last_enrolled_date_utc: "2019-04-22T13:02:59.240+0000",
    distribution_point: "",
    sus: "",
    netboot_server: "",
    site: {
      id: 1,
      name: "Test site",
    },
    itunes_store_account_is_active: true,
  },
  location: {
    username: "jhon.doe",
    realname: "Jhon Doe",
    real_name: "Jhon Doe",
    email_address: "jhon.doe@acmacorp.com",
    position: "CISO",
    phone: "1111111111",
    phone_number: "1111111111",
    department: "",
    building: "",
    room: "",
  },
  purchasing: {
    is_purchased: true,
    is_leased: false,
    po_number: "",
    vendor: "",
    applecare_id: "",
    purchase_price: "",
    purchasing_account: "",
    po_date: "",
    po_date_epoch: 0,
    po_date_utc: "",
    warranty_expires: "",
    warranty_expires_epoch: 0,
    warranty_expires_utc: "",
    lease_expires: "",
    lease_expires_epoch: 0,
    lease_expires_utc: "",
    life_expectancy: 0,
    purchasing_contact: "",
    os_applecare_id: "",
    os_maintenance_expires: "",
    attachments: [],
  },
  peripherals: [],
  hardware: {
    make: "Apple",
    model: "15-inch Retina MacBook Pro with TouchID (Late 2016)",
    model_identifier: "MacBookPro13,3",
    os_name: "Mac OS X",
    os_version: "10.13.6",
    os_build: "17G6030",
    master_password_set: false,
    active_directory_status: "Not Bound",
    service_pack: "",
    processor_type: "Intel Core i7",
    processor_architecture: "x86_64",
    processor_speed: 2900,
    processor_speed_mhz: 2900,
    number_processors: 1,
    number_cores: 4,
    total_ram: 16384,
    total_ram_mb: 16384,
    boot_rom: "254.0.0.0.0",
    bus_speed: 0,
    bus_speed_mhz: 0,
    battery_capacity: 83,
    cache_size: 8192,
    cache_size_kb: 8192,
    available_ram_slots: 0,
    optical_drive: "",
    nic_speed: "n/a",
    smc_version: "2.38f7",
    ble_capable: true,
    sip_status: "Enabled",
    gatekeeper_status: "App Store and identified developers",
    xprotect_version: "2103",
    institutional_recovery_key: "Not Present",
    disk_encryption_configuration: "",
    filevault2_users: ["jhon.doe"],
    storage: [
      {
        disk: "disk0",
        model: "APPLE SSD SM1024L",
        revision: "CXS6AA0Q",
        serial_number: "C02706400ADGVFW1H",
        size: 1048576,
        drive_capacity_mb: 1048576,
        connection_type: "NO",
        smart_status: "",
        partition: {
          name: "Macintosh HD (Boot Partition)",
          size: 953904,
          type: "boot",
          partition_capacity_mb: 953904,
          percentage_full: 66,
          filevault_status: "Encrypted",
          filevault_percent: 100,
          filevault2_status: "Encrypted",
          filevault2_percent: 100,
          boot_drive_available_mb: 356516,
          lvgUUID: "",
          lvUUID: "",
          pvUUID: "",
        },
      },
      {
        disk: "disk1",
        model: "APPLE SSD SM1024L",
        revision: "CXS6AA0Q",
        serial_number: "C02706400ADGVFW1H",
        size: 1048576,
        drive_capacity_mb: 1048576,
        connection_type: "NO",
        smart_status: "",
      },
    ],
    mapped_printers: [
      {
        name: "Test",
        uri: "dnssd://Test._pdl-datastream._tcp.local./?bidi",
        type: "Test type",
        location: "",
      },
    ],
  },
  certificates: [
    {
      common_name: "test",
      identity: false,
      expires_utc: "2017-06-22T11:55:56.000+0000",
      expires_epoch: 1498132556000,
      name: "jhon.doe",
    },
  ],
  software: {
    unix_executables: [],
    licensed_software: [],
    installed_by_casper: [],
    installed_by_installer_swu: ["Test"],
    applications: [
      {
        name: "Test.app",
        path: "/Applications/Test.app",
        version: "7.0.0.485",
      },
    ],
    fonts: [],
    plugins: [],
  },
  extension_attributes: [],
  groups_accounts: {
    computer_group_memberships: ["All Managed Clients"],
    local_accounts: [
      {
        name: "jhon.doe",
        realname: "Jhon Doe",
        uid: "501",
        home: "/Users/jhon",
        home_size: "-1MB",
        home_size_mb: -1,
        administrator: true,
        filevault_enabled: true,
      },
      {
        name: "macOS",
        realname: "macOS",
        uid: "502",
        home: "/Users/macOS",
        home_size: "-1MB",
        home_size_mb: -1,
        administrator: true,
        filevault_enabled: false,
      },
    ],
    user_inventories: {
      disable_automatic_login: true,
      user: {
        username: "macOS",
        password_history_depth: "",
        password_min_length: "",
        password_max_age: "",
        password_min_complex_characters: "",
        password_require_alphanumeric: "false",
      },
    },
  },
  iphones: [],
  configuration_profiles: [
    {
      id: 1,
      name: "TestName",
      uuid: "test_uuid",
      is_removable: false,
    },
    {
      id: 2,
      name: "OtherName",
      uuid: "other_uuid",
      is_removable: false,
    },
    {
      id: 3,
      name: "The Third",
      uuid: "third",
      is_removable: false,
    },
  ],
};

const singleDiskPartition: any = {
  hardware: {
    make: "Apple",
    model: "15-inch Retina MacBook Pro with TouchID (Late 2016)",
    model_identifier: "MacBookPro13,3",
    os_name: "Mac OS X",
    os_version: "10.13.6",
    os_build: "17G6030",
    master_password_set: false,
    active_directory_status: "Not Bound",
    service_pack: "",
    processor_type: "Intel Core i7",
    processor_architecture: "x86_64",
    processor_speed: 2900,
    processor_speed_mhz: 2900,
    number_processors: 1,
    number_cores: 4,
    total_ram: 16384,
    total_ram_mb: 16384,
    boot_rom: "254.0.0.0.0",
    bus_speed: 0,
    bus_speed_mhz: 0,
    battery_capacity: 83,
    cache_size: 8192,
    cache_size_kb: 8192,
    available_ram_slots: 0,
    optical_drive: "",
    nic_speed: "n/a",
    smc_version: "2.38f7",
    ble_capable: true,
    sip_status: "Enabled",
    gatekeeper_status: "App Store and identified developers",
    xprotect_version: "2103",
    institutional_recovery_key: "Not Present",
    disk_encryption_configuration: "",
    filevault2_users: ["jhon.doe"],
    storage: [
      {
        disk: "disk0",
        model: "APPLE SSD SM1024L",
        revision: "CXS6AA0Q",
        serial_number: "C02706400ADGVFW1H",
        size: 1048576,
        drive_capacity_mb: 1048576,
        connection_type: "NO",
        smart_status: "",
        partition: {
          name: "Macintosh HD (Boot Partition)",
          size: 953904,
          type: "other",
          partition_capacity_mb: 953904,
          percentage_full: 66,
          filevault_status: "Encrypted",
          filevault_percent: 100,
          filevault2_status: "Encrypted",
          filevault2_percent: 100,
          boot_drive_available_mb: 356516,
          lvgUUID: "",
          lvUUID: "",
          pvUUID: "",
        },
      },
    ],
    mapped_printers: [
      {
        name: "Test",
        uri: "dnssd://Test._pdl-datastream._tcp.local./?bidi",
        type: "Test type",
        location: "",
      },
    ],
  },
};

const faultVaultInProgress: any = {
  hardware: {
    make: "Apple",
    model: "15-inch Retina MacBook Pro with TouchID (Late 2016)",
    model_identifier: "MacBookPro13,3",
    os_name: "Mac OS X",
    os_version: "10.13.6",
    os_build: "17G6030",
    master_password_set: false,
    active_directory_status: "Not Bound",
    service_pack: "",
    processor_type: "Intel Core i7",
    processor_architecture: "x86_64",
    processor_speed: 2900,
    processor_speed_mhz: 2900,
    number_processors: 1,
    number_cores: 4,
    total_ram: 16384,
    total_ram_mb: 16384,
    boot_rom: "254.0.0.0.0",
    bus_speed: 0,
    bus_speed_mhz: 0,
    battery_capacity: 83,
    cache_size: 8192,
    cache_size_kb: 8192,
    available_ram_slots: 0,
    optical_drive: "",
    nic_speed: "n/a",
    smc_version: "2.38f7",
    ble_capable: true,
    sip_status: "Enabled",
    gatekeeper_status: "App Store and identified developers",
    xprotect_version: "2103",
    institutional_recovery_key: "Not Present",
    disk_encryption_configuration: "",
    filevault2_users: ["jhon.doe"],
    storage: [
      {
        disk: "disk0",
        model: "APPLE SSD SM1024L",
        revision: "CXS6AA0Q",
        serial_number: "C02706400ADGVFW1H",
        size: 1048576,
        drive_capacity_mb: 1048576,
        connection_type: "NO",
        smart_status: "",
        partition: {
          name: "Macintosh HD (Boot Partition)",
          size: 953904,
          type: "other",
          partition_capacity_mb: 953904,
          percentage_full: 66,
          filevault_status: "Encrypted",
          filevault_percent: 99,
          filevault2_status: "Encrypted",
          filevault2_percent: 99,
          boot_drive_available_mb: 356516,
          lvgUUID: "",
          lvUUID: "",
          pvUUID: "",
        },
      },
    ],
    mapped_printers: [
      {
        name: "Test",
        uri: "dnssd://Test._pdl-datastream._tcp.local./?bidi",
        type: "Test type",
        location: "",
      },
    ],
  },
};

const playerOne: ComputerEntity = {
  ...convertProperties(playerOneDetails.general),
  _class: ["Host", "Device"],
  _key: "user_endpoint_1",
  _type: "user_endpoint",
  _rawData: [
    { name: "default", rawData: computers[0] },
    { name: "detail", rawData: playerOneDetails },
  ],
  building: "",
  department: "",
  displayName: "PlayerOne’s MacBook",
  encrypted: true,
  gatekeeperEnabled: true,
  gatekeeperStatus: "App Store and identified developers",
  firewallEnabled: true,
  firewallBlockAllIncoming: true,
  firewallStealthModeEnabled: true,
  screensaverLockEnabled: true,
  screensaverIdleTime: 600,
  systemIntegrityProtectionEnabled: true,
  id: 1,
  macAddress: "78:4f:43:7f:7d:cb",
  managed: true,
  model: "MacBookPro13,3",
  name: "PlayerOne’s MacBook",
  lastReportedOn: 1557149588196,
  serialNumber: "5EGTF1C02T70",
  udid: "1234TE12-3STT-1234-E1ST-23TE412ST341",
  username: "player.one",
  email: "jhon.doe@acmacorp.com",
  createdOn: playerOneDetails.general.initial_entry_date_epoch,
  enrolledOn: playerOneDetails.general.last_enrolled_date_epoch,
  lastSeenOn: playerOneDetails.general.last_contact_time_epoch,
  initialEntryDate: undefined,
  initialEntryDateEpoch: undefined,
  initialEntryDateUtc: undefined,
  lastContactTime: undefined,
  lastContactTimeEpoch: undefined,
  lastContactTimeUtc: undefined,
  lastEnrolledDate: undefined,
  lastEnrolledDateEpoch: undefined,
  lastEnrolledDateUtc: undefined,
  reportDate: undefined,
  reportDateEpoch: undefined,
  reportDateUtc: undefined,
};

const playerTwo: ComputerEntity = {
  _class: ["Host", "Device"],
  _key: "user_endpoint_2",
  _type: "user_endpoint",
  _rawData: [{ name: "default", rawData: computers[1] }],
  building: "",
  department: "",
  displayName: "PlayerTwo’s MacBook",
  gatekeeperEnabled: false,
  systemIntegrityProtectionEnabled: false,
  id: "8195CA16-7FFE-5855-A3DD-53FD76ABC123",
  macAddress: "78:4f:43:7f:7d:cb",
  managed: true,
  model: "MacBookPro13,3",
  name: "PlayerTwo’s MacBook",
  lastReportedOn: 1557149588196,
  serialNumber: "5EGTF1C02T71",
  udid: "8195CA16-7FFE-5855-A3DD-53FD76ABC123",
  username: "player.two",
  encrypted: false,
};

test("convert computer entity", () => {
  const entities = createComputerEntities(
    computers,
    [playerOneDetails],
    osxConfigurationDetailsById,
  );
  expect(entities).toEqual([playerOne, playerTwo]);
});

test("convert computer entity with app store gatekeeper", () => {
  const computerDetailsAppStoreGatekeeper = [
    {
      ...playerOneDetails,
      hardware: {
        ...playerOneDetails.hardware,
        gatekeeper_status: "App Store",
      },
    },
  ];
  const entities = createComputerEntities(
    computers,
    computerDetailsAppStoreGatekeeper,
    osxConfigurationDetailsById,
  );
  expect(entities).toEqual([
    expect.objectContaining({ gatekeeperStatus: "App Store" }),
    playerTwo,
  ]);
});

test("convert computer entity storage array with single device", () => {
  const details = [
    {
      ...playerOneDetails,
      hardware: {
        ...playerOneDetails.hardware,
        storage: [
          {
            device: {
              ...playerOneDetails.hardware.storage[0],
            },
          },
        ],
      },
    },
  ];
  const entities = createComputerEntities(
    computers,
    details,
    osxConfigurationDetailsById,
  );
  expect(entities).toEqual([
    expect.objectContaining({ encrypted: true }),
    playerTwo,
  ]);
});

test("convert computer entity storage with multiple devices having no partition", () => {
  const details = [
    {
      ...playerOneDetails,
      hardware: {
        ...playerOneDetails.hardware,
        storage: [
          {
            device: {
              disk: "disk0",
              model: "APPLE SSD SM1024L",
              revision: "CXS6AA0Q",
              serial_number: "C02706400ADGVFW1H",
              size: 1048576,
              drive_capacity_mb: 1048576,
              connection_type: "NO",
              smart_status: "",
            },
          },
          {
            device: {
              disk: "disk1",
              model: "APPLE SSD SM1024L",
              revision: "CXS6AA0Q",
              serial_number: "C02706400ADGVFW1H",
              size: 1048576,
              drive_capacity_mb: 1048576,
              connection_type: "NO",
              smart_status: "",
            },
          },
        ],
      },
    },
  ];
  const entities = createComputerEntities(
    computers,
    details,
    osxConfigurationDetailsById,
  );
  expect(entities).toEqual([
    expect.objectContaining({ encrypted: false }),
    playerTwo,
  ]);
});

test("convert computer entity storage with single device", () => {
  const details = [
    {
      ...playerOneDetails,
      hardware: {
        ...playerOneDetails.hardware,
        storage: {
          device: {
            ...playerOneDetails.hardware.storage[0],
          },
        },
      },
    },
  ];
  const entities = createComputerEntities(
    computers,
    details,
    osxConfigurationDetailsById,
  );
  expect(entities).toEqual([
    expect.objectContaining({ encrypted: true }),
    playerTwo,
  ]);
});

test("convert computer entity storage with single device and single partition not labeled as 'boot'", () => {
  const details = [
    {
      ...playerOneDetails,
      hardware: {
        ...singleDiskPartition.hardware,
      },
    },
  ];
  const entities = createComputerEntities(
    computers,
    details,
    osxConfigurationDetailsById,
  );
  expect(entities).toEqual([
    expect.objectContaining({ encrypted: true }),
    playerTwo,
  ]);
});

test("convert computer entity storage fault vault encryption not 100% complete", () => {
  const details = [
    {
      ...playerOneDetails,
      hardware: {
        ...faultVaultInProgress.hardware,
      },
    },
  ];
  const entities = createComputerEntities(
    computers,
    details,
    osxConfigurationDetailsById,
  );
  expect(entities).toEqual([
    expect.objectContaining({ encrypted: false }),
    playerTwo,
  ]);
});

test("convert computer entity storage with multiple partitions", () => {
  const details = [
    {
      ...playerOneDetails,
      hardware: {
        ...playerOneDetails.hardware,
        storage: {
          device: {
            ...playerOneDetails.hardware.storage[0],
            partition: [
              {
                ...playerOneDetails.hardware.storage[0].partition,
                type: "other",
              },
              playerOneDetails.hardware.storage[0].partition,
            ],
          },
        },
      },
    },
  ];
  const entities = createComputerEntities(
    computers,
    details,
    osxConfigurationDetailsById,
  );
  expect(entities).toEqual([
    expect.objectContaining({ encrypted: true }),
    playerTwo,
  ]);
});

test("convert computer entity without configuration profiles", () => {
  const entities = createComputerEntities(computers, [playerOneDetails], {});
  expect(entities).toEqual([
    {
      ...playerOne,
      firewallEnabled: undefined,
      firewallBlockAllIncoming: undefined,
      firewallStealthModeEnabled: undefined,
      screensaverLockEnabled: undefined,
      screensaverIdleTime: undefined,
      screensaverModulePath: undefined,
    },
    playerTwo,
  ]);
});

test("convert computer entity without device username", () => {
  const computer = {
    ...computers[0],
    username: "",
  };
  const entities = createComputerEntities([computer], [playerOneDetails], {});
  expect(entities[0].username).toEqual("jhon.doe");
});

describe("collapsing number values", () => {
  test("sets to undefined if can't collapse", () => {
    const osxConfigurationProfileClone = OSXConfigurationProfileDetails(
      1,
      "Test Configuration",
    );
    osxConfigurationProfileClone.parsedPayload.PayloadContent[1].loginWindowIdleTime =
      "NaN";
    const entities = createComputerEntities(computers, [playerOneDetails], {
      1: osxConfigurationProfileClone,
    });
    expect(entities).toEqual([
      { ...playerOne, screensaverIdleTime: undefined },
      playerTwo,
    ]);
  });
});
