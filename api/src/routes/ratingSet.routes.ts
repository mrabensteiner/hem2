import {Router} from "express";
import {requireAuth} from "../middlewares/auth.middleware";
import {ratingSetController} from "../controllers/ratingSetController";

const router: Router = Router();

router.use(requireAuth);

router.get('/', ratingSetController.getAll);
router.post('/', ratingSetController.create);
router.delete('/', ratingSetController.remove);
router.put('/', ratingSetController.update);
router.get('/:id', ratingSetController.getById);
router.post('/:id', ratingSetController.createSingle);
router.delete('/:id', ratingSetController.removeSingle);

export default router;
