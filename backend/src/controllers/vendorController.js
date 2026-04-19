import vendorService from '../services/vendorService.js';
import ApiResponse from '../utils/ApiResponse.js';

class VendorController {
  async getProfile(req, res, next) {
    try {
      const profile = await vendorService.getProfile(req.user.id);
      res.status(200).json(new ApiResponse(200, { profile }, 'Vendor profile retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const profile = await vendorService.updateProfile(req.user.id, req.body);
      res.status(200).json(new ApiResponse(200, { profile }, 'Vendor profile updated'));
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(req, res, next) {
    try {
      const analytics = await vendorService.getAnalytics(req.user.id);
      res.status(200).json(new ApiResponse(200, analytics, 'Vendor analytics retrieved'));
    } catch (error) {
      next(error);
    }
  }
}

export default new VendorController();
