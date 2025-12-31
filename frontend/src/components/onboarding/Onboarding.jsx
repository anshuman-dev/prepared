import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { VISA_TYPES, COUNTRIES, FIELDS_OF_STUDY } from '../../utils/constants';
import { authAPI } from '../../services/api';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Visa Details
    visaType: '',
    country: '',
    countryOther: '',
    interviewDate: '',
    previousVisa: false,
    previousApproval: null,

    // Step 2: Profile Details
    age: '',
    field: '',
    fieldOther: '',
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
    if (!formData.visaType || !formData.country) {
      setError('Visa type and country are required');
      return false;
    }
    if (formData.country === 'Other' && !formData.countryOther) {
      setError('Please specify your country');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.age || !formData.field) {
      setError('Age and field are required');
      return false;
    }
    if (formData.field === 'Other' && !formData.fieldOther) {
      setError('Please specify your field');
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
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    try {
      const profile = {
        visaType: formData.visaType,
        country: formData.country === 'Other' ? formData.countryOther : formData.country,
        age: parseInt(formData.age),
        field: formData.field === 'Other' ? formData.fieldOther : formData.field,
        ...(formData.university && { university: formData.university }),
        ...(formData.company && { company: formData.company }),
        hasRelativesInUS: formData.hasRelativesInUS,
        ...(formData.relativesVisaStatus && { relativesVisaStatus: formData.relativesVisaStatus }),
        ...(formData.interviewDate && { interviewDate: formData.interviewDate }),
        previousVisa: formData.previousVisa,
        ...(formData.previousApproval !== null && { previousApproval: formData.previousApproval })
      };

      // Update profile on backend
      await authAPI.updateProfile({ profile });

      // Update local auth context
      updateUserProfile(profile);

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save profile. Please try again.');
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
        {/* Progress Indicator */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-center mb-6 text-[#F5E6D3]">
            Complete Your <span className="italic text-[#FF7A59]">Profile</span>
          </h1>
          <div className="flex justify-between mb-3">
            <span className={`text-sm font-medium ${step >= 1 ? 'text-[#FF7A59]' : 'text-[#B39B8A]'}`}>
              Visa Details
            </span>
            <span className={`text-sm font-medium ${step >= 2 ? 'text-[#FF7A59]' : 'text-[#B39B8A]'}`}>
              Your Profile
            </span>
          </div>
          <div className="h-2 bg-[#5A3838] border-2 border-[#5A3838] overflow-hidden">
            <div
              className="h-full bg-[#FF7A59] transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#2E1616] border-2 border-[#5A3838] p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-[#FF7A59]/10 border-2 border-[#FF7A59] text-[#FF7A59] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Visa Details */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#F5E6D3]">Visa Type *</label>
                  <select
                    className="w-full px-4 py-3 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] focus:border-[#FF7A59] focus:outline-none transition-colors"
                    value={formData.visaType}
                    onChange={(e) => updateField('visaType', e.target.value)}
                  >
                    <option value="" className="bg-[#3D1F1F]">Select visa type</option>
                    {VISA_TYPES.map(visa => (
                      <option key={visa.value} value={visa.value} className="bg-[#3D1F1F]">
                        {visa.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#F5E6D3]">Country of Origin *</label>
                  <select
                    className="w-full px-4 py-3 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] focus:border-[#FF7A59] focus:outline-none transition-colors"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                  >
                    <option value="" className="bg-[#3D1F1F]">Select country</option>
                    {COUNTRIES.map(country => (
                      <option key={country.value} value={country.value} className="bg-[#3D1F1F]">
                        {country.label}
                      </option>
                    ))}
                  </select>
                  {formData.country === 'Other' && (
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:border-[#FF7A59] focus:outline-none transition-colors mt-2"
                      value={formData.countryOther}
                      onChange={(e) => updateField('countryOther', e.target.value)}
                      placeholder="Enter your country"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#F5E6D3]">Interview Date (Optional)</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] focus:border-[#FF7A59] focus:outline-none transition-colors"
                    value={formData.interviewDate}
                    onChange={(e) => updateField('interviewDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3 text-[#F5E6D3]">
                    Have you had a US visa before?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="previousVisa"
                        checked={formData.previousVisa === false}
                        onChange={() => {
                          updateField('previousVisa', false);
                          updateField('previousApproval', null);
                        }}
                        className="mr-3 w-4 h-4 accent-[#FF7A59]"
                      />
                      <span className="text-[#B39B8A] group-hover:text-[#F5E6D3] transition-colors">No</span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="previousVisa"
                        checked={formData.previousVisa === true}
                        onChange={() => updateField('previousVisa', true)}
                        className="mr-3 w-4 h-4 accent-[#FF7A59]"
                      />
                      <span className="text-[#B39B8A] group-hover:text-[#F5E6D3] transition-colors">Yes</span>
                    </label>
                  </div>
                </div>
                {formData.previousVisa && (
                  <div>
                    <label className="block text-sm font-medium mb-3 text-[#F5E6D3]">
                      Was it approved?
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="previousApproval"
                          checked={formData.previousApproval === true}
                          onChange={() => updateField('previousApproval', true)}
                          className="mr-3 w-4 h-4 accent-[#FF7A59]"
                        />
                        <span className="text-[#B39B8A] group-hover:text-[#F5E6D3] transition-colors">Yes, it was approved</span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="previousApproval"
                          checked={formData.previousApproval === false}
                          onChange={() => updateField('previousApproval', false)}
                          className="mr-3 w-4 h-4 accent-[#FF7A59]"
                        />
                        <span className="text-[#B39B8A] group-hover:text-[#F5E6D3] transition-colors">No, it was denied</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Profile Details */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#F5E6D3]">Age Range *</label>
                  <select
                    className="w-full px-4 py-3 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] focus:border-[#FF7A59] focus:outline-none transition-colors"
                    value={formData.age}
                    onChange={(e) => updateField('age', e.target.value)}
                  >
                    <option value="" className="bg-[#3D1F1F]">Select age range</option>
                    <option value="20" className="bg-[#3D1F1F]">18-22</option>
                    <option value="25" className="bg-[#3D1F1F]">23-27</option>
                    <option value="31" className="bg-[#3D1F1F]">28-35</option>
                    <option value="40" className="bg-[#3D1F1F]">36+</option>
                  </select>
                </div>

                {/* Visa-specific fields */}
                {formData.visaType === 'F-1' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#F5E6D3]">Field of Study *</label>
                      <select
                        className="w-full px-4 py-3 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] focus:border-[#FF7A59] focus:outline-none transition-colors"
                        value={formData.field}
                        onChange={(e) => updateField('field', e.target.value)}
                      >
                        <option value="" className="bg-[#3D1F1F]">Select field of study</option>
                        {FIELDS_OF_STUDY.map(field => (
                          <option key={field.value} value={field.value} className="bg-[#3D1F1F]">
                            {field.label}
                          </option>
                        ))}
                      </select>
                      {formData.field === 'Other' && (
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:border-[#FF7A59] focus:outline-none transition-colors mt-2"
                          value={formData.fieldOther}
                          onChange={(e) => updateField('fieldOther', e.target.value)}
                          placeholder="Enter your field of study"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#F5E6D3]">University Name *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:border-[#FF7A59] focus:outline-none transition-colors"
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
                      <label className="block text-sm font-medium mb-2 text-[#F5E6D3]">Job Title/Field *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:border-[#FF7A59] focus:outline-none transition-colors"
                        value={formData.field}
                        onChange={(e) => updateField('field', e.target.value)}
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#F5E6D3]">Company Name *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:border-[#FF7A59] focus:outline-none transition-colors"
                        value={formData.company}
                        onChange={(e) => updateField('company', e.target.value)}
                        placeholder="e.g., Google, Microsoft"
                      />
                    </div>
                  </>
                )}

                {!['F-1', 'H-1B', 'L-1'].includes(formData.visaType) && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#F5E6D3]">Field/Purpose *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:border-[#FF7A59] focus:outline-none transition-colors"
                      value={formData.field}
                      onChange={(e) => updateField('field', e.target.value)}
                      placeholder="Describe your purpose/field"
                    />
                  </div>
                )}

                <div>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.hasRelativesInUS}
                      onChange={(e) => updateField('hasRelativesInUS', e.target.checked)}
                      className="mr-3 w-4 h-4 accent-[#FF7A59]"
                    />
                    <span className="text-sm text-[#B39B8A] group-hover:text-[#F5E6D3] transition-colors">I have relatives in the US</span>
                  </label>
                </div>

                {formData.hasRelativesInUS && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#F5E6D3]">Their Visa Status</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-[#3D1F1F] border-2 border-[#5A3838] text-[#F5E6D3] placeholder-[#B39B8A] focus:border-[#FF7A59] focus:outline-none transition-colors"
                      value={formData.relativesVisaStatus}
                      onChange={(e) => updateField('relativesVisaStatus', e.target.value)}
                      placeholder="e.g., H-1B, Green Card, Citizen"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 bg-transparent text-[#F5E6D3] font-medium hover:bg-[#F5E6D3]/10 transition-all duration-200 border-2 border-[#F5E6D3] hover:border-[#F5E6D3] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Back
                </button>
              )}
              {step < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-[#FF7A59] text-white font-medium hover:bg-[#FF8C6B] transition-all duration-200 border-2 border-[#FF7A59]"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#FF7A59] text-white font-medium hover:bg-[#FF8C6B] transition-all duration-200 border-2 border-[#FF7A59] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Complete Profile'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
