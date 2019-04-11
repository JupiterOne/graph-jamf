import JamfClient, { JamfDataModel } from "./JamfClient";

export default async function fetchJamfData(
  client: JamfClient,
): Promise<JamfDataModel> {
  const [users] = await Promise.all([client.fetchUsers()]);

  return { users };
}
