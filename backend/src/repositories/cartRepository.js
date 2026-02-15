import Cart from '../models/Cart.js';

class CartRepository {
  async findByCustomer(customerId) {
    return await Cart.findOne({ customer: customerId })
      .populate('items.product', 'name price images stock vendor')
      .populate('couponApplied');
  }

  async create(customerId) {
    const cart = new Cart({ customer: customerId, items: [] });
    return await cart.save();
  }

  async save(cart) {
    return await cart.save();
  }

  async clear(customerId) {
    return await Cart.findOneAndUpdate(
      { customer: customerId },
      { $set: { items: [], couponApplied: null } },
      { new: true }
    );
  }
}

export default new CartRepository();
