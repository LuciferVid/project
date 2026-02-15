import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtTime: { type: Number, required: true }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  items: [cartItemSchema],
  couponApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
