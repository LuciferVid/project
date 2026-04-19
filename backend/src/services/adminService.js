import userRepository from '../repositories/userRepository.js';
import vendorRepository from '../repositories/vendorRepository.js';
import orderRepository from '../repositories/orderRepository.js';

class AdminService {
  async getDashboardAnalytics() {
    const orders = await orderRepository.findAll();
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Assuming simple aggregations rather than heavy queries for MVP
    // Number of users by mapping their roles (simulated for simplicity, real app would use group aggregate)
    const mongoose = await import('mongoose');
    const usersCount = await mongoose.model('User').countDocuments();
    
    return {
      totalOrders,
      totalRevenue,
      usersCount
    };
  }

  async getAllUsers(page = 1, limit = 20, role) {
    const query = role ? { role } : {};
    const skip = (page - 1) * limit;
    
    const mongoose = await import('mongoose');
    const User = mongoose.model('User');
    
    const users = await User.find(query).skip(skip).limit(limit).select('-passwordHash');
    const total = await User.countDocuments(query);
    
    return { users, total, pages: Math.ceil(total / limit) };
  }

  async toggleUserStatus(userId) {
    const mongoose = await import('mongoose');
    const User = mongoose.model('User');
    
    const user = await User.findById(userId);
    user.isActive = !user.isActive;
    await user.save();
    return user;
  }
}

export default new AdminService();
