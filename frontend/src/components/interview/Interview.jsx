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
  const isSpeakingRef = useRef(false);

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
      // When agent switches to speaking mode, clear user listening state
      if (modeChange.mode === 'speaking') {
        setIsListening(false);
      }
    }
  });

  // Keep ref in sync with state for use in detectSpeech loop
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    if (!sessionId || !agentConfig) {
      navigate('/dashboard');
      return;
    }

    // Check microphone permissions and setup audio monitoring
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        setMicPermission('granted');
        console.log('✅ Microphone access granted');

        // Setup audio context for voice detection
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
        microphone.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        // Monitor audio levels to detect when user is speaking
        const detectSpeech = () => {
          if (!analyserRef.current) return;

          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

          // If audio level is above threshold and AI is not speaking, user is speaking
          if (average > 20 && !isSpeakingRef.current) {
            setIsListening(true);
          } else if (average <= 15) {
            // Small delay before stopping listening indicator
            setTimeout(() => {
              if (!isSpeakingRef.current) {
                setIsListening(false);
              }
            }, 500);
          }

          requestAnimationFrame(detectSpeech);
        };

        detectSpeech();
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
      if (audioContextRef.current) {
        audioContextRef.current.close();
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
      <div
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
            linear-gradient(135deg, #3D1F1F 0%, #4A2828 100%)
          `,
          backgroundSize: '60px 60px, 60px 60px, cover'
        }}
      >
        <div className="bg-[#2E1616] border-2 border-[#5A3838] p-12 shadow-2xl text-center max-w-md">
          <div className="mb-6">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#5A3838] border-t-[#FF7A59]"></div>
          </div>
          <h2 className="text-2xl font-serif text-[#F5E6D3] mb-3">
            Analyzing Your <span className="italic text-[#FF7A59]">Interview</span>
          </h2>
          <p className="text-[#B39B8A]">
            Our AI is reviewing your responses and generating detailed feedback...
          </p>
        </div>
      </div>
    );
  }

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif text-[#F5E6D3]">
              {mode === INTERVIEW_MODES.PRACTICE ? 'Practice' : 'Simulation'} <span className="italic text-[#FF7A59]">Interview</span>
            </h1>
            <p className="text-[#B39B8A] mt-1">
              Duration: {formatDuration(duration)}
            </p>
          </div>
          <button
            onClick={handleEndInterview}
            disabled={conversation.status === 'disconnected'}
            className="px-6 py-2 bg-[#FF7A59] text-white font-medium hover:bg-[#FF8C6B] transition-colors border-2 border-[#FF7A59] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            End Interview
          </button>
        </div>

        {/* Red Flag Alert (Practice Mode) */}
        {redFlag && mode === INTERVIEW_MODES.PRACTICE && (
          <div className="mb-6 bg-[#FF7A59]/10 border-2 border-[#FF7A59] p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">⚠️</span>
                  <h3 className="text-lg font-serif text-[#F5E6D3]">
                    Red Flag: {redFlag.type.replace('_', ' ').toUpperCase()}
                  </h3>
                </div>
                <p className="text-[#B39B8A] mb-2">
                  <span className="font-medium text-[#F5E6D3]">Issue:</span> {redFlag.explanation}
                </p>
                <p className="text-[#B39B8A]">
                  <span className="font-medium text-[#F5E6D3]">Suggestion:</span> {redFlag.suggestion}
                </p>
                <div className="mt-3">
                  <span className={`inline-block px-3 py-1 border-2 text-xs font-medium ${
                    redFlag.severity === 'high' ? 'bg-[#FF7A59]/20 text-[#FF7A59] border-[#FF7A59]' :
                    redFlag.severity === 'medium' ? 'bg-[#FF8C6B]/20 text-[#FF8C6B] border-[#FF8C6B]' :
                    'bg-[#F5E6D3]/20 text-[#F5E6D3] border-[#F5E6D3]'
                  }`}>
                    {redFlag.severity.toUpperCase()} SEVERITY
                  </span>
                </div>
              </div>
              <button
                onClick={dismissRedFlag}
                className="text-[#FF7A59] hover:text-[#FF8C6B] ml-4 text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Interview Container */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Voice Interface */}
          <div className="bg-[#2E1616] border-2 border-[#5A3838] p-6 shadow-2xl">
            <h2 className="text-xl font-serif text-[#F5E6D3] mb-6">Voice Interview</h2>

            <div className="mb-6">
              <div className="flex justify-center mb-4">
                {conversation.status === 'connected' ? (
                  <div className="relative flex flex-col items-center">
                    {/* Audio Visualization */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      {/* Outer ring - always visible */}
                      <div className="absolute inset-0 w-48 h-48 rounded-full border-4 border-[#FF7A59] opacity-20"></div>

                      {/* Animated waves when speaking */}
                      {isSpeaking && (
                        <>
                          <div className="absolute inset-0 w-48 h-48 rounded-full bg-[#FF7A59] opacity-20 animate-ping"></div>
                          <div className="absolute inset-4 w-40 h-40 rounded-full bg-[#FF7A59] opacity-30 animate-pulse"></div>
                          <div className="absolute inset-8 w-32 h-32 rounded-full bg-[#FF7A59] opacity-40 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                        </>
                      )}

                      {/* Animated waves when user is speaking */}
                      {isListening && (
                        <>
                          <div className="absolute inset-0 w-48 h-48 rounded-full bg-[#F5E6D3] opacity-20 animate-ping"></div>
                          <div className="absolute inset-4 w-40 h-40 rounded-full bg-[#F5E6D3] opacity-30 animate-pulse"></div>
                          <div className="absolute inset-8 w-32 h-32 rounded-full bg-[#F5E6D3] opacity-40 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                        </>
                      )}

                      {/* Center icon */}
                      <div className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all duration-300 ${
                        isSpeaking ? 'bg-[#FF7A59] scale-110' :
                        isListening ? 'bg-[#F5E6D3] scale-110' :
                        'bg-[#5A3838]'
                      }`}>
                        {isSpeaking ? '🎙️' : isListening ? '👂' : '🎤'}
                      </div>
                    </div>

                    {/* Status text */}
                    <p className={`text-center font-medium mt-4 transition-colors duration-300 ${
                      isSpeaking ? 'text-[#FF7A59]' :
                      isListening ? 'text-[#F5E6D3]' :
                      'text-[#B39B8A]'
                    }`}>
                      {isSpeaking ? '🔊 Interviewer Speaking...' :
                       isListening ? '🎤 You are Speaking...' :
                       '👂 Listening for your response...'}
                    </p>
                  </div>
                ) : conversation.status === 'connecting' ? (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#5A3838] border-t-[#FF7A59] mb-4"></div>
                    <p className="text-[#B39B8A]">Connecting to interviewer...</p>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#5A3838] flex items-center justify-center">
                    <span className="text-4xl">🎤</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Info */}
            <div className="mt-6 p-4 bg-[#3D1F1F] border border-[#5A3838]">
              <h3 className="font-medium text-[#F5E6D3] mb-3">💡 Interview Tips:</h3>
              <ul className="text-sm text-[#B39B8A] space-y-2">
                <li>• Wait for orange waves to stop before speaking</li>
                <li>• Speak clearly at normal volume</li>
                <li>• Cream waves = your microphone is active</li>
                <li>• Be specific in your answers</li>
                {mode === INTERVIEW_MODES.PRACTICE && (
                  <li>• Watch for red flag alerts above</li>
                )}
              </ul>
            </div>

            {/* Microphone Status */}
            {conversation.status === 'connected' && (
              <div className={`mt-4 p-3 border-2 ${
                micPermission === 'granted' ? 'bg-[#F5E6D3]/10 border-[#F5E6D3]' :
                micPermission === 'denied' ? 'bg-[#FF7A59]/10 border-[#FF7A59]' :
                'bg-[#B39B8A]/10 border-[#B39B8A]'
              }`}>
                <p className={`text-sm ${
                  micPermission === 'granted' ? 'text-[#F5E6D3]' :
                  micPermission === 'denied' ? 'text-[#FF7A59]' :
                  'text-[#B39B8A]'
                }`}>
                  {micPermission === 'granted' ? (
                    <>🎤 <strong>Microphone Active</strong> - Speak at normal volume when you see cream waves</>
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
              <div className="mt-4 p-3 bg-[#FF7A59]/10 border-2 border-[#FF7A59]">
                <p className="text-sm text-[#B39B8A]">
                  💡 <strong className="text-[#F5E6D3]">Not hearing you?</strong> Speak louder and wait for cream waves to confirm.
                </p>
              </div>
            )}
          </div>

          {/* Live Transcript */}
          <div className="bg-[#2E1616] border-2 border-[#5A3838] p-6 shadow-2xl">
            <h2 className="text-xl font-serif text-[#F5E6D3] mb-6">Transcript</h2>
            <div className="h-96 overflow-y-auto space-y-3 pr-2">
              {transcript.length === 0 ? (
                <p className="text-[#B39B8A] text-sm">
                  Conversation will appear here...
                </p>
              ) : (
                transcript.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 border-2 ${
                      msg.source === 'ai'
                        ? 'bg-[#FF7A59]/10 border-[#FF7A59] text-[#F5E6D3]'
                        : 'bg-[#F5E6D3]/10 border-[#F5E6D3] text-[#F5E6D3]'
                    }`}
                  >
                    <div className="font-medium text-xs mb-1 opacity-70">
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
        <div className="mt-6 bg-[#2E1616] border-2 border-[#5A3838] p-6 shadow-2xl">
          <p className="text-sm text-[#B39B8A]">
            {mode === INTERVIEW_MODES.PRACTICE ? (
              <>
                <strong className="text-[#F5E6D3]">Practice Mode:</strong> You'll receive real-time feedback and red flag alerts during the interview.
                After completing, you'll get comprehensive analysis with recommendations.
              </>
            ) : (
              <>
                <strong className="text-[#F5E6D3]">Simulation Mode:</strong> Realistic interview experience with no interruptions.
                You'll receive comprehensive feedback after completing the interview.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Interview;
