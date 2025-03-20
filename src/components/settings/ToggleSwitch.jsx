import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context


const ToggleSwitch = ({ label, isOn, onToggle }) => {
  const { isDarkMode } = useDarkMode(); // Use dark mode context
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";

  return (
    <div className="flex items-center justify-between py-3">
      <span className={`${textColor}`}>{label}</span>
      <button
        className={`
        relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none
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
    </div>
  );
};
export default ToggleSwitch;
