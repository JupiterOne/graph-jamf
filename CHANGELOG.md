# v2.14.6 (Wed Aug 23 2023)

#### 🐛 Bug Fix

- INT-8586: normalize hardware os version [#155](https://github.com/JupiterOne/graph-jamf/pull/155) (michell.ayalagalvan@contractor.jupterone.com [@mishelashala](https://github.com/mishelashala))

#### Authors: 2

- Mich (michell.ayalagalvan@contractor.jupterone.com)
- Michell Ayala ([@mishelashala](https://github.com/mishelashala))

---

# v2.14.5 (Wed Aug 02 2023)

#### 🐛 Bug Fix

- Removed the logs added [#153](https://github.com/JupiterOne/graph-jamf/pull/153) (gonzaloavalosribas@Gonzalos-MacBook-Pro.local)

#### Authors: 1

- Gonzalo Avalos Ribas ([@Gonzalo-Avalos-Ribas](https://github.com/Gonzalo-Avalos-Ribas))

---

# v2.14.4 (Wed Aug 02 2023)

#### 🐛 Bug Fix

- Added wrapper to log the size of entities [#152](https://github.com/JupiterOne/graph-jamf/pull/152) (gonzaloavalosribas@Gonzalos-MacBook-Pro.local)

#### Authors: 1

- Gonzalo Avalos Ribas ([@Gonzalo-Avalos-Ribas](https://github.com/Gonzalo-Avalos-Ribas))

---

# v2.14.3 (Tue Aug 01 2023)

#### 🐛 Bug Fix

- Log sizes of fields of group entity [#151](https://github.com/JupiterOne/graph-jamf/pull/151) (gonzaloavalosribas@Gonzalos-MacBook-Pro.local)

#### Authors: 1

- Gonzalo Avalos Ribas ([@Gonzalo-Avalos-Ribas](https://github.com/Gonzalo-Avalos-Ribas))

---

# v2.14.2 (Thu Jul 27 2023)

#### 🐛 Bug Fix

- Int 8912 jamf upload error -sdk upgrade [#150](https://github.com/JupiterOne/graph-jamf/pull/150) (gonzaloavalosribas@Gonzalos-MacBook-Pro.local)

#### Authors: 1

- Gonzalo Avalos Ribas ([@Gonzalo-Avalos-Ribas](https://github.com/Gonzalo-Avalos-Ribas))

---

# v2.14.1 (Mon Jul 24 2023)

#### 🐛 Bug Fix

- DEVICE-107 -  ensure displayName is provided on all Device entities [#149](https://github.com/JupiterOne/graph-jamf/pull/149) ([@mknoedel](https://github.com/mknoedel))

#### Authors: 1

- Michael Knoedel ([@mknoedel](https://github.com/mknoedel))

---

# v2.14.0 (Wed Jun 28 2023)

#### 🚀 Enhancement

- INT-8568: normalize devices os versions [#148](https://github.com/JupiterOne/graph-jamf/pull/148) (michell.ayalagalvan@contractor.jupterone.com [@mishelashala](https://github.com/mishelashala))

#### Authors: 2

- Mich (michell.ayalagalvan@contractor.jupterone.com)
- Michell Ayala ([@mishelashala](https://github.com/mishelashala))

---

# v2.13.2 (Wed Jun 21 2023)

#### 🐛 Bug Fix

- NOTICKET - Add preversion hook to fix published package [#147](https://github.com/JupiterOne/graph-jamf/pull/147) ([@mknoedel](https://github.com/mknoedel))
- fix auto packaging [#146](https://github.com/JupiterOne/graph-jamf/pull/146) ([@mknoedel](https://github.com/mknoedel))

#### Authors: 1

- Michael Knoedel ([@mknoedel](https://github.com/mknoedel))

---

# v2.13.1 (Tue Jun 20 2023)

#### 🐛 Bug Fix

- Do nothing so CI can republish this project [#145](https://github.com/JupiterOne/graph-jamf/pull/145) ([@mknoedel](https://github.com/mknoedel))

#### Authors: 1

- Michael Knoedel ([@mknoedel](https://github.com/mknoedel))

---

# v2.13.0 (Fri Jun 16 2023)

#### 🚀 Enhancement

- DEVICE-123 - Fetch more detailed mobile device information [#143](https://github.com/JupiterOne/graph-jamf/pull/143) ([@mknoedel](https://github.com/mknoedel))

#### 🐛 Bug Fix

- Update integration-deployment.yml [#142](https://github.com/JupiterOne/graph-jamf/pull/142) ([@Nick-NCSU](https://github.com/Nick-NCSU))

#### Authors: 2

- Michael Knoedel ([@mknoedel](https://github.com/mknoedel))
- Nick Thompson ([@Nick-NCSU](https://github.com/Nick-NCSU))

---

## [2.11.1] - 2023-05-09

### Added

- Added `auto` package to help with builds, versioning and npm packaging

## [2.11.0] - 2023-01-27

### Added

- Integration now ingests `local_account` entities.

The following mapped relationship is **now** created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` | Direction |
| --------------------- | --------------------- | --------------------- | --------- |
| `jamf_local_account`  | **USES**              | `*user_endpoint*`     | REVERSE   |

## [2.10.0] - 2023-01-20

### Changed

- Changed authentication method to support both `Basic Auth` and `Bearer Token`
  depending on the Jamf version in use.

## [2.9.2] - 2023-01-18

### Changed

- Changed `batchSize` from `10` to `5` to limit the number of concurrently
  pending promises made for users requests.

## [2.9.1] - 2023-01-05

## Changed

- Email addresses properties are now set to all lower case on user and device
  entities.

## [2.9.0] - 2022-12-15

### Added

- Added `realName` property to `user_endpoint` entity.

## [2.8.2] - 2022-12-02

### Changed

- Errors should be thrown even if response is lacking details.

## [2.8.1] - 2022-08-01

### Changed

- Updated user query to run concurrently using pMap.

## [2.8.0] - 2022-06-23

### Changed

- now uses `gaxios` as underlying client. Removed `@lifeomic/attempt` and
  `p-queue` dependencies

## [2.7.6] - 2022-06-17

### Changed

- Edit `extensionAttributes` properties of `user_endpoint` entity to only
  include the `Deployment status` property due to entity size concerns

## [2.7.5] - 2022-06-17

### Changed

- Upgrades @lifeomic/attempt

## [2.7.4] - 2022-05-24

### Changed

- enable rawData for computer
- bump sdk to 8.13.10

## [2.7.3] - 2022-05-23

### Changed

- clone source before setting as rawData for osxConfiguration

## [2.7.2] - 2022-05-19

### Changed

- add rawData back for osxConfiguration

## [2.7.1] - 2022-05-02

### Added

- new question in questions.yaml
- `code-ql` and `questions.yml` workflows

## [2.7.0] - 2022-04-18

- re-disable raw data for devices step and sdk bump due to possible regression.

## [2.6.0] - 2022-04-18

### Changed

- re-enable raw data for devices step after bumping to latest sdk
- update plist, url-parse, moment to non-vulnerable versions

## [2.5.0] - 2022-03-28

### Added

- deviceId property to computer and mobile device entities produced by this
  integration
- will allow SentinelOne HostAgents create mapped PROTECTS relationships with
  these entities if they match

## [2.4.0] - 2022-03-24

### Added

- New properties added to entities

  | Entity        | Property | Type      |
  | ------------- | -------- | --------- |
  | `device_user` | `active` | `boolean` |
  | `jamf_user`   | `active` | `boolean` |

### Changed

- Upgrade `@jupiterone/integration-sdk-*` to v[8.6.4]

## [2.3.6] - 2022-01-06

### Fixed

- Updated how firewall properties are being populated.

## [2.3.5] - 2021-12-21

### Fixed

- Do not hard fail when some devices cannot be fetched from the computer details
  API

## [2.3.4] - 2021-12-21

### Fixed

- Remove raw data from `user_endpoint` entities

## [2.3.3] - 2021-12-04

### Fixed

- Preventing duplicate relationships for jamf_computer_group-HAS->user_endpoint.

## [2.3.2] - 2021-12-03

### Added

- Added ingestion of Smart and Static Computer Groups.

## [2.3.1] - 2021-12-01

### Fixed

- Updated support for extension attributes to work with the classic API that
  we're currently using.

## 2.3.0 - 2021-11-10

## Added

- Added support for `extension_attributes` on Entity `user_endpoint` (Computer).
  An extension attribute will appear as a property `extensionAttribute.<id#>`,
  with a value equal to the array of values of the JAMF extension attribute.

## [2.2.3] - 2021-08-31

### Fixed

- Construct proper target entity `_key` for the following relationships:
  - `device_user` **HAS** `mobile_device`
  - `device_user` **HAS** `user_endpoint`

## [2.2.2] - 2021-08-31

### Fixed

- Prevent `user_endpoint` duplicate `_key`
- Prevent `mobile_device` duplicate `_key`

## 2.2.0 - 2021-08-30

### Changed

- Update `_key` for `user_endpoint` to be the serial number of the computer
- Update `_key` for `mobile_device` to be the serial number of the mobile device
- Updated all packages
- Change build to target Node 14.x

## [2.1.3] - 2021-07-08

### Fixed

- Fix `user_endpoint.encrypted` not reflecting state of `boot` partition.

## [2.1.2] - 2021-04-27

### Fixed

- Fixed [#39](https://github.com/JupiterOne/graph-jamf/issues/39) - Prevent
  trying to create duplicate relationships between `jamf_computer` and
  `jamf_osx_configuration_profile`.

## [2.1.1] - 2021-04-20

### Changed

- Upgraded `@jupiterone/integration-sdk-*@6.0.0`, which includes a more
  performant `jobState.findEntity()`.

## 2.1.0 - 2021-03-16

### Changed

- Add `version` and `path` properties to the `INSTALLED` relationship between a
  computer and a `macos_app`. This captures the version and path of an
  application installed on a specific computer and allows users to query that
  information as needed.

## 2.0.3 - 2021-03-11

### Changed

- Added logging to various steps

### Fixed

- Add 60 second timeout to all API requests

## 2.0.2 - 2021-03-11

### Changed

- Make fetching computer details more resilient
- Improve logging around fetching computer details

### Fixed

- Fix Jamf API requests not properly retrying non-200 status codes

## 2.0.1 - 2021-03-10

### Added

- New properties added to resources:
  - Devices
    - `device_user`
      - `name`

### Fixed

- Remove raw data from various entities to drastically reduce upload size

## 2.0.0 - 2021-03-04

### Changed

- Convert to new SDK

## [1.4.4] - 2021-02-02

- Fixed failure to handle Jamf hosts such as
  `https://jss.myjamf.com:8443/?failover`
