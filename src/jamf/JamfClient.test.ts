import nock from "nock";
import { fetchJamfData } from "./index";
import JamfClient from "./JamfClient";

const JAMF_LOCAL_EXECUTION_ACCOUNT_HOST =
  process.env.JAMF_LOCAL_EXECUTION_ACCOUNT_HOST || "example.jamfcloud.com";
const JAMF_LOCAL_EXECUTION_ACCOUNT_NAME =
  process.env.JAMF_LOCAL_EXECUTION_ACCOUNT_NAME || "name";
const JAMF_LOCAL_EXECUTION_ACCOUNT_PASSWORD =
  process.env.JAMF_LOCAL_EXECUTION_ACCOUNT_PASSWORD || "password";

function prepareScope(def: nock.NockDefinition) {
  def.scope = `https://${JAMF_LOCAL_EXECUTION_ACCOUNT_HOST}`;
}

function getClient() {
  return new JamfClient(
    JAMF_LOCAL_EXECUTION_ACCOUNT_HOST,
    JAMF_LOCAL_EXECUTION_ACCOUNT_NAME,
    JAMF_LOCAL_EXECUTION_ACCOUNT_PASSWORD,
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
