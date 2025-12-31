import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className="h-screen overflow-hidden flex flex-col relative"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
          linear-gradient(135deg, #3D1F1F 0%, #4A2828 100%)
        `,
        backgroundSize: '60px 60px, 60px 60px, cover'
      }}
    >
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 px-8 py-6 z-10">
        <div className="text-2xl font-serif">
          <span className="text-[#F5E6D3]">prepared</span>
          <span className="text-[#FF7A59]">.</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 text-center flex-grow flex items-center justify-center">
        <div className="w-full">
          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif mb-6 leading-tight">
            <span className="text-[#F5E6D3]">Prepare for your</span>
            <br />
            <span className="text-[#FF7A59] italic">US visa interview.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-[#B39B8A] mb-12 max-w-2xl mx-auto leading-relaxed">
            Practice with an AI consular officer. Build confidence. Ace your interview.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-[#FF7A59] text-white text-lg font-medium hover:bg-[#FF8C6B] transition-all duration-200 border-2 border-[#FF7A59]"
            >
              Start Practicing
            </button>

            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-transparent text-[#F5E6D3] text-lg font-medium hover:bg-[#F5E6D3]/10 transition-all duration-200 border-2 border-[#F5E6D3]"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Subtle tagline */}
          <p className="text-sm text-[#B39B8A]/60 mt-16">
            Powered by AI • Available 24/7
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="pb-6 text-center">
        <p className="text-sm text-[#B39B8A]/50">
          Built by{' '}
          <a
            href="https://www.linkedin.com/in/anshuman-singh-4537731a5/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF7A59] hover:text-[#FF8C6B] transition-colors"
          >
            Anshuman
          </a>
          {' '}on a laptop
        </p>
      </footer>
    </div>
  );
};

export default Landing;
