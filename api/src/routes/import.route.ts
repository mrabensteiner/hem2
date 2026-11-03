import {Router} from "express";
import multer from "multer";
import {requireAuth} from "../middlewares/auth.middleware";
import {importController} from "../controllers/import.controller";

const router: Router = Router();
const upload = multer({storage: multer.memoryStorage()});

router.use(requireAuth);

router.post('/projects/json', upload.array("file"), importController.projectJson);

export default router;
