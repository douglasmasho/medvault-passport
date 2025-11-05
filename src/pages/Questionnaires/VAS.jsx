import {
  Brain,
  CalendarCheck,
  MessagesSquare,
  ClipboardList,
  ClipboardCheck,
  FileQuestion,
  Share,
  CircleDashed,
  Accessibility,
  EyeOff,
  BrainCircuit,
  ChevronLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/authContext/index";
import { Navigate, useLocation } from "react-router-dom";
import { useDarkMode } from "../../contexts/darkModeContext";
import QuestionnairesTable from "../../components/users/QuestionnairesTable";
import LogoDark from "../../assets/svg/logoblack.svg";
import LogoLight from "../../assets/logowhite.png";
import { useNavigate } from "react-router-dom";
import PatientPainMapper from "../../components/pain-mapper/Patient";
import { createQuestionnaire } from "../../firebase/questionnaires";
import toast from "react-hot-toast";

const VAS = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode(); // Use dark mode context
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're in edit mode
  const isEditMode = location.state?.editMode || false;
  const preFilledData = location.state?.preFilledData || null;
  // Centralized styling object that checks dark mode once
  const styles = {
    container: isDarkMode ? "bg-gray-900" : "bg-white",
    border: isDarkMode ? "border-gray-800" : "border-gray-300",
    text: isDarkMode ? "white-text" : "text-gray-900",
    textSecondary: isDarkMode ? "white-text" : "text-gray-600",
  };

  const doSomething = (data) => {
    console.log("Pain mapper data received:", data);
    setPainMapperData(data);
  };

  const [vasAnswers, setVasAnswers] = useState(() => {
    if (isEditMode && preFilledData) {
      // Use pre-filled data from navigation state
      return {
        worstPain: preFilledData.vasAnswers?.worstPain || preFilledData.worstPain || 5,
        leastPain: preFilledData.vasAnswers?.leastPain || preFilledData.leastPain || 2,
        averagePain: preFilledData.vasAnswers?.averagePain || preFilledData.averagePain || 4,
        currentPain: preFilledData.vasAnswers?.currentPain || preFilledData.currentPain || 3,
      };
    }
    return {
      worstPain: 5,
      leastPain: 2,
      averagePain: 4,
      currentPain: 3,
    };
  });

  const [painMapperData, setPainMapperData] = useState(() => {
    if (isEditMode && preFilledData) {
      return preFilledData.painMapperData || null;
    }
    return null;
  });
  const [completedData, setCompletedData] = useState(null);

  const handleVasChange = (question, value) => {
    setVasAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  // Helper function to remove undefined values from objects
  const removeUndefinedValues = (obj) => {
    if (obj === null || obj === undefined) return null;
    if (typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      return obj
        .map((item) => removeUndefinedValues(item))
        .filter((item) => item !== null);
    }

    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefinedValues(value);
      }
    }
    return cleaned;
  };

  const handleVASCompletion = async () => {
    try {
      // Clean the data to remove any undefined values
      const cleanPainMapperData = painMapperData || [];
      const cleanVasAnswers = {
        worstPain: vasAnswers.worstPain || 0,
        leastPain: vasAnswers.leastPain || 0,
        averagePain: vasAnswers.averagePain || 0,
        currentPain: vasAnswers.currentPain || 0,
      };

      const comprehensiveData = {
        timestamp: new Date().toISOString(),
        patientId: currentUser?.uid || "unknown",
        painMapperData: cleanPainMapperData,
        vasAnswers: cleanVasAnswers,
        summary: {
          worstPain: cleanVasAnswers.worstPain,
          leastPain: cleanVasAnswers.leastPain,
          averagePain: cleanVasAnswers.averagePain,
          currentPain: cleanVasAnswers.currentPain,
          painRange: cleanVasAnswers.worstPain - cleanVasAnswers.leastPain,
          totalPainMarkers: cleanPainMapperData.length,
        },
      };

      console.log("=== VAS COMPLETION DATA ===");
      console.log("Comprehensive Data Object:", comprehensiveData);
      console.log("Pain Mapper Data:", painMapperData);
      console.log("VAS Answers:", vasAnswers);
      console.log("Summary:", comprehensiveData.summary);
      console.log("==========================");

      // Set completedData immediately so the completion screen has data to display
      console.log("Setting completedData immediately:", comprehensiveData);
      setCompletedData(comprehensiveData);

      // Clean the data before sending to Firebase
      const cleanedData = removeUndefinedValues({
        ...comprehensiveData,
        type: "vas", // Add the type property as required
      });

      console.log("Cleaned data for Firebase:", cleanedData);

      // Save to Firebase
      const result = await createQuestionnaire(cleanedData, currentUser?.uid);

      if (result.success) {
        if (isEditMode) {
          toast.success("VAS questionnaire updated successfully!");
        } else {
          toast.success("VAS questionnaire completed and saved successfully!");
        }
      } else {
        toast.error("Failed to save questionnaire. Please try again.");
        // Reset completedData if save failed
        setCompletedData(null);
      }
    } catch (error) {
      console.error("Error saving VAS questionnaire:", error);
      toast.error("Error saving questionnaire. Please try again.");
      // Reset completedData if save failed
      setCompletedData(null);
    }
  };

  const VASQuestion = ({ question, value, onChange, title, description }) => (
    <div
      className="vas-question-container"
      style={{
        padding: "1rem",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        width: "100%",
      }}
    >
      <p
        className="text-sm md:text-base"
        style={{
          fontSize: "0.875rem",
          marginBottom: "1.5rem",
          color: isDarkMode ? "black" : "black",
          textAlign: "center",
          padding: "0 0.5rem",
        }}
      >
        {description}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          padding: "0 0.5rem",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <span
          className="text-xs md:text-sm"
          style={{
            fontSize: "0.75rem",
            color: isDarkMode ? "black" : "black",
          }}
        >
          No Pain
        </span>
        <span
          className="text-xs md:text-sm"
          style={{
            fontSize: "0.75rem",
            color: isDarkMode ? "black" : "black",
          }}
        >
          Worst Pain
        </span>
      </div>

      <div
        className="flex flex-wrap justify-center gap-1 md:gap-2"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1.5rem",
          width: "100%",
          maxWidth: "500px",
          gap: "0.25rem",
          padding: "0 0.5rem",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, index) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className="w-8 h-8 md:w-10 md:h-10 text-sm md:text-base"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: `2px solid ${
                num === value
                  ? isDarkMode
                    ? "#10b981"
                    : "#059669"
                  : isDarkMode
                  ? "#4b5563"
                  : "#d1d5db"
              }`,
              backgroundColor:
                num === value
                  ? isDarkMode
                    ? "#10b981"
                    : "#059669"
                  : "transparent",
              color:
                num === value ? "#ffffff" : isDarkMode ? "#9ca3af" : "#374151",
              fontSize: "0.875rem",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none",
              transition: "all 0.1s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (num !== value) {
                e.target.style.backgroundColor = isDarkMode
                  ? "#4b5563"
                  : "#e5e7eb";
                e.target.style.transform = "scale(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (num !== value) {
                e.target.style.backgroundColor = "transparent";
                e.target.style.transform = "scale(1)";
              }
            }}
          >
            {num}
          </button>
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          minWidth: "100px",
        }}
      >
        <span
          className="text-3xl md:text-4xl"
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: isDarkMode ? "#10b981" : "#059669",
          }}
        >
          {value}
        </span>
        <span
          className="text-lg md:text-xl"
          style={{
            fontSize: "1rem",
            color: isDarkMode ? "#9ca3af" : "#6b7280",
            marginLeft: "0.5rem",
          }}
        >
          / 10
        </span>
      </div>
    </div>
  );

  const questionComps = [
    {
      component: (
        <PatientPainMapper
          onDataChange={doSomething}
          initialData={painMapperData || []}
        />
      ),
    },
    {
      component: (
        <VASQuestion
          question="worstPain"
          value={vasAnswers.worstPain}
          onChange={(value) => handleVasChange("worstPain", value)}
          title="2. Which number indicates the WORST pain you experienced the past week?"
          description="Click a number to select the intensity of your worst pain in the last 7 days"
        />
      ),
    },
    {
      component: (
        <VASQuestion
          question="leastPain"
          value={vasAnswers.leastPain}
          onChange={(value) => handleVasChange("leastPain", value)}
          title="3. Which number indicates the LEAST pain you experienced the past week?"
          description="Click a number to select the intensity of your least pain in the last 7 days"
        />
      ),
    },
    {
      component: (
        <VASQuestion
          question="averagePain"
          value={vasAnswers.averagePain}
          onChange={(value) => handleVasChange("averagePain", value)}
          title="4. Choose a number that indicates the AVERAGE pain you experienced the last week:"
          description="Click a number to select the average intensity of your pain in the last 7 days"
        />
      ),
    },
    {
      component: (
        <VASQuestion
          question="currentPain"
          value={vasAnswers.currentPain}
          onChange={(value) => handleVasChange("currentPain", value)}
          title="5. Which number indicates the pain you experience AT THE MOMENT:"
          description="Click a number to select the intensity of your current pain right now"
        />
      ),
    },
  ];

  const CompletionScreen = () => {
    // Use the existing state data instead of completedData
    const summaryData = {
      worstPain: vasAnswers.worstPain,
      leastPain: vasAnswers.leastPain,
      averagePain: vasAnswers.averagePain,
      currentPain: vasAnswers.currentPain,
      painRange: vasAnswers.worstPain - vasAnswers.leastPain,
      totalPainMarkers: painMapperData?.length || 0,
    };

    console.log("CompletionScreen using direct state data:", summaryData);

    return (
      <div
        className="px-4 md:px-8 py-4 md:py-8"
        style={{
          padding: "1rem",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h2
          className="text-xl md:text-2xl"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            color: isDarkMode ? "green" : "green",
          }}
        >
          {isEditMode ? "VAS Questionnaire Updated!" : "VAS Questionnaire Completed!"}
        </h2>

        <div
          className="p-4 md:p-8"
          style={{
            backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
            padding: "1rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            textAlign: "left",
          }}
        >
          <h3
            className="text-lg md:text-xl"
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: isDarkMode ? "#10b981" : "#059669",
            }}
          >
            Summary
          </h3>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                padding: "1rem",
                backgroundColor: isDarkMode ? "#4b5563" : "#ffffff",
                borderRadius: "8px",
                border: "1px solid " + (isDarkMode ? "#6b7280" : "#e5e7eb"),
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                }}
              >
                Worst Pain
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: isDarkMode ? "#10b981" : "#059669",
                }}
              >
                {summaryData.worstPain}/10
              </div>
            </div>

            <div
              style={{
                padding: "1rem",
                backgroundColor: isDarkMode ? "#4b5563" : "#ffffff",
                borderRadius: "8px",
                border: "1px solid " + (isDarkMode ? "#6b7280" : "#e5e7eb"),
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                }}
              >
                Least Pain
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: isDarkMode ? "#10b981" : "#059669",
                }}
              >
                {summaryData.leastPain}/10
              </div>
            </div>

            <div
              style={{
                padding: "1rem",
                backgroundColor: isDarkMode ? "#4b5563" : "#ffffff",
                borderRadius: "8px",
                border: "1px solid " + (isDarkMode ? "#6b7280" : "#e5e7eb"),
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                }}
              >
                Average Pain
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: isDarkMode ? "#10b981" : "#059669",
                }}
              >
                {summaryData.averagePain}/10
              </div>
            </div>

            <div
              style={{
                padding: "1rem",
                backgroundColor: isDarkMode ? "#4b5563" : "#ffffff",
                borderRadius: "8px",
                border: "1px solid " + (isDarkMode ? "#6b7280" : "#e5e7eb"),
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                }}
              >
                Current Pain
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: isDarkMode ? "#10b981" : "#059669",
                }}
              >
                {summaryData.currentPain}/10
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              borderRadius: "8px",
              border: "2px solid " + (isDarkMode ? "#10b981" : "#059669"),
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                color: isDarkMode ? "#9ca3af" : "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              Pain Markers on Body Diagram
            </div>
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: isDarkMode ? "#10b981" : "#059669",
              }}
            >
              {summaryData.totalPainMarkers} markers placed
            </div>
          </div>
        </div>

        <button
          className="w-full md:w-auto px-6 md:px-8 py-3 text-sm md:text-base"
          onClick={() => {
            setCompletedData(null); // Reset completion state
            navigate("/questionnaires");
          }}
          style={{
            backgroundColor: isDarkMode ? "#10b981" : "#059669",
            color: "#ffffff",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.875rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = isDarkMode ? "#059669" : "#047857";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = isDarkMode ? "#10b981" : "#059669";
          }}
        >
          Return to Questionnaires
        </button>
      </div>
    );
  };

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${styles.container}`}>
      {!userLoggedIn ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <div className="questionnaire__container">
          <div
            className="questionnaire__question p-4 md:p-8"
            style={{
              background:
                "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
              borderRadius: "12px",
              padding: "1rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div style={{ display: "inline-block" }}>
              <div
                className="questionnaire__nav"
                onClick={() => {
                  navigate("/questionnaires");
                }}
              >
                <ChevronLeft size={24} color="white" />
                <span>VAS</span>
              </div>
            </div>

            <div>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={currentQuestionIndex}
                  className={`questionnaire__question__text`}
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                >
                  {currentQuestionIndex === 0
                    ? "Mark on the diagram your area of pain"
                    : currentQuestionIndex === 1
                    ? "Which number indicates the WORST pain you experienced the past week?"
                    : currentQuestionIndex === 2
                    ? "Which number indicates the LEAST pain you experienced the past week?"
                    : currentQuestionIndex === 3
                    ? "Choose a number that indicates the AVERAGE pain you experienced the last week:"
                    : "Which number indicates the pain you experience AT THE MOMENT:"}
                </motion.h3>
              </AnimatePresence>
              <br />
              <div className="center-hrz--col--on-phone">
                <AnimatePresence>
                  {currentQuestionIndex !== 0 ? (
                    <motion.button
                      key="back"
                      className="button button-outline button-first questionnaire-back"
                      onClick={() => {
                        setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      Back
                    </motion.button>
                  ) : null}
                </AnimatePresence>

                {currentQuestionIndex < questionComps.length && (
                  <motion.button
                    className="button button-white"
                    onClick={() => {
                      if (currentQuestionIndex < questionComps.length - 1) {
                        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                      } else {
                        // Handle completion
                        handleVASCompletion();
                        setCurrentQuestionIndex(questionComps.length); // Set to completion state
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentQuestionIndex < questionComps.length - 1
                      ? "Next Question"
                      : "Complete"}
                  </motion.button>
                )}
              </div>
            </div>

            <img
              src={LogoLight}
              alt="Medvault Logo"
              className="h-10 mb-8 self-start questionnaire-logo"
            />
          </div>
          <div
            className="questionnaire__answer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100%",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                style={{ width: "100%", height: "100%" }}
              >
                {currentQuestionIndex >= questionComps.length ? (
                  <CompletionScreen />
                ) : (
                  questionComps[currentQuestionIndex]?.component
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default VAS;
