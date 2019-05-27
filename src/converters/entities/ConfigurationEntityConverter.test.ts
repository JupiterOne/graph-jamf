import { ConfigurationDetail } from "../../types";
import { createConfigurationEntities } from "./ConfigurationEntityConverter";

test("convert configuration entity", () => {
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

  expect(createConfigurationEntities(configs)).toEqual([
    {
      _class: "Configuration",
      _key: "jamf_configuration_profile_1",
      _type: "jamf_configuration_profile",
      description: "Some Description Data",
      id: 1,
      name: "Test Configuration",
      type: "Standard",
    },
  ]);
});
