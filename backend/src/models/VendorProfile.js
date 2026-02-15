import mongoose from 'mongoose';

const vendorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  shopName: { type: String, required: true, unique: true },
  description: { type: String },
  logo: { type: String },
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    holderName: String
  },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 }
}, { timestamps: true });

const VendorProfile = mongoose.model('VendorProfile', vendorProfileSchema);
export default VendorProfile;
