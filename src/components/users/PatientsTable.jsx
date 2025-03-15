import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Plus, CircleX } from "lucide-react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import AddPatientForm from "../forms/AddPatientForm";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../contexts/authContext";
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingcubes.json";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const PatientsTable = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = allPatients.filter((user) =>
      user.fullName.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const getAge = (birthDate) => {
    const birthMoment = birthDate;
    const currentMoment = moment();
    return currentMoment.diff(birthMoment, "years");
  };

  // const getPatients = async () => {
  //   setFilteredUsers([]);
  //   setAllPatients([]);
  //   try {
  //     setIsLoading(true);
  //     const docSnap = await getDoc(doc(db, "users", currentUser.uid));
  //     const patientsList = docSnap.data().patients;
  //     if (patientsList.length === 0) {
  //       setIsLoading(0);
  //     } else {
  //       patientsList.forEach(async (pid, index) => {
  //         const docSnap = await getDoc(doc(db, "patients", pid));
  //         setFilteredUsers((prevState) => [
  //           ...prevState,
  //           { ...docSnap.data(), age: getAge(docSnap.data().dob) },
  //         ]);

  //         setAllPatients((prevState) => [
  //           ...prevState,
  //           { ...docSnap.data(), age: getAge(docSnap.data().dob) },
  //         ]);
  //         if (index === patientsList.length - 1) {
  //           setIsLoading(false);
  //         }
  //       });

  //     }
  //   } catch (e) {
  //     console.log(e);
  //     setIsLoading(false);
  //   }
  // };

  const getPatients = async () => {
    setFilteredUsers([]);
    setAllPatients([]);
    try {
      setIsLoading(true);
      const docSnap = await getDoc(doc(db, "users", currentUser.uid));
      const patientsList = docSnap.data().patients;

      if (patientsList.length === 0) {
        setIsLoading(false);
      } else {
        // Collect all patient data in an array first
        const patientDataArray = await Promise.all(
          patientsList.map(async (pid) => {
            const patientSnap = await getDoc(doc(db, "patients", pid));
            return {
              ...patientSnap.data(),
              age: getAge(patientSnap.data().dob),
            };
          })
        );

        // Sort the array after all patients are fetched
        const sortedPatients = patientDataArray.sort((a, b) => {
          if (a.lastDiagnosis < b.lastDiagnosis) {
            return 1;
          } else if (a.lastDiagnosis > b.lastDiagnosis) {
            return -1;
          } else {
            return 0;
          }
        });

        // Update the state once with sorted patients
        setFilteredUsers(sortedPatients);
        setAllPatients(sortedPatients);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPatients();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="u-center-hrz">
          <Lottie animationData={animation} style={{ width: "200px" }} />
        </div>
      ) : (
        <motion.div
          className={`${
            isDarkMode
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-900 shadow-lg"
          } shadow-lg rounded-xl p-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Patients</h2>
            <div style={{ display: "flex" }}>
              <motion.button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto mr-5"
                style={{ display: "flex", alignItems: "center" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={onOpenModal}
              >
                <Plus className="mr-2" />
                Add Patient
              </motion.button>
              <div className="relative">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className={`${
                    isDarkMode
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-gray-100 text-gray-900 placeholder-gray-500"
                  } rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead
                className={`${
                  isDarkMode
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Last Diagnosis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    View Patient
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.pid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                            {user.fullName.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div
                            className={`${
                              isDarkMode ? "text-white" : "text-gray-900"
                            } text-sm font-medium`}
                          >
                            {user.fullName}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        } text-sm`}
                      >
                        {user.age}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-blue-100">
                        {user.gender}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.lastDiagnosis
                        ? moment(user.lastDiagnosis).format(
                            "Do MMMM YYYY, h:mm:ss a"
                          )
                        : "Not yet diagnosed"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Eye
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigate(`/patient/${user.pid}`);
                        }}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal
            open={open}
            onClose={onCloseModal}
            center
            classNames={{
              modal: `${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
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
            <h2 className="text-2xl font-semibold">Add Patient</h2>
            <AddPatientForm
              closeModal={onCloseModal}
              getPatients={getPatients}
              isDarkMode={isDarkMode}
            />
          </Modal>
        </motion.div>
      )}
    </>
  );
};

export default PatientsTable;
