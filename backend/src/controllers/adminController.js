import adminService from '../services/adminService.js';
import vendorService from '../services/vendorService.js';
import ApiResponse from '../utils/ApiResponse.js';

class AdminController {
  async getDashboard(req, res, next) {
    try {
      const analytics = await adminService.getDashboardAnalytics();
      res.status(200).json(new ApiResponse(200, analytics, 'Dashboard data retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const { page, limit, role } = req.query;
      const data = await adminService.getAllUsers(Number(page), Number(limit), role);
      res.status(200).json(new ApiResponse(200, data, 'Users retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async toggleUser(req, res, next) {
    try {
      const user = await adminService.toggleUserStatus(req.params.id);
      res.status(200).json(new ApiResponse(200, { user }, 'User status toggled'));
    } catch (error) {
      next(error);
    }
  }

  async getVendors(req, res, next) {
    try {
      const vendors = await vendorService.getAllVendors();
      res.status(200).json(new ApiResponse(200, { vendors }, 'Vendors retrieved'));
    } catch (error) {
      next(error);
    }
  }
  
  async approveVendor(req, res, next) {
    try {
      const vendor = await vendorService.approveVendor(req.params.id, req.user.id);
      res.status(200).json(new ApiResponse(200, { vendor }, 'Vendor approved'));
    } catch (error) {
      next(error);
    }
  }
  
  async rejectVendor(req, res, next) {
    try {
      const vendor = await vendorService.rejectVendor(req.params.id);
      res.status(200).json(new ApiResponse(200, { vendor }, 'Vendor rejected'));
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
