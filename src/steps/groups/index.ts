import {
  createDirectRelationship,
  Entity,
  IntegrationLogger,
  IntegrationStep,
  IntegrationStepExecutionContext,
  JobState,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IJamfClient, JamfClient } from '../../jamf/client';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createGroupEntity } from './converters';
import { Group } from '../../jamf/types';
import { getAccountData, getAccountEntity } from '../../util/account';
import { generateEntityKey } from '../../util/generateKey';

async function iterateGroupProfiles(
  client: IJamfClient,
  logger: IntegrationLogger,
  jobState: JobState,
  iteratee: (user: Group) => Promise<void>,
) {
  const accountData = await getAccountData(jobState);
  logger.info({ numGroups: accountData.groups }, 'Iterating groups');

  for (const group of accountData.groups) {
    await iteratee(await client.fetchAccountGroupById(group.id));
  }
}

async function createGroupHasMemberRelationships(
  jobState: JobState,
  groupEntity: Entity,
  group: Group,
) {
  for (const member of group.members || []) {
    const userEntity = await jobState.findEntity(
      generateEntityKey(Entities.USER_ADMIN._type, member.id),
    );

    if (!userEntity) {
      continue;
    }

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: groupEntity,
        to: userEntity,
      }),
    );
  }
}

export async function fetchGroups({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;

  const client = JamfClient.getInstance({
    host: config.jamfHost,
    username: config.jamfUsername,
    password: config.jamfPassword,
  });
  await client.initialize();

  const accountEntity = await getAccountEntity(jobState);

  await iterateGroupProfiles(client, logger, jobState, async (group) => {
    const groupEntity = await jobState.addEntity(createGroupEntity(group));
    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: groupEntity,
      }),
    );

    await createGroupHasMemberRelationships(jobState, groupEntity, group);
  });
}

export const groupSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.GROUPS,
    name: 'Fetch Groups',
    entities: [Entities.GROUP],
    relationships: [
      Relationships.ACCOUNT_HAS_GROUP,
      Relationships.GROUP_HAS_USER_ADMIN_MEMBER,
    ],
    executionHandler: fetchGroups,
    dependsOn: [IntegrationSteps.ACCOUNTS, IntegrationSteps.ADMINS],
  },
];
