<?php

namespace OCA\ShareRenamer\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

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
	public function rename(): DataResponse {
		$oldToken = $this->request->getParam('old_token');
		$newToken = $this->request->getParam('new_token');
		if ($oldToken === null || $newToken === null || $newToken === '') {
			throw new \Exception('Request parameters are missing/incorrect.');
		}

		$result = $this->service->rename($oldToken, $newToken);

		if ($result == "pass") {
			return new DataResponse("", Http::STATUS_OK);
		} else {
			return new DataResponse($result, Http::STATUS_CONFLICT);
		}
	}
}
