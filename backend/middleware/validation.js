import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Validate Email Format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Password Strength
 */
export const validatePassword = (password) => {
  return password && password.length >= 8;
};

/**
 * Validate User Profile
 */
export const validateProfile = (profile) => {
  const required = ['visaType', 'country', 'age', 'field'];

  for (const field of required) {
    if (!profile[field]) {
      return { valid: false, message: `${field} is required` };
    }
  }

  return { valid: true };
};

/**
 * Request Validation Middleware
 */
export const validateSignup = (req, res, next) => {
  const { email, password, profile } = req.body;

  if (!validateEmail(email)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Invalid email format'
    });
  }

  if (!validatePassword(password)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Password must be at least 8 characters'
    });
  }

  const profileValidation = validateProfile(profile);
  if (!profileValidation.valid) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: profileValidation.message
    });
  }

  next();
};
