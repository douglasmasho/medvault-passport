import { motion } from "framer-motion";
import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context

const SettingSection = ({ icon: Icon, title, children }) => {
  const { isDarkMode } = useDarkMode(); // Access dark mode state

  return (
    <motion.div
      className={`${
        isDarkMode ? "bg-gray-800 bg-opacity-50" : "bg-white bg-opacity-80"
      } backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border ${
        isDarkMode ? "border-gray-700" : "border-gray-300"
      } mb-8`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <Icon className="mr-4" color="#56BB6E" size="24" />
        <h2
          className={`text-xl  ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {title}
        </h2>
      </div>
      {children}
    </motion.div>
  );
};

export default SettingSection;
