import cartRepository from '../repositories/cartRepository.js';
import productRepository from '../repositories/productRepository.js';
import couponRepository from '../repositories/couponRepository.js';
import ApiError from '../utils/ApiError.js';

class CartService {
  async getCart(customerId) {
    let cart = await cartRepository.findByCustomer(customerId);
    if (!cart) {
      cart = await cartRepository.create(customerId);
    }
    return cart;
  }

  async addItem(customerId, productId, quantity) {
    let cart = await cartRepository.findByCustomer(customerId);
    if (!cart) cart = await cartRepository.create(customerId);

    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) throw new ApiError(404, 'Product not found or inactive');
    if (product.stock < quantity) throw new ApiError(400, 'Insufficient stock');

    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);
    
    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (product.stock < newQuantity) throw new ApiError(400, 'Insufficient stock');
      cart.items[itemIndex].quantity = newQuantity;
      cart.items[itemIndex].priceAtTime = product.discountPrice || product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        priceAtTime: product.discountPrice || product.price
      });
    }

    await cartRepository.save(cart);
    return await cartRepository.findByCustomer(customerId); // Return populated
  }

  async updateItemQuantity(customerId, productId, quantity) {
    const cart = await cartRepository.findByCustomer(customerId);
    if (!cart) throw new ApiError(404, 'Cart not found');

    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);
    if (itemIndex === -1) throw new ApiError(404, 'Item not in cart');

    const product = await productRepository.findById(productId);
    if (product.stock < quantity) throw new ApiError(400, 'Insufficient stock');

    cart.items[itemIndex].quantity = quantity;
    await cartRepository.save(cart);
    return await cartRepository.findByCustomer(customerId);
  }

  async removeItem(customerId, productId) {
    const cart = await cartRepository.findByCustomer(customerId);
    if (!cart) throw new ApiError(404, 'Cart not found');

    cart.items = cart.items.filter(item => item.product._id.toString() !== productId);
    await cartRepository.save(cart);
    return await cartRepository.findByCustomer(customerId);
  }

  async clearCart(customerId) {
    return await cartRepository.clear(customerId);
  }

  async applyCoupon(customerId, code) {
    const cart = await cartRepository.findByCustomer(customerId);
    if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

    const coupon = await couponRepository.findByCode(code.toUpperCase());
    if (!coupon) throw new ApiError(404, 'Invalid or expired coupon');

    if (new Date() > coupon.expiresAt) throw new ApiError(400, 'Coupon has expired');
    if (coupon.usedCount >= coupon.usageLimit) throw new ApiError(400, 'Coupon usage limit reached');

    // Calculate subtotal
    const subtotal = cart.items.reduce((acc, item) => acc + (item.priceAtTime * item.quantity), 0);
    
    if (subtotal < coupon.minOrderAmount) {
      throw new ApiError(400, `Minimum order amount of ${coupon.minOrderAmount} required`);
    }

    cart.couponApplied = coupon._id;
    await cartRepository.save(cart);
    return await cartRepository.findByCustomer(customerId);
  }

  async removeCoupon(customerId) {
    const cart = await cartRepository.findByCustomer(customerId);
    if (!cart) throw new ApiError(404, 'Cart not found');

    cart.couponApplied = null;
    await cartRepository.save(cart);
    return await cartRepository.findByCustomer(customerId);
  }
}

export default new CartService();
