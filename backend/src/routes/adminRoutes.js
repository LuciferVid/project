import express from 'express';
import adminController from '../controllers/adminController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verifyJWT, requireRole('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/toggle', adminController.toggleUser);

router.get('/vendors', adminController.getVendors);
router.patch('/vendors/:id/approve', adminController.approveVendor);
router.patch('/vendors/:id/reject', adminController.rejectVendor);

// For admin orders and categories, those logic are handled via orderRoutes and categoryRoutes mounted with admin roles.

export default router;
