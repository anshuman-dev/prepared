/**
 * Centralized Prompt Management
 * Export all prompt generation functions
 */

export { generateSystemPrompt } from './systemPrompt.js';
export { generateRedFlagPrompt } from './redFlagDetection.js';
export { generateAnalysisPrompt } from './analysisPrompt.js';
export { getCountryContext } from './countryContext.js';
export { getVisaRequirements } from './visaRequirements.js';
