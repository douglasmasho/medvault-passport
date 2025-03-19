import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/index";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useUser } from "../../contexts/userContext";
import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingcubes.json";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const Register = () => {
  const { isDarkMode } = useDarkMode(); // Access dark mode state
  const [email, setEmail] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [orgID, setOrgID] = useState("");
  const [gender, setGender] = useState("");
  const [practiceNumber, setPracticeNumber] = useState("");

  const { currentUser, setCurrentUser } = useUser();
  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        const userCredential = await doCreateUserWithEmailAndPassword(
          email,
          password
        );
        const uid = userCredential.user.uid;
        let userObj = {
          title,
          fullName,
          email,
          gender,
          uid,
          bloodType,
          phone,
          idNumber,
          role: "patient",
          profilePic: "https://i.ibb.co/z6xFjgk/defaultpic.png",
          notifications: [],
          appointments: [],
        };

        await setDoc(doc(db, "users", uid), userObj);
        await setDoc(doc(db, "patients", uid), {
          instances: [],
          investigations: [],
          questionnaires: [],
          ...userObj,
        });
        setCurrentUser(userObj);
        toast.success("Successfully Created Account");
        localStorage.setItem("currentUser", JSON.stringify(userObj));
      } catch (e) {
        console.log(e);
        setErrorMessage(e.code);
        toast.error(e.code);
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/"} replace={true} />}

      <main
        className={`w-full flex self-center place-content-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        {isRegistering ? (
          <div className="u-center-hrz--col">
            <Lottie animationData={animation} style={{ width: "200px" }} />
          </div>
        ) : (
          <div
            className={`mt-5 p-4 shadow-xl border rounded-xl ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-600"
            }`}
            style={{ marginBottom: "70px" }}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl  sm:text-2xl">Create a New Account</h3>
            </div>

            <form
              onSubmit={onSubmit}
              className="space-y-4"
              style={{ width: "90%" }}
            >
              <div>
                <label className="text-sm ">Title</label>
                <input
                  type="text"
                  autoComplete="title"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  className={`w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm ">Full Name</label>
                <input
                  type="text"
                  autoComplete="full-name"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                  }}
                  className={`w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm ">ID Number</label>
                <input
                  type="text"
                  autoComplete="id-number"
                  required
                  value={idNumber}
                  onChange={(e) => {
                    setIdNumber(e.target.value);
                  }}
                  className={`w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm ">Gender</label>
                <select
                  required
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                  className={`w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="male" className="black-text">
                    Male
                  </option>
                  <option value="female" className="black-text">
                    Female
                  </option>
                </select>
              </div>

              <div>
                <label className="text-sm ">Blood Type (Skip if unknown)</label>
                <select
                  value={bloodType}
                  onChange={(e) => {
                    setBloodType(e.target.value);
                  }}
                  className={`w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="A+" className="black-text">
                    A+
                  </option>
                  <option value="A-" className="black-text">
                    A-
                  </option>
                  <option value="B+" className="black-text">
                    B+
                  </option>
                  <option value="B-" className="black-text">
                    B-
                  </option>
                  <option value="AB+" className="black-text">
                    AB+
                  </option>
                  <option value="AB-" className="black-text">
                    AB-
                  </option>
                  <option value="O+" className="black-text">
                    O+
                  </option>
                  <option value="O-" className="black-text">
                    O-
                  </option>
                </select>
              </div>

              <div>
                <label className="text-sm ">Phone</label>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={setPhone}
                  required
                />
              </div>
              <div>
                <label className="text-sm ">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className={`w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                />
              </div>

              <div>
                <label className="text-sm ">Password</label>
                <input
                  disabled={isRegistering}
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className={`w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                />
              </div>

              <div>
                <label className="text-sm ">Confirm Password</label>
                <input
                  disabled={isRegistering}
                  type="password"
                  autoComplete="off"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setconfirmPassword(e.target.value);
                  }}
                  className={`w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                />
              </div>

              {errorMessage && (
                <span className="text-red-600 ">{errorMessage}</span>
              )}

              <button
                type="submit"
                disabled={isRegistering}
                className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                  isRegistering
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 hover:shadow-xl transition duration-300"
                }`}
              >
                {isRegistering ? "Signing Up..." : "Sign Up"}
              </button>
              <div className="text-sm text-center">
                Already have an account? {"   "}
                <Link to={"/login"} className="hover:underline ">
                  Continue
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default Register;
