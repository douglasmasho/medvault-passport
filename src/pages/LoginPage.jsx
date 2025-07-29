import { useState } from "react";
import Login from "../components/auth/login";
import { useDarkMode } from "../contexts/darkModeContext"; // Import dark mode context
import AuthImg from "../assets/authbg.png";
const iconStyle = {
  width: "100px",
};

const LoginPage = () => {
  const { isDarkMode } = useDarkMode(); // Access dark mode state
  return (
    <div className={`relative z-50 min-h-screen flex w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Left: Login Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-4 py-8">
        <Login />
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

export default LoginPage;