import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', categoryController.getAllCategories);

// Admin only routes
router.use(verifyJWT, requireRole('admin'));
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deactivateCategory);

export default router;
