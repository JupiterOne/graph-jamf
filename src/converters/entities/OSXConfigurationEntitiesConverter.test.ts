import plist from "plist";
import { OSXConfigurationEntity } from "../../jupiterone";
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
    {
      PayloadUUID: "E29F040C-1058-4F3F-BB53-327A95EAE7AB",
      PayloadType: "com.apple.screensaver",
      PayloadOrganization: "JupiterOne",
      PayloadIdentifier: "E29F040C-1058-4F3F-BB53-327A95EAE7AB",
      PayloadDisplayName: "Login Window:  Screen Saver Preferences",
      PayloadDescription: "",
      PayloadVersion: 1,
      PayloadEnabled: true,
      loginWindowIdleTime: 600,
      idleTime: 600,
      loginWindowModulePath: "/System/Library/Screen Savers/Flurry.saver",
    },
  ],
};

const expectedEntity: OSXConfigurationEntity = {
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
  redeployOnUpdate: "Newly Assigned",
  screensaverIdleTime: 600,
  screensaverLockEnabled: true,
  screensaverModulePath: "/System/Library/Screen Savers/Flurry.saver",
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
      redeploy_on_update: "Newly Assigned",
      payloads: payloadsPlistString,
    },
    scope: {
      all_computers: false,
      all_jss_users: false,
    },
  };
}

test("convert osx configuration entity", () => {
  const payloadsPlistString = plist.build(payloadsPlist as any);

  expect(
    createOSXConfigurationEntities([
      configurationDetail(payloadsPlistString),
      configurationDetail(payloadsPlistString),
    ]),
  ).toEqual([expectedEntity, expectedEntity]);
});

test("convert osx configuration entity without payloads", () => {
  const payloadsPlistString = plist.build({
    ...payloadsPlist,
    PayloadContent: [],
  });
  const expectedEntityNoPayloads = {
    ...expectedEntity,
    firewallEnabled: false,
    firewallBlockAllIncoming: undefined,
    firewallStealthModeEnabled: undefined,
    screensaverLockEnabled: false,
    screensaverIdleTime: undefined,
    screensaverModulePath: undefined,
  };

  expect(
    createOSXConfigurationEntities([
      configurationDetail(payloadsPlistString),
      configurationDetail(payloadsPlistString),
    ]),
  ).toEqual([expectedEntityNoPayloads, expectedEntityNoPayloads]);
});
