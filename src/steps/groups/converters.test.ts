import { createGroupEntity } from './converters';
import { createMockGroup } from '../../../test/mocks';

describe('#createGroupEntity', () => {
  test('should convert data', () => {
    expect(createGroupEntity(createMockGroup())).toMatchSnapshot();
  });
});
