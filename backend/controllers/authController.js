import { HTTP_STATUS } from '../utils/constants.js';
import * as authService from '../services/authService.js';
import * as firestoreService from '../services/firestoreService.js';

/**
 * User Signup (Firebase Auth)
 * POST /api/auth/signup
 * Frontend creates Firebase Auth user first, then calls this to store basic profile
 */
export const signup = async (req, res, next) => {
  try {
    const { email, fullName } = req.body;
    const userId = req.userId; // Firebase Auth UID from verifyToken middleware

    // Validate input
    if (!email || !fullName) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Email and fullName are required'
      });
    }

    // Note: Firebase Auth user already created by frontend
    // We just need to store basic user info in Firestore
    // Profile (visa details) will be added later via onboarding

    // Check if user profile exists
    const existingUser = await firestoreService.getUserByEmail(email);
    if (existingUser) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'User profile already exists'
      });
    }

    // Create user in Firestore using Firebase Auth UID as document ID
    await firestoreService.createUser(userId, {
      email,
      fullName,
      profile: {}, // Empty profile, to be filled during onboarding
      createdAt: new Date()
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      userId
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Login (Firebase Auth)
 * POST /api/auth/login
 * NOTE: With Firebase Auth, login happens on frontend via Firebase SDK
 * This endpoint is kept for potential future use or non-Firebase flows
 */
export const login = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Email is required'
      });
    }

    // Get user profile
    const user = await firestoreService.getUserByEmail(email);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'User profile not found'
      });
    }

    res.json({
      success: true,
      userId: user.userId,
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

/**
 * Create Profile from Google Sign-In
 * POST /api/auth/google-profile
 * Called after Google Sign-In to create user profile
 */
export const createGoogleProfile = async (req, res, next) => {
  try {
    const { email, fullName, profile } = req.body;
    const userId = req.userId; // Firebase Auth UID from verifyToken middleware

    // Validate input
    if (!email || !fullName) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Email and fullName are required'
      });
    }

    // Check if user profile already exists
    const existingUser = await firestoreService.getUserByEmail(email);
    if (existingUser) {
      // Profile exists, just return it
      return res.json({
        success: true,
        userId: existingUser.userId,
        profile: existingUser.profile
      });
    }

    // Create new user profile using Firebase Auth UID as document ID
    await firestoreService.createUser(userId, {
      email,
      fullName,
      profile: profile || {},
      createdAt: new Date()
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      userId,
      profile: profile || {}
    });
  } catch (error) {
    next(error);
  }
};
