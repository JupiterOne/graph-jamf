import plist from "plist";
import { createOSXConfigurationEntities } from "./OSXConfigurationEntitiesConverter";

const payloadsPlist = {
  PayloadUUID: "99537B91-E619-44DD-A4FB-E80E5622C3B7",
  PayloadType: "Configuration",
  PayloadOrganization: "JupiterOne",
  PayloadIdentifier: "99537B91-E619-44DD-A4FB-E80E5622C3B7",
  PayloadDisplayName: "Isaac's Test Configuration",
  PayloadDescription: "",
  PayloadVersion: 1,
  PayloadEnabled: true,
  PayloadRemovalDisallowed: true,
  PayloadScope: "System",
  PayloadContent: [
    {
      PayloadUUID: "A5BB2304-1191-40B8-A15C-69E1757D0F5B",
      PayloadType: "com.apple.security.firewall",
      PayloadOrganization: "JupiterOne",
      PayloadIdentifier: "A5BB2304-1191-40B8-A15C-69E1757D0F5B",
      PayloadDisplayName: "Firewall",
      PayloadDescription: "",
      PayloadVersion: 1,
      PayloadEnabled: true,
      EnableFirewall: true,
      BlockAllIncoming: true,
      EnableStealthMode: true,
      Applications: [],
    },
  ],
};

const expectedEntity = {
  _class: "Configuration",
  _key: "jamf_osx_configuration_profile_1",
  _type: "jamf_osx_configuration_profile",
  allComputers: false,
  allJSSUsers: false,
  categoryName: "My Category",
  description: "",
  distributionMethod: "Make Available in Self Service",
  firewallBlockAllIncoming: true,
  firewallEnabled: true,
  firewallStealthModeEnabled: true,
  id: 1,
  level: "computer",
  name: "My OSX Configuration Profile",
  redeployOnUpdate: true,
  siteName: "My Site",
  userRemovable: false,
};

function configurationDetail(payloadsPlistString: string): any {
  return {
    general: {
      id: 1,
      name: "My OSX Configuration Profile",
      description: "",
      site: {
        name: "My Site",
      },
      category: {
        name: "My Category",
      },
      distribution_method: "Make Available in Self Service",
      user_removable: false,
      level: "computer",
      redeploy_on_update: true,
      payloads: payloadsPlistString,
    },
    scope: {
      all_computers: false,
      all_jss_users: false,
    },
  };
}

test("convert osx configuration entity", () => {
  const payloadsPlistString = plist.build(payloadsPlist);

  expect(
    createOSXConfigurationEntities([
      configurationDetail(payloadsPlistString),
      configurationDetail(payloadsPlistString),
    ]),
  ).toEqual([expectedEntity, expectedEntity]);
});

test("convert osx configuration entity without firewall payload", () => {
  const payloadsPlistString = plist.build({
    ...payloadsPlist,
    PayloadContent: [],
  });
  const expectedEntityFirewallOff = {
    ...expectedEntity,
    firewallEnabled: false,
    firewallBlockAllIncoming: false,
    firewallStealthModeEnabled: false,
  };

  expect(
    createOSXConfigurationEntities([
      configurationDetail(payloadsPlistString),
      configurationDetail(payloadsPlistString),
    ]),
  ).toEqual([expectedEntityFirewallOff, expectedEntityFirewallOff]);
});
