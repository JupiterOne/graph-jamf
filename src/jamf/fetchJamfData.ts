import { JamfDataModel, User } from "../types";
import JamfClient from "./JamfClient";

export default async function fetchJamfData(
  client: JamfClient,
): Promise<JamfDataModel> {
  const [users, mobileDevices, computers] = await Promise.all([
    client.fetchUsers(),
    client.fetchMobileDevices(),
    client.fetchComputers(),
    client.fetchAccounts(),
  ]);

  const usersFullProfiles: User[] = await Promise.all(
    users.map(user => client.fetchUserById(user.id)),
  );

  await client.fetchAccountUserById(6);
  await client.fetchAccountGroupById(1);

  return { users: usersFullProfiles, mobileDevices, computers };
}
