import { IJamfClient } from '../src/jamf/client';
import {
  Admin,
  AdminsAndGroups,
  ApplicationDetail,
  Computer,
  ComputerDetail,
  Configuration,
  Group,
  MobileDevice,
  MobileDeviceDetail,
  OSXConfigurationDetail,
  User,
} from '../src/jamf/types';

export function createMockDeviceUser(): User {
  return {
    id: 1,
    name: 'Test',
    full_name: 'Test User',
    email: 'test@gmail.com',
    email_address: 'TesT@gmail.com',
    phone_number: '',
    position: '',
    managed_apple_id: '',
    ldap_server: {
      id: -1,
      name: 'None',
    },
    extension_attributes: [],
    sites: [],
    links: {
      computers: [],
      peripherals: [],
      mobile_devices: [],
      vpp_assignments: [],
      total_vpp_code_count: 0,
    },
    user_groups: {
      size: 0,
    },
  };
}

export function createMockAdminUser(): Admin {
  return {
    id: 1,
    name: 'adam.williams',
    directory_user: false,
    full_name: '',
    email: 'ADAM.williams@jupiterone.com',
    email_address: 'Adam.Williams@jupiterone.com',
    enabled: 'Enabled',
    force_password_change: false,
    access_level: 'Full Access',
    privilege_set: 'Administrator',
    privileges: {
      jss_objects: ['Create Keystore'],
      jss_settings: ['Read Jamf Imaging'],
      jss_actions: ['Allow User to Enroll', 'CLEAR_TEACHER_PROFILE_PRIVILEGE'],
      recon: ['Add Computers Remotely', 'Create QuickAdd Packages'],
      casper_admin: ['Use Casper Admin', 'Save With Casper Admin'],
      casper_remote: ['Use Casper Remote'],
      casper_imaging: ['Use Casper Imaging'],
    },
  };
}

export function createMockMobileDevice(): MobileDevice {
  return {
    id: 16,
    name: 'Update 1-1',
    device_name: 'Update 1-1',
    udid: 'ca44c66860a311e490b812df261f2c7e',
    serial_number: 'CA44C68660A3',
    phone_number: '612-356-4364',
    wifi_mac_address: '0C:3E:9F:49:99:67',
    managed: true,
    supervised: false,
    model: 'iPhone 5S (GSM)',
    model_identifier: 'iPhone6,1',
    model_display: 'iPhone 5S (GSM)',
    username: undefined,
  };
}

