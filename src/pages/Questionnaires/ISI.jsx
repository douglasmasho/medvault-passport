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
import { createQuestionnaire } from "../../firebase/questionnaires";
import toast from "react-hot-toast";

const ISI = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're in edit mode
  const isEditMode = location.state?.editMode || false;
  const preFilledData = location.state?.preFilledData || null;
  
  const styles = {
    container: isDarkMode ? "bg-gray-900" : "bg-white",
    border: isDarkMode ? "border-gray-800" : "border-gray-300",
    text: isDarkMode ? "white-text" : "text-gray-900",
    textSecondary: isDarkMode ? "white-text" : "text-gray-600",
  };

  const [isiAnswers, setIsiAnswers] = useState(() => {
    if (isEditMode && preFilledData) {
      // Use pre-filled data from navigation state
      return {
        difficultyFallingAsleep: preFilledData.difficultyFallingAsleep || 0,
        difficultyStayingAsleep: preFilledData.difficultyStayingAsleep || 0,
        problemsWakingUpEarly: preFilledData.problemsWakingUpEarly || 0,
        sleepSatisfaction: preFilledData.sleepSatisfaction || 0,
        sleepProblemNoticeable: preFilledData.sleepProblemNoticeable || 0,
        worriedAboutSleep: preFilledData.worriedAboutSleep || 0,
        sleepInterferesWithDaily: preFilledData.sleepInterferesWithDaily || 0,
      };
    }
    return {
      difficultyFallingAsleep: 0,
      difficultyStayingAsleep: 0,
      problemsWakingUpEarly: 0,
      sleepSatisfaction: 0,
      sleepProblemNoticeable: 0,
      worriedAboutSleep: 0,
      sleepInterferesWithDaily: 0,
    };
  });

  const [completedData, setCompletedData] = useState(null);

  const handleIsiChange = (question, value) => {
    setIsiAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

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

  const calculateISIScore = (answers) => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = 28;
    
    let severityLevel = "";
    if (totalScore <= 7) {
      severityLevel = "No clinically significant insomnia";
    } else if (totalScore <= 14) {
      severityLevel = "Subthreshold insomnia";
    } else if (totalScore <= 21) {
      severityLevel = "Clinical insomnia (moderate severity)";
    } else {
      severityLevel = "Clinical insomnia (severe)";
    }

    return {
      totalScore,
      severityLevel,
    };
  };

  const handleISICompletion = async () => {
    try {
      const cleanIsiAnswers = {
        difficultyFallingAsleep: isiAnswers.difficultyFallingAsleep || 0,
        difficultyStayingAsleep: isiAnswers.difficultyStayingAsleep || 0,
        problemsWakingUpEarly: isiAnswers.problemsWakingUpEarly || 0,
        sleepSatisfaction: isiAnswers.sleepSatisfaction || 0,
        sleepProblemNoticeable: isiAnswers.sleepProblemNoticeable || 0,
        worriedAboutSleep: isiAnswers.worriedAboutSleep || 0,
        sleepInterferesWithDaily: isiAnswers.sleepInterferesWithDaily || 0,
      };

      const scoreResults = calculateISIScore(cleanIsiAnswers);

      const comprehensiveData = {
        timestamp: new Date().toISOString(),
        patientId: currentUser?.uid || "unknown",
        ...cleanIsiAnswers,
      };

      console.log("=== ISI COMPLETION DATA ===");
      console.log("Comprehensive Data Object:", comprehensiveData);
      console.log("ISI Answers:", isiAnswers);
      console.log("Summary:", comprehensiveData.summary);
      console.log("==========================");

      setCompletedData(comprehensiveData);

      const cleanedData = removeUndefinedValues({
        ...comprehensiveData,
        type: "isi",
      });

      console.log("Cleaned data for Firebase:", cleanedData);
      console.log("Current User UID:", currentUser?.uid);
      console.log("About to call createQuestionnaire...");

      const result = await createQuestionnaire(cleanedData, currentUser?.uid);
      console.log("createQuestionnaire result:", result);

      if (result.success) {
        if (isEditMode) {
          toast.success("ISI questionnaire updated successfully!");
        } else {
          toast.success("ISI questionnaire completed and saved successfully!");
        }
      } else {
        toast.error("Failed to save questionnaire. Please try again.");
        setCompletedData(null);
      }
    } catch (error) {
      console.error("Error saving ISI questionnaire:", error);
      toast.error("Error saving questionnaire. Please try again.");
      setCompletedData(null);
    }
  };

  const ISIQuestion = ({ question, value, onChange, title, description, options }) => (
    <div
      className="isi-question-container px-4 md:px-8 py-4 md:py-8"
      style={{
        padding: "1rem",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "800px",
        width: "100%",
      }}
    >
      <h3
        className="text-lg md:text-xl"
        style={{
          fontSize: "1.125rem",
          marginBottom: "0.75rem",
          color: "black",
          textAlign: "center",
          fontWeight: "bold",
          padding: "0 0.5rem",
        }}
      >
        {title}
      </h3>

      <p
        className="text-sm md:text-base"
        style={{
          fontSize: "0.875rem",
          marginBottom: "1.5rem",
          color: "black",
          textAlign: "center",
          padding: "0 0.5rem",
        }}
      >
        {description}
      </p>

      <div
        className="w-full"
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "0 0.5rem",
        }}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className="p-3 md:p-4"
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "0.75rem",
              marginBottom: "0.5rem",
              border: value === index ? "2px solid #56BB6E" : "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: value === index ? "#f0f9ff" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={() => onChange(index)}
          >
            <input
              type="radio"
              name={question}
              value={index}
              checked={value === index}
              onChange={() => onChange(index)}
              className="mt-1"
              style={{
                marginRight: "0.75rem",
                marginTop: "0.25rem",
                flexShrink: 0,
              }}
            />
            <label
              className="text-sm md:text-base"
              style={{
                flex: 1,
                color: "black",
                cursor: "pointer",
                fontSize: "0.875rem",
                lineHeight: "1.5",
              }}
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const isiQuestions = [
    {
      title: "Question 1 - Difficulty Falling Asleep",
      description: "Please rate the CURRENT (i.e. LAST 2 WEEKS) SEVERITY of your insomnia problem(s).",
      question: "difficultyFallingAsleep",
      options: [
        "None",
        "Mild",
        "Moderate", 
        "Severe",
        "Very Severe"
      ],
    },
    {
      title: "Question 2 - Difficulty Staying Asleep",
      description: "Please rate the CURRENT (i.e. LAST 2 WEEKS) SEVERITY of your insomnia problem(s).",
      question: "difficultyStayingAsleep",
      options: [
        "None",
        "Mild",
        "Moderate",
        "Severe", 
        "Very Severe"
      ],
    },
    {
      title: "Question 3 - Problems Waking Up Too Early",
      description: "Please rate the CURRENT (i.e. LAST 2 WEEKS) SEVERITY of your insomnia problem(s).",
      question: "problemsWakingUpEarly",
      options: [
        "None",
        "Mild",
        "Moderate",
        "Severe",
        "Very Severe"
      ],
    },
    {
      title: "Question 4 - Sleep Satisfaction",
      description: "How SATISFIED/DISSATISFIED are you with your CURRENT sleep pattern?",
      question: "sleepSatisfaction",
      options: [
        "Very Satisfied",
        "Satisfied",
        "Moderately Satisfied",
        "Dissatisfied",
        "Very Dissatisfied"
      ],
    },
    {
      title: "Question 5 - Noticeability to Others",
      description: "How NOTICEABLE to others do you think your sleep problem is in terms of impairing the quality of your life?",
      question: "sleepProblemNoticeable",
      options: [
        "Not at all Noticeable",
        "A Little Noticeable",
        "Somewhat Noticeable",
        "Much Noticeable",
        "Very much Noticeable"
      ],
    },
    {
      title: "Question 6 - Worry About Sleep Problem",
      description: "How WORRIED/DISTRESSED are you about your current sleep problem?",
      question: "worriedAboutSleep",
      options: [
        "Not at all Worried",
        "A Little Worried",
        "Somewhat Worried",
        "Much Worried",
        "Very much Worried"
      ],
    },
    {
      title: "Question 7 - Interference with Daily Functioning",
      description: "To what extent do you consider your sleep problem to INTERFERE with your daily functioning (e.g. daytime fatigue, mood, ability to function at work/daily chores, concentration, memory, etc.) CURRENTLY?",
      question: "sleepInterferesWithDaily",
      options: [
        "Not at all Interfering",
        "A Little Interfering",
        "Somewhat Interfering",
        "Much Interfering",
        "Very much Interfering"
      ],
    },
  ];

  const questionComps = isiQuestions.map((q, index) => ({
    component: (
      <ISIQuestion
        question={q.question}
        value={isiAnswers[q.question]}
        onChange={(value) => handleIsiChange(q.question, value)}
        title={q.title}
        description={q.description}
        options={q.options}
      />
    ),
  }));

  const CompletionScreen = () => {
    const scoreResults = calculateISIScore(isiAnswers);

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
            color: "#059669",
          }}
        >
          {isEditMode ? "ISI Questionnaire Updated!" : "ISI Questionnaire Completed!"}
        </h2>

        <div
          className="p-4 md:p-8"
          style={{
            backgroundColor: "#f3f4f6",
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
              color: "#059669",
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
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                }}
              >
                Total Score
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#059669",
                }}
              >
                {scoreResults.totalScore}/28
              </div>
            </div>

            <div
              style={{
                padding: "1rem",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                }}
              >
                Severity Level
              </div>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#059669",
                }}
              >
                {scoreResults.severityLevel}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "2px solid #059669",
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              Questions Completed
            </div>
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#059669",
              }}
            >
              {Object.keys(isiAnswers).length} questions
            </div>
          </div>
        </div>

        <button
          className="w-full md:w-auto px-6 md:px-8 py-3 text-sm md:text-base"
          onClick={() => {
            setCompletedData(null);
            navigate("/questionnaires");
          }}
          style={{
            backgroundColor: "#059669",
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
            e.target.style.backgroundColor = "#047857";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#059669";
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
                <span>ISI</span>
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
                  {isiQuestions[currentQuestionIndex]?.title || "ISI Questionnaire"}
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
                        handleISICompletion();
                        setCurrentQuestionIndex(questionComps.length);
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

export default ISI;
