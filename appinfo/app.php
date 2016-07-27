<?php

namespace OCA\ShareRenamer\AppInfo;

use OCP\Util;

$app = new Application();
$c = $app->getContainer();
$appName = $c->query('AppName');

// Hack which only loads the scripts in the Files app
$request = $c->query('Request');
if (isset($request->server['REQUEST_URI'])) {
	$url = $request->server['REQUEST_URI'];
	if (preg_match('%apps/files(/.*)?%', $url)) {
		Util::addScript($appName, 'sharerenamer');
		Util::addStyle($appName, 'sharerenamer');
	}
}
