<?php
namespace OCA\ShareRenamer\Db;

use \OCP\IDBConnection;
use \OCP\AppFramework\Db\Mapper;

class ShareRenamerMapper extends Mapper {

	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'share', '\OCA\ShareRenamer\Db\ShareRenamer');
	}

	public function trytokeninsert($oldtoken, $newtoken) {
		// check if new token already exists
		$sql = 'SELECT COUNT(*) AS n FROM *PREFIX*share WHERE token = ?';
		$sql = $this->db->prepare($sql);
		$sql->bindParam(1, $newtoken, \PDO::PARAM_STR);
		$sql->execute();
		$row = $sql->fetch();
		$sql->closeCursor();
		$alreadyexists = $row['n']; // returns 0 or 1

		if ($alreadyexists === '1') {
			return 'exists';
		}

		// now change token in database
		$sql2 = 'UPDATE *PREFIX*share SET token = ? WHERE token = ?';
		$sql2 = $this->db->prepare($sql2);
		$sql2->bindParam(1, $newtoken, \PDO::PARAM_STR);
		$sql2->bindParam(2, $oldtoken, \PDO::PARAM_STR);
		$sql2->execute();

		return 'pass';
	}
}
