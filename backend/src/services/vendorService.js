import vendorRepository from '../repositories/vendorRepository.js';
import productRepository from '../repositories/productRepository.js';
import orderRepository from '../repositories/orderRepository.js';
import ApiError from '../utils/ApiError.js';

class VendorService {
  async getProfile(vendorId) {
    let profile = await vendorRepository.findByUserId(vendorId);
    if (!profile) {
      throw new ApiError(404, 'Vendor profile not found setup yet. Please complete registration.');
    }
    return profile;
  }

  async updateProfile(vendorId, data) {
    return await vendorRepository.updateByUserId(vendorId, data);
  }

  async getAnalytics(vendorId) {
    const products = await productRepository.findByVendor(vendorId);
    const orders = await orderRepository.findByVendor(vendorId);

    const totalProducts = products.length;
    let pendingOrders = 0;
    let totalRevenue = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.vendor._id.toString() === vendorId.toString()) {
          if (['placed', 'confirmed', 'shipped'].includes(item.itemStatus)) {
            pendingOrders++;
          }
          if (item.itemStatus === 'delivered') {
            totalRevenue += (item.quantity * item.priceAtTime);
          }
        }
      });
    });

    return {
      totalProducts,
      totalOrders: orders.length,
      pendingOrders,
      totalRevenue
    };
  }

  // Admin accessible interactions
  async getAllVendors() {
    return await vendorRepository.findAll();
  }

  async approveVendor(profileId, adminId) {
    return await vendorRepository.updateApprovalStatus(profileId, 'approved', adminId);
  }

  async rejectVendor(profileId) {
    return await vendorRepository.updateApprovalStatus(profileId, 'rejected', null);
  }
}

export default new VendorService();
