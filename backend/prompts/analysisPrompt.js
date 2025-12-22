/**
 * Post-Interview Analysis Prompt
 * Comprehensive analysis of completed interview
 */

export const generateAnalysisPrompt = (visaType, profile, transcript) => {
  const { country, age, field } = profile;

  // Format transcript for analysis
  const formattedTranscript = transcript.map(msg =>
    `${msg.speaker === 'officer' ? 'OFFICER' : 'APPLICANT'}: ${msg.text}`
  ).join('\n\n');

  return `You are an expert visa interview analyst. Review this complete ${visaType} visa interview and provide comprehensive feedback.

APPLICANT PROFILE:
- Visa Type: ${visaType}
- Country: ${country}
- Age: ${age}
- Field: ${field}

FULL INTERVIEW TRANSCRIPT:
${formattedTranscript}

PROVIDE DETAILED ANALYSIS:

1. OVERALL ASSESSMENT
   - Interview Performance Score (1-10): Based on clarity, confidence, specificity
   - Approval Likelihood (%): Realistic assessment (0-100)
   - Likely Outcome: Would this be "approved" or "denied"? Why?
   - Key Factor: What was the determining factor in your decision?

2. RED FLAGS IDENTIFIED
   For each red flag found, provide:
   - Type: immigrant_intent, vague_answer, financial, weak_ties, or inconsistent
   - Severity: high, medium, or low
   - Answer: The specific answer that triggered this flag
   - Explanation: Why this is concerning to a consular officer
   - Suggestion: How to improve this answer
   - Impact: How this affects the approval decision

3. STRENGTHS
   List 3-5 things the applicant did well:
   - Specific strong answers
   - Good techniques they used
   - Positive patterns observed

4. ANSWER QUALITY BREAKDOWN (Score each 1-10)
   - Clarity: How clear and articulate were responses?
   - Confidence: How confident did they sound?
   - Specificity: How detailed and specific were answers?
   - Return Intent Strength: How convincing were their return plans?

5. SPECIFIC IMPROVEMENTS
   - Top 3 things to improve immediately
   - For the 2-3 weakest answers, provide:
     * Original answer
     * Why it was weak
     * Suggested better phrasing
   - What to practice before next session

6. NEXT PRACTICE FOCUS
   - Primary area to focus on in next practice interview
   - Are they ready for the real interview? (yes/no)
   - If not ready, what's specifically missing?
   - Recommended number of additional practice sessions (0-5)

RESPOND IN STRICT JSON FORMAT (no markdown, no code blocks, just raw JSON):
{
  "overallScore": number (1-10),
  "approvalLikelihood": number (0-100),
  "likelyOutcome": "approved" or "denied",
  "keyFactor": "string explaining main determining factor",
  "redFlags": [
    {
      "type": "immigrant_intent|vague_answer|financial|weak_ties|inconsistent",
      "severity": "high|medium|low",
      "answer": "the problematic answer",
      "explanation": "why this is concerning",
      "suggestion": "how to improve",
      "impact": "how this affects approval"
    }
  ],
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3"
  ],
  "scores": {
    "clarity": number (1-10),
    "confidence": number (1-10),
    "specificity": number (1-10),
    "returnIntent": number (1-10)
  },
  "recommendations": [
    "improvement 1",
    "improvement 2",
    "improvement 3"
  ],
  "weakAnswersAnalysis": [
    {
      "original": "weak answer",
      "issue": "what was wrong",
      "improved": "better version"
    }
  ],
  "nextFocus": "primary area to work on",
  "readyForRealInterview": true or false,
  "whatsMissing": "explanation if not ready, or null if ready",
  "recommendedSessions": number (0-5)
}

Be honest, specific, and constructive. This feedback will help them improve.

Analyze the interview and respond with JSON only.`;
};

export default generateAnalysisPrompt;
