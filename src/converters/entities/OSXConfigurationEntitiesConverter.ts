import {
  OSX_CONFIGURATION_ENTITY_CLASS,
  OSX_CONFIGURATION_ENTITY_TYPE,
  OSXConfigurationEntity,
} from "../../jupiterone/entities/OSXConfigurationEntity";
import {
  OSXConfigurationDetailParsed,
  OSXConfigurationFirewallPayload,
  OSXConfigurationScreensaverPayload,
} from "../../types";
import { generateEntityKey } from "../../utils/generateKey";

function createOSXConfigurationEntity(
  data: OSXConfigurationDetailParsed,
): OSXConfigurationEntity {
  const baseOSXConfigurationEntity: OSXConfigurationEntity = {
    _key: generateEntityKey(OSX_CONFIGURATION_ENTITY_TYPE, data.general.id),
    _class: OSX_CONFIGURATION_ENTITY_CLASS,
    _type: OSX_CONFIGURATION_ENTITY_TYPE,
    _rawData: [{ name: "default", rawData: data }],
    id: data.general.id,
    name: data.general.name,
    displayName: data.general.name,
    description: data.general.description,
    siteName: data.general.site.name,
    categoryName: data.general.category.name,
    distributionMethod: data.general.distribution_method,
    userRemovable: data.general.user_removable,
    level: data.general.level,
    redeployOnUpdate: data.general.redeploy_on_update,
    allComputers: data.scope.all_computers,
    allJSSUsers: data.scope.all_jss_users,
    firewallEnabled: false,
    screensaverLockEnabled: false,
  };

  const firewallPayload = data.parsedPayload.PayloadContent.find(item => {
    return item.PayloadType === "com.apple.security.firewall";
  }) as OSXConfigurationFirewallPayload;

  if (firewallPayload && firewallPayload.PayloadEnabled) {
    baseOSXConfigurationEntity.firewallEnabled = firewallPayload.EnableFirewall;
    baseOSXConfigurationEntity.firewallStealthModeEnabled =
      firewallPayload.EnableStealthMode;
    baseOSXConfigurationEntity.firewallBlockAllIncoming =
      firewallPayload.BlockAllIncoming;
  }

  const screensaverPayload = data.parsedPayload.PayloadContent.find(item => {
    return item.PayloadType === "com.apple.screensaver";
  }) as OSXConfigurationScreensaverPayload;

  if (screensaverPayload && screensaverPayload.PayloadEnabled) {
    baseOSXConfigurationEntity.screensaverLockEnabled = true;
    baseOSXConfigurationEntity.screensaverIdleTime =
      screensaverPayload.loginWindowIdleTime;
  }

  return baseOSXConfigurationEntity;
}

export function createOSXConfigurationEntities(
  details: OSXConfigurationDetailParsed[],
): OSXConfigurationEntity[] {
  return details.reduce((entities: OSXConfigurationEntity[], configuration) => {
    return [...entities, createOSXConfigurationEntity(configuration)];
  }, []);
}
