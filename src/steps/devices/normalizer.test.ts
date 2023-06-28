import { deviceNormalizer } from './normalizer';

describe('Device Normalizer', () => {
  describe('normalizeOsVersion()', () => {
    describe('given a version without patch version', () => {
      it('should set patch to 0', () => {
        const result = deviceNormalizer.normalizeOsVersion('1.1');
        expect(result).toEqual('1.1.0');
      });
    });

    describe('given a version without minor version', () => {
      it('should set both minor and patch to 0', () => {
        const result = deviceNormalizer.normalizeOsVersion('1');
        expect(result).toEqual('1.0.0');
      });
    });

    describe('given an empty version', () => {
      it('should return the same value', () => {
        const result = deviceNormalizer.normalizeOsVersion('');
        expect(result).toEqual('');
      });
    });
  });
});
