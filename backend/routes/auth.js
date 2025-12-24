import express from 'express';
import { signup, login, getProfile, updateProfile, createGoogleProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (login doesn't need token)
router.post('/login', login);

// Protected routes (require auth token)
router.post('/signup', verifyToken, signup);
router.post('/google-profile', verifyToken, createGoogleProfile);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

export default router;
