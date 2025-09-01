import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  Shield,
  FileText,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import { useDarkMode } from '../../contexts/darkModeContext';
import BookingService from '../../firebase/booking';
import toast from 'react-hot-toast';

const ProviderRegistration = ({ onRegistrationComplete }) => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [providerStatus, setProviderStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    licenseNumber: '',
    experience: '',
    education: '',
    orgID: '',
    address: '',
    bio: '',
    consultationFee: '',
    languages: ['English'],
    certifications: []
  });

  // Dynamic colors based on theme
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondaryColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  const inputBgColor = isDarkMode ? 'bg-gray-700' : 'bg-white';

  useEffect(() => {
    checkProviderStatus();
  }, [currentUser]);

  const checkProviderStatus = async () => {
    if (!currentUser?.uid) return;
    
    try {
      setCheckingStatus(true);
      const status = await BookingService.checkProviderStatus(currentUser.uid);
      setProviderStatus(status);
      
      // Pre-fill form with user data if available
      if (status.profile) {
        setFormData(prev => ({
          ...prev,
          name: status.profile.name || '',
          email: status.profile.email || currentUser.email || '',
          phone: status.profile.phone || '',
          specialty: status.profile.specialty || '',
          orgID: status.profile.orgID || ''
        }));
      }
    } catch (error) {
      console.error('Error checking provider status:', error);
      toast.error('Failed to check provider status');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser?.uid) {
      toast.error('Please log in to register as a provider');
      return;
    }

    // Validation
    if (!formData.name || !formData.specialty || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const providerData = {
        ...formData,
        uid: currentUser.uid,
        email: currentUser.email || formData.email,
        orgID: formData.orgID || 'default-org-123', // Default org if not specified
        registrationDate: new Date(),
        status: 'active'
      };

      const result = await BookingService.registerAsProvider(providerData);
      
      toast.success(result.message);
      
      // Update local status
      setProviderStatus({
        isProvider: true,
        isActive: true,
        registrationStatus: 'pending',
        profile: { ...providerData, id: result.providerId }
      });
      
      if (onRegistrationComplete) {
        onRegistrationComplete(result.providerId);
      }
      
    } catch (error) {
      console.error('Error registering as provider:', error);
      toast.error('Failed to register as provider. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className={`${cardBgColor} rounded-lg p-12 ${borderColor} border`}>
        <div className="flex flex-col items-center justify-center">
          <Loader className="w-12 h-12 animate-spin text-green-600 mb-4" />
          <p className={`text-lg ${textColor}`}>Checking provider status...</p>
        </div>
      </div>
    );
  }

  // If user is already a provider
  if (providerStatus?.isProvider) {
    return (
      <div className={`${cardBgColor} rounded-lg p-8 ${borderColor} border`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className={`text-xl font-semibold ${textColor} mb-2`}>
            Already Registered as Provider
          </h3>
          <p className={`text-sm ${textSecondaryColor} mb-4`}>
            You are already registered as a healthcare provider in our system.
          </p>
          
          {providerStatus.registrationStatus === 'pending' && (
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'} border border-yellow-200 mb-4`}>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">Registration Pending</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                Your registration is being reviewed. You'll be notified once approved.
              </p>
            </div>
          )}
          
          {providerStatus.registrationStatus === 'approved' && (
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} border border-green-200 mb-4`}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Registration Approved</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Your provider account is active and ready to receive appointments.
              </p>
            </div>
          )}
          
          <button
            onClick={() => onRegistrationComplete && onRegistrationComplete(providerStatus.profile.id)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Continue to Provider Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className={`${cardBgColor} rounded-lg p-6 ${borderColor} border`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className={`text-2xl font-bold ${textColor} mb-2`}>
            Register as Healthcare Provider
          </h2>
          <p className={`text-sm ${textSecondaryColor} max-w-2xl mx-auto`}>
            Join our network of healthcare providers and start offering appointments to patients. 
            Complete the form below to register your practice.
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <div className={`${cardBgColor} rounded-lg p-6 ${borderColor} border`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Dr. John Smith"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="john.smith@example.com"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email from your account</p>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Organization ID
                </label>
                <input
                  type="text"
                  name="orgID"
                  value={formData.orgID}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="org-123"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
              <GraduationCap className="w-5 h-5 text-green-600" />
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Specialty *
                </label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                >
                  <option value="">Select Specialty</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Urology">Urology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="MD123456"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="5"
                  min="0"
                  max="50"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Consultation Fee ($)
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="150"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Education & Certifications */}
          <div>
            <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
              <FileText className="w-5 h-5 text-purple-600" />
              Education & Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Education
                </label>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Medical School, Residency, Fellowships..."
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.certifications.join(', ')}
                  onChange={(e) => handleArrayInputChange('certifications', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Board Certified, ACLS, BLS..."
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
              <MapPin className="w-5 h-5 text-orange-600" />
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Practice address..."
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.languages.join(', ')}
                  onChange={(e) => handleArrayInputChange('languages', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="English, Spanish, French..."
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className={`block text-sm font-medium ${textColor} mb-2`}>
                Bio/About
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg ${borderColor} ${inputBgColor} ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Tell patients about your experience, approach to care, and what they can expect..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Register as Provider
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Information Notice */}
      <div className={`${cardBgColor} rounded-lg p-4 ${borderColor} border`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className={`font-medium ${textColor} mb-1`}>Registration Process</h4>
            <p className={`text-sm ${textSecondaryColor}`}>
              After submitting your registration, your account will be reviewed by our team. 
              You'll receive an email notification once your provider account is approved and activated. 
              This process typically takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProviderRegistration;

