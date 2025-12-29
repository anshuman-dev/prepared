import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConversation } from '@elevenlabs/react';
import { interviewAPI } from '../../services/api';
import { INTERVIEW_MODES } from '../../utils/constants';

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, agentConfig, mode } = location.state || {};

  const [transcript, setTranscript] = useState([]);
  const [redFlag, setRedFlag] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // AI is speaking
  const [isListening, setIsListening] = useState(false); // User is speaking
  const [micPermission, setMicPermission] = useState('checking');
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // ElevenLabs conversation hook
  const conversation = useConversation({
    agentId: agentConfig?.agentId,
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      console.log('SessionId in URL query param:', sessionId);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      handleEndInterview();
    },
    onMessage: (message) => {
      console.log('Message:', message);
      setTranscript(prev => [...prev, message]);

      // Visual feedback: AI is speaking
      if (message.source === 'ai') {
        setIsSpeaking(true);
        setIsListening(false);
        // Stop speaking indicator after message duration (estimate)
        const estimatedDuration = message.message?.length * 50 || 3000; // ~50ms per character
        setTimeout(() => {
          setIsSpeaking(false);
        }, estimatedDuration);
      } else {
        // User spoke
        setIsListening(false);
        setIsSpeaking(false);
      }

      // Check for red flag in response (practice mode only)
      if (mode === INTERVIEW_MODES.PRACTICE && message.source === 'ai' && message.redFlag) {
        setRedFlag(message.redFlag);
        setTimeout(() => setRedFlag(null), 10000);
      }
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
    },
    onModeChange: (modeChange) => {
      console.log('Mode change:', modeChange);
      // Track when user is speaking vs AI is speaking
      if (modeChange.mode === 'speaking') {
        setIsListening(true);
        setIsSpeaking(false);
      } else if (modeChange.mode === 'listening') {
        setIsListening(false);
      }
    }
  });

  useEffect(() => {
    if (!sessionId || !agentConfig) {
      navigate('/dashboard');
      return;
    }

    // Check microphone permissions
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setMicPermission('granted');
        console.log('✅ Microphone access granted');
      })
      .catch((err) => {
        setMicPermission('denied');
        console.error('❌ Microphone access denied:', err);
        alert('Microphone access is required for voice interview. Please allow microphone access and refresh the page.');
      });

    // Start conversation and timer
    conversation.startSession();
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      conversation.endSession();
    };
  }, [sessionId, agentConfig]);

  const handleEndInterview = async () => {
    try {
      setIsAnalyzing(true);
      await conversation.endSession();

      // Call analyze endpoint
      const data = await interviewAPI.analyze(sessionId);

      // Navigate to results page
      navigate(`/results/${sessionId}`, {
        state: { analysis: data.analysis }
      });
    } catch (error) {
      console.error('Error analyzing interview:', error);
      alert('Failed to analyze interview. Redirecting to dashboard...');
      navigate('/dashboard');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const dismissRedFlag = () => {
    setRedFlag(null);
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="card text-center max-w-md">
          <div className="mb-4">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Analyzing Your Interview</h2>
          <p className="text-gray-600">
            Our AI is reviewing your responses and generating detailed feedback...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === INTERVIEW_MODES.PRACTICE ? 'Practice' : 'Simulation'} Interview
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Duration: {formatDuration(duration)}
            </p>
          </div>
          <button
            onClick={handleEndInterview}
            disabled={conversation.status === 'disconnected'}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            End Interview
          </button>
        </div>

        {/* Red Flag Alert (Practice Mode) */}
        {redFlag && mode === INTERVIEW_MODES.PRACTICE && (
          <div className="mb-6 card bg-yellow-50 border-2 border-yellow-400 animate-fadeIn">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚠️</span>
                  <h3 className="text-lg font-bold text-yellow-900">
                    Red Flag Detected: {redFlag.type.replace('_', ' ').toUpperCase()}
                  </h3>
                </div>
                <p className="text-yellow-900 mb-2">
                  <span className="font-medium">Issue:</span> {redFlag.explanation}
                </p>
                <p className="text-yellow-900">
                  <span className="font-medium">Suggestion:</span> {redFlag.suggestion}
                </p>
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    redFlag.severity === 'high' ? 'bg-red-100 text-red-800' :
                    redFlag.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {redFlag.severity.toUpperCase()} SEVERITY
                  </span>
                </div>
              </div>
              <button
                onClick={dismissRedFlag}
                className="text-yellow-600 hover:text-yellow-900 ml-4"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Interview Container */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Voice Interface */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Voice Interview</h2>

            <div className="mb-6">
              <div className="flex justify-center mb-4">
                {conversation.status === 'connected' ? (
                  <div className="relative flex flex-col items-center">
                    {/* Audio Visualization */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      {/* Outer ring - always visible */}
                      <div className="absolute inset-0 w-48 h-48 rounded-full border-4 border-primary opacity-20"></div>

                      {/* Animated waves when speaking */}
                      {isSpeaking && (
                        <>
                          <div className="absolute inset-0 w-48 h-48 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
                          <div className="absolute inset-4 w-40 h-40 rounded-full bg-blue-500 opacity-30 animate-pulse"></div>
                          <div className="absolute inset-8 w-32 h-32 rounded-full bg-blue-500 opacity-40 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                        </>
                      )}

                      {/* Animated waves when user is speaking */}
                      {isListening && (
                        <>
                          <div className="absolute inset-0 w-48 h-48 rounded-full bg-green-500 opacity-20 animate-ping"></div>
                          <div className="absolute inset-4 w-40 h-40 rounded-full bg-green-500 opacity-30 animate-pulse"></div>
                          <div className="absolute inset-8 w-32 h-32 rounded-full bg-green-500 opacity-40 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                        </>
                      )}

                      {/* Center icon */}
                      <div className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all duration-300 ${
                        isSpeaking ? 'bg-blue-500 scale-110' :
                        isListening ? 'bg-green-500 scale-110' :
                        'bg-gray-400'
                      }`}>
                        {isSpeaking ? '🎙️' : isListening ? '👂' : '🎤'}
                      </div>
                    </div>

                    {/* Status text */}
                    <p className={`text-center font-semibold mt-4 transition-colors duration-300 ${
                      isSpeaking ? 'text-blue-600' :
                      isListening ? 'text-green-600' :
                      'text-gray-600'
                    }`}>
                      {isSpeaking ? '🔊 Interviewer Speaking...' :
                       isListening ? '🎤 You are Speaking...' :
                       '👂 Listening for your response...'}
                    </p>
                  </div>
                ) : conversation.status === 'connecting' ? (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary mb-4"></div>
                    <p className="text-gray-600">Connecting to interviewer...</p>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-4xl">🎤</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">💡 Interview Tips:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Wait for blue waves to stop</strong> before speaking</li>
                <li>• <strong>Speak clearly and at normal volume</strong></li>
                <li>• Green waves = your microphone is active</li>
                <li>• Be specific in your answers</li>
                {mode === INTERVIEW_MODES.PRACTICE && (
                  <li>• Watch for red flag alerts above</li>
                )}
              </ul>
            </div>

            {/* Microphone Status */}
            {conversation.status === 'connected' && (
              <div className={`mt-4 p-3 rounded-lg ${
                micPermission === 'granted' ? 'bg-green-50 border border-green-200' :
                micPermission === 'denied' ? 'bg-red-50 border border-red-200' :
                'bg-yellow-50 border border-yellow-200'
              }`}>
                <p className={`text-sm ${
                  micPermission === 'granted' ? 'text-green-800' :
                  micPermission === 'denied' ? 'text-red-800' :
                  'text-yellow-800'
                }`}>
                  {micPermission === 'granted' ? (
                    <>🎤 <strong>Microphone Active</strong> - Speak at normal volume when you see green waves</>
                  ) : micPermission === 'denied' ? (
                    <>❌ <strong>Microphone Blocked</strong> - Please allow microphone access in browser settings</>
                  ) : (
                    <>⏳ <strong>Checking microphone...</strong></>
                  )}
                </p>
              </div>
            )}

            {/* Speech Detection Help */}
            {conversation.status === 'connected' && !isListening && !isSpeaking && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Not hearing you?</strong> Speak louder and wait for green waves to confirm the mic is picking up your voice.
                </p>
              </div>
            )}
          </div>

          {/* Live Transcript */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Transcript</h2>
            <div className="h-96 overflow-y-auto space-y-3 pr-2">
              {transcript.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Conversation will appear here...
                </p>
              ) : (
                transcript.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      msg.source === 'ai'
                        ? 'bg-blue-50 text-blue-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">
                      {msg.source === 'ai' ? 'Officer' : 'You'}
                    </div>
                    <div className="text-sm">
                      {msg.text || msg.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Mode Info */}
        <div className="mt-6 card bg-blue-50">
          <p className="text-sm text-gray-700">
            {mode === INTERVIEW_MODES.PRACTICE ? (
              <>
                <strong>Practice Mode:</strong> You'll receive real-time feedback and red flag alerts during the interview.
                After completing the interview, you'll get a comprehensive analysis with recommendations.
              </>
            ) : (
              <>
                <strong>Simulation Mode:</strong> This is a realistic interview experience with no interruptions.
                You'll receive comprehensive feedback and analysis after completing the interview.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Interview;
