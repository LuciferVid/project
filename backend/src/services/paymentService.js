import paymentRepository from '../repositories/paymentRepository.js';
import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';
import { PaymentFactory } from '../factories/PaymentFactory.js';
import orderRepository from '../repositories/orderRepository.js';

class PaymentService {
  async getPayment(id) {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw new ApiError(404, 'Payment not found');
    return payment;
  }

  async getCustomerPayments(customerId) {
    return await paymentRepository.findByCustomer(customerId);
  }

  async getAllPayments() {
    return await paymentRepository.findAll();
  }

  async verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, signature) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      throw new ApiError(400, 'Invalid payment signature');
    }
    return true;
  }

  async refundPayment(paymentId) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) throw new ApiError(404, 'Payment not found');
    if (payment.status !== 'completed') throw new ApiError(400, 'Only completed payments can be refunded');

    const paymentStrategy = PaymentFactory.create(payment.method);
    await paymentStrategy.refund(payment);
    
    // Update order status if completely refunded, depending on business logic
    await orderRepository.updateStatus(payment.order, 'refunded');
    
    return await paymentRepository.updateStatus(paymentId, 'refunded');
  }
}

export default new PaymentService();
