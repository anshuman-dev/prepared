import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI, interviewAPI } from '../../services/api';
import { INTERVIEW_MODES } from '../../utils/constants';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingInterview, setStartingInterview] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getSessions();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async (mode) => {
    try {
      setStartingInterview(true);
      setError('');

      const data = await interviewAPI.start(mode);

      // Navigate to interview page with session data
      navigate('/interview', {
        state: {
          sessionId: data.sessionId,
          agentConfig: data.agentConfig,
          mode
        }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start interview');
      setStartingInterview(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.profile?.fullName || 'User'}</h1>
            <p className="text-gray-600 mt-1">
              {user?.profile?.visaType} Visa Interview Practice
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Start Interview Card */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="card bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200">
            <div className="mb-4 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Interview Simulation</h2>
              <p className="text-gray-600">
                Experience a realistic US visa interview with AI-powered voice conversation. Get comprehensive analysis afterward.
              </p>
            </div>
            <ul className="mb-6 space-y-2 text-sm text-gray-700 max-w-md mx-auto">
              <li className="flex items-center">
                <span className="mr-2">✓</span> Authentic interview experience with voice
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> No interruptions during the interview
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> AI-powered analysis and feedback
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Track your progress over time
              </li>
            </ul>
            <button
              onClick={() => startInterview(INTERVIEW_MODES.SIMULATION)}
              disabled={startingInterview}
              className="btn-primary w-full bg-purple-600 hover:bg-purple-700 text-lg py-3"
            >
              {startingInterview ? 'Starting Interview...' : 'Start Interview Simulation'}
            </button>
          </div>
        </div>

        {/* Past Sessions */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interview History</h2>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No interview sessions yet</p>
              <p className="text-sm">Start your first practice interview to see your progress!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.sessionId}
                  onClick={() => session.status === 'completed' && navigate(`/results/${session.sessionId}`)}
                  className={`p-4 border rounded-lg transition-all ${
                    session.status === 'completed'
                      ? 'cursor-pointer hover:border-primary hover:shadow-md'
                      : 'cursor-default'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {session.mode === INTERVIEW_MODES.PRACTICE ? 'Practice' : 'Simulation'} Interview
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status === 'in_progress' ? 'In Progress' : 'Completed'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(session.startedAt)}
                      </p>
                      {session.analysis && (
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="text-gray-700">
                            Score: <span className="font-semibold">{session.analysis.overallScore}/10</span>
                          </span>
                          <span className="text-gray-700">
                            Approval: <span className="font-semibold">{session.analysis.approvalLikelihood}%</span>
                          </span>
                        </div>
                      )}
                    </div>
                    {session.status === 'completed' && (
                      <span className="text-primary text-sm font-medium">
                        View Results →
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
