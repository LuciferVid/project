import express from 'express';
import paymentController from '../controllers/paymentController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verifyJWT);

// Customer endpoints
router.get('/', requireRole('customer'), paymentController.getMyPayments);
router.get('/:id', paymentController.getPayment); // Access controlled inside controller for Customer/Admin

// Admin endpoints
router.get('/admin/all', requireRole('admin'), paymentController.getAllPayments);
router.post('/admin/:id/refund', requireRole('admin'), paymentController.processRefund);

export default router;
