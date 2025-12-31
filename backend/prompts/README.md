# Gemini Prompt Templates

This directory contains all AI prompt templates for the visa interview application.

## Files

### `systemPrompt.js`
Main interviewer system prompt that defines the AI's role as a US consular officer.

**Features:**
- Adapts to visa type (F-1, H-1B, B-1/B-2, J-1, L-1, O-1, K-1)
- Country-specific context and concerns
- Mode-specific behavior (Practice vs Simulation)
- Structured interview flow
- Realistic officer behavior

### `countryContext.js`
Country-specific patterns and concerns that real consular officers consider.

**Includes:**
- India, China, Nigeria, Vietnam, Brazil, Mexico, Pakistan, Bangladesh, Philippines
- Common visa concerns by country
- Economic context
- Return intent factors

### `visaRequirements.js`
Visa-type specific interview requirements and denial triggers.

**Covers:**
- F-1 Student Visa
- H-1B Work Visa
- B-1/B-2 Tourist/Business
- J-1 Exchange Visitor
- L-1 Intracompany Transfer
- O-1 Extraordinary Ability
- K-1 Fiance Visa

### `redFlagDetection.js`
Analyzes individual answers for potential red flags in Practice mode.

**Detects:**
- Immigrant intent
- Vague/evasive answers
- Financial concerns
- Weak home country ties
- Inconsistencies

**Output:** JSON with red flag details, severity, and improvement suggestions

### `analysisPrompt.js`
Comprehensive post-interview analysis and feedback.

**Provides:**
- Overall score (1-10)
- Approval likelihood (%)
- Red flags identified
- Strengths and weaknesses
- Detailed recommendations
- Readiness assessment

**Output:** Complete JSON analysis matching Firestore schema

## Usage

```javascript
import {
  generateSystemPrompt,
  generateRedFlagPrompt,
  generateAnalysisPrompt
} from './prompts/index.js';

// Generate system prompt for interview
const systemPrompt = generateSystemPrompt(userProfile, 'practice');

// Detect red flags in an answer
const redFlagPrompt = generateRedFlagPrompt(
  'F-1',
  'India',
  'Why do you want to study in the US?',
  'Because jobs are better there'
);

// Analyze complete interview
const analysisPrompt = generateAnalysisPrompt(
  'F-1',
  userProfile,
  transcript
);
```

## Prompt Engineering Notes

### System Prompt Design
- **Concise responses:** Officer keeps answers to 1-2 sentences
- **One question at a time:** Natural conversation flow
- **Skeptical but fair:** Reflects real officer behavior
- **Time-constrained:** 2-3 minute interviews (10-15 questions)

### Practice Mode Coaching
- Pauses when red flags detected
- Explains what went wrong
- Provides specific improvement suggestions
- Educational and constructive

### Simulation Mode Realism
- No interruptions or coaching
- Realistic approval/denial at end
- Feedback only after interview completes
- Mimics actual embassy experience

### JSON Response Format
All prompts requesting JSON responses specify:
- Strict JSON format (no markdown, no code blocks)
- Exact schema with required fields
- Example responses for guidance

## Testing Prompts

When Vertex AI is configured, test with:
1. Multiple visa types
2. Different countries
3. Various applicant profiles
4. Edge cases (weak answers, strong answers)
5. Both interview modes

## Future Enhancements

- Additional countries with specific contexts
- More visa categories (E-2, EB-5, etc.)
- Multilingual support
- Industry-specific guidance for work visas
- Academic field-specific questions for student visas
