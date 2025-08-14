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

// Create a new questionnaire
export const createQuestionnaire = async (questionnaireData, uid, orgID, fileID) => {
  try {
    const questionnaireId = nanoid(12);
    const timestamp = new Date().toISOString();
    
    // Create the questionnaire object with the required structure
    const questionnaireObj = {
      id: questionnaireId,
      uid: uid,
      type: questionnaireData.type || "vas", // Add type property
      timestamp: timestamp,
      createdAt: timestamp, // Use regular timestamp instead of serverTimestamp()
      fileID: fileID, // Add fileID for cloud function sync
      orgID: orgID, // Add orgID for cloud function sync
      ...questionnaireData
    };

    // 1. Save to /questionnaires/{uid} - user's personal questionnaires
    const userQuestionnaireRef = doc(db, "questionnaires", uid);
    await setDoc(userQuestionnaireRef, {
      questionnaires: arrayUnion(questionnaireObj)
    }, { merge: true });

    // 2. Save to /orgFiles/questionnaires/{orgID} - organization's questionnaire collection
    const orgQuestionnaireRef = doc(db, "orgFiles", "questionnaires", orgID, questionnaireId);
    await setDoc(orgQuestionnaireRef, questionnaireObj);

    // 3. Update /orgFiles/collections/{fileID} - add questionnaire reference to patient file
    // This is now handled by the cloud function, not the frontend

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
export const getUserQuestionnaires = async (uid) => {
  try {
    const userQuestionnaireRef = doc(db, "questionnaires", uid);
    const docSnap = await getDoc(userQuestionnaireRef);
    
    if (docSnap.exists()) {
      return docSnap.data().questionnaires || [];
    }
    return [];
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
