<?php

namespace OCA\ShareRenamer\AppInfo;

use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;

use OCA\ShareRenamer\Listener\LoadAdditionalScriptsListener;

class Application extends App implements IBootstrap {
	public const APP_ID = 'sharerenamer';

	public function __construct(array $urlParams = array()) {
		parent::__construct(self::APP_ID, $urlParams);
	}

    public function register(IRegistrationContext $context): void {
		require_once __DIR__ . '/../../vendor/autoload.php';

        $context->registerEventListener(LoadAdditionalScriptsEvent::class, LoadAdditionalScriptsListener::class);
    }

    public function boot(IBootContext $context): void {

    }
}