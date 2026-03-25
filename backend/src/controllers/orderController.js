import orderService from '../services/orderService.js';
import ApiResponse from '../utils/ApiResponse.js';

class OrderController {
  async checkout(req, res, next) {
    try {
      const { shippingAddress, paymentMethod } = req.body;
      const { orderPreview, paymentIntent } = await orderService.checkoutInitiate(req.user.id, shippingAddress, paymentMethod);
      res.status(200).json(new ApiResponse(200, { orderPreview, paymentIntent }, 'Checkout initiated'));
    } catch (error) {
      next(error);
    }
  }

  async verifyPaymentAndCreateOrder(req, res, next) {
    try {
      const { orderPreview, paymentData } = req.body;
      const order = await orderService.createOrderAndVerifyPayment(req.user.id, orderPreview, paymentData);
      res.status(201).json(new ApiResponse(201, { order }, 'Order placed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req, res, next) {
    try {
      const orders = await orderService.getCustomerOrders(req.user.id);
      res.status(200).json(new ApiResponse(200, { orders }, 'Orders retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req, res, next) {
    try {
      const order = await orderService.getOrder(req.params.id);
      
      // Access control
      const isOwner = order.customer._id.toString() === req.user.id;
      const isVendor = order.items.some(i => i.vendor._id.toString() === req.user.id);
      const isAdmin = req.user.role === 'admin';
      
      if (!isOwner && !isVendor && !isAdmin) {
        return res.status(403).json(new ApiResponse(403, null, 'Forbidden'));
      }
      
      res.status(200).json(new ApiResponse(200, { order }, 'Order details retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const order = await orderService.cancelOrder(req.params.id, req.user.id);
      res.status(200).json(new ApiResponse(200, { order }, 'Order cancelled successfully'));
    } catch (error) {
      next(error);
    }
  }

  // VENDOR
  async getVendorOrders(req, res, next) {
    try {
      const orders = await orderService.getVendorOrders(req.user.id);
      res.status(200).json(new ApiResponse(200, { orders }, 'Vendor orders retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async updateItemStatus(req, res, next) {
    try {
      const { itemId } = req.params;
      const { status } = req.body;
      const order = await orderService.updateItemStatus(req.user.id, req.params.id, itemId, status);
      res.status(200).json(new ApiResponse(200, { order }, 'Order item status updated'));
    } catch (error) {
      next(error);
    }
  }

  // ADMIN
  async getAllOrders(req, res, next) {
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json(new ApiResponse(200, { orders }, 'All system orders retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async overrideStatus(req, res, next) {
    try {
      const order = await orderService.overrideOrderStatus(req.params.id, req.body.status);
      res.status(200).json(new ApiResponse(200, { order }, 'Order status overridden'));
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
