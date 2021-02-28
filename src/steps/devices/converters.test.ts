import { createComputerEntity, createMobileDeviceEntity } from './converters';
import {
  createMockMobileDevice,
  createMockComputer,
  createMockComputerDetail,
} from '../../../test/mocks';

describe('#createMobileDeviceEntity', () => {
  test('should convert data', () => {
    expect(
      createMobileDeviceEntity(createMockMobileDevice()),
    ).toMatchSnapshot();
  });
});

describe('#createComputerEntity', () => {
  test('should convert data', () => {
    expect(
      createComputerEntity(
        createMockComputer(),
        new Map(),
        createMockComputerDetail(),
      ),
    ).toMatchSnapshot();
  });
});
