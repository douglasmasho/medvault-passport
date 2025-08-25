import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/Homepage";
import SettingsPage from "./pages/SettingsPage";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Toaster } from "react-hot-toast";
import EditProfilePage from "./pages/EditProfilePage";
import PatientPage from "./pages/PatientPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import { BottomNavigation } from "reactjs-bottom-navigation";
import { Home, Clock, Settings } from "lucide-react";
import { useDarkMode } from "./contexts/darkModeContext"; // Import dark mode context
import { useAuth } from "./contexts/authContext";
import QuestionnairesPage from "./pages/QuestionnairesPage";
import { useEffect } from "react";
import VAS from "./pages/Questionnaires/VAS";
import ODI from "./pages/Questionnaires/ODI";

const routesArr = ["", "appointments", "settings"];

function App() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const location = useLocation();
  const { userLoggedIn } = useAuth();

  const bottomNavbgColor = isDarkMode ? "bndark" : "bnlight";

  // useEffect(() => {
  //   console.log(localStorage.getItem("currentUser"))
  //   setLoggedInUser(JSON.parse(localStorage.getItem("currentUser")));
  // }, []);

  useEffect(() => {
    console.log(location.pathname.split("/")[1]);
  }, [location.pathname]);

  const bottomNavItems = [
    {
      title: "Home",
      onClick: () => navigate("/"),
      icon: <Home />,
      activeIcon: <Home color="#fff" />,
    },
    // {
    //   title: "Appointments",
    //   onClick: () => navigate("/appointments"),
    //   icon: <Clock />,
    //   activeIcon: <Clock color="#fff" />,
    // },
    {
      title: "Settings",
      onClick: ({ id }) => navigate("/settings"),
      icon: <Settings />,
      activeIcon: <Settings color="#fff" />,
    },
  ];

  

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        <Toaster />
        {/* BG */}

        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>
        {userLoggedIn && location.pathname.split("/")[1] !== "questionnaire" ? <Sidebar /> : null}
        <Routes>
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/" element={<WelcomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/editprofile" element={<EditProfilePage />} />
          <Route path="/patient/:pid" element={<PatientPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/questionnaires" element={<QuestionnairesPage />} />
          <Route path="/onboarding/:orgID" element={<OnBoardingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/questionnaire/vas" element={<VAS />} />
          <Route path="/questionnaire/odi" element={<ODI />} />
        </Routes>
      </div>
      {
        userLoggedIn ? 
        <BottomNavigation
        items={bottomNavItems}
        selected={routesArr.indexOf(location.pathname.split("/")[1])}
        onItemClick={(item) => console.log(item)}
        activeBgColor="rgb(86, 187, 110)"
        activeTextColor="white"
        hideOnScroll={true}
        className={`custom-bottom-nav bottomnav ${bottomNavbgColor}`}
        style={{ position: "fixed", bottom: 0, width: "100%" }}
      />: null
      }
      
    </>
  );
}

export default App;
