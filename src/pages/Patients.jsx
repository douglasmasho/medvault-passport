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
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { useAuth } from "../contexts/authContext/index";
import { Navigate, useNavigate } from "react-router-dom";
import PatientsTable from "../components/users/PatientsTable";
import { useDarkMode } from "../contexts/darkModeContext";
import DetectCM from "../assets/detect_cm.png";
import DetectPR from "../assets/detect_pr.png";
import ClassifyCM from "../assets/classify_cm.png";
import GradeCM from "../assets/grade_cm.png";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { safeGetFromStorage } from "../utils/localStorage";
const auth = getAuth();

const OverviewPage = () => {
  const { userLoggedIn, currentUser } = useAuth();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate()
  // Set dynamic colors based on the mode
  const backgroundColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const cardBackgroundColor = isDarkMode ? "bg-gray-900" : "bg-gray-100";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";

  useEffect(() => {
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

          {loggedInUser?.role === "provider" || loggedInUser?.role === "staff" ? (
            <>
              <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <PatientsTable isDarkMode={isDarkMode} />
              </main>
            </>
          ) : (
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 ">
              <h2 className={`bigger-text u-margin-bottom-small ${textColor}`}>
                Model Performance
              </h2>
              <motion.div
                className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border ${borderColor} mb-10`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                <h2
                  className={`bigger-text u-margin-bottom-small ${textColor}`}
                >
                  Detect
                </h2>

                <div
                  className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border ${borderColor} center-text p-5 mb-4`}
                >
                  <p className="medium-text u-margin-bottom-small">
                    Confusion Matrix
                  </p>
                  <img src={DetectCM} alt="" style={{ borderRadius: "10px" }} />
                </div>
                <div
                  className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border ${borderColor} center-text p-5`}
                >
                  <p className="medium-text u-margin-bottom-small">
                    Precision Recall Curve
                  </p>
                  <img
                    src={DetectPR}
                    alt=""
                    style={{ borderRadius: "10px", width: "100%" }}
                  />
                </div>
              </motion.div>
              <motion.div
                className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border ${borderColor} mb-10`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                <h2
                  className={`bigger-text u-margin-bottom-small ${textColor}`}
                >
                  Classify
                </h2>

                <div
                  className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border ${borderColor} center-text p-5 mb-4`}
                >
                  <p className="medium-text u-margin-bottom-small">
                    Confusion Matrix
                  </p>
                  <img
                    src={ClassifyCM}
                    alt=""
                    style={{ borderRadius: "10px", width: "100%" }}
                  />
                </div>
              </motion.div>
              <motion.div
                className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border ${borderColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                <h2
                  className={`bigger-text u-margin-bottom-small ${textColor}`}
                >
                  Grade
                </h2>

                <div
                  className={`${cardBackgroundColor} bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border ${borderColor} center-text p-5 mb-4`}
                >
                  <p className="medium-text u-margin-bottom-small">
                    Confusion Matrix
                  </p>
                  <img
                    src={GradeCM}
                    alt=""
                    style={{ borderRadius: "10px", width: "100%" }}
                  />
                </div>
              </motion.div>
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default OverviewPage;
