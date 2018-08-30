<?php

namespace OCA\ShareRenamer\AppInfo;

use OCP\Util;

$app = new Application();
$c = $app->getContainer();
$appName = $c->query('AppName');

// Hack which only loads the scripts in the Files and Gallery app
$request = $c->query('Request');
if (isset($request->server['REQUEST_URI'])) {
	$url = $request->server['REQUEST_URI'];

	if (preg_match('%apps/files(/.*)?%', $url) || preg_match('%apps/gallery(/.*)?%', $url)) {
		// Add core script only when in Files and Gallery app
		Util::addScript($appName, 'sharerenamer');
	}

	if (preg_match('%apps/files(/.*)?%', $url)) {
		// Add script only when in Files app
		Util::addScript($appName, 'sharerenamerfiles');
	}

	if (preg_match('%apps/gallery(/.*)?%', $url)) {
		// Add script only when in Gallery app
		Util::addScript($appName, 'sharerenamergallery');
	}
}
