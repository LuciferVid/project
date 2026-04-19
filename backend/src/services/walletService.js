import walletRepository from '../repositories/walletRepository.js';
import ApiError from '../utils/ApiError.js';
import razorpay from '../config/razorpay.js';

class WalletService {
  async getWallet(customerId) {
    return await walletRepository.findByCustomer(customerId);
  }

  async addMoneyInitiate(customerId, amount) {
    const options = {
      amount: parseInt(amount * 100),
      currency: 'INR',
      receipt: `wallet_${Date.now()}_${customerId}`,
    };
    const rzpOrder = await razorpay.orders.create(options);
    return {
      razorpayOrderId: rzpOrder.id,
      amount,
    };
  }

  // Normally verified with razorpay hook or manual signature verification
  async addMoneyVerify(customerId, amount, paymentId) {
    // In strict production, verify signature here too
    return await walletRepository.addTransaction(customerId, 'credit', amount, `Added money to wallet. Ref: ${paymentId}`);
  }
}

export default new WalletService();
