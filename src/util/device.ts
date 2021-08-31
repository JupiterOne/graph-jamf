import { IntegrationError, JobState } from '@jupiterone/integration-sdk-core';

const COMPUTER_DEVICE_ID_TO_GRAPH_OBJECT_KEY_MAP =
  'COMPUTER_DEVICE_ID_TO_GRAPH_OBJECT_KEY_MAP';
const MOBILE_DEVICE_ID_TO_GRAPH_OBJECT_KEY_MAP =
  'MOBILE_DEVICE_ID_TO_GRAPH_OBJECT_KEY_MAP';

export type DeviceIdToGraphObjectKeyMap = Map<number, string>;

export async function setComputerDeviceIdToGraphObjectKeyMap(
  jobState: JobState,
  map: Map<number, string>,
): Promise<void> {
  if (await jobState.getData(COMPUTER_DEVICE_ID_TO_GRAPH_OBJECT_KEY_MAP)) {
    throw new IntegrationError({
      message:
        'Attempted to assign computer device ID to graph object _key map after already assigned',
      code: 'COMPUTER_DEVICE_ID_TO_KEY_MAP_ERROR',
      fatal: true,
    });
  }

  await jobState.setData<DeviceIdToGraphObjectKeyMap>(
    COMPUTER_DEVICE_ID_TO_GRAPH_OBJECT_KEY_MAP,
    map,
  );
}

export async function getComputerDeviceIdToGraphObjectKeyMap(
  jobState: JobState,
): Promise<DeviceIdToGraphObjectKeyMap> {
  const map = await jobState.getData<DeviceIdToGraphObjectKeyMap | undefined>(
    COMPUTER_DEVICE_ID_TO_GRAPH_OBJECT_KEY_MAP,
  );

  if (!map) {
    throw new IntegrationError({
      message:
        'Could not find computer device ID to graph object _key map in job state',
      code: 'ACCOUNT_ENTITY_NOT_FOUND',
      fatal: true,
    });
  }

  return map;
}

export async function setMobileDeviceIdToGraphObjectKeyMap(
  jobState: JobState,
  map: Map<number, string>,
): Promise<void> {
  if (await jobState.getData(MOBILE_DEVICE_ID_TO_GRAPH_OBJECT_KEY_MAP)) {
    throw new IntegrationError({
      message:
        'Attempted to assign mobile device ID to graph object _key map after already assigned',
      code: 'COMPUTER_DEVICE_ID_TO_KEY_MAP_ERROR',
      fatal: true,
    });
  }

  await jobState.setData<DeviceIdToGraphObjectKeyMap>(
    MOBILE_DEVICE_ID_TO_GRAPH_OBJECT_KEY_MAP,
    map,
  );
}

export async function getMobileDeviceIdToGraphObjectKeyMap(
  jobState: JobState,
): Promise<DeviceIdToGraphObjectKeyMap> {
  const map = await jobState.getData<DeviceIdToGraphObjectKeyMap | undefined>(
    MOBILE_DEVICE_ID_TO_GRAPH_OBJECT_KEY_MAP,
  );

  if (!map) {
    throw new IntegrationError({
      message:
        'Could not find mobile device ID to graph object _key map in job state',
      code: 'ACCOUNT_ENTITY_NOT_FOUND',
      fatal: true,
    });
  }

  return map;
}
