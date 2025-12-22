import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Verify JWT Token Middleware
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: 'Token expired'
      });
    }
    next(error);
  }
};