export function createMockMobileDeviceDetail(): MobileDeviceDetail {
  return {
    general: {
      id: 1,
      display_name: 'Tinas iPad',
      device_name: 'Tinas iPad',
      name: 'Tinas iPad',
      asset_tag: 'string',
      last_inventory_update: '2017-07-07 18:37:04',
      last_inventory_update_epoch: 1499470624555,
      last_inventory_update_utc: '2017-07-07T18:37:04.555-0500',
      capacity: 12159,
      capacity_mb: 12159,
      available: 11487,
      available_mb: 11487,
      percentage_used: 5,
      os_type: 'iOS',
      os_version: '10.3.2',
      os_build: '14F89',
      serial_number: 'C02Q7KHTGFWF',
      udid: '270aae10800b6e61a2ee2bbc285eb967050b5984',
      initial_entry_date_epoch: 1499470624555,
      initial_entry_date_utc: '2017-07-07T18:37:04.555-0500',
      phone_number: '123-555-6789',
      ip_address: '192.0.0.1',
      wifi_mac_address: 'E0:AC:CB:97:36:G4',
      bluetooth_mac_address: 'E0:AC:CB:97:36:G6',
      modem_firmware: '2.61.00',
      model: 'iPhone 6S',
      model_identifier: 'iPhone8,1',
      model_number: 'MKRY2LL',
      model_display: 'iPhone 6S',
      device_ownership_level: 'Institutional',
      last_enrollment_epoch: 1499470624555,
      last_enrollment_utc: '2017-07-07T18:37:04.555-0500',
      managed: true,
      supervised: true,
      exchange_activesync_device_identifier: 'TUCLLFJHPL779ACL9DCJQFN39F',
      shared: 'string',
      tethered: 'string',
      battery_level: 95,
      ble_capable: true,
      device_locator_service_enabled: true,
      do_not_disturb_enabled: true,
      cloud_backup_enabled: true,
      last_cloud_backup_date_epoch: 1499470624555,
      last_cloud_backup_date_utc: '2017-07-07T18:37:04.555-0500',
      location_services_enabled: true,
      itunes_store_account_is_active: true,
      last_backup_time_epoch: 1499470624555,
      last_backup_time_utc: '2017-07-07T18:37:04.555-0500',
    },
    location: {
      username: 'JBetty',
      realname: 'Betty Jackson',
      real_name: 'Betty Jackson',
      email_address: 'jbetty@company.com',
      position: 'Systems Engineer',
      phone: '123-555-6789',
      phone_number: '123-555-6789',
      department: 'Sales Staff',
      building: 'New York Office',
      room: 1159,
    },
    purchasing: {
      is_purchased: true,
      is_leased: true,
      po_number: 'string',
      vendor: 'string',
      applecare_id: 'string',
      purchase_price: 'string',
      purchasing_account: 'string',
      po_date: 'string',
      po_date_epoch: 0,
      po_date_utc: 'string',
      warranty_expires: 'string',
      warranty_expires_epoch: 0,
      warranty_expires_utc: 'string',
      lease_expires: 'string',
      lease_expires_epoch: 0,
      lease_expires_utc: 'string',
      life_expectancy: 0,
      purchasing_contact: 'string',
    },
    applications: [
      {
        size: 1,
        application: {
          application_name: 'Self Service Mobile',
          application_version: '10.1.1',
          identifier: 'com.jamfsoftware.selfservice',
        },
      },
    ],
    security: {
      data_protection: true,
      block_level_encryption_capable: true,
      file_level_encryption_capable: true,
      passcode_present: true,
      passcode_compliant: true,
      passcode_compliant_with_profile: true,
      passcode_lock_grace_period_enforced: 'Not Available',
      hardware_encryption: 'string',
      activation_lock_enabled: true,
      jailbreak_detected: 'Normal',
      lost_mode_enabled: true,
      lost_mode_enforced: true,
      lost_mode_enable_issued_epoch: 1517598768512,
      lost_mode_enable_issued_utc: '2018-02-02T13:12:48.512-0600',
      lost_mode_message: 'Please return to Company',
      lost_mode_phone: '555-555-5555',
      lost_mode_footnote: 'string',
      lost_location_epoch: 1517598680459,
      lost_location_utc: '2018-02-02T13:11:20.459-0600',
      lost_location_latitude: 44.81436821,
      lost_location_longitude: -91.502672,
      lost_location_altitude: 242.88067627,
      lost_location_speed: -1,
      lost_location_course: -1,
      lost_location_horizontal_accuracy: 65,
      lost_location_vertical_accuracy: 10,
    },
    network: {
      home_carrier_network: 'Verizon',
      cellular_technology: 'Unknown',
      voice_roaming_enabled: 'Yes',
      imei: '35 200706 056227 1',
      iccid: '8914 8000 0010 0254 6259',
      current_carrier_network: 'string',
      carrier_settings_version: 20,
      current_mobile_country_code: 311,
      current_mobile_network_code: 480,
      home_mobile_country_code: 311,
      home_mobile_network_code: 480,
      data_roaming_enabled: true,
      phone_number: 5555555555,
    },
    certificates: [
      {
        size: 1,
        certificate: {
          common_name: 'JSS Built-in Certificate Authority',
          identity: true,
        },
      },
    ],
    configuration_profiles: [
      {
        size: 1,
        configuration_profile: {
          display_name: 'WiFi',
          version: 1,
          identifier: '279889AF-1564-4480-A61D-860DF5EFDF26',
          uuid: '279889AF-1564-4480-A61D-860DF5EFDF26',
        },
      },
    ],
    provisioning_profiles: [
      {
        size: 1,
        mobile_device_provisioning_profile: {
          display_name: 'In-House App Provisioning Profile',
          expiration_date: '2018-01-29',
          expiration_date_epoch: 0,
          expiration_date_utc: '2018-01-29T14:18:02.000-0600',
          uuid: '279889AF-1564-4480-A61D-860DF5EFDF26',
        },
      },
    ],
    mobile_device_groups: [
      {
        size: 1,
        mobile_device_group: {
          id: 1,
          name: 'string',
        },
      },
    ],
    extension_attributes: EXTENSION_ATTRIBUTES,
  };
}

