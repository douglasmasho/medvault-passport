import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Plus, CircleX, Trash2, Circle } from "lucide-react";
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
import { useDarkMode } from "../../contexts/darkModeContext";
import BarGraphCustom from "../charts/BarGraphCustom";

const convertToData = (object) => {
  const labelArr = [];
  const dataArr = [];
  console.log(object);

  console.log(labelArr);
  console.log(dataArr);
  return {
    labels: ["Glioma", "Meningioma", "No Tumor", "Pituitary"],
    datasets: [
      {
        label: "",
        data: [
          object.glioma,
          object.meningioma,
          object.notumor,
          object.pituitary,
        ],
        backgroundColor: "#56BB6E",
      },
    ],
  };
};

const DiagnosisTable = ({ diagnoses, deleteDiagnosis }) => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [dataObj, setDataObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const { currentUser } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [currentDiagnosis, setCurrentDiagnosis] = useState("");

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const onOpenModal2 = () => setOpen2(true);
  const onCloseModal2 = () => setOpen2(false);

  const onOpenModal3 = () => setOpen3(true);
  const onCloseModal3 = () => setOpen3(false);

  async function downloadBlobFromUrl() {
    console.log(url);
  }

  useEffect(() => {}, []);

  return (
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
        <h2 className="text-xl ">Detection Diagnoses</h2>
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
                Diagnosis Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Diagnosis ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Pedicted Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Class Probabilities
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                View MRI detection
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {diagnoses.map((diagnosis) => (
              <motion.tr
                key={diagnosis.did}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {moment(diagnosis.date).format("Do MMMM YYYY")}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } text-sm`}
                  >
                    {diagnosis.did}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5  rounded-full bg-green-800 text-blue-100 capitalize-text">
                    {diagnosis.predicted_class}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <Eye
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setDataObj(convertToData(diagnosis.class_predictions));
                      onOpenModal();
                    }}
                  />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Eye
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setUrl(diagnosis.url);
                      onOpenModal2();
                    }}
                  />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Trash2
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setCurrentDiagnosis(diagnosis);
                      onOpenModal3();
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
        <BarGraphCustom dataObj={dataObj} />
      </Modal>

      <Modal
        open={open2}
        onClose={onCloseModal2}
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
        <img
          src={url}
          alt="detection result"
          className="u-margin-bottom-small"
        />
        <a
          className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
          href={url}
          target="_blank"
        >
          Download Image
        </a>
      </Modal>

      <Modal
        open={open3}
        onClose={onCloseModal3}
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
        <h3 className="bigger-text">
          Are you sure you want to delete this diagnosis?
        </h3>
        <div style={{ display: "flex" }} className="u-margin-top">
          <motion.button
            className="bg-red-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 w-full sm:w-auto mr-5"
            style={{ display: "flex", alignItems: "center" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              deleteDiagnosis(currentDiagnosis);
            }}
          >
            <Trash2 className="mr-2" />
            Yes, Delete Diagnosis
          </motion.button>
          <motion.button
            className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 w-full sm:w-auto mr-5"
            style={{ display: "flex", alignItems: "center" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCloseModal3}
          >
            <CircleX className="mr-2" />
            No, Cancel
          </motion.button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default DiagnosisTable;
