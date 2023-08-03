import { createMobileDeviceEntity, getDeploymentStatus } from './converters';
import {
  createMockMobileDevice,
  createMockComputer,
  createMockComputerDetail,
  EXTENSION_ATTRIBUTES,
  createMockMobileDeviceDetail,
} from '../../../test/mocks';

describe('#createMobileDeviceEntity', () => {
  test('should convert data', () => {
    expect(
      createMobileDeviceEntity(
        createMockMobileDevice(),
        createMockMobileDeviceDetail(),
        false,
      ),
    ).toMatchSnapshot();
  });
});

describe('#getDeploymentStatus', () => {
  test('should get the value of the deployment status hash', () => {
    expect(getDeploymentStatus(EXTENSION_ATTRIBUTES)).toEqual(['active']);
  });
  test('should handle null', () => {
    expect(getDeploymentStatus(null as any)).toEqual([]);
  });
  test('should handle undefined', () => {
    expect(getDeploymentStatus(undefined as any)).toEqual([]);
  });
  test('should handle incorrect input', () => {
    expect(getDeploymentStatus(2 as any)).toEqual([]);
  });
});
