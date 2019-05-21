import {
  IntegrationActionName,
  IntegrationExecutionContext,
} from "@jupiterone/jupiter-managed-integration-sdk";
import executionHandler from "./executionHandler";
import initializeContext from "./initializeContext";

jest.mock("./initializeContext");

let executionContext: any;

beforeEach(() => {
  executionContext = {
    graph: {
      findEntitiesByType: jest.fn().mockResolvedValue([]),
      findRelationshipsByType: jest.fn().mockResolvedValue([]),
    },
    persister: {
      processEntities: jest.fn().mockReturnValue([]),
      processRelationships: jest.fn().mockReturnValue([]),
      publishPersisterOperations: jest.fn().mockResolvedValue({}),
    },
    provider: {
      fetchUsers: jest.fn().mockReturnValue([]),
      fetchMobileDevices: jest.fn().mockReturnValue([]),
      fetchComputers: jest.fn().mockReturnValue([]),
      fetchUserById: jest.fn().mockReturnValue({}),
    },
    account: {
      id: "testId",
      name: "testName",
    },
  };

  (initializeContext as jest.Mock).mockReturnValue(executionContext);
});

test("executionHandler with INGEST action", async () => {
  const invocationContext = {
    instance: {
      config: {},
    },
    event: {
      action: {
        name: IntegrationActionName.INGEST,
      },
    },
  } as IntegrationExecutionContext;

  await executionHandler(invocationContext);

  expect(initializeContext).toHaveBeenCalledWith(invocationContext);
  expect(executionContext.provider.fetchUsers).toHaveBeenCalledTimes(1);
  expect(executionContext.provider.fetchMobileDevices).toHaveBeenCalledTimes(1);
  expect(executionContext.provider.fetchComputers).toHaveBeenCalledTimes(1);
  expect(executionContext.provider.fetchUserById).toHaveBeenCalledTimes(0);
  expect(executionContext.persister.processEntities).toHaveBeenCalledTimes(5);
  expect(
    executionContext.persister.publishPersisterOperations,
  ).toHaveBeenCalledTimes(2);
});

test("executionHandler with unhandled action", async () => {
  const invocationContext = {
    instance: {
      config: {},
    },
    event: {
      action: {
        name: IntegrationActionName.SCAN,
      },
    },
  } as IntegrationExecutionContext;

  await executionHandler(invocationContext);

  expect(executionContext.provider.fetchUsers).not.toHaveBeenCalled();
  expect(executionContext.provider.fetchMobileDevices).not.toHaveBeenCalled();
  expect(executionContext.provider.fetchUserById).not.toHaveBeenCalled();
  expect(executionContext.persister.processEntities).not.toHaveBeenCalled();
  expect(
    executionContext.persister.publishPersisterOperations,
  ).not.toHaveBeenCalled();
  expect(
    executionContext.persister.publishPersisterOperations,
  ).not.toHaveBeenCalled();
});
