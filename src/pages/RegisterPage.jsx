import { useState } from "react";
import Register from "../components/auth/register";
import { useDarkMode } from "../contexts/darkModeContext";
import AuthImg from "../assets/authbg.png";

const RegisterPage = () => {
  const { isDarkMode } = useDarkMode();
  const [files, setFiles] = useState([]);
  const [predictedClass, setPredictedClass] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className={`min-h-screen flex w-full relative z-50 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Left: Register Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-4 py-8">
        <Register />
      </div>
      {/* Right: Image */}
      <div
        className="hidden md:block md:w-1/2 h-screen"
        style={{
          backgroundImage: `url(${AuthImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
    </div>
  );
};

export default RegisterPage;
