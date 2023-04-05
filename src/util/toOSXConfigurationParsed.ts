import plist from 'plist';
import {
  OSXConfigurationDetail,
  OSXConfigurationDetailParsed,
  OSXConfigurationPayload,
} from '../jamf/types';

export function toOSXConfigurationDetailParsed(
  detail: OSXConfigurationDetail,
): OSXConfigurationDetailParsed | null {
  try {
    const payload = plist.parse(
      detail.general.payloads,
    ) as unknown as OSXConfigurationPayload;

    return {
      ...detail,
      parsedPayload: payload,
    };
  } catch (err) {
    return null;
  }
}
