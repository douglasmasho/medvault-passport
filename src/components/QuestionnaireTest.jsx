import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext/index';
import { getUserQuestionnaires, getOrgQuestionnaires, getPatientFile } from '../firebase/questionnaires';
import toast from 'react-hot-toast';

const QuestionnaireTest = () => {
  const { currentUser } = useAuth();
  const [userQuestionnaires, setUserQuestionnaires] = useState([]);
  const [orgQuestionnaires, setOrgQuestionnaires] = useState([]);
  const [patientFile, setPatientFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!currentUser?.uid) return;
    
    setLoading(true);
    try {
      // Get user questionnaires
      const userData = await getUserQuestionnaires(currentUser.uid);
      console.log('User questionnaires data:', userData);
      setUserQuestionnaires(userData);

      // Get user profile to find orgID and fileID
      const userProfile = JSON.parse(localStorage.getItem("medvault_passport_profile") || "{}");
      const userFiles = userProfile.myFiles || [];
      
      if (userFiles.length > 0) {
        const { org: orgID, pfid: fileID } = userFiles[0];
        
        // Get organization questionnaires
        const orgData = await getOrgQuestionnaires(orgID);
        console.log('Organization questionnaires data:', orgData);
        setOrgQuestionnaires(orgData);

        // Get patient file
        const fileData = await getPatientFile(fileID);
        console.log('Patient file data:', fileData);
        setPatientFile(fileData);
      }
    } catch (error) {
      console.error('Error loading questionnaire data:', error);
      toast.error('Error loading questionnaire data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  if (!currentUser) {
    return <div>Please log in to view questionnaire data</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Questionnaire Integration Test</h1>
      
      <button 
        onClick={loadData}
        disabled={loading}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Refresh Data'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Questionnaires */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">User Questionnaires</h2>
          <div className="text-sm text-gray-600 mb-2">
            Count: {userQuestionnaires.length}
          </div>
          {userQuestionnaires.map((q, index) => (
            <div key={index} className="mb-3 p-3 bg-gray-50 rounded">
              <div className="font-medium">ID: {q.id}</div>
              <div>Type: {q.type}</div>
              <div>Created: {new Date(q.timestamp).toLocaleDateString()}</div>
              {q.summary && (
                <div className="mt-2 text-xs">
                  <div>Worst Pain: {q.summary.worstPain}/10</div>
                  <div>Least Pain: {q.summary.leastPain}/10</div>
                  <div>Average Pain: {q.summary.averagePain}/10</div>
                  <div>Current Pain: {q.summary.currentPain}/10</div>
                  <div>Pain Range: {q.summary.painRange}</div>
                  <div>Pain Markers: {q.summary.totalPainMarkers}</div>
                </div>
              )}
              {!q.summary && (
                <div className="mt-2 text-xs text-red-500">
                  No summary data found
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Organization Questionnaires */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Organization Questionnaires</h2>
          <div className="text-sm text-gray-600 mb-2">
            Count: {orgQuestionnaires.length}
          </div>
          {orgQuestionnaires.map((q, index) => (
            <div key={index} className="mb-3 p-3 bg-gray-50 rounded">
              <div className="font-medium">ID: {q.id}</div>
              <div>Type: {q.type}</div>
              <div>User: {q.uid}</div>
              <div>Created: {new Date(q.timestamp).toLocaleDateString()}</div>
            </div>
          ))}
        </div>

        {/* Patient File */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Patient File</h2>
          {patientFile ? (
            <div>
              <div className="text-sm text-gray-600 mb-2">
                Patient ID: {patientFile.pid}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                File ID: {patientFile.pfid}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Questionnaire References: {patientFile.questionnaires?.length || 0}
              </div>
                             {patientFile.questionnaires && patientFile.questionnaires.length > 0 && (
                 <div className="mt-3">
                   <div className="font-medium text-sm mb-2">Questionnaires:</div>
                   {patientFile.questionnaires.map((q, index) => (
                     <div key={index} className="text-xs bg-gray-50 p-2 rounded mb-1">
                       <div><strong>ID:</strong> {q.id}</div>
                       <div><strong>Type:</strong> {q.type}</div>
                       <div><strong>Last Answered:</strong> {new Date(q.lastAnswered).toLocaleDateString()}</div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          ) : (
            <div className="text-gray-500">No patient file found</div>
          )}
        </div>
      </div>

      {/* Debug Data */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Debug Information</h3>
        <div className="text-sm space-y-2">
          <div><strong>User Questionnaires:</strong> /questionnaires/{currentUser.uid}</div>
          <div><strong>Organization Questionnaires:</strong> /orgFiles/questionnaires/{orgID}/{questionnaireId}</div>
          <div><strong>Patient Files:</strong> /orgFiles/collections/{fileID}</div>
          <div className="mt-4">
            <strong>Raw User Data:</strong>
            <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto max-h-40">
              {JSON.stringify(userQuestionnaires, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireTest;
