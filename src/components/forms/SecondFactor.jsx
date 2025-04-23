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
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
} from "firebase/auth";

const SecondFactor = ({ closeModal, getPatients, isDarkMode, error }) => {
  const [pin, setPin] = useState("");
  const [gender, setGender] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const mfaResolver = getMultiFactorResolver(getAuth(), error);
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const selectedHint = mfaResolver.hints[0];
    if (selectedHint.factorId === TotpMultiFactorGenerator.FACTOR_ID) {
      const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(
        selectedHint.uid,
        pin
      );
      try {
        const userCredential = await mfaResolver.resolveSignIn(
          multiFactorAssertion
        );
        // Successfully signed in!
        navigate("/");
        toast.success("Successfully signed in");
      } catch (e) {
        switch (e.code) {
          case "auth/invalid-verification-code":
            toast.error("Invalid Code");
            break;
          default:
        }
        // Handle invalid/expired OTP
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle unsupported factor
    }

    // try{

    //   console.log(pin)
    // }catch(e){
    // }finally{
    // }
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
              className={`text-sm  ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Pin (From your authenticator app)
            </label>
            <input
              type="text"
              autoComplete="full-name"
              required
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
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

          {errorMessage && (
            <span className="text-red-600 ">{errorMessage}</span>
          )}

          <button
            type="submit"
            className={`px-4 py-2 font-medium rounded-lg ${
              isDarkMode
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-700 hover:bg-green-800"
            } text-white transition duration-300`}
          >
            Login
          </button>
        </form>
      )}
    </>
  );
};

export default SecondFactor;
