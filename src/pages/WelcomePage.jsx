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
  FolderOpen,
  CalendarCheck,
  MessagesSquare,
  ClipboardList,
  ClipboardCheck,
  Share,
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
            title=" Passport"
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
                Welcome to MedVault Passport, a secure portal designed to help
                you seamlessly interact with healthcare providers. This platform
                allows you to access medical files, schedule consultations, engage
                in online consultations, and view prescriptions and referrals.
                MedVault Passport empowers you to take control of your healthcare journey
                with ease and convenience.
              </p>
              <br /> <br />
              
              <br />
              <h2 className={`bigger-text u-margin-bottom-small ${textColor}`}>
                Features
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
                    <CalendarCheck
                      style={{ color: "#56BB6E" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${textColor}`}>Schedule Consultations</h3>
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
                    <MessagesSquare
                      style={{ color: "#56BB6E" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${textColor}`}>Online Consultations</h3>
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
                    <ClipboardList
                      style={{ color: "#56BB6E" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${textColor}`}>View Prescriptions & Referrals</h3>
                  </div>
                </motion.div>
              </div>


{/* Schedule Consultations Section */}
<h2 className={`bigger-text u-margin-bottom-small ${textColor}`}>
  <CalendarCheck style={{ color: "#56BB6E", marginRight: "10px" }} />
  Schedule Consultations
</h2>
<p className={`u-margin-bottom-small ${secondaryTextColor}`}>
  Easily book appointments with healthcare providers at your convenience. 
  Select available time slots, receive reminders, and stay on top of your medical visits.
</p>

{/* Online Consultations Section */}
<h2 className={`bigger-text u-margin-bottom-small ${textColor}`}>
  <MessagesSquare style={{ color: "#56BB6E", marginRight: "10px" }} />
  Online Consultations
</h2>
<p className={`u-margin-bottom-small ${secondaryTextColor}`}>
  Connect with doctors remotely through secure chats or video calls. 
  Discuss your health concerns, receive medical advice, and get prescriptions without visiting a clinic.
</p>

{/* View Prescriptions Section */}
<h2 className={`bigger-text u-margin-bottom-small ${textColor}`}>
  <ClipboardCheck style={{ color: "#56BB6E", marginRight: "10px" }} />
  View Prescriptions
</h2>
<p className={`u-margin-bottom-small ${secondaryTextColor}`}>
  Keep track of your prescribed medications in one place. 
  View dosage instructions, refill reminders, and pharmacy details to manage your treatments efficiently.
</p>

{/* View Referrals Section */}
<h2 className={`bigger-text u-margin-bottom-small ${textColor}`}>
  <Share style={{ color: "#56BB6E", marginRight: "10px" }} />
  View Referrals
</h2>
<p className={`u-margin-bottom-small ${secondaryTextColor}`}>
  Get instant access to specialist referrals from your doctor. 
  Track referral statuses and receive guidance on the next steps for specialized care.
</p>


            </motion.div>
          </main>
        </>
      )}
    </div>
  );
};

export default WelcomePage;
