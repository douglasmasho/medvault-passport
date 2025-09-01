import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Firebase Functions
const bookAppointmentFunction = httpsCallable(functions, 'bookAppointment');
const cancelAppointmentFunction = httpsCallable(functions, 'cancelAppointment');

// Booking Service Class
export class BookingService {
 b   // Register as a provider
  static async registerAsProvider(providerData) {
    try {
      const providerRegistrationData = {
        ...providerData,
        role: 'provider',
        isActive: true,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        registrationStatus: 'pending', // pending, approved, rejected
        verified: false
      };

      const docRef = await addDoc(collection(db, 'users'), providerRegistrationData);
      
      // Create initial availability slots for the provider
      await this.createInitialAvailabilitySlots(docRef.id, providerData.orgID);
      
      return { 
        success: true, 
        providerId: docRef.id,
        message: 'Provider registration submitted successfully. Your account will be reviewed and activated shortly.'
      };
    } catch (error) {
      console.error('Error registering as provider:', error);
      throw error;
    }
  }

  // Update provider profile
  static async updateProviderProfile(providerId, updates) {
    try {
      const providerRef = doc(db, 'users', providerId);
      await updateDoc(providerRef, {
        ...updates,
        lastUpdated: serverTimestamp()
      });
      return { success: true, message: 'Provider profile updated successfully' };
    } catch (error) {
      console.error('Error updating provider profile:', error);
      throw error;
    }
  }

  // Get provider profile
  static async getProviderProfile(providerId) {
    try {
      const providerRef = doc(db, 'users', providerId);
      const providerDoc = await getDoc(providerRef);
      
      if (providerDoc.exists()) {
        return {
          id: providerDoc.id,
          ...providerDoc.data()
        };
      } else {
        throw new Error('Provider not found');
      }
    } catch (error) {
      console.error('Error getting provider profile:', error);
      throw error;
    }
  }

