import express from 'express';
import reviewController from '../controllers/reviewController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', reviewController.getProductReviews);

router.use(verifyJWT); // Customer can post/edit their own, Admin can delete

router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview); // Controller checks if Owner or Admin

export default router;
