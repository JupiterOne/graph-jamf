import { Group } from "../../types";
import { createGroupAdminRelationships } from "./GroupAdminRelationshipConverter";

test("convert group admin relationships", () => {
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
    {
      id: 4,
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
    },
  ];

  expect(createGroupAdminRelationships(groups)).toEqual([
    {
      _class: "HAS",
      _fromEntityKey: "jamf_group_1",
      _key: "jamf_group_1_jamf_group_has_jamf_user_jamf_user_6",
      _toEntityKey: "jamf_user_6",
      _type: "jamf_group_has_jamf_user",
    },
    {
      _class: "HAS",
      _fromEntityKey: "jamf_group_2",
      _key: "jamf_group_2_jamf_group_has_jamf_user_jamf_user_6",
      _toEntityKey: "jamf_user_6",
      _type: "jamf_group_has_jamf_user",
    },
    {
      _class: "HAS",
      _fromEntityKey: "jamf_group_3",
      _key: "jamf_group_3_jamf_group_has_jamf_user_jamf_user_6",
      _toEntityKey: "jamf_user_6",
      _type: "jamf_group_has_jamf_user",
    },
  ]);
});
