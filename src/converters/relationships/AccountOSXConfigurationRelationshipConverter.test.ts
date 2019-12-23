import { Account } from "../../types";
import { createAccountOSXConfigurationRelationships } from "./AccountOSXConfigurationRelationshipConverter";

test("convert account configurations relationships", () => {
  const account: Account = {
    id: "TestId",
    name: "TestName",
  };

  const configs: any = [
    {
      general: {
        id: 1,
      },
    },
  ];

  expect(createAccountOSXConfigurationRelationships(account, configs)).toEqual([
    {
      _class: "HAS",
      _fromEntityKey: "jamf_account_TestId",
      _key: "jamf_account_TestId_has_jamf_osx_configuration_profile_1",
      _toEntityKey: "jamf_osx_configuration_profile_1",
      _type: "jamf_account_has_jamf_osx_configuration_profile",
      _scope: "jamf_account_has_jamf_osx_configuration_profile",
    },
  ]);
});
