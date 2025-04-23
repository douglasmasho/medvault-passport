import { Navigate } from "react-router-dom";
import Header from "../components/common/Header";
import DangerZone from "../components/settings/DangerZone";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";
import { useAuth } from "../contexts/authContext";
import { Settings } from "lucide-react";
import { useDarkMode } from "../contexts/darkModeContext"; // Import dark mode context
import ToggleMode from "../components/settings/ToggleMode";
import EmailVerify from "../components/settings/EmailVerify";
import Totp from "../components/settings/Totp";

const SettingsPage = () => {
  const { userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode(); // Use dark mode context

  // Set dynamic colors based on the mode
  const backgroundColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${backgroundColor}`}>
      {!userLoggedIn ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <>
          <Header
            title="Settings"
            icon={<Settings style={{ marginRight: "10px", color: "#56BB6E" }} />}
          />
          <main className={`max-w-4xl mx-auto py-6 px-4 lg:px-8 ${textColor}`}>
            <Profile />
            <ToggleMode/>
            <EmailVerify/>
            <Totp/>
          </main>
        </>
      )}
    </div>
  );
};

export default SettingsPage;
