import walletService from '../services/walletService.js';
import ApiResponse from '../utils/ApiResponse.js';

class WalletController {
  async getWallet(req, res, next) {
    try {
      const wallet = await walletService.getWallet(req.user.id);
      res.status(200).json(new ApiResponse(200, { wallet }, 'Wallet retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async addMoneyInitiate(req, res, next) {
    try {
      const { amount } = req.body;
      const order = await walletService.addMoneyInitiate(req.user.id, amount);
      res.status(200).json(new ApiResponse(200, order, 'Razorpay order created for wallet'));
    } catch (error) {
      next(error);
    }
  }

  async addMoneyVerify(req, res, next) {
    try {
      const { amount, razorpayPaymentId } = req.body;
      const wallet = await walletService.addMoneyVerify(req.user.id, amount, razorpayPaymentId);
      res.status(200).json(new ApiResponse(200, { wallet }, 'Money added to wallet successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new WalletController();
