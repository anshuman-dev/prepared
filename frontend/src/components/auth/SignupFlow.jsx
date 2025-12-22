import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { VISA_TYPES } from '../../utils/constants';

const SignupFlow = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Account
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',

    // Step 2: Visa Details
    visaType: '',
    country: '',
    interviewDate: '',
    previousVisa: false,
    previousApproval: null,

    // Step 3: Profile (adapts based on visa type)
    age: '',
    field: '',
    university: '',
    company: '',
    hasRelativesInUS: false,
    relativesVisaStatus: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
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

  const validateStep2 = () => {
    if (!formData.visaType || !formData.country) {
      setError('Visa type and country are required');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.age || !formData.field) {
      setError('Age and field are required');
      return false;
    }
    // Visa-specific validation
    if (formData.visaType === 'F-1' && !formData.university) {
      setError('University is required for F-1 visa');
      return false;
    }
    if ((formData.visaType === 'H-1B' || formData.visaType === 'L-1') && !formData.company) {
      setError('Company is required for work visas');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) return;

    setLoading(true);
    setError('');

    try {
      const profile = {
        visaType: formData.visaType,
        country: formData.country,
        age: parseInt(formData.age),
        field: formData.field,
        ...(formData.university && { university: formData.university }),
        ...(formData.company && { company: formData.company }),
        hasRelativesInUS: formData.hasRelativesInUS,
        ...(formData.relativesVisaStatus && { relativesVisaStatus: formData.relativesVisaStatus }),
        ...(formData.interviewDate && { interviewDate: formData.interviewDate }),
        previousVisa: formData.previousVisa,
        ...(formData.previousApproval !== null && { previousApproval: formData.previousApproval })
      };

      await signup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        profile
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className={`text-sm ${step >= 1 ? 'text-primary font-medium' : 'text-gray-400'}`}>
              Account
            </span>
            <span className={`text-sm ${step >= 2 ? 'text-primary font-medium' : 'text-gray-400'}`}>
              Visa Details
            </span>
            <span className={`text-sm ${step >= 3 ? 'text-primary font-medium' : 'text-gray-400'}`}>
              Profile
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Your Account
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Creation */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    className="input-field"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="At least 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <input
                    type="password"
                    className="input-field"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    placeholder="Re-enter password"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Visa Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Visa Type *</label>
                  <select
                    className="input-field"
                    value={formData.visaType}
                    onChange={(e) => updateField('visaType', e.target.value)}
                  >
                    <option value="">Select visa type</option>
                    {VISA_TYPES.map(visa => (
                      <option key={visa.value} value={visa.value}>
                        {visa.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country of Origin *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    placeholder="e.g., India, China, Brazil"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Interview Date (Optional)</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.interviewDate}
                    onChange={(e) => updateField('interviewDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Have you had a US visa before?
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="previousVisa"
                        checked={formData.previousVisa === false}
                        onChange={() => {
                          updateField('previousVisa', false);
                          updateField('previousApproval', null);
                        }}
                        className="mr-2"
                      />
                      No
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="previousVisa"
                        checked={formData.previousVisa === true}
                        onChange={() => updateField('previousVisa', true)}
                        className="mr-2"
                      />
                      Yes
                    </label>
                  </div>
                </div>
                {formData.previousVisa && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Was it approved?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="previousApproval"
                          checked={formData.previousApproval === true}
                          onChange={() => updateField('previousApproval', true)}
                          className="mr-2"
                        />
                        Yes, it was approved
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="previousApproval"
                          checked={formData.previousApproval === false}
                          onChange={() => updateField('previousApproval', false)}
                          className="mr-2"
                        />
                        No, it was denied
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Additional Profile */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Age Range *</label>
                  <select
                    className="input-field"
                    value={formData.age}
                    onChange={(e) => updateField('age', e.target.value)}
                  >
                    <option value="">Select age range</option>
                    <option value="20">18-22</option>
                    <option value="25">23-27</option>
                    <option value="31">28-35</option>
                    <option value="40">36+</option>
                  </select>
                </div>

                {/* Visa-specific fields */}
                {formData.visaType === 'F-1' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Field of Study *</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.field}
                        onChange={(e) => updateField('field', e.target.value)}
                        placeholder="e.g., Computer Science, Business"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">University Name *</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.university}
                        onChange={(e) => updateField('university', e.target.value)}
                        placeholder="e.g., MIT, Stanford"
                      />
                    </div>
                  </>
                )}

                {(formData.visaType === 'H-1B' || formData.visaType === 'L-1') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Job Title/Field *</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.field}
                        onChange={(e) => updateField('field', e.target.value)}
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Company Name *</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.company}
                        onChange={(e) => updateField('company', e.target.value)}
                        placeholder="e.g., Google, Microsoft"
                      />
                    </div>
                  </>
                )}

                {!['F-1', 'H-1B', 'L-1'].includes(formData.visaType) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Field/Purpose *</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.field}
                      onChange={(e) => updateField('field', e.target.value)}
                      placeholder="Describe your purpose/field"
                    />
                  </div>
                )}

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasRelativesInUS}
                      onChange={(e) => updateField('hasRelativesInUS', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">I have relatives in the US</span>
                  </label>
                </div>

                {formData.hasRelativesInUS && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Their Visa Status</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.relativesVisaStatus}
                      onChange={(e) => updateField('relativesVisaStatus', e.target.value)}
                      placeholder="e.g., H-1B, Green Card, Citizen"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-secondary flex-1"
                  disabled={loading}
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary flex-1"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:underline font-medium"
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
