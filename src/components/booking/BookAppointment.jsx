import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Star, 
  Filter,
  CheckCircle,
  AlertCircle,
  Loader,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import { useDarkMode } from '../../contexts/darkModeContext';
import BookingService from '../../firebase/booking';
import toast from 'react-hot-toast';
import ModalWrapper from '../Modal/ModalWrapper';

const BookAppointment = () => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    type: 'consultation',
    description: ''
  });

  // Dynamic colors based on theme
  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondaryColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBgColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

  useEffect(() => {
    if (currentUser?.uid) {
      loadProviders();
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    // Filter providers based on search term
    const filtered = providers.filter(provider => 
      provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProviders(filtered);
  }, [searchTerm, providers]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const providersList = await BookingService.searchProviders('', currentUser.orgID);
      setProviders(providersList);
      setFilteredProviders(providersList);
    } catch (error) {
      console.error('Error loading providers:', error);
      toast.error(`Failed to load providers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestProvider = async () => {
    try {
      await BookingService.createTestProvider(currentUser.orgID);
      toast.success('Test provider created successfully!');
      loadProviders(); // Reload the providers list
    } catch (error) {
      console.error('Error creating test provider:', error);
      toast.error('Failed to create test provider');
    }
  };

  const createTestSlots = async () => {
    try {
      if (!selectedProvider) {
        toast.error('Please select a provider first');
        return;
      }
      await BookingService.createTestAvailabilitySlots(selectedProvider.id, currentUser.orgID || 'default-org-123');
      toast.success('Test availability slots created successfully!');
      handleProviderSelect(selectedProvider); // Reload the availability slots
    } catch (error) {
      console.error('Error creating test slots:', error);
      toast.error('Failed to create test slots');
    }
  };

  const handleProviderSelect = async (provider) => {
    try {
      setSelectedProvider(provider);
      setLoading(true);
      const slots = await BookingService.getProviderAvailability(provider.id);
      // Filter only available slots
      const availableSlots = slots.filter(slot => slot.status === 'available');
      setAvailabilitySlots(availableSlots);
    } catch (error) {
      console.error('Error loading provider availability:', error);
      toast.error('Failed to load provider availability');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const handleBooking = async () => {
    try {
      if (!selectedProvider || !selectedSlot || !bookingData.type) {
        toast.error('Please fill in all required fields');
        return;
      }

      await BookingService.bookAppointment(
        selectedProvider.id,
        currentUser.uid,
        selectedSlot.id,
        bookingData
      );

      toast.success('Appointment booked successfully!');
      setShowBookingModal(false);
      setSelectedSlot(null);
      setBookingData({ type: 'consultation', description: '' });
      // Refresh availability slots
      handleProviderSelect(selectedProvider);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  const formatTime = (date) => {
    // Handle Firestore Timestamp objects
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    // Handle Firestore Timestamp objects
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDuration = (startTime, endTime) => {
    // Handle Firestore Timestamp objects
    const start = startTime?.toDate ? startTime.toDate() : new Date(startTime);
    const end = endTime?.toDate ? endTime.toDate() : new Date(endTime);
    const diffMs = end - start;
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} minutes`;
  };

  if (loading && providers.length === 0) {
    return (
      <div className={`${bgColor} rounded-lg p-6 ${borderColor} border`}>
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

    return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className={`${cardBgColor} rounded-lg p-6 ${borderColor} border`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${textColor} mb-2`}>Book Your Appointment</h2>
            <p className={`text-sm ${textSecondaryColor}`}>
              Find and book appointments with healthcare providers in your area
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4">
            <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border border-blue-200`}>
              <div className="text-blue-600 font-semibold">{filteredProviders.length}</div>
              <div className="text-xs text-blue-600">Providers</div>
            </div>
            <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} border border-green-200`}>
              <div className="text-green-600 font-semibold">{availabilitySlots.length}</div>
              <div className="text-xs text-green-600">Available Slots</div>
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
              placeholder="Search providers by name, specialty, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg ${borderColor} ${bgColor} ${textColor} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
          </div>
          
          {/* Test Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={createTestProvider}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Test Provider
            </button>
            {selectedProvider && (
              <button
                onClick={createTestSlots}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Add Test Slots
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Providers List */}
        <div className="xl:col-span-1">
          <div className={`${cardBgColor} rounded-lg p-6 ${borderColor} border`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${textColor}`}>Healthcare Providers</h3>
              <div className="text-sm text-gray-500">{filteredProviders.length} available</div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredProviders.map((provider) => (
                <motion.div
                  key={provider.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProviderSelect(provider)}
                  className={`${bgColor} p-4 rounded-lg ${borderColor} border cursor-pointer transition-all hover:shadow-md ${
                    selectedProvider?.id === provider.id ? 'ring-2 ring-green-500 bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedProvider?.id === provider.id ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <User className={`w-6 h-6 ${selectedProvider?.id === provider.id ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold ${textColor} truncate`}>
                        {provider.name || 'Unknown Provider'}
                      </h4>
                      <p className={`text-sm ${textSecondaryColor} mb-1`}>
                        {provider.specialty || 'General Medicine'}
                      </p>
                      {provider.location && (
                        <div className="flex items-center space-x-1 mb-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className={`text-xs ${textSecondaryColor} truncate`}>{provider.location}</span>
                        </div>
                      )}
                      {provider.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className={`text-xs ${textSecondaryColor}`}>{provider.rating}</span>
                        </div>
                      )}
                    </div>
                    {selectedProvider?.id === provider.id && (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredProviders.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className={`text-lg font-medium ${textColor} mb-2`}>No providers found</h4>
                <p className={`text-sm ${textSecondaryColor} mb-4`}>
                  {searchTerm ? 'Try adjusting your search criteria' : 'No healthcare providers are currently available'}
                </p>
                <button
                  onClick={createTestProvider}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Add Test Provider
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Availability Slots */}
        <div className="xl:col-span-2">
          <div className={`${cardBgColor} rounded-lg p-6 ${borderColor} border`}>
            {selectedProvider ? (
              <div>
                {/* Provider Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${textColor}`}>
                        {selectedProvider.name || 'Unknown Provider'}
                      </h3>
                      <p className={`text-sm ${textSecondaryColor}`}>
                        {selectedProvider.specialty || 'General Medicine'}
                      </p>
                      {selectedProvider.location && (
                        <p className={`text-xs ${textSecondaryColor} flex items-center gap-1 mt-1`}>
                          <MapPin className="w-3 h-3" />
                          {selectedProvider.location}
                        </p>
                      )}
                    </div>
                  </div>
                  {loading && (
                    <div className="flex items-center space-x-2">
                      <Loader className="w-5 h-5 animate-spin text-green-600" />
                      <span className={`text-sm ${textSecondaryColor}`}>Loading slots...</span>
                    </div>
                  )}
                </div>

                {/* Available Slots */}
                <div>
                  <h4 className={`text-lg font-semibold ${textColor} mb-4`}>Available Appointment Slots</h4>
                  
                  {availabilitySlots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availabilitySlots.map((slot) => (
                        <motion.div
                          key={slot.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSlotSelect(slot)}
                          className={`${bgColor} p-4 rounded-lg ${borderColor} border cursor-pointer transition-all hover:shadow-md hover:border-green-300`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-5 h-5 text-green-600" />
                              <span className={`font-semibold ${textColor}`}>
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </span>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className={`text-sm font-medium ${textColor}`}>
                                {formatDate(slot.startTime)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className={`text-sm ${textSecondaryColor}`}>
                                Duration: {getDuration(slot.startTime, slot.endTime)}
                              </span>
                            </div>
                            {slot.recurring && (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 text-blue-500">🔄</div>
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                  Recurring Slot
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                              Book This Slot
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-gray-400" />
                      </div>
                      <h4 className={`text-lg font-medium ${textColor} mb-2`}>No available slots</h4>
                      <p className={`text-sm ${textSecondaryColor} mb-4`}>
                        This provider doesn't have any available slots at the moment.
                      </p>
                      <button
                        onClick={createTestSlots}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Add Test Slots
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className={`text-lg font-medium ${textColor} mb-2`}>Select a Provider</h4>
                <p className={`text-sm ${textSecondaryColor} mb-4`}>
                  Choose a healthcare provider from the list to view their available appointment slots.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={createTestProvider}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Add Test Provider
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

             {/* Booking Modal */}
       <ModalWrapper
         open={showBookingModal}
         onClose={() => setShowBookingModal(false)}
         title="Confirm Your Appointment"
         isDarkMode={isDarkMode}
       >
         {selectedSlot && selectedProvider && (
           <div className="space-y-6">
             {/* Appointment Summary */}
             <div className={`${cardBgColor} p-6 rounded-lg ${borderColor} border`}>
               <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
                 <CheckCircle className="w-5 h-5 text-green-600" />
                 Appointment Summary
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Provider Info */}
                 <div className="space-y-3">
                   <div className="flex items-center space-x-3">
                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                       <User className="w-6 h-6 text-green-600" />
                     </div>
                     <div>
                       <h4 className={`font-semibold ${textColor}`}>{selectedProvider.name}</h4>
                       <p className={`text-sm ${textSecondaryColor}`}>{selectedProvider.specialty}</p>
                       {selectedProvider.location && (
                         <p className={`text-xs ${textSecondaryColor} flex items-center gap-1 mt-1`}>
                           <MapPin className="w-3 h-3" />
                           {selectedProvider.location}
                         </p>
                       )}
                     </div>
                   </div>
                 </div>
                 
                 {/* Time & Date */}
                 <div className="space-y-3">
                   <div className="flex items-center space-x-2">
                     <Calendar className="w-5 h-5 text-blue-600" />
                     <span className={`font-medium ${textColor}`}>
                       {formatDate(selectedSlot.startTime)}
                     </span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Clock className="w-5 h-5 text-green-600" />
                     <span className={`font-medium ${textColor}`}>
                       {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                     </span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Clock className="w-4 h-4 text-gray-500" />
                     <span className={`text-sm ${textSecondaryColor}`}>
                       Duration: {getDuration(selectedSlot.startTime, selectedSlot.endTime)}
                     </span>
                   </div>
                 </div>
               </div>
             </div>

             {/* Booking Form */}
             <div className="space-y-4">
               <div>
                 <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                   Appointment Type *
                 </label>
                 <select
                   value={bookingData.type}
                   onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                   className={`w-full p-3 border rounded-lg ${borderColor} ${bgColor} ${textColor} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                 >
                   <option value="consultation">General Consultation</option>
                   <option value="follow-up">Follow-up Visit</option>
                   <option value="emergency">Emergency Visit</option>
                   <option value="routine">Routine Check-up</option>
                   <option value="specialist">Specialist Consultation</option>
                   <option value="vaccination">Vaccination</option>
                   <option value="screening">Health Screening</option>
                 </select>
               </div>
               
               <div>
                 <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                   Reason for Visit (Optional)
                 </label>
                 <textarea
                   value={bookingData.description}
                   onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                   placeholder="Please describe your symptoms, concerns, or reason for the visit..."
                   rows={4}
                   className={`w-full p-3 border rounded-lg ${borderColor} ${bgColor} ${textColor} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                 />
                 <p className={`text-xs ${textSecondaryColor} mt-1`}>
                   This helps the provider prepare for your appointment
                 </p>
               </div>
             </div>

             {/* Important Notes */}
             <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border border-blue-200`}>
               <h4 className={`text-sm font-semibold ${textColor} mb-2 flex items-center gap-2`}>
                 <AlertCircle className="w-4 h-4 text-blue-600" />
                 Important Information
               </h4>
               <ul className={`text-xs ${textSecondaryColor} space-y-1`}>
                 <li>• Please arrive 10 minutes before your appointment time</li>
                 <li>• Bring your ID and insurance information if applicable</li>
                 <li>• You can cancel or reschedule up to 24 hours before the appointment</li>
                 <li>• A confirmation email will be sent to your registered email address</li>
               </ul>
             </div>
             
             {/* Action Buttons */}
             <div className="flex flex-col sm:flex-row gap-3 pt-4">
               <button
                 onClick={() => setShowBookingModal(false)}
                 className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
               >
                 Cancel
               </button>
               <button
                 onClick={handleBooking}
                 className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
               >
                 <CheckCircle className="w-4 h-4" />
                 Confirm Booking
               </button>
             </div>
           </div>
         )}
       </ModalWrapper>
    </div>
  );
};

export default BookAppointment;

