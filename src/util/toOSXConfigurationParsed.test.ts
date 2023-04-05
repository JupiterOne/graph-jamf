import { toOSXConfigurationDetailParsed } from './toOSXConfigurationParsed';

describe('toOSXConfigurationDetailParsed()', () => {
  describe('given an empty payload string', () => {
    it('should return null', () => {
      const result = toOSXConfigurationDetailParsed('');
      expect(result).not.toBeDefined();
    });
  });

  describe('given a valid plist string payload', () => {
    it('should parse it and return it', () => {
      const result = toOSXConfigurationDetailParsed(
        '<plist><string>Hello World</string></plist>',
      );
      expect(result).toEqual('Hello World');
    });
  });
});
