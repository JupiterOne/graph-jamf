# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Add `version` and `path` properties to the `INSTALLED` relationship between a
  computer and a `macos_app`. This captures the version and path of an
  application installed on a specific computer and allows users to query that
  information as needed.

## 2.0.0 - 2021-03-04

### Changed

- Convert to new SDK

## 1.4.4 - 2021-02-02

- Fixed failure to handle Jamf hosts such as
  `https://jss.myjamf.com:8443/?failover`