export function createMockComputer(): Computer {
  return {
    id: 1,
    name: 'John’s MacBook',
    managed: true,
    username: 'john',
    model: 'MacBookPro13,3',
    department: '',
    building: '',
    mac_address: '12:34:67:8A:9B:1C',
    udid: 'DF7C48EF-D17E-4A5E-B192-8C758870F624',
    serial_number: 'ABC123DEF456',
    report_date_utc: '2019-06-17T16:00:56.384+0000',
    report_date_epoch: 1560787256384,
  };
}

export const EXTENSION_ATTRIBUTES = [
  {
    id: 1,
    name: '123',
    value: ['foo123', 'bar123'],
  },
  {
    id: 2,
    name: '456',
    value: ['foo456', 'bar456'],
  },
  {
    id: 3,
    name: 'Deployment status',
    value: ['active'],
  },
];

export function createMockComputerDetail(): ComputerDetail {
  return {
    general: {
      id: 1,
      name: "John's MacBook",
      network_adapter_type: 'IEEE80211',
      mac_address: '12:34:67:8A:9B:1C',
      alt_network_adapter_type: 'Ethernet',
      alt_mac_address: '12:34:56:78:90:12',
      ip_address: '12.34.567.890',
      last_reported_ip: '192.168.1.139',
      serial_number: 'ABC123DEF456',
      udid: 'DF7C48EF-D17E-4A5E-B192-8C758870F624',
      jamf_version: '10.23.0-t1595614145',
      platform: 'Mac',
      barcode_1: '',
      barcode_2: '',
      asset_tag: '',
      remote_management: {
        managed: true,
        management_username: 'macOS',
        management_password_sha256: 'abc123',
      },
      supervised: false,
      mdm_capable: true,
      mdm_capable_users: {
        mdm_capable_user: 'john.doe',
      },
      management_status: {
        enrolled_via_dep: false,
        user_approved_enrollment: false,
        user_approved_mdm: false,
      },
      report_date: '2020-08-03 12:24:29',
      report_date_epoch: 1596457469968,
      report_date_utc: '2020-08-03T12:24:29.968+0000',
      last_contact_time: '2020-08-09 13:24:00',
      last_contact_time_epoch: 1596979440636,
      last_contact_time_utc: '2020-08-09T13:24:00.636+0000',
      initial_entry_date: '2020-06-03',
      initial_entry_date_epoch: 1591217314697,
      initial_entry_date_utc: '2020-06-03T20:48:34.697+0000',
      last_cloud_backup_date_epoch: 0,
      last_cloud_backup_date_utc: '',
      last_enrolled_date_epoch: 1591217314697,
      last_enrolled_date_utc: '2020-06-03T20:48:34.697+0000',
      mdm_profile_expiration_epoch: 1748983791000,
      mdm_profile_expiration_utc: '2025-06-03T20:49:51.000+0000',
      distribution_point: '',
      sus: '',
      netboot_server: '',
      site: {
        id: 1,
        name: 'Test site',
      },
      itunes_store_account_is_active: true,
    },
    location: {
      username: 'john.doe',
      realname: 'John Doe',
      real_name: 'John Doe',
      email_address: 'JOHN.doe@test.com',
      position: 'CISO',
      phone: '111',
      phone_number: '111',
      department: '',
      building: '',
      room: '',
    },
    purchasing: {
      is_purchased: true,
      is_leased: false,
      po_number: '',
      vendor: '',
      applecare_id: '',
      purchase_price: '',
      purchasing_account: '',
      po_date: '',
      po_date_epoch: 0,
      po_date_utc: '',
      warranty_expires: '',
      warranty_expires_epoch: 0,
      warranty_expires_utc: '',
      lease_expires: '',
      lease_expires_epoch: 0,
      lease_expires_utc: '',
      life_expectancy: 0,
      purchasing_contact: '',
      os_applecare_id: '',
      os_maintenance_expires: '',
      attachments: [],
    },
    peripherals: [],
    hardware: {
      make: 'Apple',
      model: '15-inch Retina MacBook Pro with TouchID (Mid 2017)',
      model_identifier: 'MacBookPro14,3',
      os_name: 'Mac OS X',
      os_version: '10.15.3',
      os_build: '19D76',
      master_password_set: false,
      active_directory_status: 'Not Bound',
      service_pack: '',
      processor_type: 'Quad-Core Intel Core i7',
      processor_architecture: 'x86_64',
      processor_speed: 3100,
      processor_speed_mhz: 3100,
      number_processors: 1,
      number_cores: 4,
      total_ram: 16384,
      total_ram_mb: 16384,
      boot_rom: '204.0.0.0.0',
      bus_speed: 0,
      bus_speed_mhz: 0,
      battery_capacity: 93,
      cache_size: 8192,
      cache_size_kb: 8192,
      available_ram_slots: 0,
      optical_drive: '',
      nic_speed: 'n/a',
      smc_version: '2.45f1',
      ble_capable: true,
      sip_status: 'Enabled',
      gatekeeper_status: 'App Store and identified developers',
      xprotect_version: '2127',
      institutional_recovery_key: 'Not Present',
      disk_encryption_configuration: '',
      filevault2_users: ['macOS', 'john.doe'],
      storage: [
        {
          disk: 'disk0',
          model: 'APPLE SSD SM1024L',
          revision: 'CXS5EA0Q',
          serial_number: '123ABC',
          size: 1000555,
          drive_capacity_mb: 1000555,
          connection_type: 'NO',
          smart_status: 'Verified',
          partitions: [
            {
              name: 'Macintosh HD (Boot Partition)',
              size: 1000240,
              type: 'boot',
              partition_capacity_mb: 1000240,
              percentage_full: 5,
              available_mb: 207295,
              filevault_status: 'Encrypted',
              filevault_percent: 100,
              filevault2_status: 'Encrypted',
              filevault2_percent: 100,
              boot_drive_available_mb: 207295,
              lvgUUID: '',
              lvUUID: '',
              pvUUID: '',
            },
            {
              name: 'Data',
              size: 1000240,
              type: 'other',
              partition_capacity_mb: 1000240,
              percentage_full: 79,
              available_mb: 207295,
              filevault_status: 'Encrypted',
              filevault_percent: 100,
              filevault2_status: 'Encrypted',
              filevault2_percent: 100,
            },
          ],
        },
      ],
      mapped_printers: [
        {
          name: 'Brother ABC',
          uri: 'dnssd://Brother%20ABC._pdl-datastream._tcp.local./?bidi',
          type: 'Brother ABC',
          location: '',
        },
      ],
    },
    certificates: [
      {
        common_name: 'com.apple.kerberos.kdc',
        identity: true,
        expires_utc: '',
        expires_epoch: '',
        name: '',
      },
      {
        common_name:
          'Apple Worldwide Developer Relations Certification Authority',
        identity: false,
        expires_utc: '2023-02-07T21:48:47.000+0000',
        expires_epoch: 1675806527000,
        name: '',
      },
    ],
    security: {
      activation_lock: false,
      secure_boot_level: 'not supported',
      external_boot_level: 'not supported',
      firewall_enabled: false,
    },
    software: {
      unix_executables: [],
      licensed_software: [],
      installed_by_casper: [],
      installed_by_installer_swu: ['com.apple.pkg.Core'],
      cached_by_casper: [],
      available_software_updates: [],
      available_updates: {},
      running_services: ['com.apple.accessoryd'],
      applications: [
        {
          name: 'Atom.app',
          path: '/Applications/Atom.app',
          version: '1.43.0',
          bundle_id: 'com.github.atom',
        },
      ],
      fonts: [],
      plugins: [],
    },
    extension_attributes: EXTENSION_ATTRIBUTES,
    groups_accounts: {
      computer_group_memberships: ['All Managed Clients'],
      local_accounts: [
        {
          name: 'john.doe',
          realname: 'John',
          uid: '501',
          home: '/Users/john',
          home_size: '-1MB',
          home_size_mb: -1,
          administrator: true,
          filevault_enabled: true,
        },
        {
          name: 'macOS',
          realname: 'macOS',
          uid: '502',
          home: '/Users/macOS',
          home_size: '-1MB',
          home_size_mb: -1,
          administrator: true,
          filevault_enabled: true,
        },
      ],
      user_inventories: {
        disable_automatic_login: true,
        user: {
          username: 'macOS',
          password_history_depth: '',
          password_min_length: '4',
          password_max_age: '',
          password_min_complex_characters: '',
          password_require_alphanumeric: 'false',
        },
      },
    },
    iphones: [],
    configuration_profiles: [
      {
        id: -2,
        name: '',
        uuid: '',
        is_removable: false,
      },
      {
        id: -1,
        name: '',
        uuid: '',
        is_removable: false,
      },
    ],
  };
}

