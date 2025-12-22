/**
 * Country-Specific Context for Visa Interviews
 * These reflect real patterns that consular officers consider
 */

const COUNTRY_CONTEXTS = {
  India: `High volume of F-1/H-1B applicants. Common concerns: intent to stay for work (H-1B pathway), family already in US pulling applicant. Probe return plans carefully. Strong tech industry back home provides credible return options.`,

  China: `STEM field scrutiny for technology transfer concerns. Strong emphasis on return intent due to large diaspora. Ask about specific research that doesn't involve sensitive technologies. Growing economy provides credible career opportunities.`,

  Nigeria: `Financial verification is critical due to fraud concerns. Scrutinize funding sources carefully. Ask for concrete evidence of family income. Probe the authenticity of job offers or university acceptance letters.`,

  Vietnam: `Similar to China for STEM concerns. Verify university acceptance and program authenticity. Growing economy offers good return prospects. Family ties are typically strong.`,

  Brazil: `Economic factors - verify funding is sufficient given exchange rates. Assess career prospects back home. Strong family culture provides credible return ties.`,

  Mexico: `Geographic proximity increases concerns about staying illegally. Strong emphasis on return intent and ties to home country. Family and property ownership are important factors.`,

  Pakistan: `Security screening is thorough. STEM fields face additional scrutiny. Funding sources must be clearly documented. Family ties and property ownership strengthen the application.`,

  Bangladesh: `Similar patterns to India. Verify financial capacity carefully. Growing tech sector provides return opportunities. Family ties are typically strong.`,

  Philippines: `Large diaspora in US increases scrutiny of return intent. Healthcare and IT workers face particular questions. Remittance culture is understood. Family ties are very important.`,

  Default: `Standard interview procedures apply. Focus on the three key areas: eligibility verification, financial capacity, and return intent. Be thorough but fair in your assessment.`
};

/**
 * Get Country-Specific Context
 * @param {string} country - Country name
 * @returns {string} Context for this country
 */
export const getCountryContext = (country) => {
  return COUNTRY_CONTEXTS[country] || COUNTRY_CONTEXTS.Default;
};

export default getCountryContext;
