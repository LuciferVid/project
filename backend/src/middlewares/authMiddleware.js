import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

export const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next(new ApiError(401, 'Unauthorized request. No token provided.'));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decodedToken; // { id, role }
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired access token'));
  }
};
