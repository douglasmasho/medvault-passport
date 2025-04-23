import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingcubes.json";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/authContext";
import qrcode from "qrcode";
import {
  multiFactor,
  TotpMultiFactorGenerator,
  TotpSecret,
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { Copy } from "lucide-react";

const friendlyMessages = {
    "auth/too-many-enrollment-attempts": "You’ve made too many attempts. Please try again later.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/invalid-verification-code": "The pin is incorrect"
    // add more mappings as needed
  };

const ReauthenticateForm = ({
  closeModal,
  isDarkMode,
  setTwoFa,
  textColor,
  toggleModal
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [cantScan, setCantScan] = useState(false);
  const [secretKey, setSecretKey] = useState(true);
  const [secret, setSecret] = useState(true);
  const [isEnteringPin, setIsEnteringPin] = useState(false);
  const [pin, setPin] = useState("");
  const auth = getAuth();

  useEffect(() => {
    console.log(auth.currentUser);
  }, []);


  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // reauthenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      const multiFactorSession = await multiFactor(
        auth.currentUser
      ).getSession();
      const totpSecret = await TotpMultiFactorGenerator.generateSecret(
        multiFactorSession
      );
      setSecret(totpSecret)
      setSecretKey(totpSecret.secretKey);
      const totpUri = totpSecret.generateQrCodeUrl(
        auth.currentUser.email,
        "Medvault"
      );
      const url = await qrcode.toDataURL(totpUri);
      setQrCodeUrl(url);
      setTwoFa(true);
      setErrorMessage("");
    } catch (e) {
      setErrorMessage(e.message);
      toast.error(e.message);
      console.log(e);
    } finally {
      setIsLoading(false);
      // toggleModal(false)
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    try{
      setIsLoading(true);
      const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(
        secret,
        pin
      );
      await multiFactor(auth.currentUser).enroll(multiFactorAssertion, "My TOTP Device");
      toast.success("Successfully enrolled");
    }catch(e){
        const friendlyMessage = friendlyMessages[e.code] || "Something went wrong. Please try again.";
        toast.error(friendlyMessage);
        console.log(e)
    }finally{
        setIsLoading(false);
      toggleModal(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="u-center-hrz">
          <Lottie animationData={animation} style={{ width: "500px" }} />
        </div>
      ) : isEnteringPin ? (
        <>
          <h3 className={`bigger-text ${textColor} u-margin-bottom`}>
            Please enter the pin shown by your authenticator app
          </h3>
          <form
          onSubmit={verify}
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
                Pin
              </label>
              <input
                type="text"
                autoComplete=""
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
                } focus:border-indigo-600 shadow-sm rounded-lg transition duration-300 mb-5`}
              />
              <div className="center-hrz--col--on-phone">
                <button
                  className="bg-red-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200  sm:w-auto btnn"
                  type="button"
                  onClick={() => {
                    setIsEnteringPin(false);
                  }}
                >
                  Back
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200  sm:w-auto btnn"
                  type="submit"
                  onClick={verify}
                >
                  Next Step
                </button>
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          {qrCodeUrl ? (
            <div className="center-text">
              {cantScan ? (
                <>
                  <h3 className={`bigger-text ${textColor} u-margin-bottom`}>
                    Copy and paste this secret into an authenticator app
                  </h3>
                  <p className="medium-text mb-2">{secretKey}</p>
                  <button
                    className="bg-gray-700 hover:bg-gray-300 text-white hover:text-black  py-1 px-4 rounded transition duration-200  sm:w-auto btnn mb-5"
                    onClick={() => {
                      navigator.clipboard.writeText(secretKey);
                      toast.success("Secret copied to clipboard");
                    }}
                  >
                    <Copy color="white" className="mr-3" />
                    Copy Code
                  </button>
                  <p className="mb-5">
                    In most authenticator apps: <br />
                    Tap “+” → “Enter setup key” → Add your account name & key →
                    Done.
                  </p>
                  <div className="center-hrz--col--on-phone">
                    <button
                      className="bg-red-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200  sm:w-auto btnn"
                      onClick={() => {
                        setCantScan(false);
                      }}
                    >
                      Back
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200  sm:w-auto btnn"
                      onClick={() => {
                        setIsEnteringPin(true);
                      }}
                    >
                      Next Step
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className={`bigger-text ${textColor} u-margin-bottom`}>
                    Scan this code using an authenticator app
                  </h3>
                  <div className="center-hrz">
                    <img src={qrCodeUrl} alt="TOTP QR Code" className="mb-3" />
                  </div>

                  <p className="mb-5 px-8">
                    Download Authy, Google Autenticator or Microsoft
                    Authenticator on your phone, then scan the code using the
                    app.
                  </p>
                  <div className="center-hrz--col--on-phone">
                    <button
                      className="bg-red-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200  sm:w-auto btnn"
                      onClick={() => {
                        setCantScan(true);
                      }}
                    >
                      I can't scan
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200  sm:w-auto btnn"
                      onClick={() => {
                        setIsEnteringPin(true);
                      }}
                    >
                      Next Step
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <h3 className="bigger-text">Please re-enter your password</h3>

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
                    Password
                  </label>
                  <input
                    type="password"
                    autoComplete="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
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
                )}{" "}
                <br />
                <button
                  type="submit"
                  className={`px-4 py-2 font-medium rounded-lg ${
                    isDarkMode
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-green-700 hover:bg-green-800"
                  } text-white transition duration-300`}
                >
                  Sign In
                </button>
              </form>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ReauthenticateForm;
