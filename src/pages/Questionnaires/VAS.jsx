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
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/authContext/index";
import { Navigate } from "react-router-dom";
import { useDarkMode } from "../../contexts/darkModeContext";
import QuestionnairesTable from "../../components/users/QuestionnairesTable";

const VAS = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode(); // Use dark mode context

  // Centralized styling object that checks dark mode once
  const styles = {
    container: isDarkMode ? "bg-gray-900" : "bg-white",
    border: isDarkMode ? "border-gray-800" : "border-gray-300",
    text: isDarkMode ? "white-text" : "text-gray-900",
    textSecondary: isDarkMode ? "white-text" : "text-gray-600"
  };

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${styles.container}`}>
      {!userLoggedIn ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <>


         <p>
            CODE IS POETRY

         </p>
        </>
      )}
    </div>
  );
};

export default VAS;
