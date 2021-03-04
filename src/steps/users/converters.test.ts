import { createAdminEntity, createDeviceUserEntity } from './converters';
import { createMockAdminUser, createMockDeviceUser } from '../../../test/mocks';

describe('#createAdminEntity', () => {
  test('should convert data', () => {
    expect(createAdminEntity(createMockAdminUser())).toMatchSnapshot();
  });
});

describe('#createDeviceUserEntity', () => {
  test('should convert data', () => {
    expect(createDeviceUserEntity(createMockDeviceUser())).toMatchSnapshot();
  });
});
