import { User } from "../types";
import { createUserEntities } from "./UserEntityConverter";

describe("convert user entity", () => {
  test("with mobile device", () => {
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
          computers: [
            {
              id: 35,
              name: "Update 1-3",
            },
          ],
          peripherals: [],
          mobile_devices: [
            {
              id: 35,
              name: "Update 1-3",
            },
          ],
          vpp_assignments: [],
          total_vpp_code_count: 0,
        },
      },
    ];

    const entities = createUserEntities(users);

    expect(entities).toEqual([
      {
        _class: "User",
        _key: "device_user_5",
        _type: "device_user",
        customPhotoUrl: "",
        displayName: "Heriberto Truby",
        email: "testing123@example.com",
        emailAddress: "testing123@example.com",
        enableCustomPhotoUrl: false,
        fullName: "",
        id: 5,
        ldapServer: "None",
        phoneNumber: "",
        position: "",
        totalVppCodeCount: 0,
        username: "Heriberto Truby",
      },
    ]);
  });

  test("without mobile device", () => {
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
          mobile_devices: [],
          vpp_assignments: [],
          total_vpp_code_count: 0,
        },
      },
    ];

    const entities = createUserEntities(users);

    expect(entities).toEqual([
      {
        _class: "User",
        _key: "device_user_5",
        _type: "device_user",
        customPhotoUrl: "",
        displayName: "Heriberto Truby",
        email: "testing123@example.com",
        emailAddress: "testing123@example.com",
        enableCustomPhotoUrl: false,
        fullName: "",
        id: 5,
        ldapServer: "None",
        phoneNumber: "",
        position: "",
        totalVppCodeCount: 0,
        username: "Heriberto Truby",
      },
    ]);
  });
});
