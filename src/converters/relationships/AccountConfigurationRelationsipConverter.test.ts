import { Account, ConfigurationDetail } from "../../types";
import { createAccountConfigurationRelationships } from "./AccountConfigurationRelationsipConverter";

test("convert account configurations relationships", () => {
  const account: Account = {
    id: "TestId",
    name: "TestName",
  };

  const configs: ConfigurationDetail[] = [
    {
      general: {
        id: 1,
        name: "Test Configuration",
        description: "Some Description Data",
        type: "Standard",
      },
      packages: [],
      scripts: [],
      printers: [],
      directory_bindings: [],
      management: {
        username: "",
        password_sha256:
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        create_account: false,
        hide_account: false,
        allow_ssh_for_management_only: false,
      },
      home_page: "",
      partitions: [],
    },
  ];

  expect(createAccountConfigurationRelationships(account, configs)).toEqual([
    {
      _class: "HAS",
      _fromEntityKey: "jamf_account_TestId",
      _key: "jamf_account_TestId_has_jamf_configuration_profile_1",
      _toEntityKey: "jamf_configuration_profile_1",
      _type: "jamf_account_has_jamf_configuration_profile",
    },
  ]);
});
