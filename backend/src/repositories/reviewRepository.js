import Review from '../models/Review.js';

class ReviewRepository {
  async create(data) {
    const review = new Review(data);
    return await review.save();
  }

  async findByProduct(productId) {
    return await Review.find({ product: productId })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });
  }

  async findByIdAndCustomer(id, customerId) {
    return await Review.findOne({ _id: id, customer: customerId });
  }

  async updateById(id, data) {
    return await Review.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await Review.findByIdAndDelete(id);
  }

  // Aggregate function to update product average rating
  async getAverageRating(productId) {
    const stats = await Review.aggregate([
      { $match: { product: productId } },
      { $group: { _id: '$product', averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);
    return stats.length > 0 ? stats[0] : { averageRating: 0, totalReviews: 0 };
  }
}

export default new ReviewRepository();
