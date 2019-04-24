import { createTestIntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";
import initializeContext from "./initializeContext";

jest.mock("./jamf");

test("creates jamf client", async () => {
  const options = {
    instance: {
      config: {
        jamfHost: "",
        jamfUsername: "",
        jamfPassword: "",
      },
    },
  };

  const executionContext = createTestIntegrationExecutionContext(options);

  const integrationContext = await initializeContext(executionContext);
  expect(integrationContext.graph).toBeDefined();
  expect(integrationContext.persister).toBeDefined();
  expect(integrationContext.provider).toBeDefined();
});
