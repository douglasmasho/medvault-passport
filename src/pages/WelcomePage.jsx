import {
  Search,
  BrainCircuit,
  View,
  BadgeInfo,
  Microscope,
  Brain,
  CircleDot,
  Dna,
  SquareStack,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { useAuth } from "../contexts/authContext/index";
import { Navigate } from "react-router-dom";
import { useDarkMode } from "../contexts/darkModeContext";

const WelcomePage = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode(); // Use dark mode context

  // Set dynamic colors based on the mode
  const backgroundColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-800" : "border-gray-300";
  const textColor = isDarkMode ? "white-text" : "text-gray-900";
  const secondaryTextColor = isDarkMode ? "white-text" : "text-gray-600";

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${backgroundColor}`}>
      {!userLoggedIn ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <>
          <Header
            title="Welcome to Medvault"
            icon={<BadgeInfo style={{ marginRight: "10px" }} color="#56BB6E" />}
          />

          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <motion.div
              className={`shadow-lg rounded-xl p-6 border ${backgroundColor} ${borderColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              <p className={textColor}>
                Welcome to Medalgo, an AI assisted tool designed to assist
                medical professionals in medical image analysis. This
                application leverages advanced machine learning algorithms to
                analyze MRIs, CTs, Mammograms, Biopsies to identify and classify
                abnormalities found. This tool is meant to enhance medical
                professionals by increasing their worflow speed and accuracy.
              </p>
              <br /> <br />
              <h2 className={`${textColor} bigger-text`}>Disclaimer!</h2> <br />
              <p className={`${textColor}`}>
                Medalgo is designed exclusively for use by certified medical
                professionals in clinical or academic settings. <br /> <br />
                This application is a tool to assist in the screening, analysis,
                and diagnosis of medical images. It should not be used as a
                standalone diagnostic tool. Results provided by Medalgo are
                intended to support, not replace, professional medical judgment.{" "}
                <br /> <br />
                Do not use Medalgo for self-diagnosis or self-treatment
                decisions. If you have any health concerns, consult a qualified
                healthcare provider immediately.
              </p>
              <br />
              <h2 className={`bigger-text u-margin-bottom-small ${textColor}`}>
                Features
              </h2>
              <div className="grid grid-4 u-margin-bottom-medium">
                <motion.div
                  className={`overflow-hidden shadow-lg rounded-xl border ${backgroundColor} ${borderColor} center-text`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <Search
                      style={{ color: "#3B82F6" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${textColor}`}>Detect</h3>
                  </div>
                </motion.div>

                <motion.div
                  className={`overflow-hidden shadow-lg rounded-xl border ${backgroundColor} ${borderColor} center-text`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <SquareStack
                      style={{ color: "#3B82F6" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${textColor}`}>Classify</h3>
                  </div>
                </motion.div>

                <motion.div
                  className={`overflow-hidden shadow-lg rounded-xl border ${backgroundColor} ${borderColor} center-text`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <View
                      style={{ color: "#3B82F6" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${textColor}`}>Visualize</h3>
                  </div>
                </motion.div>
                <motion.div
                  className={`overflow-hidden shadow-lg rounded-xl border ${backgroundColor} ${borderColor} center-text`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <Microscope
                      style={{ color: "#3B82F6" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${textColor}`}>
                      Biopsy Analysis
                    </h3>
                  </div>
                </motion.div>
              </div>
              {/* Detect Section */}
              <h2 className={`bigger-text u-margin-bottom-small ${textColor}`}>
                <Search style={{ color: "#3B82F6", marginRight: "10px" }} />
                Detect
              </h2>
              <p className={`u-margin-bottom-small ${secondaryTextColor}`}>
                Detect allows you to quickly analyze MRI scans for the presence
                of brain tumors. This feature highlights any detected tumors and
                classifies them into one of three types: glioma, meningioma,
                pituitary, or determines if no tumor is present (healthy).
              </p>
              {/* Analyze Section */}
              <h2 className={`bigger-text u-margin-bottom-small ${textColor}`}>
                <BrainCircuit
                  style={{ color: "#3B82F6", marginRight: "10px" }}
                />
                Grade
              </h2>
              <p className={`u-margin-bottom-small ${secondaryTextColor}`}>
                Grade helps determine whether a glioma tumor is high-grade (HGG)
                or low-grade (LGG). Upload a .nii file, and Medalgo will
                classify the grade, offering insight for further medical
                evaluation.
              </p>
              {/* Visualize Section */}
              <h2 className={`bigger-text u-margin-bottom-small ${textColor}`}>
                <View style={{ color: "#3B82F6", marginRight: "10px" }} />
                Visualize
              </h2>
              <p className={`u-margin-bottom-small ${secondaryTextColor}`}>
                Visualize lets you explore MRI scans stored in .nii format,
                offering a clear and detailed view of the brain images. You can
                interact with the images and gain a better understanding of the
                scan.
              </p>
              <h2 className={`bigger-text u-margin-bottom-small ${textColor}`}>
                <Microscope style={{ color: "#3B82F6", marginRight: "10px" }} />
                Biopsy Analysis
              </h2>
              <p className={`u-margin-bottom-small ${secondaryTextColor}`}>
                Biopsy Analysis enables the examination of histopathological
                images to identify abnormalities at the cellular level. This
                feature assists in detecting malignancies, providing critical
                insights to guide diagnosis and treatment planning.
              </p>
              <br />
              <h2 className={`bigger-text u-margin-bottom-small ${textColor}`}>
                Supported Body Regions
              </h2>
              <div className="grid grid-3 u-margin-bottom-medium">
                <motion.div
                  className={`overflow-hidden shadow-lg rounded-xl border ${backgroundColor} ${borderColor} center-text`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <Brain
                      style={{ color: "#3B82F6" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${textColor}`}>Brain</h3>
                  </div>
                </motion.div>

                <motion.div
                  className={`overflow-hidden shadow-lg rounded-xl border ${backgroundColor} ${borderColor} center-text`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <CircleDot
                      style={{ color: "#3B82F6" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${textColor}`}>Breast</h3>
                  </div>
                </motion.div>

                <motion.div
                  className={`overflow-hidden shadow-lg rounded-xl border ${backgroundColor} ${borderColor} center-text`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <Dna
                      style={{ color: "#3B82F6" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${textColor}`}>Skin</h3>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </main>
        </>
      )}
    </div>
  );
};

export default WelcomePage;
