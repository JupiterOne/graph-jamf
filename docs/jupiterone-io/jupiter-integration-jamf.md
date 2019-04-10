# jamf

## Overview

JupiterOne provides a managed integration with jamf. The integration connects
directly to jamf APIs to obtain account metadata and analyze resource
relationships. Customers authorize access by ... in their target jamf account
and providing that credential to JupiterOne.

## Integration Instance Configuration

The integration is triggered by an event containing the information for a
specific integration instance.

jamf provides [detailed instructions on creating credentials][1].

## Entities

The following entity resources are ingested when the integration runs:

| Example Entity Resource | \_type : \_class of the Entity        |
| ----------------------- | ------------------------------------- |
| Account                 | `example_account` : `Account`         |
| Application             | `example_application` : `Application` |

## Relationships

The following relationships are created/mapped:

| From              | Type    | To                    |
| ----------------- | ------- | --------------------- |
| `example_account` | **HAS** | `example_application` |

[1]: https://www.jamf.com
