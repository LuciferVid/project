import express from 'express';
import productController from '../controllers/productController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { productSchema } from '../validators/productValidator.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);
router.get('/slug/:slug', productController.getProductBySlug);

// Vendor protected routes
router.use(verifyJWT, requireRole('vendor'));
router.get('/vendor/my-products', productController.getVendorProducts);
router.post('/', validate(productSchema), productController.createProduct);
router.put('/:id', validate(productSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Image uploading
router.post('/:id/images', upload.array('images', 5), productController.uploadImages);
router.delete('/:id/images/:imgIndex', productController.removeImage);

export default router;
