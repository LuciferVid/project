import authService from '../services/authService.js';
import ApiResponse from '../utils/ApiResponse.js';

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(new ApiResponse(201, { user }, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.login(email, password);
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json(new ApiResponse(200, { user, accessToken }, 'Logged in successfully'));
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      if (req.user) {
        await authService.logout(req.user.id);
      }
      res.clearCookie('refreshToken');
      res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const tokens = await authService.refreshToken(refreshToken);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json(new ApiResponse(200, { accessToken: tokens.accessToken }, 'Token refreshed'));
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      res.status(200).json(new ApiResponse(200, { user }, 'User profile retrieved'));
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
