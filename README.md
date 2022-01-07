[![Github All Releases](https://img.shields.io/github/downloads/JonathanTreffler/sharerenamer/total.svg)](https://github.com/JonathanTreffler/sharerenamer/releases)
[![AGPL-3.0](https://img.shields.io/github/license/JonathanTreffler/sharerenamer.svg)](https://github.com/JonathanTreffler/sharerenamer/blob/master/LICENSE)

# ShareRenamer

The app is only compatible up to Nextcloud 17.

A rewrite is currently being worked on to make it compatible with newer versions. A pre release compatible with Nextcloud 22 can be downloaded [here](https://github.com/JonathanTreffler/sharerenamer/files/7216628/sharerenamer.zip).

## A simple app to lets you customize file/folder share links

![](screenshots/sharerenamer.png)

This is an add-in to the Files app, which allows you to customize your share tokens, so your links can be https://mycloud.de/s/mysharedlink instead of https://mycloud.de/s/qPv1SwbU5M2YEoJZ. Just share a file or folder (or click an already shared one) and a new button for renaming the link will appear below the 'Copy URL' button in the menu of the share.

Please be aware that this is a potential security risk: links could be guessed! We discourage using this app on large instances that host sensitive data! We also encourage you to password protect such shared links.

## Requirements
* Nextcloud 9-17 (not compatible to Nextcloud 18+)

## Install
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

## Development
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/JonathanTreffler/sharerenamer/)

It will automatically spin up and configure a full Nextcloud, MariaDB and PhpMyAdmin server.

### Nextcloud Login:
**Username:** dev

**Password:** t2qQ1C6ktYUv7

### PhpMyAdmin Login:
**Username:** nextcloud

**Password:** wdGq73jQB0p373gLdf6yLRj5

### OCC
```bash
docker exec -it -u 33 gitpod_app_1 php occ
```

(It is fine to have these static logins, because gitpod has acess control built in and no sensitive data is stored in these dev servers)

