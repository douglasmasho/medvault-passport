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

const ODI = () => {
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

  const [odiAnswers, setOdiAnswers] = useState(() => {
    if (isEditMode && preFilledData) {
      // Use pre-filled data from navigation state
      return {
        painIntensity: preFilledData.painIntensity || 0,
        personalCare: preFilledData.personalCare || 0,
        lifting: preFilledData.lifting || 0,
        walking: preFilledData.walking || 0,
        sitting: preFilledData.sitting || 0,
        standing: preFilledData.standing || 0,
        sleeping: preFilledData.sleeping || 0,
        sexLife: preFilledData.sexLife || 0,
        socialLife: preFilledData.socialLife || 0,
        travelling: preFilledData.travelling || 0,
      };
    }
    return {
      painIntensity: 0,
      personalCare: 0,
      lifting: 0,
      walking: 0,
      sitting: 0,
      standing: 0,
      sleeping: 0,
      sexLife: 0,
      socialLife: 0,
      travelling: 0,
    };
  });

  const [completedData, setCompletedData] = useState(null);

  const handleOdiChange = (question, value) => {
    setOdiAnswers((prev) => ({
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

  const calculateODIScore = (answers) => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = 50;
    const percentage = (totalScore / maxPossibleScore) * 100;
    
    let disabilityLevel = "";
    if (percentage === 0) {
      disabilityLevel = "No Disability";
    } else if (percentage <= 20) {
      disabilityLevel = "Minimal Disability";
    } else if (percentage <= 40) {
      disabilityLevel = "Moderate Disability";
    } else if (percentage <= 60) {
      disabilityLevel = "Severe Disability";
    } else if (percentage <= 80) {
      disabilityLevel = "Crippled";
    } else {
      disabilityLevel = "Bed Bound";
    }

    return {
      totalScore,
      percentage: Math.round(percentage * 10) / 10,
      disabilityLevel,
    };
  };

  const handleODICompletion = async () => {
    try {
      const cleanOdiAnswers = {
        painIntensity: odiAnswers.painIntensity || 0,
        personalCare: odiAnswers.personalCare || 0,
        lifting: odiAnswers.lifting || 0,
        walking: odiAnswers.walking || 0,
        sitting: odiAnswers.sitting || 0,
        standing: odiAnswers.standing || 0,
        sleeping: odiAnswers.sleeping || 0,
        sexLife: odiAnswers.sexLife || 0,
        socialLife: odiAnswers.socialLife || 0,
        travelling: odiAnswers.travelling || 0,
      };

      const scoreResults = calculateODIScore(cleanOdiAnswers);

      const comprehensiveData = {
        timestamp: new Date().toISOString(),
        patientId: currentUser?.uid || "unknown",
        ...cleanOdiAnswers,
      };

      console.log("=== ODI COMPLETION DATA ===");
      console.log("Comprehensive Data Object:", comprehensiveData);
      console.log("ODI Answers:", odiAnswers);
      console.log("Summary:", comprehensiveData.summary);
      console.log("==========================");

      setCompletedData(comprehensiveData);

      const cleanedData = removeUndefinedValues({
        ...comprehensiveData,
        type: "odi",
      });

      console.log("Cleaned data for Firebase:", cleanedData);
      console.log("Current User UID:", currentUser?.uid);
      console.log("About to call createQuestionnaire...");

      const result = await createQuestionnaire(cleanedData, currentUser?.uid);
      console.log("createQuestionnaire result:", result);

      if (result.success) {
        if (isEditMode) {
          toast.success("ODI questionnaire updated successfully!");
        } else {
          toast.success("ODI questionnaire completed and saved successfully!");
        }
      } else {
        toast.error("Failed to save questionnaire. Please try again.");
        setCompletedData(null);
      }
    } catch (error) {
      console.error("Error saving ODI questionnaire:", error);
      toast.error("Error saving questionnaire. Please try again.");
      setCompletedData(null);
    }
  };

  const ODIQuestion = ({ question, value, onChange, title, description, options }) => (
    <div
      className="odi-question-container px-4 md:px-8 py-4 md:py-8"
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

  const odiQuestions = [
    {
      title: "Section 1 - Pain Intensity",
      description: "Tick the one appropriate answer per statement:",
      question: "painIntensity",
      options: [
        "I have no pain at the moment",
        "The pain is very mild at the moment",
        "The pain is moderate at the moment",
        "The pain is fairly severe at the moment",
        "The pain is very severe at the moment",
        "The pain is the worst imaginable at the moment",
      ],
    },
    {
      title: "Section 2 - Personal Care",
      description: "Personal care (washing, dressing, etc.):",
      question: "personalCare",
      options: [
        "I can look after myself normally without causing extra pain",
        "I can look after myself normally but it is very painful",
        "It is painful to look after myself and I am slow and careful",
        "I need some help but manage most of my personal care",
        "I need help every day in most aspects of self care",
        "I do not get dressed, wash with difficulty and stay in bed",
      ],
    },
    {
      title: "Section 3 - Lifting",
      description: "Lifting:",
      question: "lifting",
      options: [
        "I can lift heavy weights without extra pain",
        "I can lift heavy weights but it gives extra pain",
        "Pain prevents me from lifting heavy weights off the floor but I can manage if they are conveniently positioned e.g. on a table",
        "Pain prevents me from lifting heavy weights but I can manage light to medium weights if they are conveniently positioned",
        "I can lift only very light weights",
        "I cannot lift or carry anything at all",
      ],
    },
    {
      title: "Section 4 - Walking",
      description: "Walking:",
      question: "walking",
      options: [
        "Pain does not prevent me walking any distance",
        "Pain prevents me walking more than one kilometre",
        "Pain prevents me walking more than 250 metres",
        "Pain prevents me walking more than 100 metres",
        "I can only walk using a stick or crutches",
        "I am in bed most of the time and have to crawl to the toilet",
      ],
    },
    {
      title: "Section 5 - Sitting",
      description: "Sitting:",
      question: "sitting",
      options: [
        "I can sit in any chair as long as I like",
        "I can sit in my favourite chair as long as I like",
        "Pain prevents me from sitting more than 1 hour",
        "Pain prevents me from sitting for more than half an hour",
        "Pain prevents me from sitting for more than 10 minutes",
        "Pain prevents me from sitting at all",
      ],
    },
    {
      title: "Section 6 - Standing",
      description: "Standing:",
      question: "standing",
      options: [
        "I can stand as long as I want without extra pain",
        "I can stand as long as I want but it gives me extra pain",
        "Pain prevents me from standing for more than 1 hour",
        "Pain prevents me from standing for more than half an hour",
        "Pain prevents me from standing for more than 10 minutes",
        "Pain prevents me from standing at all",
      ],
    },
    {
      title: "Section 7 - Sleeping",
      description: "Sleeping:",
      question: "sleeping",
      options: [
        "My sleep is never disturbed by pain",
        "My sleep is occasionally disturbed by pain",
        "Because of pain, I have less than 6 hours of sleep",
        "Because of pain, I have less than 4 hours of sleep",
        "Because of pain, I have less than 2 hours of sleep",
        "Pain prevents me from sleeping at all",
      ],
    },
    {
      title: "Section 8 - Sex Life",
      description: "Sex life (if applicable):",
      question: "sexLife",
      options: [
        "My sex life is normal and causes no extra pain",
        "My sex life is normal but causes some extra pain",
        "My sex life is nearly normal but is very painful",
        "My sex life is severely restricted by pain",
        "My sex life is nearly absent because of pain",
        "Pain prevents any sex life at all",
      ],
    },
    {
      title: "Section 9 - Social Life",
      description: "Social life:",
      question: "socialLife",
      options: [
        "My social life is normal and causes me no extra pain",
        "My social life is normal but increases the degree of pain",
        "Pain has no significant effect on my social life apart from limiting my more energetic interest e.g. sports",
        "Pain has restricted my social life and I do not go out as often",
        "Pain has restricted social life to my home",
        "I have no social life because of pain",
      ],
    },
    {
      title: "Section 10 - Travelling",
      description: "Travelling:",
      question: "travelling",
      options: [
        "I can travel anywhere without pain",
        "I can travel anywhere but it gives extra pain",
        "Pain is bad but I manage journeys over two hours",
        "Pain restricts me to journeys of less than one hour",
        "Pain restricts me to short necessary journeys under 30 minutes",
        "Pain prevents me from travelling except to receive treatment",
      ],
    },
  ];

  const questionComps = odiQuestions.map((q, index) => ({
    component: (
      <ODIQuestion
        question={q.question}
        value={odiAnswers[q.question]}
        onChange={(value) => handleOdiChange(q.question, value)}
        title={q.title}
        description={q.description}
        options={q.options}
      />
    ),
  }));

  const CompletionScreen = () => {
    const scoreResults = calculateODIScore(odiAnswers);

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
          {isEditMode ? "ODI Questionnaire Updated!" : "ODI Questionnaire Completed!"}
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
                {scoreResults.totalScore}/50
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
                Percentage
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#059669",
                }}
              >
                {scoreResults.percentage}%
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
                Disability Level
              </div>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#059669",
                }}
              >
                {scoreResults.disabilityLevel}
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
              Sections Completed
            </div>
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#059669",
              }}
            >
              {Object.keys(odiAnswers).length} sections
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
                <span>ODI</span>
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
                  {odiQuestions[currentQuestionIndex]?.title || "ODI Questionnaire"}
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
                        handleODICompletion();
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

export default ODI;
