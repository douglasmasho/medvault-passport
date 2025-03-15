import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { View } from "lucide-react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Lottie from "lottie-react";
import animation from "../assets/animation/loadingbrain.json";
import PieChartCustom from "../components/charts/PieChartCustom";
import BarGraphCustom from "../components/charts/BarGraphCustom";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import NiiVue from "../Niivue";
import { useAuth } from "../contexts/authContext/index";
import { Navigate } from "react-router-dom";
import { useDarkMode } from "../contexts/darkModeContext"; // Import dark mode context

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
registerPlugin(FilePondPluginFileValidateType);

const VisualizePage = () => {
  const { userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode(); // Use dark mode context
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [volumes, setVolumes] = useState([{ url: "./lgg.nii" }]);

  // Set dynamic colors based on the mode
  const backgroundColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${backgroundColor}`}>
      {!userLoggedIn ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <>
          <Header
            title="Visualize"
            icon={<View style={{ marginRight: "10px", color: "#56BB6E" }} />}
          />

          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <motion.div
              className={`shadow-lg rounded-xl p-6 border ${backgroundColor} ${borderColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 1 }}
            >
              <NiiVue volumes={volumes} />
            </motion.div>
          </main>
        </>
      )}
    </div>
  );
};

export default VisualizePage;
