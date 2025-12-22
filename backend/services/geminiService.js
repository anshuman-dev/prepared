import { getGenerativeModel } from '../config/vertexai.js';

/**
 * Generate System Prompt for Interview
 */
export const generateSystemPrompt = (userProfile, mode) => {
  const { visaType, country, age, field } = userProfile;

  // TODO: Implement full system prompt template from spec
  // This is a placeholder that will be expanded in the prompt-engineering phase

  return `You are a US consular officer conducting a ${visaType} visa interview.
Applicant: ${age} years old from ${country}, field: ${field}
Mode: ${mode}

${mode === 'practice'
  ? 'You can pause to coach when red flags are detected.'
  : 'Conduct a realistic interview without interruptions.'
}`;
};

/**
 * Process Conversation Turn with Gemini
 */
export const processConversationTurn = async (systemPrompt, conversationHistory, mode) => {
  // TODO: Implement actual Gemini API call
  // This is a placeholder that will be implemented when Vertex AI is set up

  const model = getGenerativeModel();

  // For now, return a mock response
  return {
    content: "Thank you. What will you study and why this specific university?"
  };

  // Actual implementation (to be completed):
  // const chat = model.startChat({
  //   history: [
  //     { role: 'system', parts: [{ text: systemPrompt }] },
  //     ...conversationHistory
  //   ]
  // });
  // const result = await chat.sendMessage(conversationHistory[conversationHistory.length - 1].content);
  // return { content: result.response.text() };
};

/**
 * Detect Red Flags in Practice Mode
 */
export const detectRedFlags = async (answer, context) => {
  // TODO: Implement red flag detection with Gemini
  // This will use a specific prompt to analyze the answer

  return null; // No red flags detected (placeholder)
};

/**
 * Analyze Complete Interview
 */
export const analyzeInterview = async (transcript, userProfile) => {
  // TODO: Implement comprehensive analysis with Gemini
  // This will use the analysis prompt from the spec

  return {
    overallScore: 7.5,
    approvalLikelihood: 75,
    likelyOutcome: 'approved',
    redFlags: [],
    strengths: ['Clear answers', 'Confident delivery'],
    scores: {
      clarity: 8,
      confidence: 7,
      specificity: 7,
      returnIntent: 8
    },
    recommendations: [
      'Practice explaining your return plans with more specific details'
    ],
    nextFocus: 'Strengthen return intent demonstration'
  };
};
