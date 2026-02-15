import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  images: [{ type: String }],
  isVerifiedPurchase: { type: Boolean, default: true },
}, { timestamps: true });

// Ensure one review per product per customer (based on an order)
reviewSchema.index({ customer: 1, product: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
