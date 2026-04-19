import reviewService from '../services/reviewService.js';
import ApiResponse from '../utils/ApiResponse.js';

class ReviewController {
  async createReview(req, res, next) {
    try {
      const review = await reviewService.createReview(req.user.id, req.body);
      res.status(201).json(new ApiResponse(201, { review }, 'Review posted successfully'));
    } catch (error) {
      if (error.code === 11000) { // MongoDB Duplicate Key Error
        next(new ApiError(400, 'You have already reviewed this product.'));
      } else {
        next(error);
      }
    }
  }

  async getProductReviews(req, res, next) {
    try {
      const reviews = await reviewService.getProductReviews(req.params.productId);
      res.status(200).json(new ApiResponse(200, { reviews }, 'Reviews retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req, res, next) {
    try {
      const review = await reviewService.updateReview(req.user.id, req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, { review }, 'Review updated'));
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const isAdmin = req.user.role === 'admin';
      await reviewService.deleteReview(req.user.id, req.params.id, isAdmin);
      res.status(200).json(new ApiResponse(200, null, 'Review deleted'));
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewController();
