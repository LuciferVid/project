import orderRepository from '../repositories/orderRepository.js';
import cartRepository from '../repositories/cartRepository.js';
import paymentRepository from '../repositories/paymentRepository.js';
import paymentService from './paymentService.js';
import { PaymentFactory } from '../factories/PaymentFactory.js';
import { NotificationFactory } from '../factories/NotificationFactory.js';
import ApiError from '../utils/ApiError.js';
import userRepository from '../repositories/userRepository.js';

class OrderService {
  async checkoutInitiate(customerId, shippingAddress, paymentMethod) {
    const cart = await cartRepository.findByCustomer(customerId);
    if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

    let subtotal = 0;
    const orderItems = [];

    // Verify stock and prepare items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for product ${item.product.name}`);
      }
      const itemPrice = item.priceAtTime * item.quantity;
      subtotal += itemPrice;
      
      orderItems.push({
        product: item.product._id,
        vendor: item.product.vendor,
        quantity: item.quantity,
        priceAtTime: item.priceAtTime,
        itemStatus: 'placed'
      });
    }

    let discount = 0;
    if (cart.couponApplied) {
      // Assuming valid, recalculate discount
      const coupon = cart.couponApplied;
      if (coupon.discountType === 'percentage') {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
      } else {
        discount = coupon.discountValue;
      }
    }

    const deliveryFee = subtotal > 500 ? 0 : 50;
    const totalAmount = subtotal - discount + deliveryFee;

    // Process payment intent
    const strategy = PaymentFactory.create(paymentMethod);
    const paymentIntent = await strategy.process(totalAmount, customerId, null);

    return {
      orderPreview: { subtotal, discount, deliveryFee, totalAmount, orderItems, shippingAddress },
      paymentIntent
    };
  }

  async createOrderAndVerifyPayment(customerId, orderPreview, paymentData) {
    const { method, razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentData;

    if (method === 'RAZORPAY') {
      await paymentService.verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    }

    // Create Payment Record
    const payment = await paymentRepository.create({
      customer: customerId,
      method,
      amount: orderPreview.totalAmount,
      status: method === 'COD' ? 'pending' : 'completed',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      transactionRef: paymentData.transactionRef,
      paidAt: method !== 'COD' ? new Date() : null
    });

    // Create Order Record
    const cart = await cartRepository.findByCustomer(customerId);
    
    const order = await orderRepository.create({
      customer: customerId,
      items: orderPreview.orderItems,
      shippingAddress: orderPreview.shippingAddress,
      status: 'placed',
      subtotal: orderPreview.subtotal,
      discount: orderPreview.discount,
      deliveryFee: orderPreview.deliveryFee,
      totalAmount: orderPreview.totalAmount,
      payment: payment._id,
      coupon: cart.couponApplied ? cart.couponApplied._id : null
    });

    // Link payment back to order
    await paymentRepository.updateStatus(payment._id, payment.status, { order: order._id });

    // Clear user's cart
    await cartRepository.clear(customerId);

    // Notify customer
    const user = await userRepository.findById(customerId);
    await NotificationFactory.notifyAll(user, 'Order Placed Successfully', `Your order ${order._id} has been placed.`);

    return order;
  }

  async getCustomerOrders(customerId) {
    return await orderRepository.findByCustomer(customerId);
  }

  async getOrder(orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new ApiError(404, 'Order not found');
    return order;
  }

  async cancelOrder(orderId, customerId) {
    const order = await this.getOrder(orderId);
    if (order.customer._id.toString() !== customerId.toString()) throw new ApiError(403, 'Forbidden');
    if (!['placed', 'confirmed'].includes(order.status)) throw new ApiError(400, 'Order cannot be cancelled at this stage');

    const updatedOrder = await orderRepository.updateStatus(orderId, 'cancelled');
    
    if (order.payment.status === 'completed') {
      // Automatic refund trigger
      await paymentService.refundPayment(order.payment._id);
    }
    
    return updatedOrder;
  }

  // VENDOR logic
  async getVendorOrders(vendorId) {
    return await orderRepository.findByVendor(vendorId);
  }

  async updateItemStatus(vendorId, orderId, itemId, status) {
    const order = await this.getOrder(orderId);
    const item = order.items.find(i => i._id.toString() === itemId);
    if (!item || item.vendor._id.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'Item not found or you are not authorized');
    }

    const updatedOrder = await orderRepository.updateItemStatus(orderId, itemId, status);
    
    // Check if entire order is delivered based on all items
    const allDelivered = updatedOrder.items.every(i => i.itemStatus === 'delivered');
    if (allDelivered) {
      await orderRepository.updateStatus(orderId, 'delivered');
    }
    
    return updatedOrder;
  }

  // ADMIN logic
  async getAllOrders() {
    return await orderRepository.findAll();
  }

  async overrideOrderStatus(orderId, status) {
    return await orderRepository.updateStatus(orderId, status);
  }
}

export default new OrderService();
