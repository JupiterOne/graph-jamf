import plist from 'plist';
import { OSXConfigurationPayload, PListDocument } from '../jamf/types';

export function toOSXConfigurationDetailParsed(
  payloads: PListDocument,
): OSXConfigurationPayload | undefined {
  try {
    return plist.parse(payloads) as unknown as OSXConfigurationPayload;
  } catch (err) {
    return;
  }
}
