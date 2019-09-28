<?php
namespace OCA\ShareRenamer\Db;

use \OCP\IDBConnection;
use \OCP\AppFramework\Db\Mapper;

class ShareRenamerMapper extends Mapper {

	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'share', '\OCA\ShareRenamer\Db\ShareRenamer');
	}

	public function trytokeninsert($oldtoken, $newtoken) {
		// Check if new token already exists
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

		// Check if the share has the same name as a user
		$sql2 = 'SELECT COUNT(*) AS n FROM *PREFIX*users WHERE LOWER(uid) = ?';
		$sql2 = $this->db->prepare($sql2);
		$toLower = strtolower($newtoken);
		$sql2->bindParam(1, $toLower, \PDO::PARAM_STR);
		$sql2->execute();
		$row2 = $sql2->fetch();
		$sql2->closeCursor();
		$shareIsUserName = $row2['n']; // returns 0 or 1

		if ($shareIsUserName === '1') {
			return 'userexists';
		}

		// Now change token in database
		$sql3 = 'UPDATE *PREFIX*share SET token = ? WHERE token = ?';
		$sql3 = $this->db->prepare($sql3);
		$sql3->bindParam(1, $newtoken, \PDO::PARAM_STR);
		$sql3->bindParam(2, $oldtoken, \PDO::PARAM_STR);
		$sql3->execute();

		return 'pass';
	}
}
