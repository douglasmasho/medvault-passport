import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/authContext/index";
import { Navigate, useLocation } from "react-router-dom";
import { useDarkMode } from "../../contexts/darkModeContext";
import LogoLight from "../../assets/logowhite.png";
import { useNavigate } from "react-router-dom";
import { createQuestionnaire } from "../../firebase/questionnaires";
import toast from "react-hot-toast";
import { ChevronLeft } from "lucide-react";

const MSPQ = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isEditMode = location.state?.editMode || false;
  const preFilledData = location.state?.preFilledData || null;
  
  const styles = {
    container: isDarkMode ? "bg-gray-900" : "bg-white",
    border: isDarkMode ? "border-gray-800" : "border-gray-300",
    text: isDarkMode ? "white-text" : "text-gray-900",
    textSecondary: isDarkMode ? "white-text" : "text-gray-600",
  };

  const [mspqAnswers, setMspqAnswers] = useState(() => {
    if (isEditMode && preFilledData) {
      return {
        heartRateIncrease: preFilledData.heartRateIncrease || 0,
        feelingHotAllOver: preFilledData.feelingHotAllOver || 0,
        sweatingAllOver: preFilledData.sweatingAllOver || 0,
        sweatingInParticularPart: preFilledData.sweatingInParticularPart || 0,
        pulseInNeck: preFilledData.pulseInNeck || 0,
        poundingInHead: preFilledData.poundingInHead || 0,
        dizziness: preFilledData.dizziness || 0,
        blurringOfVision: preFilledData.blurringOfVision || 0,
        feelingFaint: preFilledData.feelingFaint || 0,
        everythingAppearingUnreal: preFilledData.everythingAppearingUnreal || 0,
        nausea: preFilledData.nausea || 0,
        butterfliesInStomach: preFilledData.butterfliesInStomach || 0,
        painOrAcheInStomach: preFilledData.painOrAcheInStomach || 0,
        stomachChurning: preFilledData.stomachChurning || 0,
        desireToPassWater: preFilledData.desireToPassWater || 0,
        mouthBecomingDry: preFilledData.mouthBecomingDry || 0,
        difficultySwallowing: preFilledData.difficultySwallowing || 0,
        musclesInNeckAching: preFilledData.musclesInNeckAching || 0,
        legsFeelingWeak: preFilledData.legsFeelingWeak || 0,
        musclesTwitchingOrJumping: preFilledData.musclesTwitchingOrJumping || 0,
        tenseFeelingAcrossForehead: preFilledData.tenseFeelingAcrossForehead || 0,
        tenseFeelingInJawMuscles: preFilledData.tenseFeelingInJawMuscles || 0,
      };
    }
    return {
      heartRateIncrease: 0, feelingHotAllOver: 0, sweatingAllOver: 0, sweatingInParticularPart: 0,
      pulseInNeck: 0, poundingInHead: 0, dizziness: 0, blurringOfVision: 0,
      feelingFaint: 0, everythingAppearingUnreal: 0, nausea: 0, butterfliesInStomach: 0,
      painOrAcheInStomach: 0, stomachChurning: 0, desireToPassWater: 0, mouthBecomingDry: 0,
      difficultySwallowing: 0, musclesInNeckAching: 0, legsFeelingWeak: 0, musclesTwitchingOrJumping: 0,
      tenseFeelingAcrossForehead: 0, tenseFeelingInJawMuscles: 0,
    };
  });

  const [completedData, setCompletedData] = useState(null);

  const handleMspqChange = (question, value) => {
    setMspqAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const calculateMSPQScore = (answers) => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    let severityLevel = "";
    if (totalScore <= 22) severityLevel = "Low somatic symptoms";
    else if (totalScore <= 44) severityLevel = "Moderate somatic symptoms";
    else if (totalScore <= 66) severityLevel = "High somatic symptoms";
    else severityLevel = "Very high somatic symptoms";
    return { totalScore, severityLevel };
  };

  const handleMSPQCompletion = async () => {
    try {
      const scoreResults = calculateMSPQScore(mspqAnswers);
      const comprehensiveData = {
        timestamp: new Date().toISOString(),
        patientId: currentUser?.uid || "unknown",
        ...mspqAnswers,
      };

      setCompletedData(comprehensiveData);
      const cleanedData = { ...comprehensiveData, type: "mspq" };
      const result = await createQuestionnaire(cleanedData, currentUser?.uid);

      if (result.success) {
        toast.success(isEditMode ? "MSPQ questionnaire updated successfully!" : "MSPQ questionnaire completed and saved successfully!");
      } else {
        toast.error("Failed to save questionnaire. Please try again.");
        setCompletedData(null);
      }
    } catch (error) {
      console.error("Error saving MSPQ questionnaire:", error);
      toast.error("Error saving questionnaire. Please try again.");
      setCompletedData(null);
    }
  };

  const mspqQuestions = [
    { number: 1, text: "Heart rate increase", question: "heartRateIncrease" },
    { number: 2, text: "Feeling hot all over", question: "feelingHotAllOver" },
    { number: 3, text: "Sweating all over", question: "sweatingAllOver" },
    { number: 4, text: "Sweating in a particular part of the body", question: "sweatingInParticularPart" },
    { number: 5, text: "Pulse in neck", question: "pulseInNeck" },
    { number: 6, text: "Pounding in head", question: "poundingInHead" },
    { number: 7, text: "Dizziness", question: "dizziness" },
    { number: 8, text: "Blurring of vision", question: "blurringOfVision" },
    { number: 9, text: "Feeling faint", question: "feelingFaint" },
    { number: 10, text: "Everything appearing unreal", question: "everythingAppearingUnreal" },
    { number: 11, text: "Nausea", question: "nausea" },
    { number: 12, text: "Butterflies in stomach", question: "butterfliesInStomach" },
    { number: 13, text: "Pain or ache in stomach", question: "painOrAcheInStomach" },
    { number: 14, text: "Stomach churning", question: "stomachChurning" },
    { number: 15, text: "Desire to pass water", question: "desireToPassWater" },
    { number: 16, text: "Mouth becoming dry", question: "mouthBecomingDry" },
    { number: 17, text: "Difficulty swallowing", question: "difficultySwallowing" },
    { number: 18, text: "Muscles in neck aching", question: "musclesInNeckAching" },
    { number: 19, text: "Legs feeling weak", question: "legsFeelingWeak" },
    { number: 20, text: "Muscles twitching or jumping", question: "musclesTwitchingOrJumping" },
    { number: 21, text: "Tense feeling across forehead", question: "tenseFeelingAcrossForehead" },
    { number: 22, text: "Tense feeling in jaw muscles", question: "tenseFeelingInJawMuscles" },
  ];

  const options = [
    "Not at all",
    "A little, slightly",
    "A great deal, quite a bit",
    "Extremely"
  ];

  const CompletionScreen = () => {
    const scoreResults = calculateMSPQScore(mspqAnswers);
    return (
      <div className="px-4 md:px-8 py-4 md:py-8" style={{ padding: "1rem", textAlign: "center", maxWidth: "600px", margin: "0 auto", width: "100%" }}>
        <h2 className="text-xl md:text-2xl" style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#059669" }}>
          {isEditMode ? "MSPQ Questionnaire Updated!" : "MSPQ Questionnaire Completed!"}
        </h2>
        <div className="p-4 md:p-8" style={{ backgroundColor: "#f3f4f6", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", textAlign: "left" }}>
          <h3 className="text-lg md:text-xl" style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#059669" }}>Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ padding: "1rem", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Score</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>{scoreResults.totalScore}/88</div>
            </div>
            <div style={{ padding: "1rem", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Severity Level</div>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#059669" }}>{scoreResults.severityLevel}</div>
            </div>
          </div>
          <div style={{ padding: "1rem", backgroundColor: "#ffffff", borderRadius: "8px", border: "2px solid #059669" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Questions Completed</div>
            <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#059669" }}>{Object.keys(mspqAnswers).length} questions</div>
          </div>
        </div>
        <button
          className="w-full md:w-auto px-6 md:px-8 py-3 text-sm md:text-base"
          onClick={() => { setCompletedData(null); navigate("/questionnaires"); }}
          style={{
            backgroundColor: "#059669", color: "#ffffff", padding: "0.75rem 1.5rem", borderRadius: "8px",
            border: "none", fontSize: "0.875rem", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = "#047857"; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = "#059669"; }}
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
              background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
              borderRadius: "12px",
              padding: "1rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div style={{ display: "inline-block" }}>
              <div className="questionnaire__nav" onClick={() => navigate("/questionnaires")}>
                <ChevronLeft size={24} color="white" />
                <span>MSPQ</span>
              </div>
            </div>
            <div>
              <AnimatePresence mode="wait">
                <motion.h3
                  className={`questionnaire__question__text`}
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  Modified Somatic Perceptions Questionnaire (MSPQ)
                </motion.h3>
              </AnimatePresence>
              <br />
              <div className="center-hrz--col--on-phone">
                <motion.button
                  className="button button-white"
                  onClick={() => {
                    handleMSPQCompletion();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Complete
                </motion.button>
              </div>
            </div>
            <img src={LogoLight} alt="Medvault Logo" className="h-10 mb-8 self-start questionnaire-logo" />
          </div>
          <div
            className="questionnaire__answer"
            style={{ 
              display: "flex", 
              alignItems: "flex-start", 
              justifyContent: "center", 
              padding: "1rem"
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ width: "100%", maxWidth: "1200px", height: "100%" }}
              >
                {completedData ? (
                  <CompletionScreen />
                ) : (
                  <div style={{ 
                    backgroundColor: "white", 
                    borderRadius: "12px", 
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    {/* Header */}
                    <div className="p-3 md:p-6" style={{ 
                      padding: "1rem", 
                      backgroundColor: "#f8f9fa", 
                      borderBottom: "2px solid #e9ecef",
                      textAlign: "center",
                      flexShrink: 0
                    }}>
                      <h2 className="text-base md:text-xl" style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#333", marginBottom: "0.5rem" }}>
                        Modified Somatic Perceptions Questionnaire
                      </h2>
                      <p className="text-sm md:text-base" style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.75rem" }}>
                        Main C, Wood P, Hillis S, et al (1992)
                      </p>
                      <p className="text-xs md:text-sm" style={{ fontSize: "0.75rem", color: "#666" }}>
                        Please describe how you have felt during the PAST WEEK by marking a check mark in the appropriate box. 
                        Please answer all the questions. Do not think too long before answering.
                      </p>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="block md:hidden" style={{ 
                      flex: 1,
                      overflowY: "auto",
                      padding: "1rem"
                    }}>
                      {mspqQuestions.map((q) => (
                        <div
                          key={q.question}
                          className="mb-4 p-4 border rounded-lg"
                          style={{
                            marginBottom: "1rem",
                            padding: "1rem",
                            border: "1px solid #e9ecef",
                            borderRadius: "8px",
                            backgroundColor: "white"
                          }}
                        >
                          <div className="mb-3 font-bold text-sm" style={{ 
                            fontWeight: "bold", 
                            marginBottom: "0.75rem",
                            fontSize: "0.875rem",
                            color: "#333"
                          }}>
                            {q.number}. {q.text}
                          </div>
                          <div className="space-y-2">
                            {options.map((option, index) => (
                              <label
                                key={index}
                                className="flex items-center p-2 border rounded cursor-pointer"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "0.5rem",
                                  border: mspqAnswers[q.question] === index ? "2px solid #56BB6E" : "1px solid #ddd",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  backgroundColor: mspqAnswers[q.question] === index ? "#f0f9ff" : "transparent",
                                  marginBottom: "0.5rem",
                                  transition: "all 0.2s ease"
                                }}
                                onClick={() => handleMspqChange(q.question, index)}
                              >
                                <input
                                  type="radio"
                                  name={q.question}
                                  value={index}
                                  checked={mspqAnswers[q.question] === index}
                                  onChange={() => handleMspqChange(q.question, index)}
                                  className="mr-2"
                                  style={{
                                    marginRight: "0.5rem",
                                    cursor: "pointer"
                                  }}
                                />
                                <span className="text-xs" style={{ fontSize: "0.75rem", color: "#333" }}>
                                  {option}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table Container */}
                    <div className="hidden md:flex" style={{ 
                      flex: 1,
                      overflow: "hidden",
                      flexDirection: "column"
                    }}>
                      {/* Fixed Header Row */}
                      <div style={{ 
                        display: "flex",
                        borderBottom: "2px solid #e9ecef",
                        backgroundColor: "#e9ecef",
                        minWidth: "100%",
                        flexShrink: 0
                      }}>
                        {/* Questions Header */}
                        <div style={{ 
                          width: "40%", 
                          padding: "1rem", 
                          borderRight: "2px solid #e9ecef",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          color: "#333"
                        }}>
                          Questions
                        </div>

                        {/* Options Headers */}
                        {options.map((option, index) => (
                          <div
                            key={index}
                            style={{
                              flex: 1,
                              padding: "1rem 0.5rem",
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "0.8rem",
                              color: "#333",
                              borderRight: index < options.length - 1 ? "1px solid #dee2e6" : "none",
                              minWidth: "120px"
                            }}
                          >
                            {option.split(',').map((part, i) => (
                              <div key={i} style={{ marginBottom: i === 0 ? "0.25rem" : "0" }}>
                                {part.trim()}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Scrollable Table Body */}
                      <div style={{ 
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "auto"
                      }}>
                        <div style={{ 
                          display: "flex",
                          minWidth: "100%"
                        }}>
                          {/* Questions Column */}
                          <div style={{ 
                            width: "40%", 
                            borderRight: "2px solid #e9ecef",
                            backgroundColor: "#f8f9fa"
                          }}>
                            {mspqQuestions.map((q) => (
                              <div
                                key={q.question}
                                style={{
                                  padding: "1rem",
                                  borderBottom: "1px solid #e9ecef",
                                  backgroundColor: "white",
                                  minHeight: "60px",
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                <span style={{ 
                                  fontWeight: "bold", 
                                  marginRight: "0.5rem", 
                                  color: "#333",
                                  fontSize: "0.9rem"
                                }}>
                                  {q.number}.
                                </span>
                                <span style={{ 
                                  fontSize: "0.9rem", 
                                  color: "#333",
                                  lineHeight: "1.4"
                                }}>
                                  {q.text}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Options Columns */}
                          <div style={{ 
                            width: "60%",
                            minWidth: "600px"
                          }}>
                            {mspqQuestions.map((q) => (
                              <div
                                key={q.question}
                                style={{
                                  display: "flex",
                                  borderBottom: "1px solid #e9ecef",
                                  minHeight: "60px"
                                }}
                              >
                                {options.map((option, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      flex: 1,
                                      padding: "1rem 0.5rem",
                                      textAlign: "center",
                                      borderRight: index < options.length - 1 ? "1px solid #dee2e6" : "none",
                                      cursor: "pointer",
                                      backgroundColor: mspqAnswers[q.question] === index ? "#e3f2fd" : "white",
                                      transition: "background-color 0.2s ease",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      minWidth: "120px"
                                    }}
                                    onClick={() => handleMspqChange(q.question, index)}
                                  >
                                    <input
                                      type="radio"
                                      name={q.question}
                                      value={index}
                                      checked={mspqAnswers[q.question] === index}
                                      onChange={() => handleMspqChange(q.question, index)}
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        cursor: "pointer"
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default MSPQ;
