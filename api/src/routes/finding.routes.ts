import {Router} from "express";
import {requireAuth} from "../middlewares/auth.middleware";
import {findingController} from "../controllers/findingController";

const router: Router = Router();

router.use(requireAuth);

router.get('/', findingController.getAll);
router.post('/', findingController.create);
router.delete('/', findingController.remove);
router.put('/', findingController.update);
router.get('/:id', findingController.getById);
router.post('/:id/rate', findingController.rate);

export default router;
