import { getFirestore } from '../config/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';

// Lazy load db to avoid initialization issues
const getDb = () => getFirestore();

/**
 * USER OPERATIONS
 */

export const createUser = async (userId, userData) => {
  const userRef = getDb().collection(COLLECTIONS.USERS).doc(userId);

  await userRef.set({
    userId,
    ...userData
  });

  return userId;
};

export const getUser = async (userId) => {
  const doc = await getDb().collection(COLLECTIONS.USERS).doc(userId).get();
  return doc.exists ? doc.data() : null;
};

export const getUserByEmail = async (email) => {
  const snapshot = await getDb().collection(COLLECTIONS.USERS)
    .where('email', '==', email)
    .limit(1)
    .get();

  return snapshot.empty ? null : snapshot.docs[0].data();
};

export const updateUserProfile = async (userId, profile) => {
  await getDb().collection(COLLECTIONS.USERS).doc(userId).update({
    profile,
    updatedAt: new Date()
  });
};

/**
 * SESSION OPERATIONS
 */

export const createSession = async (sessionData) => {
  const sessionRef = getDb().collection(COLLECTIONS.SESSIONS).doc();
  const sessionId = sessionRef.id;

  await sessionRef.set({
    sessionId,
    ...sessionData
  });

  return sessionId;
};

export const getSession = async (sessionId) => {
  const doc = await getDb().collection(COLLECTIONS.SESSIONS).doc(sessionId).get();
  return doc.exists ? doc.data() : null;
};

export const updateSession = async (sessionId, updates) => {
  await getDb().collection(COLLECTIONS.SESSIONS).doc(sessionId).update(updates);
};

export const addToTranscript = async (sessionId, messages) => {
  const session = await getSession(sessionId);
  const transcript = session.transcript || [];

  await updateSession(sessionId, {
    transcript: [...transcript, ...messages]
  });
};

export const getUserSessions = async (userId) => {
  const snapshot = await getDb().collection(COLLECTIONS.SESSIONS)
    .where('userId', '==', userId)
    .get();

  // Sort in memory for now (TODO: create Firestore index)
  const sessions = snapshot.docs.map(doc => doc.data());
  return sessions.sort((a, b) => b.startedAt?.toMillis() - a.startedAt?.toMillis());
};

export const getAllActiveSessions = async () => {
  const snapshot = await getDb().collection(COLLECTIONS.SESSIONS)
    .where('status', '==', 'in_progress')
    .get();

  // Sort in memory to avoid composite index requirement
  const sessions = snapshot.docs.map(doc => doc.data());
  sessions.sort((a, b) => b.startedAt?.toMillis() - a.startedAt?.toMillis());

  return sessions.slice(0, 1); // Return most recent session only
};

export const deleteSession = async (sessionId) => {
  await getDb().collection(COLLECTIONS.SESSIONS).doc(sessionId).delete();
};

/**
 * PROGRESS OPERATIONS
 */

export const getProgress = async (userId) => {
  const doc = await getDb().collection(COLLECTIONS.PROGRESS).doc(userId).get();
  return doc.exists ? doc.data() : null;
};

export const updateProgress = async (userId, sessionData) => {
  const progressRef = getDb().collection(COLLECTIONS.PROGRESS).doc(userId);
  const progress = await getProgress(userId);

  if (!progress) {
    // Initialize progress
    await progressRef.set({
      userId,
      totalSessions: 1,
      sessionHistory: [sessionData],
      weaknessTracking: {},
      readinessScore: 0
    });
  } else {
    // Update progress
    const sessionHistory = [...progress.sessionHistory, sessionData];
    const scores = sessionHistory.map(s => s.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Track weaknesses
    const weaknessTracking = { ...progress.weaknessTracking };
    sessionData.redFlags?.forEach(flag => {
      if (!weaknessTracking[flag.type]) {
        weaknessTracking[flag.type] = { count: 0, lastSeen: new Date() };
      }
      weaknessTracking[flag.type].count++;
      weaknessTracking[flag.type].lastSeen = new Date();
    });

    // Calculate readiness (simple algorithm for now)
    const readinessScore = Math.min(100, Math.round(averageScore * 10));

    await progressRef.update({
      totalSessions: progress.totalSessions + 1,
      sessionHistory,
      weaknessTracking,
      readinessScore
    });
  }
};
