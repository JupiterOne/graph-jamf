import {
  createMockComputer,
  createMockComputerDetail,
} from '../../../test/mocks';
import {
  createComputerEntity,
  getConfigurationProfileData,
  getUserNameData,
} from './computerEntityConverter';

describe('#createComputerEntity', () => {
  test('should convert data', () => {
    const data = createComputerEntity({
      device: createMockComputer(),
      macOsConfigurationDetailByIdMap: new Map(),
      detailData: createMockComputerDetail(),
      previouslyDiscoveredDevice: false,
    });
    expect(data).toMatchSnapshot();
  });
});

describe('#getUserNameData()', () => {
  describe('given an emptyuser name', () => {
    it('should return the location user name', () => {
      const result = getUserNameData('', createMockComputerDetail());
      expect(result).toEqual({ username: 'john.doe' });
    });
  });
});

describe('#getConfigurationProfileData()', () => {
  describe('given a set of configuration profiles', () => {
    it('should return the firewall configuration', () => {
      const map = new Map();
      map.set(-1, {
        parsedPayload: {
          PayloadDisplayName: 'names',
          PayloadContent: [
            {
              PayloadType: 'com.apple.security.firewall',
              PayloadEnabled: true,
              EnableFirewall: true,
              BlockAllIncoming: true,
              EnableStealthMode: true,
            },
            {
              PayloadType: 'com.apple.screensaver',
              PayloadEnabled: true,
              loginWindowIdleTime: 1,
            },
          ],
        },
        general: {
          id: -1,
          name: 'name',
          description: 'description',
          site: { id: 1, name: 'site' },
          category: { id: 1, name: 'category' },
          distribution_method: 'dist',
          user_removable: true,
          level: 'level',
          redeploy_on_update: 're',
          payloads: '',
        },
        scope: {
          all_computers: true,
          all_jss_users: true,
        },
      });

      const result = getConfigurationProfileData(
        createMockComputerDetail(),
        map,
      );

      expect(result).toEqual({
        firewallBlockAllIncoming: true,
        firewallEnabled: true,
        firewallStealthModeEnabled: true,
        screensaverIdleTime: 1,
        screensaverLockEnabled: true,
      });
    });
  });
});
