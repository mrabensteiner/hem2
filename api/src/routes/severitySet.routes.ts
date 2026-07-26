import {Router} from "express";
import {requireAuth} from "../middlewares/auth.middleware";
import {severitySetController} from "../controllers/severitySet.controller";

const router: Router = Router();

router.use(requireAuth);

router.get('/', severitySetController.getAll);
router.post('/', severitySetController.create);
router.delete('/', severitySetController.remove);
router.put('/', severitySetController.update);
router.get('/:id', severitySetController.getById);
router.post('/:id', severitySetController.createSingle);
router.delete('/:id', severitySetController.removeSingle);

export default router;
