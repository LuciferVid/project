import VendorProfile from '../models/VendorProfile.js';

class VendorRepository {
  async create(data) {
    const vendorProfile = new VendorProfile(data);
    return await vendorProfile.save();
  }

  async findByUserId(userId) {
    return await VendorProfile.findOne({ userId }).populate('userId', 'name email avatar');
  }

  async findAll() {
    return await VendorProfile.find().populate('userId', 'name email avatar');
  }

  async updateByUserId(userId, data) {
    return await VendorProfile.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true } // Upsert in case creating details incrementally
    );
  }

  async updateApprovalStatus(profileId, status, adminId) {
    return await VendorProfile.findByIdAndUpdate(
      profileId,
      { 
        approvalStatus: status, 
        approvedBy: status === 'approved' ? adminId : null,
        approvedAt: status === 'approved' ? new Date() : null
      },
      { new: true }
    );
  }
}

export default new VendorRepository();
