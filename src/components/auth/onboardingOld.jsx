import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/index";
import { db } from "../../firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import toast from "react-hot-toast";
import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingcubes.json";
import "react-phone-number-input/style.css";
import { nanoid } from "nanoid";
import { getAuth } from "firebase/auth";
import { safeGetFromStorage } from "../../utils/localStorage";
const OnBoardingOld = ({ orgID, name }) => {
  const { isDarkMode } = useDarkMode(); // Access dark mode state

  const [isRegistering, setIsRegistering] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();
  const functions = getFunctions();
  const getLink = httpsCallable(functions, "checkIfPatientOrgLinkExists");
  const createNewPatient = httpsCallable(functions, "createNewPatientFile");

  const [authorize, setAuthorize] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    // check if they already have a file at the org

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        const userObj = safeGetFromStorage("medvault_passport_profile", {});
        const idToken = await auth.currentUser.getIdToken();
        const result = await createNewPatient({ orgID, userObj, idToken });
        // console.log(result.data);
        if(result.data.success){
          toast.success("File created, waiting for approval")
        }else{
          toast.error(result.data.message);
          setErrorMessage(result.data.message);
        }
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
    setIsChecking(true);
    doesFileExist();
  }, []);

  const doesFileExist = async () => {
    console.log("check")
    try {
      // call a cloud function to check if the org is in their patientOrg doc.
      const idToken = await auth.currentUser.getIdToken();
      const exists = await getLink({
        patientUid: currentUser.uid,
        orgID,
        idToken,
      });
      if (exists.data.exists) {
        console.log("exists")
        toast.error("You already have a file here.");
        navigate("/");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsChecking(false);
    }

    // const myFiles = JSON.parse(
    //   localStorage.getItem("medvault_passport_profile")
    // )?.myFiles;
  };

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
        {isRegistering || isChecking ? (
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
              <h3 className="text-xl  sm:text-2xl">Create a File</h3>
            </div>

            <form
              onSubmit={onSubmit}
              className="space-y-4"
              style={{ width: "90%" }}
            >
              <div>
                <label className="text-sm ">
                  By ticking the box below, you authorize {name} to have access
                  to your medical records.
                </label>{" "}
                <br />
                <input
                  type="checkbox"
                  required
                  value={authorize}
                  onChange={(e) => {
                    setAuthorize(e.target.value);
                  }}
                  className={`mt-2 px-3 mr-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                />
                I authorize
              </div>
              <br />
              {errorMessage && (
                <span className="text-red-600 ">{errorMessage}</span>
              )} <br />

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
