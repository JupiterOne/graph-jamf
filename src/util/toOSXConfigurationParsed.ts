import plist from 'plist';
import {
  OSXConfigurationDetail,
  OSXConfigurationDetailParsed,
  OSXConfigurationPayload,
} from '../jamf/types';

export function toOSXConfigurationDetailParsed(
  detail: OSXConfigurationDetail,
): OSXConfigurationDetailParsed {
  const payload = plist.parse(
    detail.general.payloads,
  ) as unknown as OSXConfigurationPayload;

  return {
    ...detail,
    parsedPayload: payload,
  };
}
