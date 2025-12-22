import express from 'express';
import {
  startInterview,
  geminiProxy,
  analyzeInterview,
  getSession,
  endInterview
} from '../controllers/interviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All interview routes require authentication
router.use(verifyToken);

// Interview operations
router.post('/start', startInterview);
router.post('/gemini-proxy', geminiProxy);
router.post('/analyze', analyzeInterview);
router.post('/end/:sessionId', endInterview);
router.get('/session/:sessionId', getSession);

export default router;
