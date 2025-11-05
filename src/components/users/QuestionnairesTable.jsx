import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Edit, Trash2, CircleX } from "lucide-react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";
import { useDarkMode } from "../../contexts/darkModeContext";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { normalizeQuestionnairesToArray } from "../../firebase/questionnaires";

const QuestionnairesTable = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState([]);
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Styling object that checks dark mode once
  const styles = {
    container: isDarkMode
      ? "bg-gray-800 text-white"
      : "bg-white text-gray-900 shadow-lg",
    header: isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-700",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    input: isDarkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300 text-gray-900",
    modal: isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900",
    modalCloseIcon: isDarkMode ? { color: "white" } : { color: "black" },
    buttonSecondary: isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
    card: isDarkMode ? "bg-gray-700" : "bg-gray-50",
  };

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);



  const onOpenDeleteModal = () => setOpenDelete(true);
  const onCloseDeleteModal = () => setOpenDelete(false);



  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = allQuestionnaires.filter(
      (questionnaire) =>
        questionnaire.name.toLowerCase().includes(term) ||
        questionnaire.type.toLowerCase().includes(term) ||
        (questionnaire.dateAnswered &&
          moment(questionnaire.dateAnswered)
            .format("MMMM YYYY")
            .toLowerCase()
            .includes(term))
    );
    setFilteredQuestionnaires(filtered);
  };

  const getQuestionnaires = async () => {
    try {
      setIsLoading(true);

      if (!currentUser?.uid) {
        console.log("No current user UID available");
        setIsLoading(false);
        return;
      }

      // Fetch the user's questionnaire document from Firestore
      const userQuestionnaireRef = doc(db, "questionnaires", currentUser.uid);
      const questionnaireDoc = await getDoc(userQuestionnaireRef);

      if (questionnaireDoc.exists()) {
        const data = questionnaireDoc.data();
        console.log("Fetched questionnaire data:", data);

        // Transform the Firestore data into the expected format
        const transformedQuestionnaires = [];

        // Define questionnaire types and their display names
        const questionnaireTypes = {
          vas: "Visual Analog Pain Score (VAS)",
          odi: "Oswestry Disability Index (ODI)",
          isi: "Insomnia Severity Index (ISI)",
          mspq: "Modified Somatic Perceptions Questionnaire (MSPQ)",
          dram: "Distress and Risk Assessment Method (DRAM Index)",
        };

        // Process each questionnaire type
        Object.entries(data).forEach(([type, questionnaireData]) => {
          if (questionnaireData) {
            // Handle both array and single object formats (for backward compatibility)
            // Use utility function to ensure consistent handling
            const questionnaires = normalizeQuestionnairesToArray(questionnaireData);
            
            // Sort questionnaires by date (newest first) before processing
            const sortedQuestionnaires = [...questionnaires].sort((a, b) => {
              const dateA = new Date(a.timestamp || a.createdAt || 0);
              const dateB = new Date(b.timestamp || b.createdAt || 0);
              return dateB - dateA; // Newest first
            });
            
            const totalVersions = sortedQuestionnaires.length;
            
            // Transform each questionnaire in the sorted array
            sortedQuestionnaires.forEach((qData, index) => {
              if (qData && typeof qData === "object") {
                // If there are multiple versions, include version number in the name
                // Version 1 = oldest, highest number = newest
                const versionInfo = totalVersions > 1 
                  ? ` (Version ${totalVersions - index})`
                  : "";
                
                transformedQuestionnaires.push({
                  id: qData.id || `${type}-${nanoid(6)}`,
                  name: (questionnaireTypes[type] || type.toUpperCase()) + versionInfo,
                  dateAnswered: qData.timestamp || qData.createdAt,
                  type: type,
                  answers: qData,
                  originalData: qData,
                });
              }
            });
          }
        });

        // Sort by date (newest first)
        transformedQuestionnaires.sort(
          (a, b) => new Date(b.dateAnswered) - new Date(a.dateAnswered)
        );

        console.log("Transformed questionnaires:", transformedQuestionnaires);
        setAllQuestionnaires(transformedQuestionnaires);
        setFilteredQuestionnaires(transformedQuestionnaires);
      } else {
        console.log("No questionnaire data found for user");
        setAllQuestionnaires([]);
        setFilteredQuestionnaires([]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching questionnaires:", error);
      setIsLoading(false);
    }
  };

  const handleViewAnswers = (questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    onOpenModal();
  };

  const handleEditAnswers = (questionnaire) => {
    // Navigate to the appropriate questionnaire page with pre-filled data
    navigate(`/questionnaire/${questionnaire.type}`, { 
      state: { 
        editMode: true, 
        preFilledData: questionnaire.answers 
      } 
    });
  };

  const handleDeleteQuestionnaire = async (questionnaire) => {
    try {
      if (!currentUser?.uid) {
        console.error("No current user UID available");
        return;
      }

      // Get the current questionnaire document
      const userQuestionnaireRef = doc(db, "questionnaires", currentUser.uid);
      const questionnaireDoc = await getDoc(userQuestionnaireRef);

      if (questionnaireDoc.exists()) {
        const data = questionnaireDoc.data();
        const updatedData = { ...data };

        // Handle both array and single object formats - remove the specific questionnaire by ID
        if (updatedData[questionnaire.type]) {
          // Normalize to array format for consistent handling
          const questionnaires = normalizeQuestionnairesToArray(updatedData[questionnaire.type]);
          
          // Filter out the questionnaire with matching ID
          const filtered = questionnaires.filter((q) => q.id !== questionnaire.id);
          
          // Update or remove the field
          if (filtered.length === 0) {
            // If no questionnaires remain, remove the field entirely
            delete updatedData[questionnaire.type];
          } else {
            // Save the filtered array
            updatedData[questionnaire.type] = filtered;
          }
        }

        // Update the document in Firestore
        await setDoc(userQuestionnaireRef, updatedData);

        // Update local state
        const updatedQuestionnaires = allQuestionnaires.filter(
          (q) => q.id !== questionnaire.id
        );
        setAllQuestionnaires(updatedQuestionnaires);
        setFilteredQuestionnaires(updatedQuestionnaires);

        console.log("Questionnaire deleted successfully");
      }

      onCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting questionnaire:", error);
    }
  };



  useEffect(() => {
    if (currentUser?.uid) {
      getQuestionnaires();
    }
  }, [currentUser?.uid]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <motion.div
          className={`${styles.container} shadow-lg rounded-xl p-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl">Your Questionnaires</h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search questionnaires..."
                value={searchTerm}
                onChange={handleSearch}
                className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${styles.input}`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className={styles.header}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Questionnaire Name
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date Answered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    View
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Edit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Delete
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredQuestionnaires.map((questionnaire) => (
                  <motion.tr
                    key={questionnaire.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`${styles.text} text-sm font-medium`}>
                          {questionnaire.name}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`${styles.textSecondary} text-sm`}>
                        {questionnaire.dateAnswered
                          ? moment(questionnaire.dateAnswered).format(
                              "Do MMMM YYYY, h:mm:ss a"
                            )
                          : "Not answered yet"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Eye
                        className={`${styles.textSecondary} hover:text-green-500`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleViewAnswers(questionnaire)}
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Edit
                        className={`${styles.textSecondary} hover:text-blue-500`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditAnswers(questionnaire)}
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Trash2
                        className={`${styles.textSecondary} hover:text-red-500`}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedQuestionnaire(questionnaire);
                          onOpenDeleteModal();
                        }}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View Answers Modal */}
          <Modal
            open={open}
            onClose={onCloseModal}
            center
            classNames={{
              modal: `${styles.modal} backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700`,
            }}
            styles={{
              modal: {
                width: "80%",
              },
            }}
            closeIcon={<CircleX style={styles.modalCloseIcon} />}
          >
            {selectedQuestionnaire && (
              <div>
                <h2 className="text-2xl mb-4">Questionnaire Answers</h2>
                <h3 className="text-xl mb-3">{selectedQuestionnaire.name}</h3>
                <p className={`text-sm ${styles.textMuted} mb-4`}>
                  Answered on:{" "}
                  {moment(selectedQuestionnaire.dateAnswered).format(
                    "Do MMMM YYYY, h:mm:ss a"
                  )}
                </p>

                {selectedQuestionnaire.type === "vas" && (
                  <div className="space-y-3">
                    <div className={`p-3 ${styles.card} rounded`}>
                      <span className="font-medium">Worst Pain: </span>
                      <span className="text-2xl font-bold text-green-600">
                        {selectedQuestionnaire.answers.vasAnswers?.worstPain ||
                          selectedQuestionnaire.answers.worstPain ||
                          "N/A"}
                      </span>
                      <span className="text-sm text-gray-500">/ 10</span>
                    </div>
                    <div className={`p-3 ${styles.card} rounded`}>
                      <span className="font-medium">Least Pain: </span>
                      <span className="text-xl font-semibold text-blue-600">
                        {selectedQuestionnaire.answers.vasAnswers?.leastPain ||
                          selectedQuestionnaire.answers.leastPain ||
                          "N/A"}
                      </span>
                      <span className="text-sm text-gray-500">/ 10</span>
                    </div>
                    <div className={`p-3 ${styles.card} rounded`}>
                      <span className="font-medium">Average Pain: </span>
                      <span className="text-xl font-semibold text-orange-600">
                        {selectedQuestionnaire.answers.vasAnswers
                          ?.averagePain ||
                          selectedQuestionnaire.answers.averagePain ||
                          "N/A"}
                      </span>
                      <span className="text-sm text-gray-500">/ 10</span>
                    </div>
                    <div className={`p-3 ${styles.card} rounded`}>
                      <span className="font-medium">Current Pain: </span>
                      <span className="text-xl font-semibold text-red-600">
                        {selectedQuestionnaire.answers.vasAnswers
                          ?.currentPain ||
                          selectedQuestionnaire.answers.currentPain ||
                          "N/A"}
                      </span>
                      <span className="text-sm text-gray-500">/ 10</span>
                    </div>
                    <div className={`p-3 ${styles.card} rounded`}>
                      <span className="font-medium">Pain Range: </span>
                      <span className="text-lg font-medium text-purple-600">
                        {(selectedQuestionnaire.answers.vasAnswers?.worstPain ||
                          selectedQuestionnaire.answers.worstPain ||
                          0) -
                          (selectedQuestionnaire.answers.vasAnswers
                            ?.leastPain ||
                            selectedQuestionnaire.answers.leastPain ||
                            0)}
                      </span>
                      <span className="text-sm text-gray-500"> points</span>
                    </div>
                    <div className={`p-3 ${styles.card} rounded`}>
                      <span className="font-medium">Total Pain Markers: </span>
                      <span className="text-lg font-medium text-indigo-600">
                        {selectedQuestionnaire.answers.painMapperData?.length ||
                          selectedQuestionnaire.answers.summary
                            ?.totalPainMarkers ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                )}

                {selectedQuestionnaire.type === "odi" && (
                  <div className="space-y-3">
                    {/* Calculate ODI score from the answers */}
                    {(() => {
                      const odiAnswers = selectedQuestionnaire.answers;
                      const totalScore =
                        (odiAnswers.painIntensity || 0) +
                        (odiAnswers.personalCare || 0) +
                        (odiAnswers.lifting || 0) +
                        (odiAnswers.walking || 0) +
                        (odiAnswers.sitting || 0) +
                        (odiAnswers.standing || 0) +
                        (odiAnswers.sleeping || 0) +
                        (odiAnswers.sexLife || 0) +
                        (odiAnswers.socialLife || 0) +
                        (odiAnswers.travelling || 0);

                      const percentage = (totalScore / 50) * 100;

                      let disabilityLevel = "Minimal";
                      if (percentage >= 80) disabilityLevel = "Crippled";
                      else if (percentage >= 60) disabilityLevel = "Severe";
                      else if (percentage >= 40) disabilityLevel = "Moderate";
                      else if (percentage >= 20) disabilityLevel = "Mild";

                      return (
                        <>
                          <div className={`p-3 ${styles.card} rounded`}>
                            <span className="font-medium">Total Score: </span>
                            <span className="text-2xl font-bold text-green-600">
                              {totalScore}
                            </span>
                            <span className="text-sm text-gray-500">/ 50</span>
                          </div>
                          <div className={`p-3 ${styles.card} rounded`}>
                            <span className="font-medium">Percentage: </span>
                            <span className="text-xl font-semibold text-blue-600">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className={`p-3 ${styles.card} rounded`}>
                            <span className="font-medium">
                              Disability Level:{" "}
                            </span>
                            <span className="text-lg font-medium text-orange-600">
                              {disabilityLevel}
                            </span>
                          </div>

                          <div className="mt-6">
                            <h4 className="text-lg font-semibold mb-3">
                              Section Scores:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Pain Intensity:{" "}
                                </span>
                                <span className="font-semibold">
                                  {odiAnswers.painIntensity || 0}/5
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Personal Care:{" "}
                                </span>
                                <span className="font-semibold">
                                  {odiAnswers.personalCare || 0}/5
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">Lifting: </span>
                                <span className="font-semibold">
                                  {odiAnswers.lifting || 0}/5
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">Walking: </span>
                                <span className="font-semibold">
                                  {odiAnswers.walking || 0}/5
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">Sitting: </span>
                                <span className="font-semibold">
                                  {odiAnswers.sitting || 0}/5
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">Standing: </span>
                                <span className="font-semibold">
                                  {odiAnswers.standing || 0}/5
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">Sleeping: </span>
                                <span className="font-semibold">
                                  {odiAnswers.sleeping || 0}/5
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">Sex Life: </span>
                                <span className="font-semibold">
                                  {odiAnswers.sexLife || 0}/5
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Social Life:{" "}
                                </span>
                                <span className="font-semibold">
                                  {odiAnswers.socialLife || 0}/5
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Travelling:{" "}
                                </span>
                                <span className="font-semibold">
                                  {odiAnswers.travelling || 0}/5
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {selectedQuestionnaire.type === "isi" && (
                  <div className="space-y-3">
                    {/* Calculate ISI score from the answers */}
                    {(() => {
                      const isiAnswers = selectedQuestionnaire.answers;
                      const totalScore =
                        (isiAnswers.difficultyFallingAsleep || 0) +
                        (isiAnswers.difficultyStayingAsleep || 0) +
                        (isiAnswers.problemsWakingUpEarly || 0) +
                        (isiAnswers.sleepSatisfaction || 0) +
                        (isiAnswers.sleepProblemNoticeable || 0) +
                        (isiAnswers.worriedAboutSleep || 0) +
                        (isiAnswers.sleepInterferesWithDaily || 0);

                      let severityLevel = "";
                      if (totalScore <= 7) {
                        severityLevel = "No clinically significant insomnia";
                      } else if (totalScore <= 14) {
                        severityLevel = "Subthreshold insomnia";
                      } else if (totalScore <= 21) {
                        severityLevel = "Clinical insomnia (moderate severity)";
                      } else {
                        severityLevel = "Clinical insomnia (severe)";
                      }

                      return (
                        <>
                          <div className={`p-3 ${styles.card} rounded`}>
                            <span className="font-medium">Total Score: </span>
                            <span className="text-2xl font-bold text-green-600">
                              {totalScore}
                            </span>
                            <span className="text-sm text-gray-500">/ 28</span>
                </div>
                          <div className={`p-3 ${styles.card} rounded`}>
                            <span className="font-medium">
                              Severity Level:{" "}
                            </span>
                            <span className="text-lg font-medium text-orange-600">
                              {severityLevel}
                            </span>
              </div>

                          <div className="mt-6">
                            <h4 className="text-lg font-semibold mb-3">
                              Question Scores:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Difficulty Falling Asleep:{" "}
                        </span>
                                <span className="font-semibold">
                                  {isiAnswers.difficultyFallingAsleep || 0}/4
                        </span>
                      </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Difficulty Staying Asleep:{" "}
                                </span>
                                <span className="font-semibold">
                                  {isiAnswers.difficultyStayingAsleep || 0}/4
                        </span>
                      </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Problems Waking Up Early:{" "}
                                </span>
                                <span className="font-semibold">
                                  {isiAnswers.problemsWakingUpEarly || 0}/4
                                </span>
                    </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Sleep Satisfaction:{" "}
                                </span>
                                <span className="font-semibold">
                                  {isiAnswers.sleepSatisfaction || 0}/4
                                </span>
                    </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Sleep Problem Noticeable:{" "}
                                </span>
                                <span className="font-semibold">
                                  {isiAnswers.sleepProblemNoticeable || 0}/4
                                </span>
                    </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Worried About Sleep:{" "}
                                </span>
                                <span className="font-semibold">
                                  {isiAnswers.worriedAboutSleep || 0}/4
                                </span>
                  </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Sleep Interferes with Daily:{" "}
                                </span>
                                <span className="font-semibold">
                                  {isiAnswers.sleepInterferesWithDaily || 0}/4
                                </span>
                        </div>
                      </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {selectedQuestionnaire.type === "mspq" && (
                  <div className="space-y-3">
                    {/* Calculate MSPQ score from the answers */}
                    {(() => {
                      const mspqAnswers = selectedQuestionnaire.answers;
                      // Filter out non-score fields and only sum the actual question scores
                      const scoreFields = [
                        'heartRateIncrease', 'feelingHotAllOver', 'sweatingAllOver', 'sweatingInParticularPart',
                        'pulseInNeck', 'poundingInHead', 'dizziness', 'blurringOfVision', 'feelingFaint',
                        'everythingAppearingUnreal', 'nausea', 'butterfliesInStomach', 'painOrAcheInStomach',
                        'stomachChurning', 'desireToPassWater', 'mouthBecomingDry', 'difficultySwallowing',
                        'musclesInNeckAching', 'legsFeelingWeak', 'musclesTwitchingOrJumping',
                        'tenseFeelingAcrossForehead', 'tenseFeelingInJawMuscles'
                      ];
                      const totalScore = scoreFields.reduce((sum, field) => sum + (mspqAnswers[field] || 0), 0);

                      let severityLevel = "";
                      if (totalScore <= 22) {
                        severityLevel = "Low somatic symptoms";
                      } else if (totalScore <= 44) {
                        severityLevel = "Moderate somatic symptoms";
                      } else if (totalScore <= 66) {
                        severityLevel = "High somatic symptoms";
                      } else {
                        severityLevel = "Very high somatic symptoms";
                      }

                      return (
                        <>
                          <div className={`p-3 ${styles.card} rounded`}>
                            <span className="font-medium">Total Score: </span>
                            <span className="text-2xl font-bold text-green-600">
                              {totalScore}
                              </span>
                            <span className="text-sm text-gray-500">/ 88</span>
                        </div>
                          <div className={`p-3 ${styles.card} rounded`}>
                            <span className="font-medium">
                              Severity Level:{" "}
                            </span>
                            <span className="text-lg font-medium text-orange-600">
                              {severityLevel}
                            </span>
                      </div>

                          <div className="mt-6">
                            <h4 className="text-lg font-semibold mb-3">
                              Question Scores (Sample):
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Heart Rate Increase:{" "}
                              </span>
                                <span className="font-semibold">
                                  {mspqAnswers.heartRateIncrease || 0}/3
                                </span>
                        </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Feeling Hot All Over:{" "}
                                </span>
                                <span className="font-semibold">
                                  {mspqAnswers.feelingHotAllOver || 0}/3
                                </span>
                      </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Dizziness:{" "}
                                </span>
                                <span className="font-semibold">
                                  {mspqAnswers.dizziness || 0}/3
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Nausea:{" "}
                                </span>
                                <span className="font-semibold">
                                  {mspqAnswers.nausea || 0}/3
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Tense Feeling in Jaw:{" "}
                                </span>
                                <span className="font-semibold">
                                  {mspqAnswers.tenseFeelingInJawMuscles || 0}/3
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Legs Feeling Weak:{" "}
                                </span>
                                <span className="font-semibold">
                                  {mspqAnswers.legsFeelingWeak || 0}/3
                                </span>
                              </div>
                            </div>
                            <p className={`text-sm ${styles.textMuted} mt-3`}>
                              Showing 6 of 22 questions. All questions are scored from 0-3.
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {selectedQuestionnaire.type === "dram" && (
                  <div className="space-y-3">
                    {/* Calculate DRAM score from the answers */}
                    {(() => {
                      const dramAnswers = selectedQuestionnaire.answers;
                      // Filter out non-score fields and only sum the actual question scores
                      const scoreFields = [
                        'feelDownheartedAndSad', 'morningIsWhenIFeelBest', 'haveCryingSpells', 'haveTroubleGettingToSleep',
                        'feelThatNobodyCares', 'eatAsMuchAsIUsedTo', 'stillEnjoySex', 'noticeIAmLosingWeight',
                        'haveTroubleWithConstipation', 'heartBeatsFasterThanUsual', 'getTiredForNoReason', 'mindIsAsClearAsItUsedToBe',
                        'tendToWakeUpTooEarly', 'findItEasyToDoThings', 'amRestlessAndCantKeepStill', 'feelHopefulAboutTheFuture',
                        'amMoreIrritableThanUsual', 'findItEasyToMakeDecision', 'feelQuiteGuilty', 'feelThatIAmUsefulAndNeeded',
                        'myLifeIsPrettyFull', 'feelThatOthersWouldBeBetterOff', 'amStillAbleToEnjoyThings'
                      ];
                      const totalScore = scoreFields.reduce((sum, field) => sum + (dramAnswers[field] || 0), 0);

                      let severityLevel = "";
                      if (totalScore <= 16) {
                        severityLevel = "Normal";
                      } else if (totalScore <= 20) {
                        severityLevel = "Mild depression";
                      } else if (totalScore <= 30) {
                        severityLevel = "Moderate depression";
                      } else {
                        severityLevel = "Severe depression";
                      }

                      return (
                        <>
                          <div className={`p-3 ${styles.card} rounded`}>
                            <span className="font-medium">Total Score: </span>
                            <span className="text-2xl font-bold text-green-600">
                              {totalScore}
                            </span>
                            <span className="text-sm text-gray-500">/ 69</span>
                      </div>
                          <div className={`p-3 ${styles.card} rounded`}>
                            <span className="font-medium">
                              Depression Level:{" "}
                            </span>
                            <span className="text-lg font-medium text-orange-600">
                              {severityLevel}
                            </span>
                    </div>

                          <div className="mt-6">
                            <h4 className="text-lg font-semibold mb-3">
                              Question Scores (Sample):
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Feel Downhearted and Sad:{" "}
                                </span>
                                <span className="font-semibold">
                                  {dramAnswers.feelDownheartedAndSad || 0}/3
                                </span>
                      </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Have Crying Spells:{" "}
                                </span>
                                <span className="font-semibold">
                                  {dramAnswers.haveCryingSpells || 0}/3
                                </span>
                    </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Feel That Nobody Cares:{" "}
                                </span>
                                <span className="font-semibold">
                                  {dramAnswers.feelThatNobodyCares || 0}/3
                                </span>
                    </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Get Tired For No Reason:{" "}
                                </span>
                                <span className="font-semibold">
                                  {dramAnswers.getTiredForNoReason || 0}/3
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Feel Hopeful About Future:{" "}
                                </span>
                                <span className="font-semibold">
                                  {dramAnswers.feelHopefulAboutTheFuture || 0}/3
                                </span>
                              </div>
                              <div className={`p-3 ${styles.card} rounded`}>
                                <span className="font-medium">
                                  Feel Quite Guilty:{" "}
                                </span>
                                <span className="font-semibold">
                                  {dramAnswers.feelQuiteGuilty || 0}/3
                                </span>
                              </div>
                            </div>
                            <p className={`text-sm ${styles.textMuted} mt-3`}>
                              Showing 6 of 23 questions. All questions are scored from 0-3.
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </Modal>

          

          {/* Delete Confirmation Modal */}
          <Modal
            open={openDelete}
            onClose={onCloseDeleteModal}
            center
            classNames={{
              modal: `${styles.modal} backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700`,
            }}
            styles={{
              modal: {
                width: "400px",
              },
            }}
            closeIcon={<CircleX style={styles.modalCloseIcon} />}
          >
            {selectedQuestionnaire && (
              <div>
                <h2 className="text-2xl mb-4">Delete Questionnaire</h2>
                <p className="mb-6">
                  Are you sure you want to delete "{selectedQuestionnaire.name}
                  "? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onCloseDeleteModal}
                    className={`px-4 py-2 border border-gray-300 rounded ${styles.buttonSecondary}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteQuestionnaire(selectedQuestionnaire)
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </Modal>

          
        </motion.div>
      )}
    </>
  );
};

export default QuestionnairesTable;
