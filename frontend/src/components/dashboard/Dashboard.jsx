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
        return 'text-[#FF7A59] bg-[#FF7A59]/10 border-[#FF7A59]/20';
      case 'in_progress':
        return 'text-[#F5E6D3] bg-[#F5E6D3]/10 border-[#F5E6D3]/20';
      default:
        return 'text-[#B39B8A] bg-[#B39B8A]/10 border-[#B39B8A]/20';
    }
  };

  return (
    <div
      className="min-h-screen p-8 relative"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
          linear-gradient(135deg, #3D1F1F 0%, #4A2828 100%)
        `,
        backgroundSize: '60px 60px, 60px 60px, cover'
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif text-[#F5E6D3]">
              Hey {user?.profile?.fullName?.split(' ')[0] || 'there'} 👋
            </h1>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2 text-[#F5E6D3] hover:text-[#FF7A59] transition-colors border-2 border-[#F5E6D3] hover:border-[#FF7A59]"
          >
            Sign Out
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-[#FF7A59]/10 border-2 border-[#FF7A59] text-[#FF7A59]">
            {error}
          </div>
        )}

        {/* Start Interview Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-[#2E1616] border-2 border-[#5A3838] p-8 shadow-2xl">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-serif text-[#F5E6D3] mb-3">
                Start Interview <span className="italic text-[#FF7A59]">Simulation</span>
              </h2>
              <p className="text-[#B39B8A]">
                Experience a realistic US visa interview with AI-powered voice conversation.
              </p>
            </div>
            <ul className="mb-8 space-y-3 text-[#B39B8A] max-w-md mx-auto">
              <li className="flex items-center">
                <span className="mr-3 text-[#FF7A59]">✓</span>
                Authentic interview experience with voice
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-[#FF7A59]">✓</span>
                No interruptions during the interview
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-[#FF7A59]">✓</span>
                AI-powered analysis and feedback
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-[#FF7A59]">✓</span>
                Track your progress over time
              </li>
            </ul>
            <button
              onClick={() => startInterview(INTERVIEW_MODES.SIMULATION)}
              disabled={startingInterview}
              className="w-full px-8 py-4 bg-[#FF7A59] text-white text-lg font-medium hover:bg-[#FF8C6B] transition-all duration-200 border-2 border-[#FF7A59] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {startingInterview ? 'Starting Interview...' : 'Start Interview Simulation'}
            </button>
          </div>
        </div>

        {/* Past Sessions */}
        <div className="bg-[#2E1616] border-2 border-[#5A3838] p-8 shadow-2xl">
          <h2 className="text-2xl font-serif text-[#F5E6D3] mb-6">Interview History</h2>

          {loading ? (
            <div className="text-center py-12 text-[#B39B8A]">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 text-[#B39B8A]">
              <p className="mb-2">No interview sessions yet</p>
              <p className="text-sm">Start your first practice interview to see your progress!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.sessionId}
                  onClick={() => session.status === 'completed' && navigate(`/results/${session.sessionId}`)}
                  className={`p-6 border-2 transition-all ${
                    session.status === 'completed'
                      ? 'cursor-pointer border-[#5A3838] hover:border-[#FF7A59] bg-[#3D1F1F]/30'
                      : 'cursor-default border-[#5A3838] bg-[#3D1F1F]/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-medium text-[#F5E6D3]">
                          {session.mode === INTERVIEW_MODES.PRACTICE ? 'Practice' : 'Simulation'} Interview
                        </span>
                        <span className={`px-3 py-1 border-2 text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status === 'in_progress' ? 'In Progress' : 'Completed'}
                        </span>
                      </div>
                      <p className="text-sm text-[#B39B8A] mb-3">
                        {formatDate(session.startedAt)}
                      </p>
                      {session.analysis && (
                        <div className="flex items-center gap-6 text-sm">
                          <span className="text-[#B39B8A]">
                            Score: <span className="font-semibold text-[#F5E6D3]">{session.analysis.overallScore}/10</span>
                          </span>
                          <span className="text-[#B39B8A]">
                            Approval: <span className="font-semibold text-[#F5E6D3]">{session.analysis.approvalLikelihood}%</span>
                          </span>
                        </div>
                      )}
                    </div>
                    {session.status === 'completed' && (
                      <span className="text-[#FF7A59] text-sm font-medium">
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
