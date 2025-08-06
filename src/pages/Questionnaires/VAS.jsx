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
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/authContext/index";
import { Navigate } from "react-router-dom";
import { useDarkMode } from "../../contexts/darkModeContext";
import QuestionnairesTable from "../../components/users/QuestionnairesTable";
import LogoDark from "../../assets/svg/logoblack.svg";
import LogoLight from "../../assets/logowhite.png";
import { useNavigate } from "react-router-dom";
const VAS = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode(); // Use dark mode context
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate()
  // Centralized styling object that checks dark mode once
  const styles = {
    container: isDarkMode ? "bg-gray-900" : "bg-white",
    border: isDarkMode ? "border-gray-800" : "border-gray-300",
    text: isDarkMode ? "white-text" : "text-gray-900",
    textSecondary: isDarkMode ? "white-text" : "text-gray-600",
  };

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${styles.container}`}>
      {!userLoggedIn ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <div className="questionnaire__container">
          <div className="questionnaire__question">
            <div style={{display: "inline-block"}}>
            <div className="questionnaire__nav" onClick={()=>{
              if(currentQuestionIndex === 0){
                navigate("/questionnaires")
              }else{
                setCurrentQuestionIndex(currentQuestionIndex - 1);
              }
            }}>
              <ChevronLeft size={24} color="white" />
              <span>VAS</span>
            </div>
            </div>
          
            <div>
              <h3 className={`questionnaire__question__text`}>
                Mark on the diagram your area of pain
              </h3>
            </div>
            <img
              src={LogoLight}
              alt="Medvault Logo"
              className="h-10 mb-8 self-start"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VAS;
