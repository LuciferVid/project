import Payment from '../models/Payment.js';

class PaymentRepository {
  async create(data) {
    const payment = new Payment(data);
    return await payment.save();
  }

  async findById(id) {
    return await Payment.findById(id).populate('order');
  }

  async findByCustomer(customerId) {
    return await Payment.find({ customer: customerId }).sort({ createdAt: -1 });
  }

  async updateStatus(id, status, extraData = {}) {
    return await Payment.findByIdAndUpdate(
      id,
      { status, ...extraData },
      { new: true }
    );
  }

  async findAll() {
    return await Payment.find().populate('customer', 'name email').sort({ createdAt: -1 });
  }
}

export default new PaymentRepository();
