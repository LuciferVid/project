import couponService from '../services/couponService.js';
import ApiResponse from '../utils/ApiResponse.js';

class CouponController {
  async validate(req, res, next) {
    try {
      const coupon = await couponService.validateCoupon(req.body.code);
      res.status(200).json(new ApiResponse(200, { coupon }, 'Coupon is valid'));
    } catch (error) {
      next(error);
    }
  }

  async getAllCoupons(req, res, next) {
    try {
      const coupons = await couponService.getAllCoupons();
      res.status(200).json(new ApiResponse(200, { coupons }, 'Coupons retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async createCoupon(req, res, next) {
    try {
      const coupon = await couponService.createCoupon(req.body);
      res.status(201).json(new ApiResponse(201, { coupon }, 'Coupon created'));
    } catch (error) {
      next(error);
    }
  }

  async updateCoupon(req, res, next) {
    try {
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, { coupon }, 'Coupon updated'));
    } catch (error) {
      next(error);
    }
  }

  async deleteCoupon(req, res, next) {
    try {
      await couponService.deleteCoupon(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Coupon deleted'));
    } catch (error) {
      next(error);
    }
  }
}

export default new CouponController();
