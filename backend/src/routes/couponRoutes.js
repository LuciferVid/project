import express from 'express';
import couponController from '../controllers/couponController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/validate', verifyJWT, requireRole('customer'), couponController.validate);

router.use(verifyJWT, requireRole('admin'));
router.get('/admin', couponController.getAllCoupons);
router.post('/admin', couponController.createCoupon);
router.put('/admin/:id', couponController.updateCoupon);
router.delete('/admin/:id', couponController.deleteCoupon);

export default router;
