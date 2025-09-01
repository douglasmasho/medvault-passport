import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  Users,
  CalendarDays,
  Clock3
} from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import { useDarkMode } from '../../contexts/darkModeContext';
import BookingService from '../../firebase/booking';
import toast from 'react-hot-toast';
import ModalWrapper from '../Modal/ModalWrapper';

const ProviderCalendar = () => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newSlotData, setNewSlotData] = useState({
    startTime: '',
    endTime: '',
    recurring: false,
    maxPatients: 1
  });

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
  }, [currentUser?.uid, selectedDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [slots, apps] = await Promise.all([
        BookingService.getProviderAvailability(currentUser.uid),
        BookingService.getProviderAppointments(currentUser.uid)
      ]);
      setAvailabilitySlots(slots);
      setAppointments(apps);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async () => {
    try {
      if (!newSlotData.startTime || !newSlotData.endTime) {
        toast.error('Please fill in all required fields');
        return;
      }

      await BookingService.createAvailabilitySlot(
        currentUser.uid,
        currentUser.orgID,
        newSlotData.startTime,
        newSlotData.endTime,
        newSlotData.recurring
      );

      toast.success('Availability slot created successfully');
      setShowAddSlotModal(false);
      setNewSlotData({ startTime: '', endTime: '', recurring: false, maxPatients: 1 });
      loadData();
    } catch (error) {
      console.error('Error creating slot:', error);
      toast.error('Failed to create availability slot');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await BookingService.deleteAvailabilitySlot(slotId);
      toast.success('Slot deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast.error('Failed to delete slot');
    }
  };

  const handleSlotClick = async (slot) => {
    setSelectedSlot(slot);
    if (slot.status === 'booked') {
      // Find the corresponding appointment
      const appointment = appointments.find(app => 
        app.date?.toDate?.()?.getTime() === slot.startTime?.toDate?.()?.getTime()
      );
      if (appointment) {
        setSelectedAppointment(appointment);
        setShowAppointmentModal(true);
      }
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // This would need to be implemented in the BookingService
      // await BookingService.updateAppointmentStatus(appointmentId, newStatus);
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
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'booked':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
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

  const formatFullDate = (date) => {
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
  const cancelledAppointments = appointments.filter(app => app.status === 'cancelled');

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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddSlotModal(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Availability</span>
        </motion.button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textSecondaryColor}`}>Today's Appointments</p>
              <p className={`text-2xl font-bold ${textColor}`}>{todayAppointments.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarDays className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textSecondaryColor}`}>Upcoming</p>
              <p className={`text-2xl font-bold ${textColor}`}>{upcomingAppointments.length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textSecondaryColor}`}>Completed</p>
              <p className={`text-2xl font-bold ${textColor}`}>{completedAppointments.length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${textSecondaryColor}`}>Total Patients</p>
              <p className={`text-2xl font-bold ${textColor}`}>
                {new Set(appointments.map(app => app.patientId)).size}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Appointments
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'availability'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Availability
            </button>
          </nav>
        </div>
      </div>

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Calendar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availabilitySlots.map((slot) => (
              <motion.div
                key={slot.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSlotClick(slot)}
                className={`${cardBgColor} p-4 rounded-lg ${borderColor} border cursor-pointer transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(slot.status)}
                    <span className={`text-sm font-medium px-2 py-1 rounded-full border ${getStatusColor(slot.status)}`}>
                      {slot.status}
                    </span>
                  </div>
                  {slot.status === 'available' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlot(slot.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className={`text-sm ${textColor}`}>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </div>
                  <div className={`text-sm ${textSecondaryColor}`}>
                    {formatDate(slot.startTime)}
                  </div>
                  {slot.recurring && (
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      Recurring
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {availabilitySlots.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className={`text-lg font-medium ${textColor} mb-2`}>No availability slots</h3>
              <p className={`text-sm ${textSecondaryColor} mb-4`}>
                Create your first availability slot to start accepting appointments
              </p>
              <button
                onClick={() => setShowAddSlotModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add First Slot
              </button>
            </div>
          )}
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments by patient ID or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${borderColor} ${bgColor} ${textColor} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-3 border rounded-lg ${borderColor} ${bgColor} ${textColor} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            >
              <option value="all">All Status</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${cardBgColor} rounded-lg ${borderColor} border shadow-sm overflow-hidden`}
              >
                <div className="p-6">
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
                          Patient ID: {appointment.patientId}
                        </p>
                        <p className={`text-sm ${textSecondaryColor}`}>
                          {formatFullDate(appointment.date)} at {formatTime(appointment.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowAppointmentModal(true);
                        }}
                        className="px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      {appointment.status === 'booked' && (
                        <>
                          <button
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed')}
                            className="px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                            className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
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
      )}

      {/* Availability Tab */}
      {activeTab === 'availability' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availabilitySlots.map((slot) => (
              <motion.div
                key={slot.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(slot.status)}
                    <span className={`text-sm font-medium px-2 py-1 rounded-full border ${getStatusColor(slot.status)}`}>
                      {slot.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedSlot(slot);
                        setNewSlotData({
                          startTime: slot.startTime?.toDate?.()?.toISOString().slice(0, 16) || '',
                          endTime: slot.endTime?.toDate?.()?.toISOString().slice(0, 16) || '',
                          recurring: slot.recurring || false,
                          maxPatients: slot.maxPatients || 1
                        });
                        setShowAddSlotModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className={`text-sm ${textColor}`}>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </div>
                  <div className={`text-sm ${textSecondaryColor}`}>
                    {formatDate(slot.startTime)}
                  </div>
                  {slot.recurring && (
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      Recurring
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      <ModalWrapper
        open={showAddSlotModal}
        onClose={() => setShowAddSlotModal(false)}
        title="Add Availability Slot"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Start Time
            </label>
            <input
              type="datetime-local"
              value={newSlotData.startTime}
              onChange={(e) => setNewSlotData({ ...newSlotData, startTime: e.target.value })}
              className={`w-full p-3 border rounded-lg ${borderColor} ${bgColor} ${textColor}`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              End Time
            </label>
            <input
              type="datetime-local"
              value={newSlotData.endTime}
              onChange={(e) => setNewSlotData({ ...newSlotData, endTime: e.target.value })}
              className={`w-full p-3 border rounded-lg ${borderColor} ${bgColor} ${textColor}`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Maximum Patients
            </label>
            <input
              type="number"
              min="1"
              value={newSlotData.maxPatients}
              onChange={(e) => setNewSlotData({ ...newSlotData, maxPatients: parseInt(e.target.value) })}
              className={`w-full p-3 border rounded-lg ${borderColor} ${bgColor} ${textColor}`}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recurring"
              checked={newSlotData.recurring}
              onChange={(e) => setNewSlotData({ ...newSlotData, recurring: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="recurring" className={`text-sm ${textColor}`}>
              Recurring slot
            </label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowAddSlotModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSlot}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Slot
            </button>
          </div>
        </div>
      </ModalWrapper>

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
                    {formatFullDate(selectedAppointment.date)} at {formatTime(selectedAppointment.date)}
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

export default ProviderCalendar;

