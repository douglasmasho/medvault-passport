import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/index";
import { db } from "../../firebase/firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingcubes.json";
import "react-phone-number-input/style.css";
import { nanoid } from "nanoid";
import { getAuth } from "firebase/auth";
const OnBoardingOld = ({ orgID, name }) => {
  const { isDarkMode } = useDarkMode(); // Access dark mode state
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth()

  const [authorize, setAuthorize] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    // check if they already have a file at the org

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        console.log(currentUser.uid);
        const pfid = nanoid(8);
        const userObj = JSON.parse(
          localStorage.getItem("medvault_passport_profile")
        );
        const now = new Date();
        await setDoc(doc(db, "orgFiles", "collections", orgID, pfid), {
          instances: [],
          investigations: [],
          questionnaires: [],
          pid: currentUser.uid,
          pfid,
          userDetails: userObj,
          created: now.getTime(),
          lastUpdate: "",
        });

        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          myFiles: arrayUnion({ org: orgID, pfid }),
        });

        const newUserObj = {
          ...userObj,
          myFiles: [...userObj.myFiles, { org: orgID, pfid }],
        };
        localStorage.setItem(
          "medvault_passport_profile",
          JSON.stringify(newUserObj)
        );
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

  useEffect(()=>{
    setIsChecking(true);
    doesFileExist();
  }, []);

  const doesFileExist = async() => {
    try{
      const myFilesRef = await getDoc(doc(db, "users", auth.currentUser.uid))
      const myFiles =  myFilesRef.data().myFiles
      if(myFiles){
        myFiles.forEach((el) => {
          if (el.org === orgID) {
            toast.error("You already have a file here.");
            navigate("/");
          }
        });
      }
    }catch(e){
      toast.error(e.message);
    }finally{
      setIsChecking(false);
    }
    
    // const myFiles = JSON.parse(
    //   localStorage.getItem("medvault_passport_profile")
    // )?.myFiles;
  }

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
              <h3 className="text-xl  sm:text-2xl">Create a New Account</h3>
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
