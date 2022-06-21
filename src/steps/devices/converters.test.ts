import {
  createComputerEntity,
  createMobileDeviceEntity,
  getDeploymentStatus,
} from './converters';
import {
  createMockMobileDevice,
  createMockComputer,
  createMockComputerDetail,
  EXTENSION_ATTRIBUTES,
} from '../../../test/mocks';

describe('#createMobileDeviceEntity', () => {
  test('should convert data', () => {
    expect(
      createMobileDeviceEntity(createMockMobileDevice(), false),
    ).toMatchSnapshot();
  });
});

describe('#createComputerEntity', () => {
  test('should convert data', () => {
    expect(
      createComputerEntity({
        device: createMockComputer(),
        macOsConfigurationDetailByIdMap: new Map(),
        detailData: createMockComputerDetail(),
        previouslyDiscoveredDevice: false,
      }),
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
