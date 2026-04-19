import express from 'express';
import vendorController from '../controllers/vendorController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verifyJWT, requireRole('vendor'));

router.get('/profile', vendorController.getProfile);
router.put('/profile', vendorController.updateProfile);
router.get('/analytics', vendorController.getAnalytics);

export default router;
