import { useEffect, useState } from "react";
import { User, CircleX, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/common/Header";
import { useAuth } from "../contexts/authContext/index";
import { Navigate, useNavigate } from "react-router-dom";
import { useDarkMode } from "../contexts/darkModeContext";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import {
  getDoc,
  doc,
  deleteDoc,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import animation from "../assets/animation/loadingcubes.json";
import moment from "moment";
import DiagnosisTable from "../components/users/DiagnosisTableDetect";
import DiagnosisTable2 from "../components/users/DiagnosisTableAnalysis";
import { Modal } from "react-responsive-modal";
import EditPatientForm from "../components/forms/EditPatientForm";

const PatientPage = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const { isDarkMode } = useDarkMode(); // Use dark mode context
  const { pid } = useParams();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectDiagnoses, setDetectDiagnoses] = useState([]);
  const [analysisDiagnoses, setAnalysisDiagnoses] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const onOpenModal2 = () => setOpen2(true);
  const onCloseModal2 = () => setOpen2(false);

  const navigate = useNavigate();

  useEffect(() => {
    getPatient();
    getDiagnoses();
  }, []);

  const getPatient = async () => {
    setIsLoading(true);
    try {
      const patient = await getDoc(doc(db, "patients", pid));
      setPatient(patient.data());
    } catch (e) {
      toast.error(e.code);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getAge = (birthDate) => {
    const birthMoment = birthDate;
    const currentMoment = moment();
    return currentMoment.diff(birthMoment, "years");
  };

  const getDiagnoses = async () => {
    try {
      const diagnoses = await getDoc(doc(db, "diagnosisSets", pid));
      console.log(diagnoses.data().detect);
      setDetectDiagnoses(diagnoses.data().detect);
      setAnalysisDiagnoses(diagnoses.data().analyze);
    } catch (e) {
      console.log(e);
      toast.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDiagnosis = async (diagnosis) => {
    try {
      setIsLoading(true);
      // check if diagnosis has grade
      let collectionString = diagnosis.grade
        ? "analysisDiagnosis"
        : "detectDiagnosis";
      let arrayString = diagnosis.grade ? "analyze" : "detect";
      // await deleteDoc(doc(db, collectionString, did))

      //remove it from the diagnosisSet of the patient
      //to do this first get the diagnosis with the did
      const docRef = await getDoc(doc(db, "diagnosisSets", pid));
      console.log(diagnosis.did);
      const toBeRemoved = docRef
        .data()
        [arrayString].find((el) => el.did === diagnosis.did);
      console.log(toBeRemoved);

      await updateDoc(doc(db, "diagnosisSets", pid), {
        [arrayString]: arrayRemove(toBeRemoved),
      });

      //remove the document
      await deleteDoc(doc(db, collectionString, diagnosis.did));
      toast.success("Diagnosis Deleted");
    } catch (e) {
      toast.error(e.code);
      console.log(e);
    } finally {
      setIsLoading(false);
      getDiagnoses();
    }
  };

  const deletePatient = async () => {
    try {
      setIsLoading(true);

      // Get all diagnosis IDs
      const docRef = await getDoc(doc(db, "diagnosisSets", pid));

      // Function to remove diagnoses
      const removeDiagnoses = async (arr, type) => {
        const deletePromises = arr.map(async (el) => {
          await deleteDoc(doc(db, type, el.did));
        });

        // Wait for all deletions to complete
        await Promise.all(deletePromises);
      };

      // Wait for removeDiagnoses to finish before proceeding
      await removeDiagnoses(docRef.data()?.analyze, "analysisDiagnosis");
      await removeDiagnoses(docRef.data()?.detect, "detectDiagnosis");

      // Further steps after diagnoses removal:
      // - remove diagnosis set of patient
      await deleteDoc(doc(db, "diagnosisSets", pid));
      // - delete patient document
      await deleteDoc(doc(db, "patients", pid));
      // - remove patientID from user's collection
      await updateDoc(doc(db, "users", currentUser.uid), {
        patients: arrayRemove(pid),
      });
    } catch (e) {
      toast.error(e.code);
      console.log(e);
    } finally {
      setIsLoading(false);
      toast.success("Patient has been deleted");
      navigate("/overview");
    }
  };

  // Set dynamic colors based on the mode
  const backgroundColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  return (
    <div className={`flex-1 overflow-auto relative z-10 ${backgroundColor}`}>
      {!userLoggedIn ? (
        <Navigate to="/login" replace={true} />
      ) : isLoading ? (
        <div className="u-center-hrz--col">
          <Lottie animationData={animation} style={{ width: "200px" }} />
        </div>
      ) : (
        patient && (
          <>
            <Header
              title={`Patient: ${patient?.fullName}`}
              icon={<User style={{ marginRight: "10px" }} color="#56BB6E" />}
            />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
              <motion.div
                className={`shadow-lg rounded-xl p-6 border ${backgroundColor} ${borderColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1 }}
              >
                <h2
                  className={`bigger-text u-margin-bottom-small ${textColor}`}
                >
                  Details
                </h2>
                <p className={textColor}>Name: {patient.fullName}</p>
                <p className={`${textColor} capitalize-text`}>
                  Gender: {patient.gender}
                </p>
                <p className={textColor}>Age: {getAge(patient.dob)}</p>

                <p className={textColor}>
                  Last Diagnosis:{" "}
                  {patient.lastDiagnosis
                    ? moment(patient.lastDiagnosis).format(
                        "Do MMMM YYYY, h:mm:ss a"
                      )
                    : "Not yet diagnosed"}
                </p>
                <div className="u-margin-top-small" style={{ display: "flex" }}>
                  <motion.button
                    className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 w-full sm:w-auto mr-5"
                    style={{ display: "flex", alignItems: "center" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onOpenModal}
                  >
                    <Pencil className="mr-2" />
                    Edit Patient
                  </motion.button>

                  <motion.button
                    className="bg-red-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 w-full sm:w-auto mr-5"
                    style={{ display: "flex", alignItems: "center" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onOpenModal2}
                  >
                    <Trash2 className="mr-2" />
                    Delete Patient
                  </motion.button>
                </div>
              </motion.div>
            </main>
            {detectDiagnoses.length !== 0 ? (
              <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                  className={`shadow-lg rounded-xl p-6 border ${backgroundColor} ${borderColor}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                >
                  <DiagnosisTable
                    pid={pid}
                    deleteDiagnosis={deleteDiagnosis}
                    diagnoses={detectDiagnoses}
                  />
                </motion.div>
              </main>
            ) : null}

            {analysisDiagnoses.length !== 0 ? (
              <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                  className={`shadow-lg rounded-xl p-6 border ${backgroundColor} ${borderColor}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  <DiagnosisTable2
                    pid={pid}
                    diagnoses={analysisDiagnoses}
                    deleteDiagnosis={deleteDiagnosis}
                  />
                </motion.div>
              </main>
            ) : null}
            <Modal
              open={open}
              onClose={onCloseModal}
              center
              classNames={{
                modal: `${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                } backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700`,
              }}
              styles={{
                modal: {
                  width: "80%",
                },
              }}
              closeIcon={
                <CircleX
                  style={isDarkMode ? { color: "white" } : { color: " black" }}
                />
              }
            >
              <h2 className="text-2xl ">Edit Patient</h2>
              <EditPatientForm
                closeModal={onCloseModal}
                getPatient={getPatient}
                isDarkMode={isDarkMode}
                pid={pid}
                fullNameProp={patient.fullName}
                genderProp={patient.gender}
                dobProp={patient.dob}
              />
            </Modal>

            <Modal
              open={open2}
              onClose={onCloseModal2}
              center
              classNames={{
                modal: `${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                } backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700`,
              }}
              styles={{
                modal: {
                  width: "80%",
                },
              }}
              closeIcon={
                <CircleX
                  style={isDarkMode ? { color: "white" } : { color: " black" }}
                />
              }
            >
              <h3 className="bigger-text">
                Are you sure you want to delete this patient?
              </h3>
              <div style={{ display: "flex" }} className="u-margin-top">
                <motion.button
                  className="bg-red-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 w-full sm:w-auto mr-5"
                  style={{ display: "flex", alignItems: "center" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={deletePatient}
                >
                  <Trash2 className="mr-2" />
                  Yes, Delete Diagnosis
                </motion.button>
                <motion.button
                  className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 w-full sm:w-auto mr-5"
                  style={{ display: "flex", alignItems: "center" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onCloseModal2}
                >
                  <CircleX className="mr-2" />
                  No, Cancel
                </motion.button>
              </div>
            </Modal>
          </>
        )
      )}
    </div>
  );
};

export default PatientPage;
