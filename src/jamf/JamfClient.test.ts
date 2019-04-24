import nock from "nock";
import { fetchJamfData } from "./index";
import JamfClient from "./JamfClient";

const JAMF_LOCAL_EXECUTION_HOST =
  process.env.JAMF_LOCAL_EXECUTION_HOST || "example.jamfcloud.com";
const JAMF_LOCAL_EXECUTION_USERNAME =
  process.env.JAMF_LOCAL_EXECUTION_USERNAME || "name";
const JAMF_LOCAL_EXECUTION_PASSWORD =
  process.env.JAMF_LOCAL_EXECUTION_PASSWORD || "password";

function prepareScope(def: nock.NockDefinition) {
  def.scope = `https://${JAMF_LOCAL_EXECUTION_HOST}`;
}

function getClient() {
  return new JamfClient(
    JAMF_LOCAL_EXECUTION_HOST,
    JAMF_LOCAL_EXECUTION_USERNAME,
    JAMF_LOCAL_EXECUTION_PASSWORD,
  );
}

describe("JamfClient fetch ok data", () => {
  beforeAll(() => {
    nock.back.fixtures = `${__dirname}/../../test/fixtures/`;
    process.env.CI
      ? nock.back.setMode("lockdown")
      : nock.back.setMode("record");
  });

  test("fetch users", async () => {
    const { nockDone } = await nock.back("users.json", {
      before: prepareScope,
    });

    const response = await getClient().fetchUsers();

    nockDone();

    expect(response).not.toEqual([]);
  });

  test("fetch full user profile", async () => {
    const { nockDone } = await nock.back("user-full.json", {
      before: prepareScope,
    });

    const response = await getClient().fetchUserById(5);

    nockDone();

    expect(response).not.toEqual({});
  });

  test("fetch mobile devices", async () => {
    const { nockDone } = await nock.back("mobile-devices.json", {
      before: prepareScope,
    });

    const response = await getClient().fetchMobileDevices();

    nockDone();

    expect(response).not.toEqual([]);
  });

  test("fetch all data", async () => {
    const { nockDone } = await nock.back("all-data.json", {
      before: prepareScope,
    });

    const client = getClient();
    const response = await fetchJamfData(client);

    nockDone();

    expect(response).not.toEqual([]);
  });

  afterAll(() => {
    nock.restore();
  });
});
