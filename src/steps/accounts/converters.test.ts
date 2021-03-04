import { Account } from '../../jamf/types';
import { createAccountEntity } from './converters';

describe('#createAccountEntity', () => {
  test('should convert data', () => {
    const account: Account = {
      id: 'test-id',
      name: 'test-name',
    };

    expect(createAccountEntity(account)).toMatchSnapshot();
  });
});
