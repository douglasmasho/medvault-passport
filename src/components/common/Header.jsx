import { useDarkMode } from "../../contexts/darkModeContext"; // Import the dark mode context

const Header = ({ title, icon }) => {
  const { isDarkMode } = useDarkMode(); // Use dark mode context

  // Set colors based on dark mode or light mode
  const backgroundColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";

  return (
    <header className={`${backgroundColor} bg-opacity-50 backdrop-blur-md shadow-lg border-b ${borderColor}`}>
      <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8' style={{ display: "flex", alignItems: "center" }}>
        {icon}
        <h1 className={`text-2xl font-semibold ${textColor}`}>{title}</h1>
      </div>
    </header>
  );
};

export default Header;
