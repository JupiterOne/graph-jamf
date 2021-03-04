# Integration with JupiterOne

JupiterOne provides a managed integration with jamf. The integration connects
directly to jamf APIs to obtain account metadata and analyze resource
relationships. Customers authorize access by Basic Authentication with their
target jamf account and providing that credential to JupiterOne.

## Support

If you need help with this integration, please contact
[JupiterOne Support](https://support.jupiterone.io).

## Integration Walkthrough

### Install

Jamf provides [detailed instructions on creating credentials][1].

# How to Uninstall

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **{{Jamf}}** integration tile and click it.
3. Identify and click the **integration to delete**.
4. Click the **trash can** icon.
5. Click the **Remove** button to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/master/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources                   | Entity `_type`                   | Entity `_class`  |
| --------------------------- | -------------------------------- | ---------------- |
| Account                     | `jamf_account`                   | `Account`        |
| Admin                       | `jamf_user`                      | `User`           |
| Computer                    | `user_endpoint`                  | `Host`, `Device` |
| Group                       | `jamf_group`                     | `UserGroup`      |
| Mobile Device               | `mobile_device`                  | `Device`         |
| User                        | `device_user`                    | `User`           |
| macOS Configuration Profile | `jamf_osx_configuration_profile` | `Configuration`  |

### Relationships

The following relationships are created/mapped:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type`            |
| --------------------- | --------------------- | -------------------------------- |
| `device_user`         | **HAS**               | `mobile_device`                  |
| `device_user`         | **HAS**               | `user_endpoint`                  |
| `jamf_account`        | **HAS**               | `device_user`                    |
| `jamf_account`        | **HAS**               | `jamf_group`                     |
| `jamf_account`        | **HAS**               | `mobile_device`                  |
| `jamf_account`        | **HAS**               | `jamf_osx_configuration_profile` |
| `jamf_account`        | **HAS**               | `jamf_user`                      |
| `jamf_account`        | **HAS**               | `user_endpoint`                  |
| `jamf_group`          | **HAS**               | `jamf_user`                      |
| `user_endpoint`       | **INSTALLED**         | `macos_app`                      |
| `user_endpoint`       | **USES**              | `jamf_osx_configuration_profile` |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->

[1]: https://developer.jamf.com/documentation#authentication
