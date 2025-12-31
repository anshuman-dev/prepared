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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="card text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="card text-center">
          <p className="text-gray-600">No analysis available</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 animate-fadeIn">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Analysis</h1>
          <p className="text-gray-600">Comprehensive feedback on your performance</p>
        </div>

        {/* Overall Score Card */}
        <div className="card bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore.toFixed(1)}
              </div>
              <div className="text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2 text-blue-600">
                {analysis.approvalLikelihood}%
              </div>
              <div className="text-gray-600">Approval Likelihood</div>
            </div>
            <div className="text-center">
              <div className={`inline-block px-4 py-2 rounded-full text-xl font-bold mb-2 ${getOutcomeColor(analysis.likelyOutcome)}`}>
                {analysis.likelyOutcome.toUpperCase()}
              </div>
              <div className="text-gray-600">Likely Outcome</div>
            </div>
          </div>
          {analysis.keyFactor && (
            <div className="mt-6 pt-6 border-t border-blue-200">
              <p className="text-center text-gray-700">
                <span className="font-semibold">Key Factor:</span> {analysis.keyFactor}
              </p>
            </div>
          )}
        </div>

        {/* Detailed Scores */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4">Performance Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(analysis.scores).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`font-bold ${getScoreColor(value)}`}>
                    {value}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      value >= 8 ? 'bg-green-500' :
                      value >= 6 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${value * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <div className="card bg-green-50">
            <h2 className="text-xl font-bold mb-4 text-green-900">Strengths</h2>
            {analysis.strengths && analysis.strengths.length > 0 ? (
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No specific strengths identified</p>
            )}
          </div>

          {/* Red Flags */}
          <div className="card bg-red-50">
            <h2 className="text-xl font-bold mb-4 text-red-900">Red Flags</h2>
            {analysis.redFlags && analysis.redFlags.length > 0 ? (
              <ul className="space-y-3">
                {analysis.redFlags.map((flag, index) => (
                  <li key={index} className="border-l-4 border-red-400 pl-3">
                    <div className="font-medium text-red-900">{flag.type}</div>
                    <div className="text-sm text-gray-700">{flag.explanation}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No red flags detected! Great job!</p>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
          {analysis.recommendations && analysis.recommendations.length > 0 ? (
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-3 mt-1">→</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No specific recommendations</p>
          )}
        </div>

        {/* Next Steps */}
        <div className="card bg-blue-50 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Next Focus</h3>
              <p className="text-gray-700">{analysis.nextFocus || 'Keep practicing!'}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Ready for Real Interview?</h3>
              <p className="text-gray-700">
                {analysis.readyForRealInterview ? (
                  <span className="text-green-700 font-semibold">Yes! You're ready.</span>
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

        {/* Weak Answers Analysis */}
        {analysis.weakAnswersAnalysis && analysis.weakAnswersAnalysis.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4">Areas for Improvement</h2>
            <div className="space-y-4">
              {analysis.weakAnswersAnalysis.map((item, index) => (
                <div key={index} className="border-l-4 border-yellow-400 pl-4">
                  <div className="font-medium text-gray-900 mb-1">{item.question}</div>
                  <div className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Your answer:</span> {item.answer}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Improvement:</span> {item.suggestion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript */}
        {session?.transcript && session.transcript.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4">Full Transcript</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {session.transcript.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.speaker === 'officer'
                      ? 'bg-blue-50 text-blue-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">
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
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Practice Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
