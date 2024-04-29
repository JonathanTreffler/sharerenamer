<?php

declare(strict_types=1);

namespace OCA\ShareRenamer\Listener;

use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

use OCA\ShareRenamer\AppInfo\Application;

class LoadAdditionalScriptsListener implements IEventListener {
	public function __construct() {}

	public function handle(Event $event): void {
		if (!($event instanceof LoadAdditionalScriptsEvent)) {
			return;
		}

		Util::addScript(Application::APP_ID, 'sharerenamer-main', 'files');
	}
}