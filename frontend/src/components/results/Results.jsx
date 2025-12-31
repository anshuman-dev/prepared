import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { interviewAPI } from '../../services/api';

const Results = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const location = useLocation();
  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(!analysis);

  useEffect(() => {
    if (!analysis && sessionId) {
      fetchSession();
    }
  }, [sessionId, analysis]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const data = await interviewAPI.getSession(sessionId);
      setSession(data);
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error fetching session:', error);
      alert('Failed to load results');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome?.toLowerCase()) {
      case 'approved':
        return 'text-green-700 bg-green-100';
      case 'denied':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-yellow-700 bg-yellow-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
            linear-gradient(135deg, #3D1F1F 0%, #4A2828 100%)
          `,
          backgroundSize: '60px 60px, 60px 60px, cover'
        }}
      >
        <div className="bg-[#2E1616] border-2 border-[#5A3838] p-12 shadow-2xl text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#5A3838] border-t-[#FF7A59] mb-4"></div>
          <p className="text-[#B39B8A]">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
            linear-gradient(135deg, #3D1F1F 0%, #4A2828 100%)
          `,
          backgroundSize: '60px 60px, 60px 60px, cover'
        }}
      >
        <div className="bg-[#2E1616] border-2 border-[#5A3838] p-12 shadow-2xl text-center">
          <p className="text-[#B39B8A] mb-4">No analysis available</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#FF7A59] text-white font-medium hover:bg-[#FF8C6B] transition-all duration-200 border-2 border-[#FF7A59]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
          linear-gradient(135deg, #3D1F1F 0%, #4A2828 100%)
        `,
        backgroundSize: '60px 60px, 60px 60px, cover'
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-[#F5E6D3] mb-2">
            Interview <span className="italic text-[#FF7A59]">Analysis</span>
          </h1>
          <p className="text-[#B39B8A]">Comprehensive feedback on your performance</p>
        </div>

        {/* Key Metrics Card */}
        <div className="bg-[#2E1616] border-2 border-[#5A3838] p-8 shadow-2xl mb-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2 text-[#FF7A59]">
                {analysis.approvalLikelihood}%
              </div>
              <div className="text-[#B39B8A]">Approval Likelihood</div>
            </div>
            <div className="text-center">
              <div className={`inline-block px-6 py-3 border-2 text-xl font-bold mb-2 ${
                analysis.likelyOutcome.toLowerCase() === 'approved'
                  ? 'text-[#F5E6D3] border-[#F5E6D3]'
                  : 'text-[#FF7A59] border-[#FF7A59]'
              }`}>
                {analysis.likelyOutcome.toUpperCase()}
              </div>
              <div className="text-[#B39B8A]">Likely Outcome</div>
            </div>
          </div>
          {analysis.keyFactor && (
            <div className="mt-6 pt-6 border-t border-[#5A3838]">
              <p className="text-center text-[#B39B8A]">
                <span className="font-semibold text-[#F5E6D3]">Key Factor:</span> {analysis.keyFactor}
              </p>
            </div>
          )}
        </div>

        {/* Detailed Scores */}
        <div className="bg-[#2E1616] border-2 border-[#5A3838] p-8 shadow-2xl mb-6">
          <h2 className="text-2xl font-serif text-[#F5E6D3] mb-6">Performance Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(analysis.scores).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-[#F5E6D3] capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-bold text-[#FF7A59]">
                    {value}/10
                  </span>
                </div>
                <div className="w-full bg-[#5A3838] h-3 border border-[#5A3838]">
                  <div
                    className="h-full bg-[#FF7A59] transition-all"
                    style={{ width: `${value * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <div className="bg-[#2E1616] border-2 border-[#F5E6D3]/30 p-6 shadow-2xl">
            <h2 className="text-xl font-serif text-[#F5E6D3] mb-4">Strengths</h2>
            {analysis.strengths && analysis.strengths.length > 0 ? (
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#F5E6D3] mr-2">✓</span>
                    <span className="text-[#B39B8A]">{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#B39B8A]">No specific strengths identified</p>
            )}
          </div>

          {/* Red Flags */}
          <div className="bg-[#2E1616] border-2 border-[#FF7A59]/30 p-6 shadow-2xl">
            <h2 className="text-xl font-serif text-[#F5E6D3] mb-4">Red Flags</h2>
            {analysis.redFlags && analysis.redFlags.length > 0 ? (
              <ul className="space-y-3">
                {analysis.redFlags.map((flag, index) => (
                  <li key={index} className="border-l-4 border-[#FF7A59] pl-3">
                    <div className="font-medium text-[#FF7A59]">{flag.type}</div>
                    <div className="text-sm text-[#B39B8A]">{flag.explanation}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#B39B8A]">No red flags detected! Great job!</p>
            )}
          </div>
        </div>

        {/* Recommendations & Areas for Improvement - Combined */}
        <div className="bg-[#2E1616] border-2 border-[#5A3838] p-8 shadow-2xl mb-6">
          <h2 className="text-2xl font-serif text-[#F5E6D3] mb-6">Recommendations & Areas for Improvement</h2>

          {/* General Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[#FF7A59] mb-3">Key Recommendations</h3>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#FF7A59] mr-3 mt-1">→</span>
                    <span className="text-[#B39B8A]">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specific Answer Improvements */}
          {analysis.weakAnswersAnalysis && analysis.weakAnswersAnalysis.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-[#FF7A59] mb-3">Specific Answer Improvements</h3>
              <div className="space-y-4">
                {analysis.weakAnswersAnalysis.map((item, index) => (
                  <div key={index} className="border-l-4 border-[#FF7A59] pl-4 py-2">
                    <div className="text-sm text-[#B39B8A] mb-2">
                      <span className="font-medium text-[#F5E6D3]">Your answer:</span> {item.answer}
                    </div>
                    <div className="text-sm text-[#B39B8A]">
                      <span className="font-medium text-[#F5E6D3]">Improvement:</span> {item.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!analysis.recommendations?.length && !analysis.weakAnswersAnalysis?.length && (
            <p className="text-[#B39B8A]">Great job! No specific recommendations at this time.</p>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-[#2E1616] border-2 border-[#5A3838] p-8 shadow-2xl mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif text-[#F5E6D3] mb-2">Next Focus</h3>
              <p className="text-[#B39B8A]">{analysis.nextFocus || 'Keep practicing!'}</p>
            </div>
            <div>
              <h3 className="font-serif text-[#F5E6D3] mb-2">Ready for Real Interview?</h3>
              <p className="text-[#B39B8A]">
                {analysis.readyForRealInterview ? (
                  <span className="text-[#F5E6D3] font-semibold">Yes! You're ready.</span>
                ) : (
                  <>
                    Not yet. {analysis.whatsMissing}
                    <br />
                    <span className="text-sm">
                      Recommended sessions: {analysis.recommendedSessions}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Transcript */}
        {session?.transcript && session.transcript.length > 0 && (
          <div className="bg-[#2E1616] border-2 border-[#5A3838] p-8 shadow-2xl mb-6">
            <h2 className="text-2xl font-serif text-[#F5E6D3] mb-6">Full Transcript</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {session.transcript.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 ${
                    msg.speaker === 'officer'
                      ? 'bg-[#FF7A59]/10 border-[#FF7A59] text-[#F5E6D3]'
                      : 'bg-[#F5E6D3]/10 border-[#F5E6D3] text-[#F5E6D3]'
                  }`}
                >
                  <div className="font-medium text-sm mb-1 opacity-70">
                    {msg.speaker === 'officer' ? 'Officer' : 'You'}
                  </div>
                  <div className="text-sm">{msg.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-transparent text-[#F5E6D3] font-medium hover:bg-[#F5E6D3]/10 transition-all duration-200 border-2 border-[#F5E6D3]"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-[#FF7A59] text-white font-medium hover:bg-[#FF8C6B] transition-all duration-200 border-2 border-[#FF7A59]"
          >
            Practice Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
