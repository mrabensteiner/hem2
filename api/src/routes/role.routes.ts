import {Router} from "express";
import {roleController} from "../controllers/role.controller";

const router: Router = Router();

router.get('/', roleController.getAll);
router.post('/', roleController.create);
router.delete('/', roleController.remove);
router.put('/', roleController.updateMany);

export default router;
