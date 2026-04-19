import couponRepository from '../repositories/couponRepository.js';
import ApiError from '../utils/ApiError.js';

class CouponService {
  async validateCoupon(code) {
    const coupon = await couponRepository.findByCode(code.toUpperCase());
    if (!coupon) throw new ApiError(404, 'Invalid coupon code');
    if (new Date() > coupon.expiresAt) throw new ApiError(400, 'Coupon has expired');
    if (coupon.usedCount >= coupon.usageLimit) throw new ApiError(400, 'Coupon usage limit reached');
    return coupon;
  }

  async createCoupon(data) {
    const existing = await couponRepository.findByCode(data.code.toUpperCase());
    if (existing) throw new ApiError(400, 'Coupon code already exists');
    return await couponRepository.create(data);
  }

  async getAllCoupons() {
    return await couponRepository.findAll();
  }

  async updateCoupon(id, data) {
    const coupon = await couponRepository.updateById(id, data);
    if (!coupon) throw new ApiError(404, 'Coupon not found');
    return coupon;
  }

  async deleteCoupon(id) {
    const coupon = await couponRepository.deleteById(id);
    if (!coupon) throw new ApiError(404, 'Coupon not found');
    return coupon;
  }
}

export default new CouponService();
