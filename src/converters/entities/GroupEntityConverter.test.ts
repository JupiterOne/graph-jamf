import { Group } from "../../types";
import { createGroupEntities } from "./GroupEntityConverter";

test("convert group entity", () => {
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

  expect(createGroupEntities(groups)).toEqual([
    {
      _class: "UserGroup",
      _key: "jamf_group_1",
      _type: "jamf_group",
      _rawData: [{ name: "default", rawData: groups[0] }],
      accessLevel: "Site Access",
      displayName: "Test Group",
      name: "Test Group",
      privilegeSet: "Custom",
    },
    {
      _class: "UserGroup",
      _key: "jamf_group_2",
      _type: "jamf_group",
      _rawData: [{ name: "default", rawData: groups[1] }],
      accessLevel: "Site Access",
      displayName: "Another Test Group",
      name: "Another Test Group",
      privilegeSet: "Custom",
    },
    {
      _class: "UserGroup",
      _key: "jamf_group_3",
      _type: "jamf_group",
      _rawData: [{ name: "default", rawData: groups[2] }],
      accessLevel: "Site Access",
      displayName: "Not all groups have members inside in api",
      name: "Not all groups have members inside in api",
      privilegeSet: "Custom",
    },
  ]);
});
