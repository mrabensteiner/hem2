import {Router} from "express";
import {heuristicSetController} from "../controllers/heuristicSet.controller";

const router: Router = Router();

router.get('/', heuristicSetController.getAll);
router.post('/', heuristicSetController.create);
router.delete('/', heuristicSetController.remove);
router.put('/', heuristicSetController.update);
router.get('/:id', heuristicSetController.getById);
router.post('/:id', heuristicSetController.createSingle);
router.delete('/:id', heuristicSetController.removeSingle);

export default router;
