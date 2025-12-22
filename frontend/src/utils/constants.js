export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const VISA_TYPES = [
  { value: 'F-1', label: 'F-1 (Student Visa)' },
  { value: 'H-1B', label: 'H-1B (Specialty Occupation Work Visa)' },
  { value: 'B-1/B-2', label: 'B-1/B-2 (Tourist/Business Visitor)' },
  { value: 'J-1', label: 'J-1 (Exchange Visitor)' },
  { value: 'L-1', label: 'L-1 (Intracompany Transferee)' },
  { value: 'O-1', label: 'O-1 (Extraordinary Ability)' },
  { value: 'K-1', label: 'K-1 (Fiance Visa)' },
];

export const INTERVIEW_MODES = {
  PRACTICE: 'practice',
  SIMULATION: 'simulation'
};

export const RED_FLAG_TYPES = {
  IMMIGRANT_INTENT: 'immigrant_intent',
  VAGUE_ANSWER: 'vague_answer',
  FINANCIAL: 'financial',
  WEAK_TIES: 'weak_ties',
  INCONSISTENT: 'inconsistent'
};

export const SESSION_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned'
};
