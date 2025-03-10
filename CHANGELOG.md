# Changelog


# 3.5.0

This will be the last release of this app as you don't need it anymore after updating to Nextcloud 31 (Hub 10) because the share renaming feature is now integrated natively into the Nextcloud core 🥳.

For more information see [this github issue](https://github.com/JonathanTreffler/sharerenamer/issues/340).

Thank you all for the support over the years 💚 and special thanks to @DecaTec for originally creating the app.

# 3.4.0
### Changed
- refactored entire codebase
  - while I made changes to some parts the app to make it compatible with new Nextcloud versions, the core code of the app had basically not changed since I took over the repo from the previous maintainer, it was time to change that
  - no more interacting with the shares database directy

## 3.3.2
### Changed
- removed composer autoloading (app has no non-dev depencencies anyways)

## 3.3.1
### Changed
- Updated many dependencies

## 3.3.0
### Added
- Support for Nextcloud 29

## 3.2.0
### Added
- Support for Nextcloud 26

## 3.1.0
### Added
- Support for Nextcloud 25

### Changed
- Updates are now compiled, bundled, signed and uploaded to the nextcloud appstore using [krankerl](https://github.com/ChristophWurst/krankerl)

## 3.0.1
### Added
- Support for Nextcloud 24

## 3.0.0
### Added
- Support for Nextcloud 22 - 23

### Changed
- Complete rewrite of the frontend
- There is no button in the share menu to rename the share anymore because the app now has its own tab in the sidebar, where the links can be edited.

### Removed
- Dropped support for Nextcloud 9 - 17

## 2.7.3
### Fixed
- Multiple shared links with the same name could be created when using PostgreSQL.

## 2.7.2
### Added
- Translations

### Fixed
- Warning in Nextcloud log when renaming a link.

## 2.7.1
### Added
- Translations

### Fixed
- When there are more links for one share, the text copied from the clipboard button was not alway correct after renaming a link.

## 2.7.0
### Added
- Nextcloud 17 support
- Translations

## 2.6.1
### Added
- Translations

### Fixed
- A shared link cannot have the same name as a user.

## 2.6.0
### Added
- Nextcloud 16 support
- Translations

## 2.5.1
### Added
- Added hints that using this app can be a potential security risk when links can be guessed easily.
- Translations

## 2.5.0
### Fixed
- The maximum length of a shared link (32 characters) is now also checked in the Gallery app.
- When renaming is cancelled in the Gallery app, possibly shown error messages disappear.

### Added
- Translations

## 2.4.0
### Fixed
- Maximum length of a shared link: 32 characters. An error message will appear when this length is exceeded.

### Added
- Translations

## 2.3.0
### Fixed
- Tool tips are closed when renaming is cancelled.
- Correct translation on tool tip when link name is already used.

### Added
- Support for Nextcloud 15.
- Translations.

## 2.2.0
### Fixed
- After renaming a link, the social sharing links were not updated.

### Added
- Translations.

## 2.1.1
### Added
- New translations.

## 2.1.0
### Added
- Shared links can be renamed in the Gallery app.

## 2.0.1
### Changed
- Required Nextcloud version changed from 14.0 to 14.

### Added
- Translations.

## 2.0.0
### Changed
- Nextcloud 14 compatibility.
- Changed workflow of renaming a link.


## 1.5.0
### Added
- Shared links can be renamed in the Gallery app.

## 1.4.0
### Added
- Localization support.

### Changed
- Link rename button title changed.
- Errors are shown as tooltip.
- When editing a link, the renaming can be performed with Enter. The operation can be cancelled with ESC.
- New app icon.
- Prepared for release in the Nextcloud app store.

### Fixed
- App passes the occ app:check.
