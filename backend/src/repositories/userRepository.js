import User from '../models/User.js';

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async setRefreshToken(id, token) {
    return await User.findByIdAndUpdate(id, { refreshToken: token });
  }

  async clearRefreshToken(id) {
    return await User.findByIdAndUpdate(id, { $unset: { refreshToken: 1 } });
  }
  
  async findByRefreshToken(token) {
    return await User.findOne({ refreshToken: token });
  }
}

export default new UserRepository();
