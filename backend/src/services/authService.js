import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

class AuthService {
  async register(data) {
    const { name, email, password, role } = data;
    
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await userRepository.create({
      name,
      email,
      passwordHash,
      role: role || 'customer'
    });

    const userObj = user.toObject();
    delete userObj.passwordHash;
    delete userObj.refreshToken;

    return userObj;
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || user.isActive === false) {
      throw new ApiError(401, 'Invalid credentials or inactive account');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    await userRepository.setRefreshToken(user._id, refreshToken);

    const userObj = user.toObject();
    delete userObj.passwordHash;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
  }

  async logout(userId) {
    await userRepository.clearRefreshToken(userId);
  }

  async refreshToken(token) {
    if (!token) throw new ApiError(401, 'No refresh token provided');

    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await userRepository.findById(decoded.id);

      if (!user || user.refreshToken !== token) {
        throw new ApiError(403, 'Invalid refresh token');
      }

      const accessToken = generateAccessToken(user._id, user.role);
      const newRefreshToken = generateRefreshToken(user._id);
      
      await userRepository.setRefreshToken(user._id, newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new ApiError(403, 'Refresh token expired or invalid');
    }
  }

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    const userObj = user.toObject();
    delete userObj.passwordHash;
    delete userObj.refreshToken;
    return userObj;
  }
}

export default new AuthService();
