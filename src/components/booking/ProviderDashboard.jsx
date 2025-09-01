import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  CalendarDays,
  Clock3
} from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import { useDarkMode } from '../../contexts/darkModeContext';
import BookingService from '../../firebase/booking';
import toast from 'react-hot-toast';
import ModalWrapper from '../Modal/ModalWrapper';

const ProviderDashboard = () => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [appointments, setAppointments] = useState([]);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dynamic colors based on theme
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondaryColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';

  useEffect(() => {
    if (currentUser?.uid) {
      loadData();
    }
  }, [currentUser?.uid]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apps, slots] = await Promise.all([
        BookingService.getProviderAppointments(currentUser.uid),
        BookingService.getProviderAvailability(currentUser.uid)
      ]);
      setAppointments(apps);
      setAvailabilitySlots(slots);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await BookingService.updateAppointmentStatus(appointmentId, newStatus);
      toast.success(`Appointment ${newStatus} successfully`);
      loadData();
      setShowAppointmentModal(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
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
      day: 'numeric'
    });
  };

  // Calculate dashboard stats
  const todayAppointments = appointments.filter(app => {
    const appDate = app.date?.toDate ? app.date.toDate() : new Date(app.date);
    const today = new Date();
    return appDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments.filter(app => {
    const appDate = app.date?.toDate ? app.date.toDate() : new Date(app.date);
    const now = new Date();
    return appDate > now && app.status === 'booked';
  });

  const completedAppointments = appointments.filter(app => app.status === 'completed');
  const availableSlots = availabilitySlots.filter(slot => slot.status === 'available');

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className={`${bgColor} rounded-lg p-6 ${borderColor} border`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgColor} rounded-lg p-6 ${borderColor} border`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-green-600" />
          <h2 className={`text-xl font-semibold ${textColor}`}>Provider Dashboard</h2>
        </div>
        <div className="text-sm text-gray-500">
          Welcome back, Dr. {currentUser?.name || 'Provider'}
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textSecondaryColor}`}>Today's Appointments</p>
              <p className={`text-2xl font-bold ${textColor}`}>{todayAppointments.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarDays className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textSecondaryColor}`}>Upcoming</p>
              <p className={`text-2xl font-bold ${textColor}`}>{upcomingAppointments.length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textSecondaryColor}`}>Completed</p>
              <p className={`text-2xl font-bold ${textColor}`}>{completedAppointments.length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textSecondaryColor}`}>Available Slots</p>
              <p className={`text-2xl font-bold ${textColor}`}>{availableSlots.length}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Appointments */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${textColor}`}>Recent Appointments</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-lg ${borderColor} ${bgColor} ${textColor} text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 border rounded-lg ${borderColor} ${bgColor} ${textColor} text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            >
              <option value="all">All Status</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-3">
          {filteredAppointments.slice(0, 5).map((appointment) => (
            <motion.div
              key={appointment.id}
              whileHover={{ scale: 1.01 }}
              className={`${cardBgColor} p-4 rounded-lg ${borderColor} border cursor-pointer transition-all`}
              onClick={() => {
                setSelectedAppointment(appointment);
                setShowAppointmentModal(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${getStatusColor(appointment.status).split(' ')[0]}`}>
                    {getStatusIcon(appointment.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${textColor}`}>
                        {appointment.type || 'Consultation'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className={`text-sm ${textSecondaryColor}`}>
                      Patient ID: {appointment.patientId}
                    </p>
                    <p className={`text-sm ${textSecondaryColor}`}>
                      {formatDate(appointment.date)} at {formatTime(appointment.date)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAppointment(appointment);
                      setShowAppointmentModal(true);
                    }}
                    className="px-3 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded text-sm font-medium flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  {appointment.status === 'booked' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateAppointmentStatus(appointment.id, 'completed');
                        }}
                        className="px-3 py-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded text-sm font-medium flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Complete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateAppointmentStatus(appointment.id, 'cancelled');
                        }}
                        className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded text-sm font-medium flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-lg font-medium ${textColor} mb-2`}>No appointments found</h3>
            <p className={`text-sm ${textSecondaryColor}`}>
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You don\'t have any appointments yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      <ModalWrapper
        open={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        title="Appointment Details"
        isDarkMode={isDarkMode}
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span className={`font-medium ${textColor}`}>Patient Information</span>
            </div>
            
            <div className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}>
              <div className="space-y-2">
                <div>
                  <span className={`text-sm ${textSecondaryColor}`}>Patient ID:</span>
                  <span className={`ml-2 ${textColor}`}>{selectedAppointment.patientId}</span>
                </div>
                <div>
                  <span className={`text-sm ${textSecondaryColor}`}>Appointment Type:</span>
                  <span className={`ml-2 ${textColor}`}>{selectedAppointment.type || 'Consultation'}</span>
                </div>
                <div>
                  <span className={`text-sm ${textSecondaryColor}`}>Date & Time:</span>
                  <span className={`ml-2 ${textColor}`}>
                    {formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.date)}
                  </span>
                </div>
                {selectedAppointment.description && (
                  <div>
                    <span className={`text-sm ${textSecondaryColor}`}>Description:</span>
                    <p className={`mt-1 ${textColor}`}>{selectedAppointment.description}</p>
                  </div>
                )}
                <div>
                  <span className={`text-sm ${textSecondaryColor}`}>Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedAppointment.status === 'booked' && (
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => handleUpdateAppointmentStatus(selectedAppointment.id, 'completed')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => handleUpdateAppointmentStatus(selectedAppointment.id, 'cancelled')}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Cancel Appointment
                </button>
              </div>
            )}
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </ModalWrapper>
    </div>
  );
};

export default ProviderDashboard;
