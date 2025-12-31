import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  generateSystemPrompt as createSystemPrompt,
  generateAnalysisPrompt
} from '../prompts/index.js';

// Lazy initialization of Gemini with API key (free tier)
let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    console.log('🔑 Initializing Gemini with API Key:',
      `${process.env.GEMINI_API_KEY.substring(0, 10)}...${process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4)}`);
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

/**
 * Get Gemini Model Instance (using free tier API)
 */
const getModel = () => {
  return getGenAI().getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  });
};

/**
 * Generate System Prompt for Interview
 */
export const generateSystemPrompt = (userProfile, mode) => {
  return createSystemPrompt(userProfile, mode);
};

/**
 * Process Conversation Turn with Gemini (for ElevenLabs Custom LLM)
 */
export const processConversationTurn = async (systemPrompt, conversationHistory, mode) => {
  try {
    const model = getModel();

    // Build conversation history for Gemini
    // Gemini's chat history must alternate between user and model roles
    const formattedHistory = [];

    // If conversation is empty (first message), just include system prompt
    if (conversationHistory.length === 0) {
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: `SYSTEM INSTRUCTIONS:\n${systemPrompt}\n\nYou are now in this role. Begin the interview.` }]
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I am ready to conduct the interview.' }]
          }
        ]
      });

      const result = await chat.sendMessage('Begin the interview with your opening question.');
      return { content: result.response.text() };
    }

    // Add system context as first exchange
    formattedHistory.push({
      role: 'user',
      parts: [{ text: `SYSTEM INSTRUCTIONS:\n${systemPrompt}\n\nYou are now in this role. Begin the interview.` }]
    });
    formattedHistory.push({
      role: 'model',
      parts: [{ text: 'Good morning. Please state your full name and the type of visa you are applying for.' }]
    });

    // Add all conversation history except the last user message
    // (we'll send that separately)
    for (let i = 0; i < conversationHistory.length - 1; i++) {
      const msg = conversationHistory[i];
      const role = msg.role === 'user' ? 'user' : 'model';
      formattedHistory.push({
        role,
        parts: [{ text: msg.content }]
      });
    }

    // Start chat with history
    const chat = model.startChat({
      history: formattedHistory
    });

    // Send the last user message
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;

    return {
      content: response.text()
    };
  } catch (error) {
    console.error('Error in processConversationTurn:', error);
    console.error('Error details:', error.message);
    throw new Error('Failed to process conversation turn: ' + error.message);
  }
};

/**
 * Detect Red Flags (disabled for simulation mode)
 */
export const detectRedFlags = async (answer, systemPrompt) => {
  // Simulation mode doesn't need real-time red flag detection
  return null;
};

/**
 * Analyze Complete Interview
 */
export const analyzeInterview = async (transcript, userProfile) => {
  try {
    const model = getModel();
    const { visaType } = userProfile;

    const prompt = generateAnalysisPrompt(visaType, userProfile, transcript);

    console.log('🔍 Starting interview analysis...');
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log('✅ Analysis completed');

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ Failed to parse JSON from response:', responseText.substring(0, 200));
      throw new Error('Failed to parse analysis response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return {
      overallScore: analysis.overallScore || 0,
      approvalLikelihood: analysis.approvalLikelihood || 0,
      likelyOutcome: analysis.likelyOutcome || 'uncertain',
      keyFactor: analysis.keyFactor || '',
      redFlags: analysis.redFlags || [],
      strengths: analysis.strengths || [],
      scores: {
        clarity: analysis.scores?.clarity || 0,
        confidence: analysis.scores?.confidence || 0,
        specificity: analysis.scores?.specificity || 0,
        returnIntent: analysis.scores?.returnIntent || 0
      },
      recommendations: analysis.recommendations || [],
      weakAnswersAnalysis: analysis.weakAnswersAnalysis || [],
      nextFocus: analysis.nextFocus || '',
      readyForRealInterview: analysis.readyForRealInterview || false,
      whatsMissing: analysis.whatsMissing || '',
      recommendedSessions: analysis.recommendedSessions || 3
    };
  } catch (error) {
    console.error('Error in analyzeInterview:', error);
    throw new Error('Failed to analyze interview');
  }
};