export function createMockGroup(): Group {
  return {
    id: 3,
    name: 'Not all groups have members inside in api',
    access_level: 'Site Access',
    privilege_set: 'Custom',
    site: {
      id: 1,
      name: 'Test site',
    },
    privileges: {
      jss_objects: [
        'Read Computers',
        'Read Policies',
        'Read Mac Applications',
        'Read VPP Administrator Accounts',
        'Read Mobile Device PreStage Enrollments',
        'Read Advanced User Searches',
        'Read Classes',
        'Read Mobile Device Enrollment Invitations',
        'Read Static User Groups',
        'Read Enrollment Profiles',
        'Read Mobile Device Applications',
        'Read Self Service Bookmarks',
        'Read Restricted Software',
        'Read iOS Configuration Profiles',
        'Read VPP Invitations',
        'Read PreStages',
        'Read Managed Preference Profiles',
        'Read Static Computer Groups',
        'Read Smart User Groups',
        'Read Network Integration',
        'Read Patch Policies',
        'Read User',
        'Read Mobile Device Managed App Configurations',
        'Read Advanced Mobile Device Searches',
        'Read macOS Configuration Profiles',
        'Read Licensed Software',
        'Read Smart Mobile Device Groups',
        'Read Patch Management Software Titles',
        'Read eBooks',
        'Read Static Mobile Device Groups',
        'Read Computer PreStage Enrollments',
        'Read Advanced User Content Searches',
        'Read VPP Assignment',
        'Read Smart Computer Groups',
        'Read Personal Device Profiles',
        'Read Advanced Computer Searches',
        'Read Computer Enrollment Invitations',
        'Read Mobile Devices',
        'Read Device Enrollment Program Instances',
        'Read Personal Device Configurations',
      ],
      jss_actions: [],
      recon: [],
      casper_remote: [],
      casper_imaging: [],
    },
    members: [{ id: 6, name: 'Test Account' }],
  };
}

