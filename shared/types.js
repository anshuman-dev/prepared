/**
 * Shared types and interfaces between frontend and backend
 * These are defined as JSDoc comments for better IDE support
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} visaType - Type of visa (F-1, H-1B, etc.)
 * @property {string} country - Country of origin
 * @property {number} age - Age of applicant
 * @property {string} field - Field of study or work
 * @property {string} [university] - University name (for student visas)
 * @property {string} [company] - Company name (for work visas)
 * @property {boolean} hasRelativesInUS - Has relatives in US
 * @property {string} [relativesVisaStatus] - Relatives' visa status
 * @property {string} [interviewDate] - Scheduled interview date
 * @property {boolean} previousVisa - Had previous US visa
 * @property {boolean} [previousApproval] - Was previous visa approved
 */

/**
 * @typedef {Object} InterviewSession
 * @property {string} sessionId - Unique session identifier
 * @property {string} userId - User who owns this session
 * @property {'practice'|'simulation'} mode - Interview mode
 * @property {'in_progress'|'completed'|'abandoned'} status - Session status
 * @property {Date} startedAt - Session start timestamp
 * @property {Date} [completedAt] - Session completion timestamp
 * @property {TranscriptMessage[]} transcript - Full conversation
 * @property {SessionAnalysis} [analysis] - Post-interview analysis
 */

/**
 * @typedef {Object} TranscriptMessage
 * @property {'officer'|'applicant'} speaker - Who spoke
 * @property {string} text - Message content
 * @property {Date} timestamp - When message was sent
 * @property {RedFlag} [redFlag] - Red flag if detected (practice mode)
 */

/**
 * @typedef {Object} RedFlag
 * @property {string} type - Type of red flag
 * @property {'high'|'medium'|'low'} severity - Severity level
 * @property {string} explanation - What's wrong
 * @property {string} [suggestion] - How to improve
 */

/**
 * @typedef {Object} SessionAnalysis
 * @property {number} overallScore - Score out of 10
 * @property {number} approvalLikelihood - Percentage likelihood
 * @property {'approved'|'denied'} likelyOutcome - Predicted outcome
 * @property {RedFlag[]} redFlags - All red flags identified
 * @property {string[]} strengths - What went well
 * @property {ScoreBreakdown} scores - Detailed scores
 * @property {string[]} recommendations - Improvement suggestions
 * @property {string} nextFocus - What to focus on next
 */

/**
 * @typedef {Object} ScoreBreakdown
 * @property {number} clarity - Answer clarity (1-10)
 * @property {number} confidence - Confidence level (1-10)
 * @property {number} specificity - Answer specificity (1-10)
 * @property {number} returnIntent - Return intent strength (1-10)
 */

export {};
