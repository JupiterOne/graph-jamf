import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';
import { iterator } from './interator';
import { createMockJamfClient } from '../../../test/mocks';

describe('User Iterator', () => {
  describe('#iterateUserProfiles()', () => {
    describe('given a list of users', () => {
      describe('when they try to retrieve a user id and fails', () => {
        it('should throw an error', async () => {
          try {
            const logger = createMockIntegrationLogger();
            const fakeJamfClient = createMockJamfClient();

            await iterator.iterateUserProfiles(fakeJamfClient, logger, () => {
              throw new Error('This function should never be execute');
            });
          } catch (err) {
            expect(err.message).toEqual(
              'Unable to fetch all user profiles (success=0, failed=1)',
            );
          }
        });
      });
    });
  });
});
