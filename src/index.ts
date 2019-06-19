import { IntegrationInvocationConfig } from "@jupiterone/jupiter-managed-integration-sdk";

import executionHandler from "./executionHandler";
import invocationValidator from "./invocationValidator";

const invocationConfig: IntegrationInvocationConfig = {
  instanceConfigFields: {
    jamfHost: {
      type: "string",
    },
    jamfPassword: {
      type: "string",
      mask: true,
    },
    jamfUsername: {
      type: "string",
    },
  },
  executionHandler,
  invocationValidator,
};

export default invocationConfig;
