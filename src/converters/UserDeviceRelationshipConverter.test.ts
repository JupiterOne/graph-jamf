import { User } from "../types";
import { createUserDeviceRelationships } from "./UserDeviceRelationshipConverter";

const users: User[] = [
  {
    id: 5,
    name: "Heriberto Truby",
    full_name: "",
    email: "testing123@example.com",
    email_address: "testing123@example.com",
    phone_number: "",
    position: "",
    enable_custom_photo_url: false,
    custom_photo_url: "",
    ldap_server: {
      id: -1,
      name: "None",
    },
    extension_attributes: [],
    sites: [],
    links: {
      computers: [],
      peripherals: [],
      mobile_devices: [
        {
          id: 35,
          name: "Update 1-3",
        },
        {
          id: 36,
          name: "Update 1-4",
        },
      ],
      vpp_assignments: [],
      total_vpp_code_count: 0,
    },
  },
  {
    id: 4,
    name: "Maira Fillman",
    full_name: "",
    email: "testing345@example.com",
    email_address: "testing345@example.com",
    phone_number: "",
    position: "",
    enable_custom_photo_url: false,
    custom_photo_url: "",
    ldap_server: {
      id: -1,
      name: "None",
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
  },
];

test("convert user device relationships", () => {
  const relationships = createUserDeviceRelationships(users);

  expect(relationships).toEqual([
    {
      _class: "HAS",
      _fromEntityKey: "device_user_5",
      _key: "device_user_5_has_jamf_mobile_device_35",
      _toEntityKey: "jamf_mobile_device_35",
      _type: "device_user_has_jamf_mobile_device",
    },
    {
      _class: "HAS",
      _fromEntityKey: "device_user_5",
      _key: "device_user_5_has_jamf_mobile_device_36",
      _toEntityKey: "jamf_mobile_device_36",
      _type: "device_user_has_jamf_mobile_device",
    },
  ]);
});
