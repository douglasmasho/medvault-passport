import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Search,
  Filter,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  List,
  Settings,
  BarChart3,
  Users,
  FileText,
  Shield,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/authContext';
import { useDarkMode } from '../contexts/darkModeContext';
import BookingService from '../firebase/booking';
import ProviderCalendar from '../components/booking/ProviderCalendar';
import ProviderDashboard from '../components/booking/ProviderDashboard';
import BookAppointment from '../components/booking/BookAppointment';
import ProviderRegistration from '../components/booking/ProviderRegistration';
import Header from '../components/common/Header';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AppointmentsPage = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', 'analytics'
  const [providerStatus, setProviderStatus] = useState(null);
  const [checkingProviderStatus, setCheckingProviderStatus] = useState(true);

  // Dynamic colors based on theme
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondaryColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';

  useEffect(() => {
    if (userLoggedIn && currentUser?.uid) {
      loadAppointments();
      checkProviderStatus();
    }
  }, [userLoggedIn, currentUser?.uid]);

  useEffect(() => {
    // Set the appropriate default tab based on user role and provider status
    if (providerStatus?.isProvider) {
      setActiveTab('dashboard');
    } else if (providerStatus?.registrationStatus === 'pending') {
      setActiveTab('registration');
    } else {
      setActiveTab('my-appointments');
    }
  }, [providerStatus]);

  const checkProviderStatus = async () => {
    if (!currentUser?.uid) return;
    
    try {
      setCheckingProviderStatus(true);
      const status = await BookingService.checkProviderStatus(currentUser.uid);
      setProviderStatus(status);
    } catch (error) {
      console.error('Error checking provider status:', error);
      // Don't show error toast as this might be expected for new users
    } finally {
      setCheckingProviderStatus(false);
    }
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const patientAppointments = await BookingService.getPatientAppointments(currentUser.uid);
      setAppointments(patientAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await BookingService.cancelAppointment(appointmentId);
      toast.success('Appointment cancelled successfully');
      loadAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const createTestProvider = async () => {
    try {
      await BookingService.createTestProvider(currentUser.orgID);
      toast.success('Test provider created successfully!');
    } catch (error) {
      console.error('Error creating test provider:', error);
      toast.error('Failed to create test provider');
    }
  };

  const handleRegistrationComplete = (providerId) => {
    // Refresh provider status and switch to provider dashboard
    checkProviderStatus();
    setActiveTab('dashboard');
    toast.success('Provider registration completed! Welcome to your dashboard.');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (date) => {
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!userLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  // Show loading state while determining user role and loading data
  if (loading && !currentUser) {
    return (
      <div className={`flex-1 overflow-auto relative z-10 ${bgColor}`}>
        <Header
          title="Appointment Management"
          icon={<Calendar style={{ marginRight: "10px" }} color="#56BB6E" />}
        />
        <main className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${textColor}`}>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${bgColor}`}>
      <Header
        title="Appointment Management"
        icon={<Calendar style={{ marginRight: "10px" }} color="#56BB6E" />}
      />

      <main className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${textColor}`}>
        {/* Welcome Section */}
        <div className={`${cardBgColor} rounded-lg p-6 ${borderColor} border mb-6`}>
          <div className="text-center">
            <h2 className={`text-2xl font-bold ${textColor} mb-2`}>
              Welcome to Appointment Management
            </h2>
            <p className={`text-sm ${textSecondaryColor}`}>
              {providerStatus?.isProvider 
                ? 'Manage your availability, view patient appointments, and track your schedule'
                : providerStatus?.registrationStatus === 'pending'
                ? 'Your provider registration is being reviewed. You\'ll be notified once approved.'
                : 'Book appointments with healthcare providers and manage your healthcare journey'
              }
            </p>
          </div>
        </div>

        {/* If user is a provider, show comprehensive management interface */}
        {providerStatus?.isProvider ? (
          <>
            {/* Management Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'calendar'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Calendar
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'appointments'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                  All Appointments
                </button>
                <button
                  onClick={() => setActiveTab('patients')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'patients'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Patient Records
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'dashboard' && <ProviderDashboard />}
            {activeTab === 'calendar' && <ProviderCalendar />}
            {activeTab === 'appointments' && <ProviderCalendar />}
            {activeTab === 'patients' && (
              <div className={`${cardBgColor} rounded-lg p-6 ${borderColor} border`}>
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className={`text-lg font-medium ${textColor} mb-2`}>Patient Records</h3>
                  <p className={`text-sm ${textSecondaryColor}`}>
                    Access patient information and medical history
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Patient Interface or Provider Registration */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('my-appointments')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'my-appointments'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                  My Appointments
                </button>
                <button
                  onClick={() => setActiveTab('book-appointment')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'book-appointment'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Book Appointment
                </button>
                <button
                  onClick={() => setActiveTab('registration')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'registration'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Become a Provider
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'history'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Medical History
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'my-appointments' && (
              <div className="space-y-6">
                {/* Header Section */}
                <div className={`${cardBgColor} rounded-lg p-6 ${borderColor} border`}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h2 className={`text-2xl font-bold ${textColor} mb-2`}>My Appointments</h2>
                      <p className={`text-sm ${textSecondaryColor}`}>
                        Manage and track your upcoming and past appointments
                      </p>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-4">
                      <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} border border-green-200`}>
                        <div className="text-green-600 font-semibold">
                          {filteredAppointments.filter(a => a.status === 'booked').length}
                        </div>
                        <div className="text-xs text-green-600">Upcoming</div>
                      </div>
                      <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border border-blue-200`}>
                        <div className="text-blue-600 font-semibold">
                          {filteredAppointments.filter(a => a.status === 'completed').length}
                        </div>
                        <div className="text-xs text-blue-600">Completed</div>
                      </div>
                      <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-900/20' : 'bg-gray-50'} border border-gray-200`}>
                        <div className="text-gray-600 font-semibold">
                          {filteredAppointments.length}
                        </div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search and Filter Section */}
                <div className={`${cardBgColor} rounded-lg p-6 ${borderColor} border`}>
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search appointments by type, description, or provider..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg ${borderColor} ${bgColor} ${textColor} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`px-4 py-3 border rounded-lg ${borderColor} ${bgColor} ${textColor} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      >
                        <option value="all">All Status</option>
                        <option value="booked">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      
                      {/* Test Provider Button */}
                      <button
                        onClick={createTestProvider}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Test Provider
                      </button>
                    </div>
                  </div>
                </div>

                {/* Appointments List */}
                {loading ? (
                  <div className={`${cardBgColor} rounded-lg p-12 ${borderColor} border`}>
                    <div className="flex flex-col items-center justify-center">
                      <Loader className="w-12 h-12 animate-spin text-green-600 mb-4" />
                      <p className={`text-lg ${textColor}`}>Loading your appointments...</p>
                    </div>
                  </div>
                ) : filteredAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${cardBgColor} rounded-lg ${borderColor} border shadow-sm overflow-hidden`}
                      >
                        {/* Appointment Header */}
                        <div className={`p-6 border-b ${borderColor}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-full ${getStatusColor(appointment.status).split(' ')[0]}`}>
                                {getStatusIcon(appointment.status)}
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <span className={`text-lg font-semibold ${textColor}`}>
                                    {appointment.type || 'Consultation'}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                  </span>
                                </div>
                                <p className={`text-sm ${textSecondaryColor}`}>
                                  {formatDate(appointment.appointmentDate || appointment.date)} at {formatTime(appointment.appointmentDate || appointment.date)}
                                </p>
                              </div>
                            </div>
                            
                            {appointment.status === 'booked' && (
                              <button
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Time & Provider */}
                            <div className="space-y-4">
                              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                <h4 className={`font-medium ${textColor} mb-3 flex items-center gap-2`}>
                                  <Calendar className="w-4 h-4 text-green-600" />
                                  Appointment Details
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${textSecondaryColor}`}>Date:</span>
                                    <span className={`text-sm font-medium ${textColor}`}>
                                      {formatDate(appointment.appointmentDate || appointment.date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${textSecondaryColor}`}>Time:</span>
                                    <span className={`text-sm font-medium ${textColor}`}>
                                      {formatTime(appointment.appointmentDate || appointment.date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${textSecondaryColor}`}>Duration:</span>
                                    <span className={`text-sm font-medium ${textColor}`}>30 minutes</span>
                                  </div>
                                </div>
                              </div>

                              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                <h4 className={`font-medium ${textColor} mb-3 flex items-center gap-2`}>
                                  <User className="w-4 h-4 text-blue-600" />
                                  Provider Information
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${textSecondaryColor}`}>Provider ID:</span>
                                    <span className={`text-sm font-medium ${textColor}`}>
                                      {appointment.providerId}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${textSecondaryColor}`}>Specialty:</span>
                                    <span className={`text-sm font-medium ${textColor}`}>
                                      General Medicine
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Column - Description & Actions */}
                            <div className="space-y-4">
                              {appointment.description && (
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                  <h4 className={`font-medium ${textColor} mb-3 flex items-center gap-2`}>
                                    <AlertCircle className="w-4 h-4 text-orange-600" />
                                    Description
                                  </h4>
                                  <p className={`text-sm ${textSecondaryColor} leading-relaxed`}>
                                    {appointment.description}
                                  </p>
                                </div>
                              )}

                              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                <h4 className={`font-medium ${textColor} mb-3 flex items-center gap-2`}>
                                  <Clock className="w-4 h-4 text-purple-600" />
                                  Actions
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
                                    View Details
                                  </button>
                                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
                                    Reschedule
                                  </button>
                                  <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
                                    Add to Calendar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className={`${cardBgColor} rounded-lg p-12 ${borderColor} border`}>
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className={`text-xl font-semibold ${textColor} mb-3`}>No appointments found</h3>
                      <p className={`text-sm ${textSecondaryColor} mb-6 max-w-md mx-auto`}>
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria to find your appointments.'
                          : 'You don\'t have any appointments yet. Book your first appointment to get started with your healthcare journey.'
                        }
                      </p>
                      {!searchTerm && statusFilter === 'all' && (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            onClick={() => setActiveTab('book-appointment')}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Book Your First Appointment
                          </button>
                          <button
                            onClick={createTestProvider}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                          >
                            Add Test Provider
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'book-appointment' && (
              <BookAppointment />
            )}

            {activeTab === 'registration' && (
              <ProviderRegistration onRegistrationComplete={handleRegistrationComplete} />
            )}

            {activeTab === 'history' && (
              <div className={`${cardBgColor} rounded-lg p-6 ${borderColor} border`}>
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className={`text-lg font-medium ${textColor} mb-2`}>Medical History</h3>
                  <p className={`text-sm ${textSecondaryColor}`}>
                    View your complete medical history and records
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AppointmentsPage;

