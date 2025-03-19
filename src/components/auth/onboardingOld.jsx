import React, { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/index";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { db } from "../../firebase/firebase";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useUser } from "../../contexts/userContext";
import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingcubes.json";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const OnBoardingOld = ({ orgID }) => {
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
  const [gender, setGender] = useState("");
  const [practiceNumber, setPracticeNumber] = useState("");

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [authorize, setAuthorize] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        console.log(currentUser.uid);
        updateDoc(doc(db, "orgs", orgID), {
          patientIDs: arrayUnion(currentUser.uid),
        });
        toast.success("Successfully registered");
        navigate("/");
      } catch (e) {
        console.log(e);
        setErrorMessage(e.code);
        toast.error(e.code);
      } finally {
        setIsRegistering(false);
      }
    }
  };

  useEffect(() => {
    console.log(orgID);
  }, []);

  return (
    <>
      {/* {userLoggedIn && <Navigate to={"/"} replace={true} />} */}

      <main
        className={`w-full flex self-center place-content-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        {/* <img src={} alt="" /> */}
        {/* {
          userLoggedIn ?
          <>
            
          </>
        } */}
        {isRegistering ? (
          <div className="u-center-hrz--col">
            <Lottie animationData={animation} style={{ width: "200px" }} />
          </div>
        ) : (
          <div
            className={`mt-5 mb-5 p-4 shadow-xl border rounded-xl ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-600"
            }`}
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
                <label className="text-sm ">
                  By ticking the box below, you authorize Windhoek Neurosurgical
                  Centre to have access to your medical records.
                </label>{" "}
                <br />
                <input
                  type="checkbox"
                  required
                  value={title}
                  onChange={(e) => {
                    setAuthorize(e.target.value);
                  }}
                  className={`mt-2 px-3 mr-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                />
                I authorize
              </div>

              {errorMessage && (
                <span className="text-red-600 ">{errorMessage}</span>
              )}

              <button
                type="submit"
                disabled={isRegistering}
                className={`px-4 py-2 text-white font-medium rounded-lg ${
                  isRegistering
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 hover:shadow-xl transition duration-300"
                }`}
              >
                {isRegistering ? "Registering..." : "Register"}
              </button>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default OnBoardingOld;
