import { HTTP_STATUS } from '../utils/constants.js';
import * as authService from '../services/authService.js';
import * as firestoreService from '../services/firestoreService.js';

/**
 * User Signup
 * POST /api/auth/signup
 */
export const signup = async (req, res, next) => {
  try {
    const { email, password, profile } = req.body;

    // Validate input
    if (!email || !password || !profile) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Email, password, and profile are required'
      });
    }

    // Check if user exists
    const existingUser = await firestoreService.getUserByEmail(email);
    if (existingUser) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'User already exists'
      });
    }

    // Hash password
    const passwordHash = await authService.hashPassword(password);

    // Create user
    const userId = await firestoreService.createUser({
      email,
      passwordHash,
      profile,
      createdAt: new Date()
    });

    // Generate token
    const token = authService.generateToken(userId);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      userId,
      token,
      profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Login
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Email and password are required'
      });
    }

    // Get user
    const user = await firestoreService.getUserByEmail(email);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValid = await authService.comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = authService.generateToken(user.userId);

    res.json({
      success: true,
      userId: user.userId,
      token,
      profile: user.profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get User Profile
 * GET /api/auth/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.userId; // Set by verifyToken middleware

    const user = await firestoreService.getUser(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'User not found'
      });
    }

    res.json({
      userId: user.userId,
      email: user.email,
      profile: user.profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update User Profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { profile } = req.body;

    if (!profile) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Profile data is required'
      });
    }

    await firestoreService.updateUserProfile(userId, profile);

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    next(error);
  }
};
