import { createComputerEntity, createMobileDeviceEntity } from './converters';
import {
  createMockMobileDevice,
  createMockComputer,
  createMockComputerDetail,
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
