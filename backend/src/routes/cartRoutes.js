import express from 'express';
import cartController from '../controllers/cartController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verifyJWT, requireRole('customer'));

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:productId', cartController.updateItem);
router.delete('/items/:productId', cartController.removeItem);
router.delete('/', cartController.clearCart);

router.post('/coupon', cartController.applyCoupon);
router.delete('/coupon', cartController.removeCoupon);

export default router;
