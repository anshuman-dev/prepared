/**
 * Red Flag Detection Prompt for Practice Mode
 * Analyzes individual answers for potential issues
 */

export const generateRedFlagPrompt = (visaType, country, question, answer) => {
  return `Analyze this visa interview answer for red flags:

CONTEXT:
- Visa Type: ${visaType}
- Applicant from: ${country}
- Question asked: "${question}"
- Applicant's answer: "${answer}"

TASK:
Identify if this answer raises any concerns for a consular officer.

RED FLAGS TO CHECK:

1. Immigrant Intent
   - Mentions staying in US long-term
   - Talks about US job market, salaries, opportunities
   - Vague about return plans
   - Says things like "better life", "better opportunities"
   - Mentions wanting to work for US companies
   - Expresses desire to "settle" in the US

2. Vague/Evasive Answers
   - Generic responses lacking specificity
   - Rehearsed-sounding, not genuine
   - Doesn't actually answer the question
   - "I don't know" or "I'm not sure"
   - Overly general statements
   - No concrete details or examples

3. Financial Concerns
   - Unclear funding source
   - Numbers don't add up
   - Reliance on loans without collateral
   - Income seems insufficient for claimed expenses
   - Vague about total costs
   - No proof or documentation mentioned

4. Weak Home Country Ties
   - No family back home
   - No job prospects mentioned
   - No property or assets
   - No compelling reason to return
   - All family already in the US
   - No career plan in home country

5. Inconsistencies
   - Contradicts previous answer
   - Story doesn't make logical sense
   - Defensive or nervous behavior signals
   - Details don't align with profile

RESPOND IN STRICT JSON FORMAT (no markdown, no code blocks, just raw JSON):
{
  "hasRedFlag": true or false,
  "severity": "high" or "medium" or "low" or null,
  "type": "immigrant_intent" or "vague_answer" or "financial" or "weak_ties" or "inconsistent" or null,
  "explanation": "Clear explanation of what's wrong and why it's concerning",
  "betterAnswer": "Specific suggestion for how to rephrase this better",
  "shouldPause": true or false
}

EXAMPLES:

Answer: "I want to work at Google after I graduate"
Response:
{
  "hasRedFlag": true,
  "severity": "high",
  "type": "immigrant_intent",
  "explanation": "Stating intent to work at a US company signals you plan to stay, which is immigrant intent. F-1 visa requires you return home after studies.",
  "betterAnswer": "Focus on gaining skills through OPT that you'll use for career opportunities back in [home country], such as specific companies or industries there.",
  "shouldPause": true
}

Answer: "I like computer science"
Response:
{
  "hasRedFlag": true,
  "severity": "medium",
  "type": "vague_answer",
  "explanation": "Too generic. Officers want specifics: which area of CS? What research interests? Why this program specifically?",
  "betterAnswer": "Be specific: 'I'm interested in machine learning, particularly natural language processing. This university's NLP lab led by Professor X is one of the few programs that combines theoretical research with practical applications.'",
  "shouldPause": true
}

Answer: "My uncle will pay"
Response:
{
  "hasRedFlag": true,
  "severity": "medium",
  "type": "financial",
  "explanation": "Need concrete proof of uncle's income, willingness to pay, and relationship. Just saying 'uncle will pay' isn't sufficient.",
  "betterAnswer": "Provide specifics: 'My uncle, who is a software engineer at [company] earning [amount], has agreed to sponsor my education. I have his bank statements and a notarized affidavit of support.'",
  "shouldPause": true
}

Answer: "I will return to work in my family's business after graduation"
Response:
{
  "hasRedFlag": false,
  "severity": null,
  "type": null,
  "explanation": null,
  "betterAnswer": null,
  "shouldPause": false
}

Now analyze the provided answer and respond with JSON only.`;
};

export default generateRedFlagPrompt;
