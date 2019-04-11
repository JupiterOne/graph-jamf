import { createTestIntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";
import { readFileSync } from "fs";
import initializeContext from "../initializeContext";
import fetchJamfData from "../jamf/fetchJamfData";
import { convert } from "./publishChanges";

function readFixture(fixtureName: string) {
  const raw = readFileSync(`${__dirname}/../../test/fixtures/${fixtureName}`);
  return JSON.parse(raw.toString());
}
const apiMocks = [
  {
    url: "/users",
    name: "users.json",
  },
];

jest.mock("node-fetch", () => {
  return jest.fn().mockImplementation((url: string) => {
    const fixture = apiMocks.find(mock => url.match(mock.url) !== null);

    return {
      json() {
        if (fixture) {
          return readFixture(fixture.name);
        }

        return {};
      },
    };
  });
});

test("convert", async () => {
  const options = {
    instance: {
      config: {
        jamfHost: "fakeClientId",
        jamfName: "fakeClientSecret",
        jamfPassword: "fakeClientSecret",
      },
    },
  };

  const context = createTestIntegrationExecutionContext(options);
  const { provider } = await initializeContext(context);

  const jamfData = await fetchJamfData(provider);
  const newData = convert(jamfData);

  expect(newData).toEqual(readFixture("result.json"));
});
