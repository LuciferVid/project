import Coupon from '../models/Coupon.js';

class CouponRepository {
  async create(data) {
    const coupon = new Coupon(data);
    return await coupon.save();
  }

  async findByCode(code) {
    return await Coupon.findOne({ code, isActive: true });
  }

  async findById(id) {
    return await Coupon.findById(id);
  }

  async incrementUsage(id) {
    return await Coupon.findByIdAndUpdate(id, { $inc: { usedCount: 1 } }, { new: true });
  }

  async findAll() {
    return await Coupon.find().sort({ createdAt: -1 });
  }

  async updateById(id, data) {
    return await Coupon.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await Coupon.findByIdAndDelete(id);
  }
}

export default new CouponRepository();
