import { fetchAccounts } from '.';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { AdminsAndGroups } from '../../jamf/types';
import { ACCOUNT_DATA_KEY, Entities } from '../constants';

describe('#fetchAccounts', () => {
  test('should collect data', async () => {
    const { context } = await createDataCollectionTest({
      recordingName: 'fetchAccounts',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchAccounts],
      entitySchemaMatchers: [
        {
          _type: Entities.ACCOUNT._type,
          matcher: {
            _class: ['Account'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'jamf_account' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
              },
            },
          },
        },
      ],
    });

    const accountData =
      await context.jobState.getData<AdminsAndGroups>(ACCOUNT_DATA_KEY);

    expect(accountData).toMatchSnapshot('accountData');
  });
});
