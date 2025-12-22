export const VISA_TYPES = {
  F1: 'F-1',
  H1B: 'H-1B',
  B1_B2: 'B-1/B-2',
  J1: 'J-1',
  L1: 'L-1',
  O1: 'O-1',
  K1: 'K-1',
};

export const INTERVIEW_MODES = {
  PRACTICE: 'practice',
  SIMULATION: 'simulation',
};

export const SESSION_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
};

export const RED_FLAG_TYPES = {
  IMMIGRANT_INTENT: 'immigrant_intent',
  VAGUE_ANSWER: 'vague_answer',
  FINANCIAL: 'financial',
  WEAK_TIES: 'weak_ties',
  INCONSISTENT: 'inconsistent',
};

export const RED_FLAG_SEVERITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const COLLECTIONS = {
  USERS: 'users',
  SESSIONS: 'sessions',
  PROGRESS: 'progress',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};
