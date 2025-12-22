/**
 * Visa-Type Specific Requirements
 * What must be covered in each visa type interview
 */

const VISA_REQUIREMENTS = {
  'F-1': `VISA-SPECIFIC REQUIREMENTS (F-1 Student Visa):

You MUST cover these three critical areas:

1. STUDY PLANS (Required)
   - What will you study?
   - Why this specific university?
   - Why this field of study?
   - Why not study this in your home country?
   - What specific program or research interests you?

2. FINANCIAL CAPACITY (LEGALLY REQUIRED)
   - Who is paying for your education?
   - What is the total cost (tuition + living expenses)?
   - Show proof of funding
   - What is your/your family's income source?
   - How much in savings/assets?

3. RETURN INTENT (CRITICAL - determines approval/denial)
   - What will you do after graduation?
   - What ties do you have to your home country?
   - Why will you return home?
   - Do you have family in the US?
   - Do you plan to work in the US? (OPT is acceptable, but wanting to stay permanently = denial)
   - What job prospects await you back home?

DENIAL TRIGGERS:
- Any indication of wanting to stay in US permanently
- Vague or non-existent career plans in home country
- Insufficient funding proof
- All family already in US with no ties back home`,

  'H-1B': `VISA-SPECIFIC REQUIREMENTS (H-1B Work Visa):

You MUST cover these areas:

1. JOB DETAILS (Required)
   - What is your job title and role?
   - What company hired you?
   - What will you be doing specifically?
   - Why does this job require your specific skills?

2. QUALIFICATIONS (Required)
   - What is your educational background?
   - What relevant work experience do you have?
   - Why are you qualified for this specialty occupation?

3. TEMPORARY INTENT (Critical)
   - Do you understand this is a temporary work visa?
   - What are your plans when the H-1B period ends?
   - Do you have ties to your home country?
   - What will you do after returning home?

4. EMPLOYER VERIFICATION
   - How did you find this job?
   - Have you been to the US before?
   - Do you have family in the US?

DENIAL TRIGGERS:
- Job doesn't clearly require specialized knowledge
- Qualifications don't match the role
- Signs of immigrant intent
- Unrealistic salary for the role`,

  'B-1/B-2': `VISA-SPECIFIC REQUIREMENTS (B-1/B-2 Tourist/Business Visa):

You MUST cover:

1. PURPOSE OF VISIT (Required)
   - Why are you going to the US?
   - Where will you go? For how long?
   - Who will you visit? (if applicable)
   - What business will you conduct? (B-1)

2. FINANCIAL CAPACITY (Required)
   - Who is paying for this trip?
   - What is your job/income?
   - Do you have sufficient funds?

3. RETURN ASSURANCE (Critical)
   - What ties you to your home country?
   - What is your job here?
   - Do you own property?
   - Why will you definitely return?

DENIAL TRIGGERS:
- Vague travel plans
- Insufficient funds for stated trip
- No compelling reason to return
- Overstay risk factors`,

  'J-1': `VISA-SPECIFIC REQUIREMENTS (J-1 Exchange Visitor):

You MUST cover:

1. PROGRAM DETAILS (Required)
   - What exchange program are you participating in?
   - Who is your sponsor organization?
   - What will you be doing?
   - How long is the program?

2. PROGRAM RELEVANCE
   - How does this relate to your studies/career?
   - What will you gain from this?
   - Why this specific program?

3. RETURN INTENT (Critical)
   - You are subject to 2-year home residency requirement
   - What will you do when you return home?
   - How will this exchange benefit your home country?

DENIAL TRIGGERS:
- Unclear program purpose
- Signs of wanting to stay beyond program
- Insufficient ties to home country`,

  'L-1': `VISA-SPECIFIC REQUIREMENTS (L-1 Intracompany Transfer):

You MUST cover:

1. EMPLOYMENT HISTORY (Required)
   - How long have you worked for this company?
   - What is your role in the foreign office?
   - What will be your role in the US office?

2. COMPANY RELATIONSHIP
   - What is the relationship between the foreign and US offices?
   - Why is this transfer necessary?
   - How long will you be in the US?

3. TEMPORARY INTENT
   - This is a temporary transfer - do you understand?
   - What happens when the assignment ends?
   - Do you plan to return to your home country?

DENIAL TRIGGERS:
- Company relationship unclear
- Role doesn't justify transfer
- Signs of permanent immigration intent`,

  'O-1': `VISA-SPECIFIC REQUIREMENTS (O-1 Extraordinary Ability):

You MUST cover:

1. EXTRAORDINARY ABILITY (Required)
   - What field is your extraordinary ability in?
   - What major achievements demonstrate this?
   - What will you do in the US?
   - Who will you work with/for?

2. RECOGNITION
   - What awards or recognition have you received?
   - How are you nationally or internationally recognized?

3. US ENGAGEMENT
   - What specific engagement do you have in the US?
   - How long will you stay?
   - What happens after?

DENIAL TRIGGERS:
- Achievements don't demonstrate extraordinary ability
- Unclear US engagement
- Documentation insufficient`,

  'K-1': `VISA-SPECIFIC REQUIREMENTS (K-1 Fiance Visa):

You MUST cover:

1. RELATIONSHIP HISTORY (Required)
   - How did you meet your fiance?
   - How long have you been together?
   - When did you last meet in person?
   - Where did you meet?

2. MARRIAGE PLANS
   - When do you plan to marry?
   - Where will the wedding be?
   - Have you met your fiance's family?

3. RELATIONSHIP GENUINENESS
   - What does your fiance do for work?
   - What are your fiance's interests?
   - How do you communicate?
   - What are your plans after marriage?

DENIAL TRIGGERS:
- Relationship seems fraudulent
- Haven't met in person within 2 years
- Inconsistent stories
- Financial motive suspected`
};

/**
 * Get Visa-Type Specific Requirements
 * @param {string} visaType - Visa type (F-1, H-1B, etc.)
 * @returns {string} Requirements for this visa type
 */
export const getVisaRequirements = (visaType) => {
  return VISA_REQUIREMENTS[visaType] || VISA_REQUIREMENTS['F-1'];
};

export default getVisaRequirements;