export function createMockJamfClient(): IJamfClient {
  return {
    initialize: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
    fetchAccounts: function (): Promise<AdminsAndGroups> {
      throw new Error('Function not implemented.');
    },
    fetchAccountUserById: function (id: number): Promise<Admin> {
      throw new Error('Function not implemented.');
    },
    fetchAccountGroupById: function (id: number): Promise<Group> {
      throw new Error('Function not implemented.');
    },
    fetchUsers: (): Promise<User[]> => {
      return Promise.resolve([
        {
          id: 1,
          name: 'John',
          full_name: 'John Doe',
          email: 'jonh@doe.com',
          email_address: 'john.doe@example.com',
          phone_number: '',
          position: '',
          user_groups: {
            size: 1,
          },
          managed_apple_id: '1',
        },
      ]);
    },
    fetchUserById: function (id: number): Promise<User> {
      throw new Error('Function not implemented.');
    },
    fetchMobileDevices: function (): Promise<MobileDevice[]> {
      throw new Error('Function not implemented.');
    },
    fetchMobileDeviceById: function (id: number): Promise<MobileDeviceDetail> {
      throw new Error('Function not implemented.');
    },
    fetchComputers: function (): Promise<Computer[]> {
      throw new Error('Function not implemented.');
    },
    fetchComputerById: function (id: number): Promise<ComputerDetail> {
      throw new Error('Function not implemented.');
    },
    fetchComputerApplicationByName: function (
      name: string,
    ): Promise<ApplicationDetail> {
      throw new Error('Function not implemented.');
    },
    fetchOSXConfigurationProfiles: function (): Promise<Configuration[]> {
      throw new Error('Function not implemented.');
    },
    fetchOSXConfigurationProfileById: function (
      id: number,
    ): Promise<OSXConfigurationDetail> {
      throw new Error('Function not implemented.');
    },
    getResourceUrl: function (path: string, isJSSResource: boolean): string {
      throw new Error('Function not implemented.');
    },
  };
}
