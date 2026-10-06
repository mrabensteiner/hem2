import {Router} from "express";
import {requireAuth} from "../middlewares/auth.middleware";
import {imageController} from "../controllers/image.controller";
import multer from "multer";

const router: Router = Router();
const upload = multer({storage: multer.memoryStorage()});

router.use(requireAuth);

router.post('/user/:id', upload.array("image"), imageController.uploadUserImage);
router.post('/project/:id', upload.array("image"), imageController.uploadProjectImage);
router.post('/finding/:pid/:id', upload.array("image"), imageController.uploadFindingImages);

export default router;
