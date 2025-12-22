import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Firestore errors
  if (err.code && err.code.startsWith('firestore/')) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      error: 'Database error',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: err.message
    });
  }

  // Default error response
  res.status(err.status || HTTP_STATUS.INTERNAL_ERROR).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: 'Route not found',
    path: req.path
  });
};
