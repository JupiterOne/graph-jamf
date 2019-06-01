import nock from "nock";
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

function getClient(
  config: {
    host?: string;
    username?: string;
    password?: string;
  } = {},
) {
  return new JamfClient(
    config.host || JAMF_LOCAL_EXECUTION_HOST,
    config.username || JAMF_LOCAL_EXECUTION_USERNAME,
    config.password || JAMF_LOCAL_EXECUTION_PASSWORD,
  );
}

beforeAll(() => {
  nock.back.fixtures = `${__dirname}/../../test/fixtures/`;
  process.env.CI ? nock.back.setMode("lockdown") : nock.back.setMode("record");
});

describe("JamfClient fetch err", () => {
  test("unauthorized", async () => {
    const { nockDone } = await nock.back("users-unauthorized.json", {
      before: prepareScope,
    });

    expect.assertions(3);

    try {
      await getClient({ password: "bad-password" }).fetchUsers();
    } catch (err) {
      expect(err.message).toEqual("Unauthorized");
      expect(err.code).toEqual("UnexpectedStatusCode");
      expect(err.statusCode).toEqual(401);
    }

    nockDone();
  });

  test("underpriviledged", async () => {
    const { nockDone } = await nock.back("users-forbidden.json", {
      before: prepareScope,
    });

    expect.assertions(3);

    try {
      await getClient().fetchUsers();
    } catch (err) {
      expect(err.message).toEqual("Forbidden");
      expect(err.code).toEqual("UnexpectedStatusCode");
      expect(err.statusCode).toEqual(403);
    }

    nockDone();
  });

  test("not ok", async () => {
    const { nockDone } = await nock.back("users-server-error.json", {
      before: prepareScope,
    });

    expect.assertions(3);

    try {
      await getClient().fetchUsers();
    } catch (err) {
      expect(err.message).toEqual("Internal Server Error");
      expect(err.code).toEqual("UnexpectedStatusCode");
      expect(err.statusCode).toEqual(500);
    }

    nockDone();
  });

  test("connection timeout", async () => {
    nock(`https://${JAMF_LOCAL_EXECUTION_HOST}`)
      .get("/JSSResource/users")
      .replyWithError({ code: "ETIMEDOUT" });

    expect.assertions(3);

    try {
      await getClient().fetchUsers();
    } catch (err) {
      expect(err.message).toEqual(
        `Timed out trying to connect to ${JAMF_LOCAL_EXECUTION_HOST} (ETIMEDOUT)`,
      );
      expect(err.code).toEqual("ETIMEDOUT");
      expect(err.statusCode).toBeUndefined();
    }
  });

  test("socket timeout", async () => {
    nock(`https://${JAMF_LOCAL_EXECUTION_HOST}`)
      .get("/JSSResource/users")
      .replyWithError({ code: "ESOCKETTIMEDOUT" });

    expect.assertions(3);

    try {
      await getClient().fetchUsers();
    } catch (err) {
      expect(err.message).toEqual(
        `Established connection to ${JAMF_LOCAL_EXECUTION_HOST} timed out (ESOCKETTIMEDOUT)`,
      );
      expect(err.code).toEqual("ESOCKETTIMEDOUT");
      expect(err.statusCode).toBeUndefined();
    }
  });
});

describe("JamfClient fetch ok data", () => {
  test("limits Jamf API call rate to 20 per second", async () => {
    nock(`https://${JAMF_LOCAL_EXECUTION_HOST}`)
      .persist()
      .get("/JSSResource/users")
      .reply(200, JSON.stringify({ users: [] }));

    const client = getClient();
    const start = Date.now();

    await Promise.all([
      client.fetchUsers(),
      client.fetchUsers(),
      client.fetchUsers(),
      client.fetchUsers(),
      client.fetchUsers(),
    ]);

    const finish = Date.now();
    const time = finish - start;

    expect(time).toBeGreaterThanOrEqual(200);
    expect(time).toBeLessThan(300);
  });

  test("fetch admin users and groups", async () => {
    const { nockDone } = await nock.back("admins-groups.json", {
      before: prepareScope,
    });

    const response = await getClient().fetchAccounts();

    nockDone();

    expect(response).not.toEqual([]);
  });

  test("fetch full admin user", async () => {
    const { nockDone } = await nock.back("admin-full.json", {
      before: prepareScope,
    });

    const response = await getClient().fetchAccountUserById(6);

    nockDone();

    expect(response).not.toEqual([]);
  });

  test("fetch full admin group", async () => {
    const { nockDone } = await nock.back("group-full.json", {
      before: prepareScope,
    });

    const response = await getClient().fetchAccountGroupById(3);

    nockDone();

    expect(response).not.toEqual([]);
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

  test("fetch computers", async () => {
    const { nockDone } = await nock.back("computers.json", {
      before: prepareScope,
    });

    const response = await getClient().fetchComputers();

    nockDone();

    expect(response).not.toEqual([]);
  });

  test("fetch computers detail info", async () => {
    const { nockDone } = await nock.back("computer-detail-info.json", {
      before: prepareScope,
    });

    const response = await getClient().fetchComputerById(1);

    nockDone();

    expect(response).not.toEqual([]);
  });

  test("fetch computer application", async () => {
    const { nockDone } = await nock.back("application.json", {
      before: prepareScope,
    });

    const response = await getClient().fetchComputerApplicationByName(
      "Insomnia.app",
    );

    nockDone();

    expect(response).not.toEqual([]);
  });

  test("fetch computer configurations", async () => {
    const { nockDone } = await nock.back("configurations.json", {
      before: prepareScope,
    });

    const response = await getClient().fetchComputerConfigurations();

    nockDone();

    expect(response).not.toEqual([]);
  });

  test("fetch computer configuration detail info", async () => {
    const { nockDone } = await nock.back("configuration-detail.json", {
      before: prepareScope,
    });

    const response = await getClient().fetchComputerConfigurationById(1);

    nockDone();

    expect(response).not.toEqual([]);
  });

  afterAll(() => {
    nock.restore();
  });
});
