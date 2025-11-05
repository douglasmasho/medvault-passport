import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { motion } from "framer-motion";
import { ChevronLeft, AlertCircle, CheckCircle, Clock, FileText, Download } from "lucide-react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useDarkMode } from "../../contexts/darkModeContext";
import Header from "../common/Header";
import { getMostRecentQuestionnaire } from "../../firebase/questionnaires";

// Import individual questionnaire viewers
import VASViewer from "./VASViewer";
import ODIViewer from "./ODIViewer";
import ISIViewer from "./ISIViewer";
import MSPQViewer from "./MSPQViewer";
import DRAMViewer from "./DRAMViewer";

const QuestionnaireViewer = () => {
  const { type, uid } = useParams();
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set dynamic colors based on the mode
  const backgroundColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  useEffect(() => {
    const fetchQuestionnaireData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching questionnaire data for:", { uid, type });

        // Fetch questionnaire data from Firebase
        const userQuestionnaireRef = doc(db, "questionnaires", uid);
        const docSnap = await getDoc(userQuestionnaireRef);

        if (!docSnap.exists()) {
          console.log("No document found at path:", `questionnaires/${uid}`);
          setError("No questionnaire data found for this patient");
          setLoading(false);
          return;
        }

        const userData = docSnap.data();
        console.log("Raw user data:", userData);

        const questionnaireField = type?.toLowerCase() || "vas";
        console.log("Looking for field:", questionnaireField);
        
        const data = userData[questionnaireField];
        console.log("Found questionnaire data:", data);

        if (!data) {
          console.log("Available fields:", Object.keys(userData));
          setError(`No ${type?.toUpperCase()} questionnaire data found for this patient`);
          setLoading(false);
          return;
        }

        // Handle both array and single object formats (for backward compatibility)
        // Get the most recent questionnaire using utility function
        const questionnaireDataToDisplay = getMostRecentQuestionnaire(data);
        
        if (!questionnaireDataToDisplay) {
          setError(`No ${type?.toUpperCase()} questionnaire data found for this patient`);
          setLoading(false);
          return;
        }

        console.log("Setting questionnaire data:", questionnaireDataToDisplay);
        setQuestionnaireData(questionnaireDataToDisplay);
      } catch (err) {
        console.error("Error fetching questionnaire data:", err);
        setError("Failed to load questionnaire data");
        toast.error("Failed to load questionnaire data");
      } finally {
        setLoading(false);
      }
    };

    if (uid && type) {
      fetchQuestionnaireData();
    }
  }, [uid, type]);

  const renderQuestionnaireViewer = () => {
    if (!questionnaireData) return null;

    switch (type?.toLowerCase()) {
      case "vas":
        return <VASViewer data={questionnaireData} patientId={uid} />;
      case "odi":
        return <ODIViewer data={questionnaireData} patientId={uid} />;
      case "isi":
        return <ISIViewer data={questionnaireData} patientId={uid} />;
      case "mspq":
        return <MSPQViewer data={questionnaireData} patientId={uid} />;
      case "dram":
        return <DRAMViewer data={questionnaireData} patientId={uid} />;
      default:
        return (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Questionnaire type not supported
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The questionnaire type "{type}" is not yet implemented.
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className={`flex-1 overflow-auto relative z-10 ${backgroundColor}`}>
        {!userLoggedIn ? (
          <Navigate to="/login" replace={true} />
        ) : (
          <>
            <Header
              title={`${type?.toUpperCase()} Questionnaire Results`}
              icon={<FileText style={{ marginRight: "10px", color: "#56BB6E" }} />}
            />
            <main className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${textColor}`}>
              <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading questionnaire data...</p>
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex-1 overflow-auto relative z-10 ${backgroundColor}`}>
        {!userLoggedIn ? (
          <Navigate to="/login" replace={true} />
        ) : (
          <>
            <Header
              title={`${type?.toUpperCase()} Questionnaire Results`}
              icon={<FileText style={{ marginRight: "10px", color: "#56BB6E" }} />}
            />
            <main className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${textColor}`}>
              <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
                  <p className="mt-1 text-sm text-gray-500">{error}</p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate(-1)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${backgroundColor}`}>
      {!userLoggedIn ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <>
          <Header
            title={`${type?.toUpperCase()} Questionnaire Results`}
            icon={<FileText style={{ marginRight: "10px", color: "#56BB6E" }} />}
          />
          <main className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${textColor}`}>


            {/* Patient Info Bar */}
            <div className={`mb-6 p-4 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Patient ID: {uid}</h2>
                  <p className="text-sm text-gray-500">
                    Assessment Date: {questionnaireData?.timestamp && 
                      new Date(questionnaireData.timestamp).toLocaleDateString()
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Completed
                  </div>
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </button>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => {
                  const exportData = {
                    questionnaireType: type?.toUpperCase(),
                    patientId: uid,
                    assessmentDate: questionnaireData?.timestamp || new Date().toISOString(),
                    questionnaireData: questionnaireData,
                    exportDate: new Date().toISOString(),
                  };
                  
                  console.log("Exporting questionnaire data:", exportData);
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${type}-questionnaire-${uid}-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("Questionnaire data exported successfully!");
                }}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Questionnaire Data
              </button>
            </div>

            {/* Questionnaire Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderQuestionnaireViewer()}
            </motion.div>
          </main>
        </>
      )}
    </div>
  );
};

export default QuestionnaireViewer;
