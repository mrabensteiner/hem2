import {Router} from 'express';
import {authController} from '../controllers/auth.controller';
import {requireAuth} from "../middlewares/auth.middleware";

const router: Router = Router();

router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getUser);

export default router;
