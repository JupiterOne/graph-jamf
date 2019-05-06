import { JamfDataModel, User } from "../types";
import JamfClient from "./JamfClient";

export default async function fetchJamfData(
  client: JamfClient,
): Promise<JamfDataModel> {
  const [users, mobileDevices, computers] = await Promise.all([
    client.fetchUsers(),
    client.fetchMobileDevices(),
    client.fetchComputers(),
  ]);

  const usersFullProfiles: User[] = await Promise.all(
    users.map(user => client.fetchUserById(user.id)),
  );

  return { users: usersFullProfiles, mobileDevices, computers };
}
