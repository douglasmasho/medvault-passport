import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useDarkMode } from "../../contexts/darkModeContext";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarGraphCustom = ({ dataObj }) => {
  const { isDarkMode } = useDarkMode(); // Use dark mode context

  // Set dynamic colors based on the mode
  const textColor = isDarkMode ? "#ffffff" : "#000000";

  const options = {
    indexAxis: "y",
    scales: {
      x: {
        ticks: {
          color: textColor, // Change x-axis label color based on dark mode
        },
      },
      y: {
        ticks: {
          color: textColor, // Change y-axis label color based on dark mode
        },
      },
    },
  };

  return (
    <div>
      <Bar data={dataObj} options={options}></Bar>
    </div>
  );
};

export default BarGraphCustom;