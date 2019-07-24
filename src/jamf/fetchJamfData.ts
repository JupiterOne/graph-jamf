import { Admin, Group, User } from "../types";
import JamfClient from "./JamfClient";
import { JamfDataModel } from "./types";

export default async function fetchJamfData(
  client: JamfClient,
): Promise<JamfDataModel> {
  const [users, mobileDevices, computers, accounts] = await Promise.all([
    client.fetchUsers(),
    client.fetchMobileDevices(),
    client.fetchComputers(),
    client.fetchAccounts(),
  ]);

  const usersFullProfiles: User[] = await Promise.all(
    users.map(user => client.fetchUserById(user.id)),
  );

  const adminsFullProfiles: Admin[] = await Promise.all(
    accounts.users.map(admin => client.fetchAccountUserById(admin.id)),
  );

  const groupsFullProfiles: Group[] = await Promise.all(
    accounts.groups.map(group => client.fetchAccountGroupById(group.id)),
  );

  const computerDetails = await Promise.all(
    computers.map(item => client.fetchComputerById(item.id)),
  );

  const osxConfigurations = await client.fetchOSXConfigurationProfiles();

  const osxConfigurationDetails = await Promise.all(
    osxConfigurations.map(item =>
      client.fetchOSXConfigurationProfileById(item.id),
    ),
  );

  return {
    users: usersFullProfiles,
    mobileDevices,
    computers,
    computerDetails,
    osxConfigurationDetails,
    admins: adminsFullProfiles,
    groups: groupsFullProfiles,
  };
}
