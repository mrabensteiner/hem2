import {Router} from "express";
import {userController} from "../controllers/user.controller";
import {requireAuth} from "../middlewares/auth.middleware";

const router: Router = Router();

//router.use(requireAuth);

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/', userController.update);

export default router;
