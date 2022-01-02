<?php

namespace OCA\ShareRenamer\Service;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\ShareRenamer\Db\SharerenamerMapper;

class SharerenamerService {
	private $mapper;

	public function __construct(SharerenamerMapper $mapper) {
		$this->mapper = $mapper;
	}

	private function handleException($e) {
		if ($e instanceof DoesNotExistException ||
			$e instanceof MultipleObjectsReturnedException) {
			throw new NotFoundException($e->getMessage());
		} else {
			throw $e;
		}
	}

	public function rename($oldtoken, $newtoken) {
		return $this->mapper->trytokeninsert($oldtoken, $newtoken);
	}
}
