import { User } from "../types";
import { createUserEntities } from "./UserEntityConverter";

test("convert user entity", () => {
  const users: User[] = [
    {
      id: 5,
      name: "Heriberto Truby",
      full_name: "",
      email: "heriberto.truby@gmail.com",
      email_address: "heriberto.truby@gmail.com",
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
        computers: {},
        peripherals: {},
        mobile_devices: {
          mobile_device: {
            id: 35,
            name: "Update 1-3",
          },
        },
        vpp_assignments: {},
        total_vpp_code_count: 0,
      },
    },
  ];

  const entities = createUserEntities(users);

  expect(entities).toEqual([
    {
      _class: "User",
      _key: "jamf_user_5",
      _type: "jamf_user",
      customPhotoUrl: "",
      email: "heriberto.truby@gmail.com",
      emailAddress: "heriberto.truby@gmail.com",
      enableCustomPhotoUrl: false,
      fullName: "",
      id: 5,
      ldapServer: "None",
      mobileDevice: {
        id: 35,
        name: "Update 1-3",
      },
      phoneNumber: "",
      position: "",
      totalVppCodeCount: 0,
      username: "Heriberto Truby",
    },
  ]);
});
