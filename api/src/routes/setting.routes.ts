import {Router} from "express";
import {settingController} from "../controllers/setting.controller";

const router: Router = Router();

router.get('/', settingController.getAll);
router.post('/', settingController.create);
router.delete('/', settingController.remove);
router.put('/', settingController.updateMany);

export default router;
