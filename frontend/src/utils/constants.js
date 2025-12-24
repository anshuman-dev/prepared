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

export const COUNTRIES = [
  { value: 'India', label: 'India' },
  { value: 'China', label: 'China' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'Bangladesh', label: 'Bangladesh' },
  { value: 'Nepal', label: 'Nepal' },
  { value: 'Other', label: 'Other' },
];

export const FIELDS_OF_STUDY = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Business Administration', label: 'Business Administration' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Medicine', label: 'Medicine' },
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'Biology', label: 'Biology' },
  { value: 'Economics', label: 'Economics' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Law', label: 'Law' },
  { value: 'Arts', label: 'Arts' },
  { value: 'Psychology', label: 'Psychology' },
  { value: 'Other', label: 'Other' },
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
