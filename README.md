[![Github All Releases](https://img.shields.io/github/downloads/JonathanTreffler/sharerenamer/total.svg)](https://github.com/JonathanTreffler/sharerenamer/releases)
[![AGPL-3.0](https://img.shields.io/github/license/JonathanTreffler/sharerenamer.svg)](https://github.com/JonathanTreffler/sharerenamer/blob/master/LICENSE)

# ShareRenamer

The app is only compatible up to Nextcloud 17.

A rewrite is currently being worked on to make it compatible with newer versions.

## A simple share link renamer add-in for the Files app in Nextcloud

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
* Simply clone the repo to your apps folder:
```
cd /path/to/nextcloud/apps/
git clone https://github.com/JonathanTreffler/sharerenamer.git
```
* Enable the app in the Apps section of your Nextcloud.
