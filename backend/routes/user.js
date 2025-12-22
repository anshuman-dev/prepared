import express from 'express';
import {
  getSessions,
  getProgress,
  deleteSession
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All user routes require authentication
router.use(verifyToken);

// User data operations
router.get('/sessions', getSessions);
router.get('/progress', getProgress);
router.delete('/sessions/:sessionId', deleteSession);

export default router;
