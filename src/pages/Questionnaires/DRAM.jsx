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

const DRAM = () => {
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

  const [dramAnswers, setDramAnswers] = useState(() => {
    if (isEditMode && preFilledData) {
      return {
        feelDownheartedAndSad: preFilledData.feelDownheartedAndSad || 0,
        morningIsWhenIFeelBest: preFilledData.morningIsWhenIFeelBest || 0,
        haveCryingSpells: preFilledData.haveCryingSpells || 0,
        haveTroubleGettingToSleep: preFilledData.haveTroubleGettingToSleep || 0,
        feelThatNobodyCares: preFilledData.feelThatNobodyCares || 0,
        eatAsMuchAsIUsedTo: preFilledData.eatAsMuchAsIUsedTo || 0,
        stillEnjoySex: preFilledData.stillEnjoySex || 0,
        noticeIAmLosingWeight: preFilledData.noticeIAmLosingWeight || 0,
        haveTroubleWithConstipation: preFilledData.haveTroubleWithConstipation || 0,
        heartBeatsFasterThanUsual: preFilledData.heartBeatsFasterThanUsual || 0,
        getTiredForNoReason: preFilledData.getTiredForNoReason || 0,
        mindIsAsClearAsItUsedToBe: preFilledData.mindIsAsClearAsItUsedToBe || 0,
        tendToWakeUpTooEarly: preFilledData.tendToWakeUpTooEarly || 0,
        findItEasyToDoThings: preFilledData.findItEasyToDoThings || 0,
        amRestlessAndCantKeepStill: preFilledData.amRestlessAndCantKeepStill || 0,
        feelHopefulAboutTheFuture: preFilledData.feelHopefulAboutTheFuture || 0,
        amMoreIrritableThanUsual: preFilledData.amMoreIrritableThanUsual || 0,
        findItEasyToMakeDecision: preFilledData.findItEasyToMakeDecision || 0,
        feelQuiteGuilty: preFilledData.feelQuiteGuilty || 0,
        feelThatIAmUsefulAndNeeded: preFilledData.feelThatIAmUsefulAndNeeded || 0,
        myLifeIsPrettyFull: preFilledData.myLifeIsPrettyFull || 0,
        feelThatOthersWouldBeBetterOff: preFilledData.feelThatOthersWouldBeBetterOff || 0,
        amStillAbleToEnjoyThings: preFilledData.amStillAbleToEnjoyThings || 0,
      };
    }
    return {
      feelDownheartedAndSad: 0, morningIsWhenIFeelBest: 0, haveCryingSpells: 0, haveTroubleGettingToSleep: 0,
      feelThatNobodyCares: 0, eatAsMuchAsIUsedTo: 0, stillEnjoySex: 0, noticeIAmLosingWeight: 0,
      haveTroubleWithConstipation: 0, heartBeatsFasterThanUsual: 0, getTiredForNoReason: 0, mindIsAsClearAsItUsedToBe: 0,
      tendToWakeUpTooEarly: 0, findItEasyToDoThings: 0, amRestlessAndCantKeepStill: 0, feelHopefulAboutTheFuture: 0,
      amMoreIrritableThanUsual: 0, findItEasyToMakeDecision: 0, feelQuiteGuilty: 0, feelThatIAmUsefulAndNeeded: 0,
      myLifeIsPrettyFull: 0, feelThatOthersWouldBeBetterOff: 0, amStillAbleToEnjoyThings: 0,
    };
  });

  const [completedData, setCompletedData] = useState(null);

  const handleDramChange = (question, value) => {
    setDramAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const calculateDRAMScore = (answers) => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    let severityLevel = "";
    if (totalScore <= 16) severityLevel = "Normal";
    else if (totalScore <= 20) severityLevel = "Mild depression";
    else if (totalScore <= 30) severityLevel = "Moderate depression";
    else severityLevel = "Severe depression";
    return { totalScore, severityLevel };
  };

  const handleDRAMCompletion = async () => {
    try {
      const scoreResults = calculateDRAMScore(dramAnswers);
      const comprehensiveData = {
        timestamp: new Date().toISOString(),
        patientId: currentUser?.uid || "unknown",
        ...dramAnswers,
      };

      setCompletedData(comprehensiveData);
      const cleanedData = { ...comprehensiveData, type: "dram" };
      const result = await createQuestionnaire(cleanedData, currentUser?.uid);

      if (result.success) {
        toast.success(isEditMode ? "DRAM questionnaire updated successfully!" : "DRAM questionnaire completed and saved successfully!");
      } else {
        toast.error("Failed to save questionnaire. Please try again.");
        setCompletedData(null);
      }
    } catch (error) {
      console.error("Error saving DRAM questionnaire:", error);
      toast.error("Error saving questionnaire. Please try again.");
      setCompletedData(null);
    }
  };

  const dramQuestions = [
    { number: 1, text: "I feel downhearted and sad", question: "feelDownheartedAndSad" },
    { number: 2, text: "Morning is when I feel best", question: "morningIsWhenIFeelBest" },
    { number: 3, text: "I have crying spells or feel like it", question: "haveCryingSpells" },
    { number: 4, text: "I have trouble getting to sleep at night", question: "haveTroubleGettingToSleep" },
    { number: 5, text: "I feel that nobody cares", question: "feelThatNobodyCares" },
    { number: 6, text: "I eat as much as I used to", question: "eatAsMuchAsIUsedTo" },
    { number: 7, text: "I still enjoy sex", question: "stillEnjoySex" },
    { number: 8, text: "I notice I am losing weight", question: "noticeIAmLosingWeight" },
    { number: 9, text: "I have trouble with constipation", question: "haveTroubleWithConstipation" },
    { number: 10, text: "My heart beats faster than usual", question: "heartBeatsFasterThanUsual" },
    { number: 11, text: "I get tired for no reason", question: "getTiredForNoReason" },
    { number: 12, text: "My mind is as clear as it used to be", question: "mindIsAsClearAsItUsedToBe" },
    { number: 13, text: "I tend to wake up too early", question: "tendToWakeUpTooEarly" },
    { number: 14, text: "I find it easy to do the things I use to", question: "findItEasyToDoThings" },
    { number: 15, text: "I am restless and can't keep still", question: "amRestlessAndCantKeepStill" },
    { number: 16, text: "I feel hopeful about the future", question: "feelHopefulAboutTheFuture" },
    { number: 17, text: "I am more irritable than usual", question: "amMoreIrritableThanUsual" },
    { number: 18, text: "I find it easy to make a decision", question: "findItEasyToMakeDecision" },
    { number: 19, text: "I feel quite guilty", question: "feelQuiteGuilty" },
    { number: 20, text: "I feel that I am useful and needed", question: "feelThatIAmUsefulAndNeeded" },
    { number: 21, text: "My life is pretty full", question: "myLifeIsPrettyFull" },
    { number: 22, text: "I feel that others would be better off if I were dead", question: "feelThatOthersWouldBeBetterOff" },
    { number: 23, text: "I am still able to enjoy the things I used to", question: "amStillAbleToEnjoyThings" },
  ];

  const options = [
    "Rarely or none of the time (less than 1 day per week)",
    "Some or little of the time (1-2 days per week)",
    "A moderate amount of time (3-4 days per week)",
    "Most of the time (5-7 days per week)"
  ];

  const CompletionScreen = () => {
    const scoreResults = calculateDRAMScore(dramAnswers);
    return (
      <div style={{ padding: "2rem", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem", color: "#059669" }}>
          {isEditMode ? "DRAM Questionnaire Updated!" : "DRAM Questionnaire Completed!"}
        </h2>
        <div style={{ backgroundColor: "#f3f4f6", padding: "2rem", borderRadius: "12px", marginBottom: "2rem", textAlign: "left" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#059669" }}>Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ padding: "1rem", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Score</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>{scoreResults.totalScore}/69</div>
            </div>
            <div style={{ padding: "1rem", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Depression Level</div>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#059669" }}>{scoreResults.severityLevel}</div>
            </div>
          </div>
          <div style={{ padding: "1rem", backgroundColor: "#ffffff", borderRadius: "8px", border: "2px solid #059669" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Questions Completed</div>
            <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#059669" }}>{Object.keys(dramAnswers).length} questions</div>
          </div>
        </div>
        <button
          onClick={() => { setCompletedData(null); navigate("/questionnaires"); }}
          style={{
            backgroundColor: "#059669", color: "#ffffff", padding: "1rem 2rem", borderRadius: "8px",
            border: "none", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s ease",
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
            className="questionnaire__question"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
              borderRadius: "12px",
              padding: "2rem",
              margin: "1rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div style={{ display: "inline-block" }}>
              <div className="questionnaire__nav" onClick={() => navigate("/questionnaires")}>
                <ChevronLeft size={24} color="white" />
                <span>DRAM</span>
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
                  Distress and Risk Assessment Method (DRAM Index)
                </motion.h3>
              </AnimatePresence>
              <br />
              <div className="center-hrz--col--on-phone">
                <motion.button
                  className="button button-white"
                  onClick={() => {
                    handleDRAMCompletion();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Complete
                </motion.button>
              </div>
            </div>
            <img src={LogoLight} alt="Medvault Logo" className="h-10 mb-8 self-start" />
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
                    <div style={{ 
                      padding: "1.5rem", 
                      backgroundColor: "#f8f9fa", 
                      borderBottom: "2px solid #e9ecef",
                      textAlign: "center",
                      flexShrink: 0
                    }}>
                      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333", marginBottom: "0.5rem" }}>
                        Distress and Risk Assessment Method
                      </h2>
                      <p style={{ fontSize: "1rem", color: "#666", marginBottom: "1rem" }}>
                        Main C, Wood P, Hillis S, et al (1992)
                      </p>
                      <p style={{ fontSize: "0.9rem", color: "#666" }}>
                        Please indicate for each of these questions which answer best describes how you have been feeling recently.
                      </p>
                    </div>

                    {/* Table Container */}
                    <div style={{ 
                      flex: 1,
                      overflow: "hidden",
                      display: "flex",
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
                            {dramQuestions.map((q) => (
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
                            {dramQuestions.map((q) => (
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
                                      backgroundColor: dramAnswers[q.question] === index ? "#e3f2fd" : "white",
                                      transition: "background-color 0.2s ease",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      minWidth: "120px"
                                    }}
                                    onClick={() => handleDramChange(q.question, index)}
                                  >
                                    <input
                                      type="radio"
                                      name={q.question}
                                      value={index}
                                      checked={dramAnswers[q.question] === index}
                                      onChange={() => handleDramChange(q.question, index)}
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

export default DRAM;
