import {Router} from "express";
import {projectController} from "../controllers/project.controller";

const router: Router = Router();

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.post('/', projectController.create);
router.put('/', projectController.update);

export default router;
