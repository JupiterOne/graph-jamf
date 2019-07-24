import plist from "plist";
import {
  OSX_CONFIGURATION_ENTITY_CLASS,
  OSX_CONFIGURATION_ENTITY_TYPE,
  OSXConfigurationEntity,
} from "../../jupiterone/entities/OSXConfigurationEntity";
import { OSXConfigurationDetail } from "../../types";
import { generateEntityKey } from "../../utils/generateKey";

interface OSXConfigurationPayload {
  PayloadDisplayName: string;
  PayloadContent: OSXConfigurationPayloadItem[];
}

interface OSXConfigurationPayloadItem {
  PayloadType: string;
  PayloadEnabled: boolean;
  [key: string]: string | number | boolean;
}

interface OSXConfigurationFirewallPayload extends OSXConfigurationPayloadItem {
  EnableFirewall: boolean;
  EnableStealthMode: boolean;
  BlockAllIncoming: boolean;
}

interface OSXConfigurationScreensaverPayload
  extends OSXConfigurationPayloadItem {
  loginWindowIdleTime: number;
  loginWindowModulePath: string;
}

function createOSXConfigurationEntity(
  data: OSXConfigurationDetail,
): OSXConfigurationEntity {
  const payload = (plist.parse(
    data.general.payloads,
  ) as unknown) as OSXConfigurationPayload;

  const baseOSXConfigurationEntity: OSXConfigurationEntity = {
    _key: generateEntityKey(OSX_CONFIGURATION_ENTITY_TYPE, data.general.id),
    _class: OSX_CONFIGURATION_ENTITY_CLASS,
    _type: OSX_CONFIGURATION_ENTITY_TYPE,
    id: data.general.id,
    name: data.general.name,
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

  const firewallPayload = payload.PayloadContent.find(item => {
    return item.PayloadType === "com.apple.security.firewall";
  }) as OSXConfigurationFirewallPayload;

  if (firewallPayload && firewallPayload.PayloadEnabled) {
    baseOSXConfigurationEntity.firewallEnabled = firewallPayload.EnableFirewall;
    baseOSXConfigurationEntity.firewallStealthModeEnabled =
      firewallPayload.EnableStealthMode;
    baseOSXConfigurationEntity.firewallBlockAllIncoming =
      firewallPayload.BlockAllIncoming;
  }

  const screensaverPayload = payload.PayloadContent.find(item => {
    return item.PayloadType === "com.apple.screensaver";
  }) as OSXConfigurationScreensaverPayload;

  if (screensaverPayload && screensaverPayload.PayloadEnabled) {
    baseOSXConfigurationEntity.screensaverLockEnabled = true;
    baseOSXConfigurationEntity.screensaverIdleTime =
      screensaverPayload.loginWindowIdleTime;
    baseOSXConfigurationEntity.screensaverModulePath =
      screensaverPayload.loginWindowModulePath;
  }

  return baseOSXConfigurationEntity;
}

export function createOSXConfigurationEntities(
  details: OSXConfigurationDetail[],
): OSXConfigurationEntity[] {
  return details.reduce((entities: OSXConfigurationEntity[], configuration) => {
    return [...entities, createOSXConfigurationEntity(configuration)];
  }, []);
}
