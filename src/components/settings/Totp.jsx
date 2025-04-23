import { useEffect, useState } from "react";
import SettingSection from "./SettingSection";
import { Trash2, Lock, CircleX } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import qrcode from "qrcode";
import {
  EmailAuthProvider,
  multiFactor,
  TotpMultiFactorGenerator,
  TotpSecret,
  getAuth,
  reauthenticateWithCredential,
} from "firebase/auth";
import { Modal } from "react-responsive-modal";
import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context
import { motion } from "framer-motion";
import ReauthenticateForm from "../forms/reauthenticateForm";
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingcubes.json";

const Totp = () => {
  const [twoFA, setTwoFa] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isDarkMode } = useDarkMode(); // Use dark mode context

  // Set dynamic colors based on the mode
  const backgroundColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const onOpenModal2 = () => setOpen2(true);
  const onCloseModal2 = () => setOpen2(false);

  const auth = getAuth();

  useEffect(() => {
    setTwoFa(multiFactor(auth.currentUser).enrolledFactors.length > 0);
  }, [multiFactor(auth.currentUser).enrolledFactors.length]);

  const enableTwoFa = () => {
    onOpenModal();
  };

  const disableTwoFa = async () => {
    try {
      setIsLoading(true);
      const mfaEnrollmentId = multiFactor(auth.currentUser).enrolledFactors[0];
      // Unenroll from TOTP MFA.
      await multiFactor(auth.currentUser).unenroll(mfaEnrollmentId.uid);
      setIsLoading(false);
      onCloseModal2();
    } catch (error) {
      console.log(error);
      if (error.code === "auth/user-token-expired") {
        // If the user was signed out, re-authenticate them.
        console.log("time to reauthenticate");
        // For example, if they signed in with a password, prompt them to
        // provide it again, then call `reauthenticateWithCredential()` as shown
        // below.
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(currentUser, credential);
      }
    }finally{
      setIsLoading(false);
    }
  };

  const toggleTwoFA = () => {
    if (!twoFA) {
      enableTwoFa();
    } else {
      onOpenModal2();
    }
  };

  const activateTotp = async () => {
    try {
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <SettingSection icon={Lock} title={"Security"}>
        {auth.currentUser.emailVerified ? (
          <ToggleSwitch
            label={"2 Factor Authentication"}
            isOn={twoFA}
            onToggle={toggleTwoFA}
            textColor={textColor}
          />
        ) : (
          <p>Please verify your email to use 2 factor authentication</p>
        )}
      </SettingSection>

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
        <ReauthenticateForm
          isDarkMode={isDarkMode}
          setTwoFa={setTwoFa}
          textColor={textColor}
          toggleModal={setOpen}
        />
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
        {isLoading ? (
          <div className="u-center-hrz">
            <Lottie animationData={animation} style={{ width: "500px" }} />
          </div>
        ) : (
          <>
            <h3 className="bigger-text">
              Are you sure you want to turn off 2 factor authentication?
            </h3>
            <div style={{ display: "flex" }} className="u-margin-top">
              <motion.button
                className="bg-red-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 w-full sm:w-auto mr-5"
                style={{ display: "flex", alignItems: "center" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  disableTwoFa();
                }}
              >
                <Trash2 className="mr-2" />
                Yes, Turn it off
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
          </>
        )}
      </Modal>
    </>
  );
};
export default Totp;
