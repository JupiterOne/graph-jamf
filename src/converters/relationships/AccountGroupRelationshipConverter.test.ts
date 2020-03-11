/* eslint-disable @typescript-eslint/camelcase */

import { Account, Group } from "../../types";
import { createAccountGroupRelationships } from "./AccountGroupRelationshipConverter";

test("convert account group relationships", () => {
  const account: Account = {
    id: "TestId",
    name: "TestName",
  };

  const groups: Group[] = [
    {
      id: 1,
      name: "Test Group",
      access_level: "Site Access",
      privilege_set: "Custom",
      site: { id: 1, name: "Test site" },
      privileges: {
        jss_objects: [],
        jss_actions: [],
        recon: [],
        casper_remote: [],
        casper_imaging: [],
      },
      members: [{ id: 6, name: "Test Account" }],
    },
    {
      id: 2,
      name: "Another Test Group",
      access_level: "Site Access",
      privilege_set: "Custom",
      site: { id: 1, name: "Test site" },
      privileges: {
        jss_objects: [],
        jss_actions: [],
        recon: [],
        casper_remote: [],
        casper_imaging: [],
      },
      members: [{ id: 6, name: "Test Account" }],
    },
    {
      id: 3,
      name: "Not all groups have members inside in api",
      access_level: "Site Access",
      privilege_set: "Custom",
      site: { id: 1, name: "Test site" },
      privileges: {
        jss_objects: ["Test Privileges"],
        jss_actions: [],
        recon: [],
        casper_remote: [],
        casper_imaging: [],
      },
      members: [{ id: 6, name: "Test Account" }],
    },
  ];

  expect(createAccountGroupRelationships(account, groups)).toEqual([
    {
      _class: "HAS",
      _fromEntityKey: "jamf_account_TestId",
      _key: "jamf_account_TestId_jamf_account_has_jamf_group_jamf_group_1",
      _toEntityKey: "jamf_group_1",
      _type: "jamf_account_has_jamf_group",
    },
    {
      _class: "HAS",
      _fromEntityKey: "jamf_account_TestId",
      _key: "jamf_account_TestId_jamf_account_has_jamf_group_jamf_group_2",
      _toEntityKey: "jamf_group_2",
      _type: "jamf_account_has_jamf_group",
    },
    {
      _class: "HAS",
      _fromEntityKey: "jamf_account_TestId",
      _key: "jamf_account_TestId_jamf_account_has_jamf_group_jamf_group_3",
      _toEntityKey: "jamf_group_3",
      _type: "jamf_account_has_jamf_group",
    },
  ]);
});
