<?php

namespace OCA\ShareRenamer\Controller;

use OCP\IRequest;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;

use OCA\ShareRenamer\Service\SharerenamerService;

class RenameController extends Controller {
	private $service;
	private $userId;

	use Errors;

	public function __construct($AppName, IRequest $request,
								SharerenamerService $service, $UserId) {
		parent::__construct($AppName, $request);
		$this->service = $service;
		$this->userId = $UserId;
	}

	/**
	 * @NoAdminRequired
	 */
	public function rename(): DataResponse  {
		$oldToken = $this->request->getParam('old_token');
		$newToken = $this->request->getParam('new_token');
		if ($oldToken === null || $newToken === null || $newToken === '') {
			throw new \Exception('Request parameters are missing/incorrect.');
		}
		return $this->service->rename($_POST['old_token'], $_POST['new_token']);
	}
}
