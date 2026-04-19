import paymentService from '../services/paymentService.js';
import ApiResponse from '../utils/ApiResponse.js';

class PaymentController {
  async getMyPayments(req, res, next) {
    try {
      const payments = await paymentService.getCustomerPayments(req.user.id);
      res.status(200).json(new ApiResponse(200, { payments }, 'Payments retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getPayment(req, res, next) {
    try {
      const payment = await paymentService.getPayment(req.params.id);
      
      // Ownership check for customer
      if (req.user.role === 'customer' && payment.customer.toString() !== req.user.id) {
        return res.status(403).json(new ApiResponse(403, null, 'Not authorized to view this payment'));
      }
      
      res.status(200).json(new ApiResponse(200, { payment }, 'Payment retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getAllPayments(req, res, next) {
    try {
      const payments = await paymentService.getAllPayments();
      res.status(200).json(new ApiResponse(200, { payments }, 'All payments retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async processRefund(req, res, next) {
    try {
      const payment = await paymentService.refundPayment(req.params.id);
      res.status(200).json(new ApiResponse(200, { payment }, 'Refund processed successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
