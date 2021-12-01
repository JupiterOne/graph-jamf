# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Updated support for extension attributes to work with the classic API that
  we're currently using.

## 2.3.0 - 2021-11-10

## Added

- Added support for `extension_attributes` on Entity `user_endpoint` (Computer).
  An extension attribute will appear as a property `extensionAttribute.<id#>`,
  with a value equal to the array of values of the JAMF extension attribute.

## 2.2.3 - 2021-08-31

### Fixed

- Construct proper target entity `_key` for the following relationships:
  - `device_user` **HAS** `mobile_device`
  - `device_user` **HAS** `user_endpoint`

## 2.2.2 - 2021-08-31

### Fixed

- Prevent `user_endpoint` duplicate `_key`
- Prevent `mobile_device` duplicate `_key`

## 2.2.0 - 2021-08-30

### Changed

- Update `_key` for `user_endpoint` to be the serial number of the computer
- Update `_key` for `mobile_device` to be the serial number of the mobile device
- Updated all packages
- Change build to target Node 14.x

## 2.1.3 - 2021-07-08

### Fixed

- Fix `user_endpoint.encrypted` not reflecting state of `boot` partition.

## 2.1.2 - 2021-04-27

### Fixed

- Fixed [#39](https://github.com/JupiterOne/graph-jamf/issues/39) - Prevent
  trying to create duplicate relationships between `jamf_computer` and
  `jamf_osx_configuration_profile`.

## 2.1.1 - 2021-04-20

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

## 1.4.4 - 2021-02-02

- Fixed failure to handle Jamf hosts such as
  `https://jss.myjamf.com:8443/?failover`
