import { Account, User } from "../../types";
import { createAccountUserRelationships } from "./AccountUserRelationshipConverter";

const account: Account = {
  id: "TestId",
  name: "TestName",
};

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
      ],
      vpp_assignments: [],
      total_vpp_code_count: 0,
    },
  },
];

test("convert account user relationships", () => {
  const relationships = createAccountUserRelationships(account, users);

  expect(relationships).toEqual([
    {
      _class: "HAS",
      _fromEntityKey: "jamf_account_TestId",
      _key: "jamf_account_TestId_has_device_user_5",
      _toEntityKey: "device_user_5",
      _type: "jamf_account_has_device_user",
    },
  ]);
});
