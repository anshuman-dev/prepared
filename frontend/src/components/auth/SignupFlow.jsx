import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleSignInButton from './GoogleSignInButton';

const SignupFlow = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validate = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('All fields are required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }
    return true;
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      // Redirect to onboarding to complete profile
      navigate('/onboarding');
    } catch (err) {
      if (err.message !== 'Sign-in cancelled') {
        setError(err.message || 'Google sign-in failed');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      });

      // Redirect to onboarding to complete profile
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-serif text-[#F5E6D3] mb-6 text-center">
            Create Your <span className="italic text-[#FF7A59]">Account</span>
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-[#FF7A59]/10 border-2 border-[#FF7A59] text-[#FF7A59] text-sm">
              {error}
            </div>
          )}

          <GoogleSignInButton onClick={handleGoogleSignUp} loading={googleLoading} />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#5A3838]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#2E1616] text-[#B39B8A]">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-[#F5E6D3]">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:outline-none focus:border-[#FF7A59]"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[#F5E6D3]">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:outline-none focus:border-[#FF7A59]"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[#F5E6D3]">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:outline-none focus:border-[#FF7A59]"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[#F5E6D3]">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:outline-none focus:border-[#FF7A59]"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-[#FF7A59] text-white font-medium hover:bg-[#FF8C6B] transition-all duration-200 border-2 border-[#FF7A59] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#B39B8A]">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#FF7A59] hover:text-[#FF8C6B] font-medium transition-colors"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;
