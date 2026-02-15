import Order from '../models/Order.js';

class OrderRepository {
  async create(data) {
    const order = new Order(data);
    return await order.save();
  }

  async findById(id) {
    return await Order.findById(id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images')
      .populate('items.vendor', 'name shopName')
      .populate('payment');
  }

  async findByCustomer(customerId) {
    return await Order.find({ customer: customerId })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
  }

  async findByVendor(vendorId) {
    return await Order.find({ 'items.vendor': vendorId })
      .populate('customer', 'name')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });
  }

  async updateStatus(id, status) {
    return await Order.findByIdAndUpdate(id, { status }, { new: true });
  }

  async updateItemStatus(orderId, itemId, status) {
    return await Order.findOneAndUpdate(
      { _id: orderId, 'items._id': itemId },
      { $set: { 'items.$.itemStatus': status } },
      { new: true }
    );
  }

  async findAll() {
    return await Order.find()
      .populate('customer', 'name')
      .populate('payment')
      .sort({ createdAt: -1 });
  }
}

export default new OrderRepository();
