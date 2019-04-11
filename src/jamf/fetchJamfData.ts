import JamfClient, { JamfDataModel, User } from "./JamfClient";

export default async function fetchJamfData(
  client: JamfClient,
): Promise<JamfDataModel> {
  const [users, mobileDevices] = await Promise.all([
    client.fetchUsers(),
    client.fetchMobileDevices(),
  ]);

  const usersFullProfiles: User[] = await Promise.all(
    users.map(user => client.fetchUserById(user.id)),
  );

  return { users: usersFullProfiles, mobileDevices };
}
