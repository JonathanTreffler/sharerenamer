<?php

namespace OCA\ShareRenamer\AppInfo;

use OCP\AppFramework\App;

/**
 * Class Application
 *
 * @package OCA\ShareRenamer\AppInfo
 */
class Application extends App {

	/**
	 * Constructor
	 *
	 * @param array $urlParams
	 */
	public function __construct(array $urlParams = []) {
		parent::__construct('sharerenamer', $urlParams);

		$container = $this->getContainer();
		$server = $container->getServer();
		$eventDispatcher = $server->getEventDispatcher();

		$eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', function () {
			\OCP\Util::addScript('sharerenamer', 'sharerenamer-main');
		});
	}
}
