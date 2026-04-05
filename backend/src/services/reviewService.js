import reviewRepository from '../repositories/reviewRepository.js';
import productRepository from '../repositories/productRepository.js';
import orderRepository from '../repositories/orderRepository.js';
import ApiError from '../utils/ApiError.js';

class ReviewService {
  async createReview(customerId, data) {
    // Check if user bought the product and it's delivered
    const { productId, orderId, rating, title, comment, images } = data;
    
    const order = await orderRepository.findById(orderId);
    if (!order || order.customer._id.toString() !== customerId.toString()) {
      throw new ApiError(403, 'Order not found or access denied');
    }

    const orderItem = order.items.find(i => i.product._id.toString() === productId);
    if (!orderItem || orderItem.itemStatus !== 'delivered') {
      throw new ApiError(400, 'You can only review products that have been delivered to you.');
    }

    // Create review
    const review = await reviewRepository.create({
      customer: customerId,
      product: productId,
      order: orderId,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase: true
    });

    // Update Product average rating
    await this.updateProductRatingStats(productId);

    return review;
  }

  async getProductReviews(productId) {
    return await reviewRepository.findByProduct(productId);
  }

  async updateReview(customerId, reviewId, data) {
    const review = await reviewRepository.findByIdAndCustomer(reviewId, customerId);
    if (!review) throw new ApiError(404, 'Review not found or unauthorized');

    const updatedReview = await reviewRepository.updateById(reviewId, data);
    await this.updateProductRatingStats(review.product);
    return updatedReview;
  }

  async deleteReview(customerId, reviewId, isAdmin = false) {
    let review;
    if (isAdmin) {
      // Admin bypasses ownership
      // Need a direct find to get productId
      // Or just a direct query
      const mongoose = await import('mongoose');
      review = await mongoose.model('Review').findById(reviewId);
    } else {
      review = await reviewRepository.findByIdAndCustomer(reviewId, customerId);
    }
    
    if (!review) throw new ApiError(404, 'Review not found or unauthorized');

    await reviewRepository.deleteById(reviewId);
    await this.updateProductRatingStats(review.product);
  }

  async updateProductRatingStats(productId) {
    const stats = await reviewRepository.getAverageRating(productId);
    await productRepository.updateById(productId, {
      averageRating: Math.round(stats.averageRating * 10) / 10, // 1 decimal point
      totalReviews: stats.totalReviews
    });
  }
}

export default new ReviewService();
