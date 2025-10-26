import { useState, useEffect } from "react";
import {
  BarChart2,
  ShoppingBag,
  Users,
  Zap,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { getAuth } from "firebase/auth";
import { useAuth } from "../contexts/authContext/index";
import { Navigate } from "react-router-dom";
import PatientsTable from "../components/users/PatientsTable";
import { useDarkMode } from "../contexts/darkModeContext";
import Lottie from "lottie-react";
import loader from "../assets/animation/Loader.json";
import DetectCM from "../assets/detect_cm.png";
import DetectPR from "../assets/detect_pr.png";
import ClassifyCM from "../assets/classify_cm.png";
import GradeCM from "../assets/grade_cm.png";
import { safeGetFromStorage } from "../utils/localStorage";

const OverviewPage = () => {
  const { userLoggedIn, currentUser } = useAuth();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  // Set dynamic colors based on the mode
  const backgroundColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const cardBackgroundColor = isDarkMode ? "bg-gray-900" : "bg-gray-100";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";

  useEffect(() => {
    console.log(localStorage.getItem("currentUser"));
    setLoggedInUser(safeGetFromStorage("currentUser", null));
  }, []);

  return (
    <div
      className={`flex-1 overflow-auto relative z-10 ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {!userLoggedIn && !loggedInUser ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <>
          <Header
            title="Dashboard"
            icon={
              <LayoutDashboard
                style={{ marginRight: "10px" }}
                color="#56BB6E"
              />
            }
          />
          <div>
            <p className="m-10">
            Analytics come here when full system is developed
          </p>

          <Lottie animationData={loader} style={{ width: "200px" }} />
          </div>
          
        </>
      )}
    </div>
  );
};

export default OverviewPage;
