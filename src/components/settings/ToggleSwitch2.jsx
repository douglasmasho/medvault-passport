import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context
import { Sun, Moon } from "lucide-react";


const ToggleSwitch2 = ({ isOn, onToggle }) => {
  const { isDarkMode } = useDarkMode(); // Use dark mode context
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";

  return (
    <div className="flex items-center py-3">
        <Sun className="mr-4" color="#56BB6E" size="24" />

      <button
        className={`
        relative inline-flex items-center h-6 mr-4 rounded-full w-11 transition-colors focus:outline-none
        ${isOn ? "bg-green-600" : "bg-gray-600"}
        `}
        onClick={onToggle}
      >
        <span
          className={`inline-block size-4 transform transition-transform bg-white rounded-full 
            ${isOn ? "translate-x-6" : "translate-x-1"}
            `}
        />
      </button>
      <Moon className="mr-4" color="#56BB6E" size="24" />
    </div>
  );
};
export default ToggleSwitch2;
