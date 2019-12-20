/* eslint-disable @typescript-eslint/camelcase */

import { createComputersOSXConfigurationsRelationships } from "./ComputersOSXConfigurationsRelationshipsConverter";

test("convert computer osx configurations relationships", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const computers: any[] = [
    {
      general: {
        id: 1,
      },
      configuration_profiles: [
        {
          id: 2001,
        },
        {
          id: 911,
        },
      ],
    },
    {
      general: {
        id: 2,
      },
      configuration_profiles: [
        {
          id: 2001,
        },
        {
          id: 911,
        },
      ],
    },
  ];

  expect(createComputersOSXConfigurationsRelationships(computers)).toEqual([
    {
      _class: "USES",
      _fromEntityKey: "user_endpoint_1",
      _key: "user_endpoint_1_uses_jamf_osx_configuration_profile_2001",
      _toEntityKey: "jamf_osx_configuration_profile_2001",
      _type: "user_endpoint_uses_jamf_osx_configuration_profile",
      _scope: "user_endpoint_uses_jamf_osx_configuration_profile",
    },
    {
      _class: "USES",
      _fromEntityKey: "user_endpoint_1",
      _key: "user_endpoint_1_uses_jamf_osx_configuration_profile_911",
      _toEntityKey: "jamf_osx_configuration_profile_911",
      _type: "user_endpoint_uses_jamf_osx_configuration_profile",
      _scope: "user_endpoint_uses_jamf_osx_configuration_profile",
    },
    {
      _class: "USES",
      _fromEntityKey: "user_endpoint_2",
      _key: "user_endpoint_2_uses_jamf_osx_configuration_profile_2001",
      _toEntityKey: "jamf_osx_configuration_profile_2001",
      _type: "user_endpoint_uses_jamf_osx_configuration_profile",
      _scope: "user_endpoint_uses_jamf_osx_configuration_profile",
    },
    {
      _class: "USES",
      _fromEntityKey: "user_endpoint_2",
      _key: "user_endpoint_2_uses_jamf_osx_configuration_profile_911",
      _toEntityKey: "jamf_osx_configuration_profile_911",
      _type: "user_endpoint_uses_jamf_osx_configuration_profile",
      _scope: "user_endpoint_uses_jamf_osx_configuration_profile",
    },
  ]);
});
