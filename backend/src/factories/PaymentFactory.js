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
    return await walletRepository.addTransaction(payment.customer, 'credit', payment.amount, `Refund for COD Order ${payment.order}`);
  }
}

class RazorpayPayment extends IPaymentStrategy {
  async process(orderAmount, customerId, orderId) {
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

class MockRazorpayPayment extends IPaymentStrategy {
  async process(orderAmount, customerId, orderId) {
    console.warn('⚠️ MOCK RAZORPAY: Simulating payment creation since keys are missing.');
    return {
      status: 'completed', // For mock, we complete it immediately or mark as pending-mock
      method: 'RAZORPAY',
      razorpayOrderId: `mock_order_${Date.now()}`,
      transactionRef: `mock_txn_${Date.now()}`,
      paidAt: new Date()
    };
  }

  async refund(payment) {
    console.warn('⚠️ MOCK RAZORPAY: Simulating refund.');
    return { status: 'refunded', amount: payment.amount };
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
    const isRazorpayConfigured = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'undefined';
    
    const strategies = {
      'COD': new CODPayment(),
      'RAZORPAY': isRazorpayConfigured ? new RazorpayPayment() : new MockRazorpayPayment(),
      'WALLET': new WalletPayment(),
    };
    if (!strategies[method]) throw new ApiError(400, `Unknown payment method: ${method}`);
    return strategies[method];
  }
}

