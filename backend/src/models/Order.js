import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  priceAtTime: { type: Number, required: true },
  itemStatus: { type: String, enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'placed' }
}, { _id: true });

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  status: { type: String, enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'], default: 'placed' },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
  notes: { type: String }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
