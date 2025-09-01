const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

// Helper function to check if user is authenticated
const isAuthenticated = (context) => {
  return context.auth != null;
};

// Helper function to validate appointment data
const validateAppointmentData = (data) => {
  const { providerId, patientId, slotId, appointmentDetails } = data;
  
  if (!providerId || !patientId || !slotId || !appointmentDetails) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }
  
  if (!appointmentDetails.type) {
    throw new functions.https.HttpsError('invalid-argument', 'Appointment type is required');
  }
  
  return true;
};

// Book appointment function - atomic operation
exports.bookAppointment = functions.https.onCall(async (data, context) => {
  try {
    // Check authentication
    if (!isAuthenticated(context)) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    // Validate input data
    validateAppointmentData(data);
    
    const { providerId, patientId, slotId, appointmentDetails } = data;
    const userId = context.auth.uid;

    // Verify the patient is booking for themselves
    if (patientId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Can only book appointments for yourself');
    }

    // Start a batch write for atomicity
    const batch = db.batch();

    // 1. Check if the slot is still available
    const slotRef = db.collection('providerAvailability').doc(slotId);
    const slotDoc = await slotRef.get();

    if (!slotDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Availability slot not found');
    }

    const slotData = slotDoc.data();
    
    if (slotData.status !== 'available') {
      throw new functions.https.HttpsError('failed-precondition', 'Slot is no longer available');
    }

    if (slotData.providerId !== providerId) {
      throw new functions.https.HttpsError('invalid-argument', 'Slot does not belong to the specified provider');
    }

    // 2. Create the appointment document
    const appointmentRef = db.collection('appointments').doc();
    const appointmentData = {
      providerId,
      patientId,
      orgId: slotData.orgId,
      date: slotData.startTime,
      status: 'booked',
      type: appointmentDetails.type,
      description: appointmentDetails.description || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    };

    batch.set(appointmentRef, appointmentData);

    // 3. Update the availability slot status
    batch.update(slotRef, {
      status: 'booked',
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    // 4. Update patient's user document
    const patientRef = db.collection('users').doc(patientId);
    batch.update(patientRef, {
      appointments: admin.firestore.FieldValue.arrayUnion(appointmentRef.id),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    // 5. Update provider's user document
    const providerRef = db.collection('users').doc(providerId);
    batch.update(providerRef, {
      appointments: admin.firestore.FieldValue.arrayUnion(appointmentRef.id),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    // Commit the batch
    await batch.commit();

    return {
      success: true,
      appointmentId: appointmentRef.id,
      message: 'Appointment booked successfully'
    };

  } catch (error) {
    console.error('Error booking appointment:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'Failed to book appointment');
  }
});

// Cancel appointment function - atomic operation
exports.cancelAppointment = functions.https.onCall(async (data, context) => {
  try {
    // Check authentication
    if (!isAuthenticated(context)) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { appointmentId } = data;
    const userId = context.auth.uid;

    if (!appointmentId) {
      throw new functions.https.HttpsError('invalid-argument', 'Appointment ID is required');
    }

    // Get the appointment document
    const appointmentRef = db.collection('appointments').doc(appointmentId);
    const appointmentDoc = await appointmentRef.get();

    if (!appointmentDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Appointment not found');
    }

    const appointmentData = appointmentDoc.data();

    // Check permissions - only patient or provider can cancel
    if (appointmentData.patientId !== userId && appointmentData.providerId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to cancel this appointment');
    }

    // Check if appointment can be cancelled
    if (appointmentData.status !== 'booked') {
      throw new functions.https.HttpsError('failed-precondition', 'Appointment cannot be cancelled');
    }

    // Start a batch write for atomicity
    const batch = db.batch();

    // 1. Update appointment status
    batch.update(appointmentRef, {
      status: 'cancelled',
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    // 2. Find and update the corresponding availability slot
    const availabilityQuery = await db.collection('providerAvailability')
      .where('providerId', '==', appointmentData.providerId)
      .where('startTime', '==', appointmentData.date)
      .limit(1)
      .get();

    if (!availabilityQuery.empty) {
      const slotDoc = availabilityQuery.docs[0];
      batch.update(slotDoc.ref, {
        status: 'available',
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // 3. Update patient's user document
    const patientRef = db.collection('users').doc(appointmentData.patientId);
    batch.update(patientRef, {
      appointments: admin.firestore.FieldValue.arrayRemove(appointmentId),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    // 4. Update provider's user document
    const providerRef = db.collection('users').doc(appointmentData.providerId);
    batch.update(providerRef, {
      appointments: admin.firestore.FieldValue.arrayRemove(appointmentId),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    // Commit the batch
    await batch.commit();

    return {
      success: true,
      message: 'Appointment cancelled successfully'
    };

  } catch (error) {
    console.error('Error cancelling appointment:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'Failed to cancel appointment');
  }
});

// Function to handle recurring availability slots
exports.createRecurringSlots = functions.https.onCall(async (data, context) => {
  try {
    // Check authentication
    if (!isAuthenticated(context)) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { providerId, orgId, startTime, endTime, recurringPattern, numberOfOccurrences } = data;
    const userId = context.auth.uid;

    // Verify the user is the provider
    if (providerId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Can only create slots for yourself');
    }

    const batch = db.batch();
    const slots = [];

    // Generate recurring slots based on pattern
    for (let i = 0; i < numberOfOccurrences; i++) {
      const slotStartTime = new Date(startTime);
      const slotEndTime = new Date(endTime);

      // Add days based on recurring pattern
      if (recurringPattern === 'daily') {
        slotStartTime.setDate(slotStartTime.getDate() + i);
        slotEndTime.setDate(slotEndTime.getDate() + i);
      } else if (recurringPattern === 'weekly') {
        slotStartTime.setDate(slotStartTime.getDate() + (i * 7));
        slotEndTime.setDate(slotEndTime.getDate() + (i * 7));
      } else if (recurringPattern === 'monthly') {
        slotStartTime.setMonth(slotStartTime.getMonth() + i);
        slotEndTime.setMonth(slotEndTime.getMonth() + i);
      }

      const slotRef = db.collection('providerAvailability').doc();
      const slotData = {
        providerId,
        orgId,
        startTime: slotStartTime,
        endTime: slotEndTime,
        status: 'available',
        recurring: true,
        recurringPattern,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      };

      batch.set(slotRef, slotData);
      slots.push({ id: slotRef.id, ...slotData });
    }

    await batch.commit();

    return {
      success: true,
      slotsCreated: slots.length,
      slots: slots
    };

  } catch (error) {
    console.error('Error creating recurring slots:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'Failed to create recurring slots');
  }
});

// Function to send appointment notifications (placeholder for future implementation)
exports.sendAppointmentNotification = functions.firestore
  .document('appointments/{appointmentId}')
  .onCreate(async (snap, context) => {
    const appointmentData = snap.data();
    
    // TODO: Implement notification logic
    // This could include:
    // - Sending email notifications
    // - Push notifications via Firebase Cloud Messaging
    // - SMS notifications
    // - Calendar invites
    
    console.log('New appointment created:', appointmentData);
    
    return null;
  });

// Function to clean up expired availability slots
exports.cleanupExpiredSlots = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  try {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days ago

    const expiredSlotsQuery = await db.collection('providerAvailability')
      .where('startTime', '<', cutoffDate)
      .where('status', '==', 'available')
      .get();

    const batch = db.batch();
    let deletedCount = 0;

    expiredSlotsQuery.docs.forEach((doc) => {
      batch.delete(doc.ref);
      deletedCount++;
    });

    if (deletedCount > 0) {
      await batch.commit();
      console.log(`Deleted ${deletedCount} expired availability slots`);
    }

    return null;
  } catch (error) {
    console.error('Error cleaning up expired slots:', error);
    return null;
  }
});


