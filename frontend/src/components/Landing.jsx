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
    <div className="min-h-screen bg-gradient-to-br from-[#3D1F1F] to-[#4A2828]">
      {/* Navigation */}
      <nav className="border-b border-[#5A3838] backdrop-blur-sm bg-[#2E1616]/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-[#F5E6D3]">prepared</span>
            <span className="text-[#FF7A59]">.</span>
          </div>
          <div className="flex gap-6 items-center">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            {!user ? (
              <>
                <button onClick={() => navigate('/login')} className="nav-link">
                  Sign In
                </button>
                <button onClick={() => navigate('/signup')} className="btn-primary">
                  Get Started
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/dashboard')} className="btn-primary">
                Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slideIn">
            <div className="badge mb-6">
              🎯 AI-Powered Interview Practice
            </div>

            <h1 className="section-title mb-6">
              <span className="text-[#F5E6D3]">Together, we turn</span>{' '}
              <span className="text-gradient">nervousness</span>{' '}
              <span className="text-[#F5E6D3]">into</span>{' '}
              <span className="text-gradient">confidence.</span>
            </h1>

            <p className="section-subtitle mb-8">
              Practice your US visa interview with an AI consular officer.
              Get real-time feedback, identify red flags, and nail your actual interview.
            </p>

            <div className="flex gap-4 mb-8">
              <button onClick={handleGetStarted} className="btn-primary">
                Start Practicing →
              </button>
              <button onClick={() => navigate('/signup')} className="btn-secondary">
                See Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#5A3838]">
              <div>
                <div className="text-3xl font-bold text-[#FF7A59]">98%</div>
                <div className="text-[#B39B8A] text-sm mt-1">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#FF7A59]">10K+</div>
                <div className="text-[#B39B8A] text-sm mt-1">Interviews</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#FF7A59]">24/7</div>
                <div className="text-[#B39B8A] text-sm mt-1">Available</div>
              </div>
            </div>
          </div>

          {/* AI Generated Image Placeholder 1 */}
          <div className="image-placeholder h-[500px] glow-accent animate-fadeIn">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🎙️</div>
              <p className="image-placeholder-text text-lg mb-2">AI Generated Hero Image</p>
              <p className="image-placeholder-text text-xs max-w-md mx-auto">
                <strong>Prompt:</strong> "Professional US visa interview scene, confident applicant
                speaking with consular officer across desk, modern embassy setting, warm lighting,
                photorealistic, cinematic composition, shallow depth of field, official atmosphere"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">
            Why <span className="text-gradient">Prepared</span>?
          </h2>
          <p className="section-subtitle mx-auto">
            Practice makes perfect. Our AI helps you prepare for the real thing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="stat-card hover-glow">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-2xl font-bold text-[#F5E6D3] mb-3">Voice Interview</h3>
            <p className="text-[#B39B8A]">
              Speak naturally with our AI officer. Get comfortable with the interview format before the real thing.
            </p>
          </div>

          <div className="stat-card hover-glow">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-[#F5E6D3] mb-3">Smart Feedback</h3>
            <p className="text-[#B39B8A]">
              Identify red flags in real-time. Learn what answers work and what raises concerns.
            </p>
          </div>

          <div className="stat-card hover-glow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-[#F5E6D3] mb-3">Track Progress</h3>
            <p className="text-[#B39B8A]">
              See your improvement over time. Build confidence with every practice session.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* AI Generated Image Placeholder 2 */}
          <div className="image-placeholder h-[400px] glow-accent order-2 md:order-1">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">✨</div>
              <p className="image-placeholder-text text-lg mb-2">AI Generated Process Image</p>
              <p className="image-placeholder-text text-xs max-w-md mx-auto">
                <strong>Prompt:</strong> "Modern dashboard showing visa interview analytics,
                dark elegant UI with orange accents, data visualization charts, progress tracking,
                floating 3D elements, professional design, high detail, dark background"
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="section-title mb-8">
              Simple. <span className="text-gradient">Effective.</span>
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FF7A59]/20 border border-[#FF7A59] flex items-center justify-center text-[#FF7A59] font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#F5E6D3] mb-2">Tell us about yourself</h3>
                  <p className="text-[#B39B8A]">
                    Share your visa type, background, and travel plans. We customize the interview for you.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FF7A59]/20 border border-[#FF7A59] flex items-center justify-center text-[#FF7A59] font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#F5E6D3] mb-2">Practice with AI officer</h3>
                  <p className="text-[#B39B8A]">
                    Have a real conversation. Our AI asks questions just like a real consular officer would.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FF7A59]/20 border border-[#FF7A59] flex items-center justify-center text-[#FF7A59] font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#F5E6D3] mb-2">Get detailed feedback</h3>
                  <p className="text-[#B39B8A]">
                    Review your performance. See what worked, what didn't, and how to improve.
                  </p>
                </div>
              </div>
            </div>

            <button onClick={handleGetStarted} className="btn-primary mt-8">
              Try It Free →
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="card-accent text-center py-16">
          <h2 className="section-title mb-4">
            Join <span className="text-gradient">thousands</span> who got approved
          </h2>
          <p className="section-subtitle mx-auto mb-12">
            Don't let nerves cost you your visa. Practice until you're confident.
          </p>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="stat-card">
              <div className="stat-number">15K+</div>
              <div className="stat-label">Practice Sessions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">98%</div>
              <div className="stat-label">Approval Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4.9</div>
              <div className="stat-label">User Rating</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Always Available</div>
            </div>
          </div>

          <button onClick={handleGetStarted} className="btn-primary text-lg px-10">
            Start Your Practice Interview →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#5A3838] mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-[#F5E6D3]">prepared</span>
                <span className="text-[#FF7A59]">.</span>
              </div>
              <p className="text-[#B39B8A] text-sm">
                AI-powered visa interview practice platform. Prepare with confidence.
              </p>
            </div>
            <div>
              <h4 className="text-[#F5E6D3] font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-[#B39B8A] text-sm">
                <li><a href="#" className="hover:text-[#FF7A59]">Features</a></li>
                <li><a href="#" className="hover:text-[#FF7A59]">Pricing</a></li>
                <li><a href="#" className="hover:text-[#FF7A59]">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#F5E6D3] font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-[#B39B8A] text-sm">
                <li><a href="#" className="hover:text-[#FF7A59]">About</a></li>
                <li><a href="#" className="hover:text-[#FF7A59]">Blog</a></li>
                <li><a href="#" className="hover:text-[#FF7A59]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#F5E6D3] font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-[#B39B8A] text-sm">
                <li><a href="#" className="hover:text-[#FF7A59]">Privacy</a></li>
                <li><a href="#" className="hover:text-[#FF7A59]">Terms</a></li>
                <li><a href="#" className="hover:text-[#FF7A59]">License</a></li>
              </ul>
            </div>
          </div>
          <div className="divider"></div>
          <div className="text-center text-[#B39B8A] text-sm">
            <p>© 2025 Prepared. Built with ElevenLabs & Google Gemini.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
