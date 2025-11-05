import { db } from "./firebase";
import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  arrayUnion, 
  arrayRemove, 
  collection,
  addDoc,
  getDoc,
  getDocs
} from "firebase/firestore";
import { nanoid } from "nanoid";

/**
 * Utility function to normalize questionnaire data to array format
 * Handles backward compatibility with single object format
 * @param {any} questionnaireData - Can be an array, single object, or null/undefined
 * @returns {Array} - Always returns an array
 */
export const normalizeQuestionnairesToArray = (questionnaireData) => {
  if (!questionnaireData) {
    return [];
  }
  if (Array.isArray(questionnaireData)) {
    return questionnaireData;
  }
  if (typeof questionnaireData === "object") {
    return [questionnaireData];
  }
  return [];
};

/**
 * Utility function to get the most recent questionnaire from an array or single object
 * @param {any} questionnaireData - Can be an array, single object, or null/undefined
 * @returns {object|null} - Returns the most recent questionnaire or null
 */
export const getMostRecentQuestionnaire = (questionnaireData) => {
  const questionnaires = normalizeQuestionnairesToArray(questionnaireData);
  if (questionnaires.length === 0) {
    return null;
  }
  // Sort by timestamp (newest first) and return the first one
  const sorted = [...questionnaires].sort((a, b) => {
    const dateA = new Date(a.timestamp || a.createdAt || 0);
    const dateB = new Date(b.timestamp || b.createdAt || 0);
    return dateB - dateA;
  });
  return sorted[0];
};

// Create a new questionnaire
export const createQuestionnaire = async (questionnaireData, uid) => {
  try {
    console.log("createQuestionnaire called with:", { questionnaireData, uid });
    
    const questionnaireId = nanoid(12);
    const timestamp = new Date().toISOString();
    
    // Create the questionnaire object with the required structure
    const questionnaireObj = {
      id: questionnaireId,
      uid: uid,
      type: questionnaireData.type || "vas", // Add type property
      timestamp: timestamp,
      createdAt: timestamp, // Use regular timestamp instead of serverTimestamp()
      ...questionnaireData
    };
    
    console.log("Created questionnaireObj:", questionnaireObj);

    // 1. Save to /questionnaires/{uid} - user's personal questionnaires
    const userQuestionnaireRef = doc(db, "questionnaires", uid);
    const fieldName = questionnaireData.type?.toLowerCase() || "vas";
    console.log("Saving to Firestore with fieldName:", fieldName);
    console.log("Document path:", `questionnaires/${uid}`);
    
    // Get the current document to check if field exists
    const currentDoc = await getDoc(userQuestionnaireRef);
    const currentData = currentDoc.exists() ? currentDoc.data() : {};
    
    // Get existing array for this questionnaire type, or create new array
    // Use utility function to handle both array and single object formats
    const existingArray = normalizeQuestionnairesToArray(currentData[fieldName]);
    
    // Add the new questionnaire to the array
    const updatedArray = [...existingArray, questionnaireObj];
    
    // Save the updated array
    await setDoc(userQuestionnaireRef, {
      [fieldName]: updatedArray
    }, { merge: true });
    
    console.log("Successfully saved to Firestore!");

    return {
      success: true,
      questionnaireId: questionnaireId,
      questionnaire: questionnaireObj
    };
  } catch (error) {
    console.error("Error creating questionnaire:", error);
    throw error;
  }
};

// Update an existing questionnaire
export const updateQuestionnaire = async (questionnaireId, updatedData, uid, orgID) => {
  try {
    const timestamp = new Date().toISOString();
    
    const updatedQuestionnaireObj = {
      ...updatedData,
      updatedAt: timestamp,
      lastModified: timestamp
    };

    // 1. Update in /orgFiles/questionnaires/{orgID} - organization's questionnaire collection
    const orgQuestionnaireRef = doc(db, "orgFiles", "questionnaires", orgID, questionnaireId);
    await updateDoc(orgQuestionnaireRef, updatedQuestionnaireObj);

    // 2. Update in /questionnaires/{uid} - user's personal questionnaires
    // First, get the current questionnaires array
    const userQuestionnaireRef = doc(db, "questionnaires", uid);
    // Note: This is a simplified approach. In a real implementation, you'd need to 
    // fetch the current array, update the specific questionnaire, and save it back
    // For now, we'll rely on the cloud function to handle this synchronization

    return {
      success: true,
      questionnaireId: questionnaireId
    };
  } catch (error) {
    console.error("Error updating questionnaire:", error);
    throw error;
  }
};

// Delete a questionnaire
export const deleteQuestionnaire = async (questionnaireId, uid, orgID, fileID) => {
  try {
    // 1. Remove from /orgFiles/questionnaires/{orgID} - organization's questionnaire collection
    const orgQuestionnaireRef = doc(db, "orgFiles", "questionnaires", orgID, questionnaireId);
    await deleteDoc(orgQuestionnaireRef);

    // 2. Remove from /questionnaires/{uid} - user's personal questionnaires
    // Note: This is a simplified approach. In a real implementation, you'd need to 
    // fetch the current array, remove the specific questionnaire, and save it back
    // For now, we'll rely on the cloud function to handle this synchronization

    // 3. Remove reference from /orgFiles/collections/{fileID} - patient file
    const patientFileRef = doc(db, "orgFiles", "collections", fileID);
    const patientFileDoc = await getDoc(patientFileRef);
    
    if (patientFileDoc.exists()) {
      const patientFileData = patientFileDoc.data();
      const questionnaires = patientFileData.questionnaires || [];
      
      // Remove the specific questionnaire object
      const updatedQuestionnaires = questionnaires.filter(q => q.id !== questionnaireId);
      
      await updateDoc(patientFileRef, {
        questionnaires: updatedQuestionnaires
      });
    }

    return {
      success: true,
      questionnaireId: questionnaireId
    };
  } catch (error) {
    console.error("Error deleting questionnaire:", error);
    throw error;
  }
};

// Get questionnaires for a user
// Returns all questionnaires organized by type, with each type containing an array of versions
// Note: For backward compatibility, individual types may be single objects or arrays
export const getUserQuestionnaires = async (uid) => {
  try {
    const userQuestionnaireRef = doc(db, "questionnaires", uid);
    const docSnap = await getDoc(userQuestionnaireRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Return the entire document data structure
      // Structure: { vas: [...], odi: [...], isi: [...], etc. }
      // Each field contains an array of questionnaire versions (or single object for backward compatibility)
      return data;
    }
    return {};
  } catch (error) {
    console.error("Error getting user questionnaires:", error);
    throw error;
  }
};

// Get questionnaires for an organization
export const getOrgQuestionnaires = async (orgID) => {
  try {
    const orgQuestionnairesRef = collection(db, "orgFiles", "questionnaires", orgID);
    const querySnapshot = await getDocs(orgQuestionnairesRef);
    
    const questionnaires = [];
    querySnapshot.forEach((doc) => {
      questionnaires.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return questionnaires;
  } catch (error) {
    console.error("Error getting organization questionnaires:", error);
    throw error;
  }
};

// Get patient file with questionnaire references
export const getPatientFile = async (fileID) => {
  try {
    const patientFileRef = doc(db, "orgFiles", "collections", fileID);
    const docSnap = await getDoc(patientFileRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting patient file:", error);
    throw error;
  }
};