  // Check if user is already a provider
  static async checkProviderStatus(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          isProvider: userData.role === 'provider',
          isActive: userData.isActive || false,
          registrationStatus: userData.registrationStatus || 'not_registered',
          profile: {
            id: userDoc.id,
            ...userData
          }
        };
      } else {
        return {
          isProvider: false,
          isActive: false,
          registrationStatus: 'not_registered',
          profile: null
        };
      }
    } catch (error) {
      console.error('Error checking provider status:', error);
      throw error;
    }
  }

  // Create initial availability slots for new provider
  static async createInitialAvailabilitySlots(providerId, orgId) {
    try {
      const slots = [];
      const now = new Date();
      
      // Create slots for the next 14 days (2 weeks)
      for (let i = 1; i <= 14; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        
        // Skip weekends (Saturday = 6, Sunday = 0)
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;
        
        // Create 4 slots per day (9 AM, 11 AM, 2 PM, 4 PM)
        const times = [
          { hour: 9, minute: 0 },
          { hour: 11, minute: 0 },
          { hour: 14, minute: 0 },
          { hour: 16, minute: 0 }
        ];
        
        times.forEach(({ hour, minute }) => {
          const startTime = new Date(date);
          startTime.setHours(hour, minute, 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + 30); // 30-minute slots
          
          slots.push({
            providerId,
            orgId,
            startTime,
            endTime,
            status: 'available',
            recurring: false,
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp()
          });
        });
      }
      
      // Add all slots to Firestore in batches
      const batch = writeBatch(db);
      slots.forEach(slot => {
        const docRef = doc(collection(db, 'providerAvailability'));
        batch.set(docRef, slot);
      });
      
      await batch.commit();
      
    } catch (error) {
      console.error('Error creating initial availability slots:', error);
      throw error;
    }
  }

  // Book an appointment using Firebase Function
  static async bookAppointment(providerId, patientId, slotId, appointmentDetails) {
    try {
      const result = await bookAppointmentFunction({
        providerId,
        patientId,
        slotId,
        appointmentDetails
      });
      return result.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  }

  // Cancel an appointment using Firebase Function
  static async cancelAppointment(appointmentId) {
    try {
      const result = await cancelAppointmentFunction({ appointmentId });
      return result.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  // Create provider availability slot
  static async createAvailabilitySlot(providerId, orgId, startTime, endTime, recurring = false) {
    try {
      const slotData = {
        providerId,
        orgId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: 'available',
        recurring,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'providerAvailability'), slotData);
      return { success: true, slotId: docRef.id };
    } catch (error) {
      console.error('Error creating availability slot:', error);
      throw error;
    }
  }

  // Update provider availability slot
  static async updateAvailabilitySlot(slotId, updates) {
    try {
      const slotRef = doc(db, 'providerAvailability', slotId);
      await updateDoc(slotRef, {
        ...updates,
        lastUpdated: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating availability slot:', error);
      throw error;
    }
  }

  // Delete provider availability slot
  static async deleteAvailabilitySlot(slotId) {
    try {
      const slotRef = doc(db, 'providerAvailability', slotId);
      await deleteDoc(slotRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting availability slot:', error);
      throw error;
    }
  }

  // Get provider availability slots
  static async getProviderAvailability(providerId, startDate = null, endDate = null) {
    try {
      let q = query(
        collection(db, 'providerAvailability'),
        where('providerId', '==', providerId)
      );

      if (startDate && endDate) {
        q = query(
          collection(db, 'providerAvailability'),
          where('providerId', '==', providerId),
          where('startTime', '>=', new Date(startDate)),
          where('startTime', '<=', new Date(endDate))
        );
      }

      const querySnapshot = await getDocs(q);
      const slots = [];
      querySnapshot.forEach((doc) => {
        slots.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return slots;
    } catch (error) {
      console.error('Error getting provider availability:', error);
      throw error;
    }
  }

  // Get patient appointments
  static async getPatientAppointments(patientId) {
    try {
      const q = query(
        collection(db, 'appointments'),
        where('patientId', '==', patientId)
      );
      const querySnapshot = await getDocs(q);
      const appointments = [];
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return appointments;
    } catch (error) {
      console.error('Error getting patient appointments:', error);
      throw error;
    }
  }

  // Get provider appointments
  static async getProviderAppointments(providerId) {
    try {
      const q = query(
        collection(db, 'appointments'),
        where('providerId', '==', providerId)
      );
      const querySnapshot = await getDocs(q);
      const appointments = [];
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return appointments;
    } catch (error) {
      console.error('Error getting provider appointments:', error);
      throw error;
    }
  }

  // Get single appointment details
  static async getAppointmentDetails(appointmentId) {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      const appointmentDoc = await getDoc(appointmentRef);
      
      if (appointmentDoc.exists()) {
        return {
          id: appointmentDoc.id,
          ...appointmentDoc.data()
        };
      } else {
        throw new Error('Appointment not found');
      }
    } catch (error) {
      console.error('Error getting appointment details:', error);
      throw error;
    }
  }

  // Update appointment status
  static async updateAppointmentStatus(appointmentId, newStatus) {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: newStatus,
        lastUpdated: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  // Search providers by name or specialty
  static async searchProviders(searchTerm, orgId = null) {
    try {
      let q = query(collection(db, 'users'), where('role', '==', 'provider'));
      
      if (orgId) {
        q = query(
          collection(db, 'users'),
          where('role', '==', 'provider'),
          where('orgID', '==', orgId)
        );
      }

      const querySnapshot = await getDocs(q);
      const providers = [];
      
      querySnapshot.forEach((doc) => {
        const providerData = doc.data();
        // Filter by search term if provided
        if (!searchTerm || 
            providerData.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            providerData.specialty?.toLowerCase().includes(searchTerm.toLowerCase())) {
          providers.push({
            id: doc.id,
            ...providerData
          });
        }
      });
      
      return providers;
    } catch (error) {
      console.error('Error searching providers:', error);
      throw error;
    }
  }

  // Create a test provider (for debugging)
  static async createTestProvider(orgId) {
    try {
      // Use a default orgID if none is provided
      const defaultOrgId = orgId || 'default-org-123';
      
      const testProviderData = {
        name: 'Dr. John Smith',
        email: 'john.smith@test.com',
        role: 'provider',
        orgID: defaultOrgId,
        specialty: 'General Medicine',
        phone: '+1234567890',
        createdAt: serverTimestamp(),
        isActive: true
      };

      const docRef = await addDoc(collection(db, 'users'), testProviderData);
      
      // Create some test availability slots for the provider
      await this.createTestAvailabilitySlots(docRef.id, defaultOrgId);
      
      return { success: true, providerId: docRef.id };
    } catch (error) {
      console.error('Error creating test provider:', error);
      throw error;
    }
  }

  // Create test availability slots for a provider
  static async createTestAvailabilitySlots(providerId, orgId) {
    try {
      const slots = [];
      const now = new Date();
      
      // Create slots for the next 7 days
      for (let i = 1; i <= 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        
        // Create 3 slots per day (9 AM, 2 PM, 4 PM)
        const times = [
          { hour: 9, minute: 0 },
          { hour: 14, minute: 0 },
          { hour: 16, minute: 0 }
        ];
        
        times.forEach(({ hour, minute }) => {
          const startTime = new Date(date);
          startTime.setHours(hour, minute, 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + 30); // 30-minute slots
          
          slots.push({
            providerId,
            orgId,
            startTime,
            endTime,
            status: 'available',
            recurring: false,
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp()
          });
        });
      }
      
      // Add all slots to Firestore
      const batch = writeBatch(db);
      slots.forEach(slot => {
        const docRef = doc(collection(db, 'providerAvailability'));
        batch.set(docRef, slot);
      });
      
      await batch.commit();
      
    } catch (error) {
      console.error('Error creating test availability slots:', error);
      throw error;
    }
  }
}

export default BookingService;

