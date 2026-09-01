import {Router} from "express";
import {requireAuth} from "../middlewares/auth.middleware";
import {projectController} from "../controllers/project.controller";

const router: Router = Router();

router.use(requireAuth);

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.post('/', projectController.create);
router.put('/', projectController.update);

export default router;
