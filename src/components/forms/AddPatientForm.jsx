import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../../firebase/firebase";
import { doc, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingcubes.json";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/authContext";

const AddPatientForm = ({ closeModal, getPatients, isDarkMode }) => {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useAuth();

  const getAge = (birthDate) => {
    const birthMoment = moment(birthDate.getTime());
    const currentMoment = moment();
    const age = currentMoment.diff(birthMoment, "years");
    return age;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isAdding) {
      setIsAdding(true);
      setIsLoading(true);
      const pid = nanoid(12);
      try {
        const data = {
          pid,
          fullName,
          gender,
          dob: startDate.getTime(),
          lastDiagnosis: null,
        };
        await setDoc(doc(db, "patients", pid), data);
        await updateDoc(doc(db, "users", currentUser.uid), {
          patients: arrayUnion(pid),
        });
        await setDoc(doc(db, "diagnosisSets", pid), {
          analyze: [],
          detect: [],
        });
        toast.success("Successfully added patient");
      } catch (e) {
        toast.error(e.code);
        console.log(e);
      } finally {
        setIsAdding(false);
        setIsLoading(false);
        setFullName("");
        setGender("");
        setStartDate(new Date());
        getPatients();
        closeModal();
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="u-center-hrz">
          <Lottie animationData={animation} style={{ width: "500px" }} />
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className={`space-y-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          } u-margin-top-small`}
          style={{ width: "90%" }}
        >
          <div>
            <label
              className={`text-sm font-bold ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Full Name
            </label>
            <input
              type="text"
              autoComplete="full-name"
              required
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              className={`w-full mt-2 px-3 py-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-gray-100 text-gray-900 placeholder-gray-600"
              } outline-none border ${
                isDarkMode ? "border-gray-600" : "border-gray-300"
              } focus:border-indigo-600 shadow-sm rounded-lg transition duration-300`}
            />
          </div>

          <div>
            <label
              className={`text-sm font-bold ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Gender
            </label>
            <select
              required
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
              }}
              className={`w-full mt-2 px-3 py-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-900"
              } outline-none border ${
                isDarkMode ? "border-gray-600" : "border-gray-300"
              } focus:border-indigo-600 shadow-sm rounded-lg transition duration-300`}
            >
              <option value="" disabled>
                Select an option
              </option>
              <option
                value="male"
                className={`${isDarkMode ? "white-text" : "text-black"}`}
              >
                Male
              </option>
              <option
                value="female"
                className={`${isDarkMode ? "white-text" : "text-black"}`}
              >
                Female
              </option>
            </select>
          </div>

          <div>
            <label
              className={`text-sm font-bold ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Date of Birth
            </label>
            <br />
            <DatePicker
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className={`w-full mt-2 px-3 py-2 ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-900"
              } outline-none border ${
                isDarkMode ? "border-gray-600" : "border-gray-300"
              } focus:border-indigo-600 shadow-sm rounded-lg transition duration-300`}
            />
          </div>

          {errorMessage && (
            <span className="text-red-600 font-bold">{errorMessage}</span>
          )}

          <button
            type="submit"
            className={`px-4 py-2 font-medium rounded-lg ${
              isDarkMode
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-700 hover:bg-green-800"
            } text-white transition duration-300`}
          >
            Add Patient
          </button>
        </form>
      )}
    </>
  );
};

export default AddPatientForm;
