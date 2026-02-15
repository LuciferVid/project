import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: { type: String }, // 'Home', 'Work'
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
  avatar: { type: String },
  phone: { type: String },
  addresses: [addressSchema],
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String }
}, { timestamps: true });

// OOP Factory Implementation for User methods
class BaseUser {
  constructor(userDoc) {
    this.doc = userDoc;
  }
  getPermissions() { return []; }
  canAccess(resource) { return this.getPermissions().includes(resource); }
}

class Customer extends BaseUser {
  getPermissions() {
    return ['browse', 'cart', 'checkout', 'orders', 'reviews', 'wallet'];
  }
}

class Vendor extends BaseUser {
  getPermissions() {
    return ['browse', 'product:manage', 'orders:vendor', 'analytics:vendor'];
  }
}

class Admin extends BaseUser {
  getPermissions() {
    return ['*'];
  }
}

export class UserFactory {
  static create(userDoc) {
    if (!userDoc) return null;
    if (userDoc.role === 'customer') return new Customer(userDoc);
    if (userDoc.role === 'vendor') return new Vendor(userDoc);
    if (userDoc.role === 'admin') return new Admin(userDoc);
    throw new Error(`Unknown role: ${userDoc.role}`);
  }
}

const User = mongoose.model('User', userSchema);
export default User;
