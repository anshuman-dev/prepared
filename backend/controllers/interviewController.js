import { HTTP_STATUS, SESSION_STATUS } from '../utils/constants.js';
import * as firestoreService from '../services/firestoreService.js';
import * as geminiService from '../services/geminiService.js';

/**
 * Start Interview Session
 * POST /api/interview/start
 */
export const startInterview = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { mode } = req.body; // 'practice' or 'simulation'

    if (!mode || !['practice', 'simulation'].includes(mode)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Valid mode (practice or simulation) is required'
      });
    }

    // Get user profile for context
    const user = await firestoreService.getUser(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'User not found'
      });
    }

    // Create session
    const sessionId = await firestoreService.createSession({
      userId,
      mode,
      status: SESSION_STATUS.IN_PROGRESS,
      startedAt: new Date(),
      transcript: []
    });

    // Generate system prompt for this session
    const systemPrompt = geminiService.generateSystemPrompt(user.profile, mode);

    // Store system prompt in session for context
    await firestoreService.updateSession(sessionId, {
      systemPrompt
    });

    res.status(HTTP_STATUS.CREATED).json({
      sessionId,
      agentConfig: {
        agentId: process.env.ELEVENLABS_AGENT_ID,
        customLLMEndpoint: `${process.env.BACKEND_URL || 'http://localhost:8080'}/api/interview/gemini-proxy`
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Gemini Proxy for ElevenLabs
 * POST /api/interview/gemini-proxy
 */
export const geminiProxy = async (req, res, next) => {
  try {
    const { conversationHistory, sessionId } = req.body;

    if (!sessionId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Session ID is required'
      });
    }

    // Get session context
    const session = await firestoreService.getSession(sessionId);
    if (!session) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Session not found'
      });
    }

    // Get response from Gemini
    const response = await geminiService.processConversationTurn(
      session.systemPrompt,
      conversationHistory,
      session.mode
    );

    // Save message to transcript
    const lastUserMessage = conversationHistory[conversationHistory.length - 1];
    await firestoreService.addToTranscript(sessionId, [
      {
        speaker: 'applicant',
        text: lastUserMessage.content,
        timestamp: new Date()
      },
      {
        speaker: 'officer',
        text: response.content,
        timestamp: new Date()
      }
    ]);

    // If practice mode, check for red flags
    let redFlag = null;
    if (session.mode === 'practice' && lastUserMessage.content) {
      redFlag = await geminiService.detectRedFlags(
        lastUserMessage.content,
        session.systemPrompt
      );
    }

    res.json({
      content: response.content,
      redFlag
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Analyze Interview
 * POST /api/interview/analyze
 */
export const analyzeInterview = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Session ID is required'
      });
    }

    // Get session
    const session = await firestoreService.getSession(sessionId);
    if (!session) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Session not found'
      });
    }

    // Get user for context
    const user = await firestoreService.getUser(session.userId);

    // Analyze with Gemini
    const analysis = await geminiService.analyzeInterview(
      session.transcript,
      user.profile
    );

    // Save analysis
    await firestoreService.updateSession(sessionId, {
      analysis,
      status: SESSION_STATUS.COMPLETED,
      completedAt: new Date()
    });

    // Update progress tracking
    await firestoreService.updateProgress(session.userId, {
      sessionId,
      score: analysis.overallScore,
      redFlags: analysis.redFlags
    });

    res.json({ analysis });
  } catch (error) {
    next(error);
  }
};

/**
 * End Interview
 * POST /api/interview/end/:sessionId
 */
export const endInterview = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    await firestoreService.updateSession(sessionId, {
      status: SESSION_STATUS.COMPLETED,
      completedAt: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Interview Session
 * GET /api/interview/session/:sessionId
 */
export const getSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    const session = await firestoreService.getSession(sessionId);
    if (!session) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Session not found'
      });
    }

    // Verify ownership
    if (session.userId !== userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Access denied'
      });
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
};
