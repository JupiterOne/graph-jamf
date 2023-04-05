import { toOSXConfigurationDetailParsed } from './toOSXConfigurationParsed';

describe('toOSXConfigurationDetailParsed()', () => {
  describe('given an empty payload string', () => {
    it('should return null', () => {
      const result = toOSXConfigurationDetailParsed({
        general: {
          id: 1,
          name: '',
          description: '',
          site: { id: 1, name: '' },
          category: { id: 1, name: '' },
          distribution_method: '',
          user_removable: false,
          level: '',
          redeploy_on_update: '',
          payloads: '',
        },
        scope: {
          all_computers: false,
          all_jss_users: false,
        },
      });

      expect(result).toEqual(null);
    });
  });

  describe('given a valid plist string payload', () => {
    it('should parse it and return it', () => {
      const result = toOSXConfigurationDetailParsed({
        general: {
          id: 1,
          name: '',
          description: '',
          site: { id: 1, name: '' },
          category: { id: 1, name: '' },
          distribution_method: '',
          user_removable: false,
          level: '',
          redeploy_on_update: '',
          payloads: '<plist><string>Hello World</string></plist>',
        },
        scope: {
          all_computers: false,
          all_jss_users: false,
        },
      });

      expect(result).toEqual({
        general: {
          category: { id: 1, name: '' },
          description: '',
          distribution_method: '',
          id: 1,
          level: '',
          name: '',
          payloads: '<plist><string>Hello World</string></plist>',
          redeploy_on_update: '',
          site: { id: 1, name: '' },
          user_removable: false,
        },
        parsedPayload: 'Hello World',
        scope: { all_computers: false, all_jss_users: false },
      });
    });
  });
});
