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

	private function handleException(\Exception $e): void {
		if ($e instanceof DoesNotExistException ||
			$e instanceof MultipleObjectsReturnedException) {
			throw new NotFoundException($e->getMessage());
		} else {
			throw $e;
		}
	}

	public function rename(string $oldtoken, string $newtoken): string {
		return $this->mapper->trytokeninsert($oldtoken, $newtoken);
	}
}
