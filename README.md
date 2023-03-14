# JupiterOne Integration

Learn about the data ingested, benefits of this integration, and how to use it
with JupiterOne in the [integration documentation](docs/jupiterone.md).

## Development

### Prerequisites

1. Install [Node.js](https://nodejs.org/) using the
   [installer](https://nodejs.org/en/download/) or a version manager such as
   [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm).
2. Install [`yarn`](https://yarnpkg.com/getting-started/install) or
   [`npm`](https://github.com/npm/cli#installation) to install dependencies.
3. Install dependencies with `yarn install`.
4. Register an account in the system this integration targets for ingestion and
   obtain API credentials.
5. `cp .env.example .env` and add necessary values for runtime configuration.

   When an integration executes, it needs API credentials and any other
   configuration parameters necessary for its work (provider API credentials,
   data ingestion parameters, etc.). The names of these parameters are defined
   by the `IntegrationInstanceConfigFieldMap`in `src/config.ts`. When the
   integration is executed outside the JupiterOne managed environment (local
   development or on-prem), values for these parameters are read from Node's
   `process.env` by converting config field names to constant case. For example,
   `clientId` is read from `process.env.CLIENT_ID`.

   The `.env` file is loaded into `process.env` before the integration code is
   executed. This file is not required should you configure the environment
   another way. `.gitignore` is configured to to avoid commiting the `.env`
   file.

### Running the integration

1. `yarn start` to collect data
2. `yarn graph` to show a visualization of the collected data
3. `yarn j1-integration -h` for additional commands

### How to add a new developer to the JupiterOne Jamf Integration Development directory

In order to add a new user you need to:

1. Login to your `jamf` pro account
2. Click the `gear` settings icon
3. Click `User accounts and groups`
4. Click `+ New` on the top right section
5. Click `Next` on the bottom right section
6. Fill new user data
   - Enter `username`
   - Set `Privilege Set` to administrator
   - Enter full name
   - Enter email address
   - Enter Password
   - Confirm Password
   - Check `Force user to change password at next login`
7. Click `Save`

![Instructions](/images/add-account.gif)

> Note: Jamf doesn't send an invitation email when a new user is added. We have
> to manually share the `jamf` pro url.

When user log-ins for the first time `jamf` will notify them their password has
expired and they need to set a new password.

![First Login](/images/first-login.gif)

### Making Contributions

Start by taking a look at the source code. The integration is basically a set of
functions called steps, each of which ingests a collection of resources and
relationships. The goal is to limit each step to as few resource types as
possible so that should the ingestion of one type of data fail, it does not
necessarily prevent the ingestion of other, unrelated data. That should be
enough information to allow you to get started coding!

See the
[SDK development documentation](https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md)
for a deep dive into the mechanics of how integrations work.

See [docs/development.md](docs/development.md) for any additional details about
developing this integration.

### Changelog

The history of this integration's development can be viewed at
[CHANGELOG.md](CHANGELOG.md).
