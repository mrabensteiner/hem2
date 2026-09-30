import {Router} from "express";
import {requireAuth} from "../middlewares/auth.middleware";
import {exportController} from "../controllers/export.controller";

const router: Router = Router();

router.use(requireAuth);

router.get('/projects/json/:id', exportController.projectJson);
router.get('/projects/latex/:id', exportController.projectReportLatex);

export default router;
