import express from 'express';
import authController from '../controllers/authController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', verifyJWT, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.get('/me', verifyJWT, authController.getMe);

export default router;
