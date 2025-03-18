import { Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/Homepage";
import SettingsPage from "./pages/SettingsPage";
import WelcomePage from "./pages/WelcomePage";
import DetectPage from "./pages/Brain/DetectPage";
import DetectPage2 from "./pages/Mammogram/DetectPage";
import AnalysisPage from "./pages/Brain/AnalysisPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import toast, { Toaster } from "react-hot-toast";
import EditProfilePage from "./pages/EditProfilePage";
import { useEffect, useState } from "react";
import PatientPage from "./pages/PatientPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OnBoarding from "./components/auth/onboardingOld";
import OnBoardingPage from "./pages/OnBoardingPage";
import { BottomNavigation } from "reactjs-bottom-navigation";
import {
  Home,
  Clock,
  Bell,
  User
} from "lucide-react";
function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log(localStorage.getItem("currentUser"))
  //   setLoggedInUser(JSON.parse(localStorage.getItem("currentUser")));
  // }, []);
  const bottomNavItems = [
    {
      title: "Home",
      onClick: ()=>navigate("/"),
      icon: <Home />,
      activeIcon: <Home color="#fff" />
    },
    {
      title: "Appointments",
      onClick: ()=>navigate("/appointments"),
      icon: <Clock />,
      activeIcon: <Clock color="#fff" />
    },
    {
      title: "Profile",
      onClick: ({ id }) => navigate("/profile"),
      icon: <User />,
      activeIcon: <User color="#fff" />
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

      <Sidebar />
      <Routes>
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/" element={<WelcomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/editprofile" element={<EditProfilePage />} />
        <Route path="/patient/:pid" element={<PatientPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />

        <Route path="/onboarding/:orgID" element={<OnBoardingPage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<SettingsPage />} />
        <Route path="/brain/detect" element={<DetectPage />} />
        <Route path="/brain/detect" element={<DetectPage />} />
        <Route path="/breast/detect" element={<DetectPage2 />} />
        <Route path="/brain/grade" element={<AnalysisPage />} />
      </Routes>
      
    </div>
    <BottomNavigation
        items={bottomNavItems}
        selected={0}
        onItemClick={(item) => console.log(item)}
        activeBgColor="rgb(86, 187, 110)"
        activeTextColor="white"
        hideOnScroll={true}
        className="custom-bottom-nav bottomnav"
        style={{ position: "fixed", bottom: 0, width: "100%" }}
      />
    </>
   
  );
}

export default App;
