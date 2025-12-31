import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleSignInButton from './GoogleSignInButton';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, user, isProfileComplete } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);

      // Wait for onAuthStateChanged to fetch profile
      setTimeout(() => {
        const profileComplete = isProfileComplete(user?.profile);
        navigate(profileComplete ? '/dashboard' : '/onboarding');
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      await loginWithGoogle();

      // Wait for onAuthStateChanged to fetch profile
      setTimeout(() => {
        const profileComplete = isProfileComplete(user?.profile);
        navigate(profileComplete ? '/dashboard' : '/onboarding');
        setGoogleLoading(false);
      }, 500);
    } catch (err) {
      if (err.message !== 'Sign-in cancelled') {
        setError(err.message || 'Google sign-in failed');
      }
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 122, 89, 0.05) 1px, transparent 1px),
          linear-gradient(135deg, #3D1F1F 0%, #4A2828 100%)
        `,
        backgroundSize: '60px 60px, 60px 60px, cover'
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-[#2E1616] border-2 border-[#5A3838] p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-[#F5E6D3] mb-2">Welcome <span className="italic text-[#FF7A59]">Back</span></h1>
            <p className="text-[#B39B8A]">Sign in to continue your interview practice</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#FF7A59]/10 border-2 border-[#FF7A59] text-[#FF7A59] text-sm">
              {error}
            </div>
          )}

          {/* Google Sign-In */}
          <GoogleSignInButton onClick={handleGoogleSignIn} loading={googleLoading} />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#5A3838]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#2E1616] text-[#B39B8A]">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#F5E6D3]">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:outline-none focus:border-[#FF7A59]"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#F5E6D3]">Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:outline-none focus:border-[#FF7A59]"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-[#FF7A59] text-white font-medium hover:bg-[#FF8C6B] transition-all duration-200 border-2 border-[#FF7A59] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || googleLoading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#B39B8A]">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-[#FF7A59] hover:text-[#FF8C6B] font-medium transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
