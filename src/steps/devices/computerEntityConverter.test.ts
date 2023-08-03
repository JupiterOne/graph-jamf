import {
  createMockComputer,
  createMockComputerDetail,
} from '../../../test/mocks';
import { createComputerEntity } from './computerEntityConverter';

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
