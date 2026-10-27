import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { validateBody, registerSchema, loginSchema } from '../validators/schemas.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
