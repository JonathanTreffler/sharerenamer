<?php
namespace OCA\ShareRenamer\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\ShareRenamer\Service\SharerenamerService;

class RenameController extends Controller {

    private $service;
    private $userId;

    use Errors;

    public function __construct($AppName, IRequest $request,
                                SharerenamerService $service, $UserId){
        parent::__construct($AppName, $request);
        $this->service = $service;
        $this->userId = $UserId;
    }

    /**
     * @NoAdminRequired
     *
     * @param string $title
     * @param string $content
     */
    public function rename() {
        return $this->service->rename($_POST['old_token'], $_POST['new_token']);
    }

}
