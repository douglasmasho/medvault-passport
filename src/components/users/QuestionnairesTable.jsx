import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Edit, Trash2, CircleX } from "lucide-react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";
import { useDarkMode } from "../../contexts/darkModeContext";
import moment from "moment";

const QuestionnairesTable = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState([]);
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAnswer, setOpenAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);

  const { currentUser } = useAuth();

  // Styling object that checks dark mode once
  const styles = {
    container: isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900 shadow-lg",
    header: isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-700",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    input: isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900",
    modal: isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900",
    modalCloseIcon: isDarkMode ? { color: "white" } : { color: "black" },
    buttonSecondary: isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
    card: isDarkMode ? "bg-gray-700" : "bg-gray-50"
  };

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const onOpenEditModal = () => setOpenEdit(true);
  const onCloseEditModal = () => setOpenEdit(false);

  const onOpenDeleteModal = () => setOpenDelete(true);
  const onCloseDeleteModal = () => setOpenDelete(false);

  const onOpenAnswerModal = () => setOpenAnswer(true);
  const onCloseAnswerModal = () => setOpenAnswer(false);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = allQuestionnaires.filter((questionnaire) =>
      questionnaire.name.toLowerCase().includes(term)
    );
    setFilteredQuestionnaires(filtered);
  };

  // Mock data for demonstration - replace with actual Firebase data
  const mockQuestionnaires = [
    {
      id: "1",
      name: "Visual Analog Pain Score (VAS)",
      status: "answered",
      dateAnswered: "2024-01-15T10:30:00Z",
      answers: {
        painLevel: 7,
        location: "Lower back",
        duration: "3 weeks"
      }
    },
    {
      id: "2", 
      name: "Oswestry Disability Index (OSI)",
      status: "requested",
      dateAnswered: null,
      answers: null
    },
    {
      id: "3",
      name: "Insomnia Severity Index (ISI)", 
      status: "answered",
      dateAnswered: "2024-01-10T14:20:00Z",
      answers: {
        sleepQuality: "Poor",
        sleepHours: 5,
        difficulty: "Moderate"
      }
    },
    {
      id: "4",
      name: "Modified Somatic Perceptions Questionnaire (MSPQ)",
      status: "answered", 
      dateAnswered: "2024-01-08T09:15:00Z",
      answers: {
        anxietyLevel: "High",
        physicalSymptoms: "Yes",
        stressLevel: "Moderate"
      }
    }
  ];

  const getQuestionnaires = async () => {
    try {
      setIsLoading(true);
      // For now using mock data - replace with actual Firebase query
      setAllQuestionnaires(mockQuestionnaires);
      setFilteredQuestionnaires(mockQuestionnaires);
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
    setSelectedQuestionnaire(questionnaire);
    onOpenEditModal();
  };

  const handleDeleteQuestionnaire = async (questionnaire) => {
    try {
      // Replace with actual Firebase delete operation
      // await deleteDoc(doc(db, "questionnaires", questionnaire.id));
      
      // Update local state
      const updatedQuestionnaires = allQuestionnaires.filter(q => q.id !== questionnaire.id);
      setAllQuestionnaires(updatedQuestionnaires);
      setFilteredQuestionnaires(updatedQuestionnaires);
      onCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting questionnaire:", error);
    }
  };

  const handleAnswerQuestionnaire = (questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    onOpenAnswerModal();
  };

  useEffect(() => {
    getQuestionnaires();
  }, []);

  const getStatusBadge = (status) => {
    if (status === "answered") {
      return (
        <span className="px-2 inline-flex text-xs leading-5 rounded-full bg-green-100 text-green-800">
          Answered
        </span>
      );
    } else {
      return (
        <span className="px-2 inline-flex text-xs leading-5 rounded-full bg-yellow-100 text-yellow-800">
          Requested
        </span>
      );
    }
  };

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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                    Status
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
                        <button
                          onClick={() => handleAnswerQuestionnaire(questionnaire)}
                          className="hover:text-green-500 transition-colors duration-200"
                        >
                          {questionnaire.name}
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(questionnaire.status)}
                    </td>

                                         <td className="px-6 py-4 whitespace-nowrap">
                       <div className={`${styles.textSecondary} text-sm`}>
                         {questionnaire.dateAnswered
                           ? moment(questionnaire.dateAnswered).format("Do MMMM YYYY, h:mm:ss a")
                           : "Not answered yet"}
                       </div>
                     </td>

                                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                       {questionnaire.status === "answered" && (
                         <Eye
                           className={`${styles.textSecondary} hover:text-green-500`}
                           style={{ cursor: "pointer" }}
                           onClick={() => handleViewAnswers(questionnaire)}
                         />
                       )}
                     </td>

                                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                       {questionnaire.status === "answered" && (
                         <Edit
                           className={`${styles.textSecondary} hover:text-blue-500`}
                           style={{ cursor: "pointer" }}
                           onClick={() => handleEditAnswers(questionnaire)}
                         />
                       )}
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
             closeIcon={
               <CircleX style={styles.modalCloseIcon} />
             }
           >
            {selectedQuestionnaire && (
              <div>
                <h2 className="text-2xl mb-4">Questionnaire Answers</h2>
                <h3 className="text-xl mb-3">{selectedQuestionnaire.name}</h3>
                                 <p className={`text-sm ${styles.textMuted} mb-4`}>
                   Answered on: {moment(selectedQuestionnaire.dateAnswered).format("Do MMMM YYYY, h:mm:ss a")}
                 </p>
                <div className="space-y-3">
                                     {selectedQuestionnaire.answers && Object.entries(selectedQuestionnaire.answers).map(([key, value]) => (
                     <div key={key} className={`flex justify-between items-center p-3 ${styles.card} rounded`}>
                       <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                       <span>{value}</span>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </Modal>

                     {/* Edit Answers Modal */}
           <Modal
             open={openEdit}
             onClose={onCloseEditModal}
             center
             classNames={{
               modal: `${styles.modal} backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700`,
             }}
             styles={{
               modal: {
                 width: "80%",
               },
             }}
             closeIcon={
               <CircleX style={styles.modalCloseIcon} />
             }
           >
            {selectedQuestionnaire && (
              <div>
                <h2 className="text-2xl mb-4">Edit Questionnaire Answers</h2>
                <h3 className="text-xl mb-3">{selectedQuestionnaire.name}</h3>
                                 <p className={`text-sm ${styles.textMuted} mb-4`}>
                   This feature will allow editing of questionnaire answers.
                 </p>
                <div className="space-y-3">
                  {selectedQuestionnaire.answers && Object.entries(selectedQuestionnaire.answers).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <label className="font-medium capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
                                             <input
                         type="text"
                         defaultValue={value}
                         className={`p-2 border rounded ${styles.input}`}
                       />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                                     <button
                     onClick={onCloseEditModal}
                     className={`px-4 py-2 border border-gray-300 rounded ${styles.buttonSecondary}`}
                   >
                     Cancel
                   </button>
                  <button
                    onClick={() => {
                      // Handle save logic here
                      onCloseEditModal();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
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
             closeIcon={
               <CircleX style={styles.modalCloseIcon} />
             }
           >
            {selectedQuestionnaire && (
              <div>
                <h2 className="text-2xl mb-4">Delete Questionnaire</h2>
                <p className="mb-6">
                  Are you sure you want to delete "{selectedQuestionnaire.name}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                                     <button
                     onClick={onCloseDeleteModal}
                     className={`px-4 py-2 border border-gray-300 rounded ${styles.buttonSecondary}`}
                   >
                     Cancel
                   </button>
                  <button
                    onClick={() => handleDeleteQuestionnaire(selectedQuestionnaire)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </Modal>

                     {/* Answer Questionnaire Modal */}
           <Modal
             open={openAnswer}
             onClose={onCloseAnswerModal}
             center
             classNames={{
               modal: `${styles.modal} backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700`,
             }}
             styles={{
               modal: {
                 width: "90%",
                 maxWidth: "800px",
               },
             }}
             closeIcon={
               <CircleX style={styles.modalCloseIcon} />
             }
           >
            {selectedQuestionnaire && (
              <div>
                <h2 className="text-2xl mb-4">Answer Questionnaire</h2>
                <h3 className="text-xl mb-6 text-green-600">{selectedQuestionnaire.name}</h3>
                
                {/* VAS Questionnaire */}
                {selectedQuestionnaire.name.includes("VAS") && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium mb-3">
                        On a scale of 0-10, how would you rate your current pain level?
                      </label>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">0 (No pain)</span>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-gray-500">10 (Worst pain)</span>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-2xl font-bold text-green-600">5</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-lg font-medium mb-2">
                        Where is your pain located?
                      </label>
                                             <select className={`w-full p-3 border rounded-lg ${styles.input}`}>
                        <option value="">Select location</option>
                        <option value="head">Head</option>
                        <option value="neck">Neck</option>
                        <option value="back">Back</option>
                        <option value="shoulder">Shoulder</option>
                        <option value="arm">Arm</option>
                        <option value="leg">Leg</option>
                        <option value="chest">Chest</option>
                        <option value="abdomen">Abdomen</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-medium mb-2">
                        How long have you been experiencing this pain?
                      </label>
                                             <input
                         type="text"
                         placeholder="e.g., 2 weeks, 3 months"
                         className={`w-full p-3 border rounded-lg ${styles.input}`}
                       />
                    </div>
                  </div>
                )}

                {/* OSI Questionnaire */}
                {selectedQuestionnaire.name.includes("OSI") && (
                  <div className="space-y-6">
                                         <p className={`${styles.textMuted} mb-4`}>
                       This questionnaire is designed to help us understand how your back pain affects your daily life.
                     </p>
                    
                    {[
                      "Pain intensity",
                      "Personal care (washing, dressing)",
                      "Lifting",
                      "Walking",
                      "Sitting",
                      "Standing",
                      "Sleeping",
                      "Social life",
                      "Traveling",
                      "Employment/homemaking"
                    ].map((activity, index) => (
                      <div key={index}>
                        <label className="block text-lg font-medium mb-3">
                          {activity}
                        </label>
                        <div className="space-y-2">
                          {[
                            "I can do this activity normally without pain",
                            "I can do this activity normally but it causes some pain",
                            "I can do this activity normally but it causes much pain",
                            "Pain prevents me from doing this activity but I can manage",
                            "Pain prevents me from doing this activity"
                          ].map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={`activity-${index}`}
                                value={optionIndex}
                                className="text-green-600"
                              />
                              <span className="text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ISI Questionnaire */}
                {selectedQuestionnaire.name.includes("ISI") && (
                  <div className="space-y-6">
                                         <p className={`${styles.textMuted} mb-4`}>
                       Please rate the severity of your sleep problems over the last month.
                     </p>
                    
                    {[
                      "Difficulty falling asleep",
                      "Difficulty staying asleep",
                      "Problems waking up too early",
                      "How satisfied/dissatisfied are you with your current sleep pattern?",
                      "How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?",
                      "How worried/distressed are you about your current sleep problem?",
                      "To what extent do you consider your sleep problem to interfere with your daily functioning?"
                    ].map((question, index) => (
                      <div key={index}>
                        <label className="block text-lg font-medium mb-3">
                          {question}
                        </label>
                        <div className="grid grid-cols-5 gap-2 text-sm">
                          {["None", "Mild", "Moderate", "Severe", "Very Severe"].map((level, levelIndex) => (
                            <label key={levelIndex} className="flex flex-col items-center space-y-1">
                              <input
                                type="radio"
                                name={`isi-${index}`}
                                value={levelIndex}
                                className="text-green-600"
                              />
                              <span className="text-xs text-center">{level}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* MSPQ Questionnaire */}
                {selectedQuestionnaire.name.includes("MSPQ") && (
                  <div className="space-y-6">
                                         <p className={`${styles.textMuted} mb-4`}>
                       Please indicate how much you have been bothered by each of the following symptoms.
                     </p>
                    
                    {[
                      "Dizziness",
                      "Faintness or feeling about to faint",
                      "Feeling hot or cold",
                      "Numbness or tingling",
                      "Feeling of weakness",
                      "Heavy feelings in arms or legs",
                      "Soreness in muscles",
                      "Feeling of pressure in head",
                      "Tightness in head",
                      "Feeling of pressure in chest",
                      "Breathing difficulties",
                      "Feeling of bloatedness",
                      "Nausea or feeling sick",
                      "Feeling of butterflies in stomach",
                      "Heart beating faster than usual",
                      "Sweating"
                    ].map((symptom, index) => (
                      <div key={index}>
                        <label className="block text-lg font-medium mb-3">
                          {symptom}
                        </label>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          {["Not at all", "A little", "Moderately", "A lot"].map((level, levelIndex) => (
                            <label key={levelIndex} className="flex flex-col items-center space-y-1">
                              <input
                                type="radio"
                                name={`mspq-${index}`}
                                value={levelIndex}
                                className="text-green-600"
                              />
                              <span className="text-xs text-center">{level}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* DRAM Questionnaire */}
                {selectedQuestionnaire.name.includes("DRAM") && (
                  <div className="space-y-6">
                                         <p className={`${styles.textMuted} mb-4`}>
                       This assessment helps us understand how emotional factors might be affecting your pain.
                     </p>
                    
                    <div>
                      <label className="block text-lg font-medium mb-3">
                        How often do you feel anxious or worried about your health?
                      </label>
                      <div className="space-y-2">
                        {["Never", "Rarely", "Sometimes", "Often", "Always"].map((frequency, index) => (
                          <label key={index} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="anxiety"
                              value={index}
                              className="text-green-600"
                            />
                            <span>{frequency}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-medium mb-3">
                        How much does your pain interfere with your daily activities?
                      </label>
                      <div className="space-y-2">
                        {["Not at all", "A little", "Moderately", "A lot", "Extremely"].map((level, index) => (
                          <label key={index} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="interference"
                              value={index}
                              className="text-green-600"
                            />
                            <span>{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-medium mb-2">
                        Additional comments about how your pain affects you emotionally:
                      </label>
                                             <textarea
                         rows="4"
                         placeholder="Please share any additional thoughts..."
                         className={`w-full p-3 border rounded-lg ${styles.input}`}
                       />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-8">
                                     <button
                     onClick={onCloseAnswerModal}
                     className={`px-6 py-2 border border-gray-300 rounded-lg ${styles.buttonSecondary}`}
                   >
                     Cancel
                   </button>
                  <button
                    onClick={() => {
                      // Handle save logic here
                      console.log("Saving questionnaire answers...");
                      onCloseAnswerModal();
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Submit Answers
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