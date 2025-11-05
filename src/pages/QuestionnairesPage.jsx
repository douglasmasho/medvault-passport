import {
  Brain,
  CalendarCheck,
  MessagesSquare,
  ClipboardList,
  ClipboardCheck,
  FileQuestion,
  Share,
  CircleDashed,
  Accessibility,
  EyeOff,
  BrainCircuit,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { useAuth } from "../contexts/authContext/index";
import { Navigate } from "react-router-dom";
import { useDarkMode } from "../contexts/darkModeContext";
import QuestionnairesTable from "../components/users/QuestionnairesTable";
import { useNavigate } from "react-router-dom";

const QuestionnairesPage = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode(); // Use dark mode context
  const navigate = useNavigate();
  // Centralized styling object that checks dark mode once
  const styles = {
    container: isDarkMode ? "bg-gray-900" : "bg-white",
    border: isDarkMode ? "border-gray-800" : "border-gray-300",
    text: isDarkMode ? "white-text" : "text-gray-900",
    textSecondary: isDarkMode ? "white-text" : "text-gray-600"
  };

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${styles.container}`}>
      {!userLoggedIn ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <>
          <Header
            title=" Questionnaires"
            icon={
              <FileQuestion style={{ marginRight: "10px" }} color="#56BB6E" />
            }
          />

          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <motion.div
              className={`shadow-lg rounded-xl p-6 border ${styles.container} ${styles.border}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              <p className={styles.text}>
                Welcome to MedVault Questionnaires, below are the questionnaires
                you can fill out to help us better understand your health and
                needs.
              </p>
              <br />
              <QuestionnairesTable isDarkMode={isDarkMode} />
             <br />
              <h2 className={`bigger-text u-margin-bottom-small ${styles.text}`}>
                Answer Questionnaires
              </h2>
              <p>You can answer questionnaires multiple times. Each response will be saved as a new version, preserving your complete health history.</p>
              <br />
              <div className="grid grid-3 u-margin-bottom-medium">
                <motion.div
                  className={`overflow-hidden shadow-lg rounded-xl border ${styles.container} ${styles.border} center-text cursor-pointer`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  onClick={() => navigate("/questionnaire/vas")}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <CircleDashed
                      style={{ color: "#56BB6E" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${styles.text}`}>
                      Visual Analog Pain Score{" "}
                    </h3>
                    <h3 className={`bigish-text ${styles.text}`}>(VAS)</h3>
                    <p className={`u-margin-top-small ${styles.textSecondary}`}>
                      A simple scale to help you describe how much pain you're
                      feeling — from no pain at all to the worst pain
                      imaginable.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className={`overflow-hidden shadow-lg rounded-xl border ${styles.container} ${styles.border} center-text cursor-pointer`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  onClick={() => navigate("/questionnaire/odi")}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <Accessibility
                      style={{ color: "#56BB6E" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${styles.text}`}>
                      Oswestry Disability Index{" "}
                    </h3>
                    <h3 className={`bigish-text ${styles.text}`}>(ODI)</h3>
                    <p className={`u-margin-top-small ${styles.textSecondary}`}>
                      This helps us understand how much your back pain affects
                      your daily life — from walking and lifting to sleeping and
                      socializing.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className={`overflow-hidden shadow-lg rounded-xl border ${styles.container} ${styles.border} center-text cursor-pointer`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  onClick={() => navigate("/questionnaire/isi")}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <EyeOff
                      style={{ color: "#56BB6E" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${styles.text}`}>
                      Insomnia Severity Index
                    </h3>
                    <h3 className={`bigish-text ${styles.text}`}>(ISI)</h3>
                    <p className={`u-margin-top-small ${styles.textSecondary}`}>
                      A short questionnaire to measure how severe your sleep
                      problems are and how they affect your daily functioning.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className={`overflow-hidden shadow-lg rounded-xl border ${styles.container} ${styles.border} center-text cursor-pointer`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  onClick={() => navigate("/questionnaire/mspq")}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <Brain
                      style={{ color: "#56BB6E" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${styles.text}`}>
                      Modified Somatic Perceptions Questionnaire
                    </h3>
                    <h3 className={`bigish-text ${styles.text}`}>(MSPQ)</h3>
                    <p className={`u-margin-top-small ${styles.textSecondary}`}>
                      This helps us learn how your body sensations and physical
                      symptoms may be linked to stress or anxiety.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className={`overflow-hidden shadow-lg rounded-xl border ${styles.container} ${styles.border} center-text cursor-pointer`}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  onClick={() => navigate("/questionnaire/dram")}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <BrainCircuit
                      style={{ color: "#56BB6E" }}
                      size={100}
                      className="u-margin-bottom-small"
                    />
                    <h3 className={`bigish-text ${styles.text}`}>
                      Distress and Risk Assessment Method
                    </h3>
                    <h3 className={`bigish-text ${styles.text}`}>(DRAM Index)</h3>
                      <p className={`u-margin-top-small ${styles.textSecondary}`}>
                      This tool helps us see if emotional stress or anxiety
                      might be making your pain feel worse or affecting your
                      recovery.
                    </p>
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

export default QuestionnairesPage;
