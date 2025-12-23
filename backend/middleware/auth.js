import admin from 'firebase-admin';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Verify Firebase ID Token Middleware
 */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.userId = decodedToken.uid;
      req.userEmail = decodedToken.email;

      next();
    } catch (error) {
      if (error.code === 'auth/id-token-expired') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: 'Token expired'
        });
      }
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: 'Invalid token'
      });
    }
  } catch (error) {
    next(error);
  }
};
