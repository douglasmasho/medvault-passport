import { useState } from "react";
import Header from "../components/common/Header";
import { User } from "lucide-react";
import Register from "../components/auth/register";
import { useDarkMode } from "../contexts/darkModeContext"; // Import dark mode context

const RegisterPage = () => {
  const { isDarkMode } = useDarkMode(); // Access dark mode state
  const [files, setFiles] = useState([]);
  const [predictedClass, setPredictedClass] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Header
        title="Profile"
        icon={<User style={{ marginRight: "10px" }} />}
      />

      <Register />
    </div>
  );
};

export default RegisterPage;
