import cartService from '../services/cartService.js';
import ApiResponse from '../utils/ApiResponse.js';

class CartController {
  async getCart(req, res, next) {
    try {
      const cart = await cartService.getCart(req.user.id);
      res.status(200).json(new ApiResponse(200, { cart }, 'Cart retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async addItem(req, res, next) {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.addItem(req.user.id, productId, quantity);
      res.status(200).json(new ApiResponse(200, { cart }, 'Item added to cart'));
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req, res, next) {
    try {
      const { quantity } = req.body;
      const cart = await cartService.updateItemQuantity(req.user.id, req.params.productId, quantity);
      res.status(200).json(new ApiResponse(200, { cart }, 'Cart item updated'));
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req, res, next) {
    try {
      const cart = await cartService.removeItem(req.user.id, req.params.productId);
      res.status(200).json(new ApiResponse(200, { cart }, 'Item removed from cart'));
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req, res, next) {
    try {
      const cart = await cartService.clearCart(req.user.id);
      res.status(200).json(new ApiResponse(200, { cart }, 'Cart cleared'));
    } catch (error) {
      next(error);
    }
  }

  async applyCoupon(req, res, next) {
    try {
      const { code } = req.body;
      const cart = await cartService.applyCoupon(req.user.id, code);
      res.status(200).json(new ApiResponse(200, { cart }, 'Coupon applied'));
    } catch (error) {
      next(error);
    }
  }

  async removeCoupon(req, res, next) {
    try {
      const cart = await cartService.removeCoupon(req.user.id);
      res.status(200).json(new ApiResponse(200, { cart }, 'Coupon removed'));
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
