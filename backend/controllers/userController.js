import { HTTP_STATUS } from '../utils/constants.js';
import * as firestoreService from '../services/firestoreService.js';

/**
 * Get User Sessions
 * GET /api/user/sessions
 */
export const getSessions = async (req, res, next) => {
  try {
    const userId = req.userId;

    const sessions = await firestoreService.getUserSessions(userId);

    res.json({
      sessions: sessions.map(s => ({
        sessionId: s.sessionId,
        mode: s.mode,
        status: s.status,
        startedAt: s.startedAt,
        completedAt: s.completedAt,
        score: s.analysis?.overallScore || null
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get User Progress
 * GET /api/user/progress
 */
export const getProgress = async (req, res, next) => {
  try {
    const userId = req.userId;

    const progress = await firestoreService.getProgress(userId);
    const sessions = await firestoreService.getUserSessions(userId);

    // Calculate stats
    const completedSessions = sessions.filter(s => s.analysis);
    const scores = completedSessions.map(s => s.analysis.overallScore);
    const averageScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

    // Determine trend
    let trend = 'stable';
    if (scores.length >= 3) {
      const recent = scores.slice(-3);
      const older = scores.slice(-6, -3);
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg = older.length > 0
        ? older.reduce((a, b) => a + b, 0) / older.length
        : recentAvg;

      if (recentAvg > olderAvg + 0.5) trend = 'improving';
      else if (recentAvg < olderAvg - 0.5) trend = 'declining';
    }

    res.json({
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      averageScore,
      trend,
      sessionHistory: completedSessions.map(s => ({
        sessionId: s.sessionId,
        score: s.analysis.overallScore,
        date: s.completedAt,
        mode: s.mode
      })),
      weaknesses: progress?.weaknessTracking || {},
      readinessScore: progress?.readinessScore || 0
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Session
 * DELETE /api/user/sessions/:sessionId
 */
export const deleteSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    // Verify ownership
    const session = await firestoreService.getSession(sessionId);
    if (!session) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Session not found'
      });
    }

    if (session.userId !== userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Access denied'
      });
    }

    await firestoreService.deleteSession(sessionId);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
