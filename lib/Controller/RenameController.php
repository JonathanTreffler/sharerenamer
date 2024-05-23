<?php

namespace OCA\ShareRenamer\Controller;

use OCA\ShareRenamer\AppInfo\Application;

use OCP\Share\IManager;
use OCP\Share\IShare;
use OCP\Share\Exceptions\ShareNotFound;
use OCP\IRequest;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Controller;

class RenameController extends Controller {
	public function __construct(
		private IManager $sharesManager,
		private string $userId,
	) {
		parent::__construct(
			Application::APP_ID,
			\OC::$server->get(IRequest::class),
		);
	}

	/**
     * @param $key
     * @param $value
     *
     * @return JSONResponse
     */
	#[NoAdminRequired]
	public function rename(string $oldToken, string $newToken): JSONResponse {
		if ($oldToken === $newToken) {
			return new JSONResponse([
				"status" => "error",
				"errorMessage" => "The new token must be different than the current one",
			], Http::STATUS_BAD_REQUEST);
		}

		if (strlen($newToken) < 4) {
			return new JSONResponse([
				"status" => "error",
				"errorMessage" => "The new token is invalid",
			], Http::STATUS_BAD_REQUEST);
		}

		$share = $this->sharesManager->getShareByToken($oldToken);

		// only handle link shares (type 3)
		if ($share->getShareType() !== IShare::TYPE_LINK) {
			return new JSONResponse([
				"status" => "error",
				"errorMessage" => "Invalid share",
			], Http::STATUS_BAD_REQUEST);
		}

		// ensure only the person, that created the share can rename it
		if($share->getShareOwner() !== $this->userId) {
			return new JSONResponse([
				"status" => "error",
				"errorMessage" => "You are not authorized to rename this share",
			], Http::STATUS_FORBIDDEN);
		}

		try {
			$this->sharesManager->getShareByToken($newToken);
			// will throw ShareNotFound error at this point if the share does not exist
			$newTokenAlreadyExists = True;
		} catch (ShareNotFound $e) {
			$newTokenAlreadyExists = False;
		}

		if($newTokenAlreadyExists) {
			return new JSONResponse([
				"status" => "error",
				"errorMessage" => "The new token is invalid",
			], Http::STATUS_BAD_REQUEST);
		}

		$share->setToken($newToken);
		$this->sharesManager->updateShare($share);

		return new JSONResponse([
			"status" => "success",
		], Http::STATUS_OK);
	}
}
