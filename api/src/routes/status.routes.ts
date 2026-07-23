import {Router} from "express";
import {statusController} from "../controllers/status.controller";

const router: Router = Router();

router.get('/', statusController.getAll);
router.post('/', statusController.create);
router.delete('/', statusController.remove);
router.put('/', statusController.updateMany);

export default router;
