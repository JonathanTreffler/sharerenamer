[![Github All Releases](https://img.shields.io/github/downloads/JonathanTreffler/sharerenamer/total.svg)](https://github.com/JonathanTreffler/sharerenamer/releases)
[![AGPL-3.0](https://img.shields.io/github/license/JonathanTreffler/sharerenamer.svg)](https://github.com/JonathanTreffler/sharerenamer/blob/master/LICENSE)
[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)

# ShareRenamer

This Nextcloud app allows you to customize your share tokens, so your links can be like https://your-nextcloud.com/s/mysharedlink instead of https://your-nextcloud.com/s/qPv1SwbU5M2YEoJZ. Just share a file or folder normally and customize the link in the sharerenamer tab in the sidebar.

> [!NOTE]
> You don't need this app anymore after updating to Nextcloud 31 (Hub 10) as the share renaming feature is now integrated natively into the Nextcloud core (you just need to enable it in the admin settings)

## A simple Nextcloud app that lets you customize file/folder share links

![](screenshots/sharerenamer.png)
![](screenshots/sharerenamer2.png)

## Requirements
* Nextcloud 29 or 30

## Installation
### Nextcloud app store (*recommended*)
Just install the app from the [Nextcloud app store](https://apps.nextcloud.com/apps/sharerenamer). It can be found under the 'tools' category.

### Manual installation
* Download the latest version from the [release page](https://github.com/JonathanTreffler/sharerenamer/releases).
* Extract the archive to your Nextcloud's app folder, e.g. `tar xvf sharerenamer-x.x.x.tar.gz -C /path/to/nextcloud/apps`
* Enable the app in the Apps section of your Nextcloud.

### Install from git
* Simply clone the repo to your apps folder and build the frontend:
```
cd /path/to/nextcloud/apps/
git clone https://github.com/JonathanTreffler/sharerenamer.git
cd sharerenamer/
make composer
make npm-init
make build-js-production
```
* Enable the app in the Apps section of your Nextcloud.

## Security
- Share Tokens can currently not be set to the same string as any registered username, so do not use this app if users are not supposed to be able to find out any other registered usernames.
- Links could be guessed! We discourage using this app on large instances that host sensitive data! We also encourage you to password protect such shared links.

## Known Issues:
- Changes to the link shares only show up in the Sharerenamer Tab after the sidebar has been closed and opened again
- The copy button of the Shares tab only copies the new link after the sidebar has been closed and opened again

(please don't create issue for these)

## Creating a new Release

Steps:
1. Place appstore private key at $HOME/.nextcloud/certificates/sharerenamer.key
1. `krankerl login --appstore <appstore api key>`
1. Bump app version using `krankerl version (major|minor|patch)`
1. Add app update information to CHANGELOG.md
1. Commit app version bump (`git commit -m "Bumped app version to <version>"`)
1. Push commit to Github (`git push`)
1. `krankerl package`
1. `krankerl sign --package`
1. Create a new Github release and attach the build/artifacts/sharerenamer.tar.gz file
1. `krankerl publish <github release attached file public url>`
