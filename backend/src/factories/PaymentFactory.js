import ApiError from '../utils/ApiError.js';
import razorpay from '../config/razorpay.js';
import walletRepository from '../repositories/walletRepository.js';

class IPaymentStrategy {
  async process(orderAmount, customerId, orderId) { throw new Error('Not implemented'); }
  async refund(payment) { throw new Error('Not implemented'); }
}

class CODPayment extends IPaymentStrategy {
  async process(orderAmount, customerId, orderId) {
    return {
      status: 'pending',
      method: 'COD',
      transactionRef: `COD-${Date.now()}`
    };
  }
  
  async refund(payment) {
    // If COD was paid and needs refund, add to wallet
    return await walletRepository.addTransaction(payment.customer, 'credit', payment.amount, `Refund for COD Order ${payment.order}`);
  }
}

class RazorpayPayment extends IPaymentStrategy {
  async process(orderAmount, customerId, orderId) {
    // Razorpay amount is in paise
    const options = {
      amount: parseInt(orderAmount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${customerId}`,
    };
    
    const rzpOrder = await razorpay.orders.create(options);
    
    return {
      status: 'pending',
      method: 'RAZORPAY',
      razorpayOrderId: rzpOrder.id
    };
  }

  async refund(payment) {
    if (!payment.razorpayPaymentId) throw new ApiError(400, 'No Razorpay payment ID found');
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: parseInt(payment.amount * 100),
      notes: { reason: `Refund for order ${payment.order}` }
    });
    return refund;
  }
}

class WalletPayment extends IPaymentStrategy {
  async process(orderAmount, customerId, orderId) {
    const wallet = await walletRepository.findByCustomer(customerId);
    if (wallet.balance < orderAmount) {
      throw new ApiError(400, 'Insufficient wallet balance');
    }
    
    await walletRepository.addTransaction(customerId, 'debit', orderAmount, `Payment for Order (Pending Assignment)`);
    
    return {
      status: 'completed',
      method: 'WALLET',
      transactionRef: `WAL-${Date.now()}`,
      paidAt: new Date()
    };
  }

  async refund(payment) {
    return await walletRepository.addTransaction(payment.customer, 'credit', payment.amount, `Refund for Wallet Order ${payment.order}`);
  }
}

export class PaymentFactory {
  static create(method) {
    const strategies = {
      'COD': new CODPayment(),
      'RAZORPAY': new RazorpayPayment(),
      'WALLET': new WalletPayment(),
    };
    if (!strategies[method]) throw new ApiError(400, `Unknown payment method: ${method}`);
    return strategies[method];
  }
}
