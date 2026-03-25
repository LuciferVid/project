import express from 'express';
import orderController from '../controllers/orderController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verifyJWT);

// Customer Routes
router.post('/checkout', requireRole('customer'), orderController.checkout);
router.post('/checkout/verify', requireRole('customer'), orderController.verifyPaymentAndCreateOrder);
router.get('/me', requireRole('customer'), orderController.getMyOrders);
router.post('/:id/cancel', requireRole('customer'), orderController.cancelOrder);

// Vendor Routes
router.get('/vendor', requireRole('vendor'), orderController.getVendorOrders);
router.patch('/vendor/:id/items/:itemId', requireRole('vendor'), orderController.updateItemStatus);

// Admin Routes
router.get('/admin', requireRole('admin'), orderController.getAllOrders);
router.patch('/admin/:id/status', requireRole('admin'), orderController.overrideStatus);

// Shared Route (access restricted in controller)
router.get('/:id', orderController.getOrder);

export default router;
