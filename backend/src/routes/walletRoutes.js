import express from 'express';
import walletController from '../controllers/walletController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verifyJWT, requireRole('customer'));

router.get('/', walletController.getWallet);
router.post('/add-money/initiate', walletController.addMoneyInitiate);
router.post('/add-money/verify', walletController.addMoneyVerify);

export default router;
