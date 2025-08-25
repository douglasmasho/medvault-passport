import { useEffect, useState } from "react";
import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { doSignOut } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import { db } from "../../firebase/firebase";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingcubes.json";
import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context
import { safeGetFromStorage, safeSetToStorage, hasValidStorageValue } from "../../utils/localStorage";

const Profile = () => {
  const navigate = useNavigate();
  const [userPic, setUserPic] = useState("");
  const { currentUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pid, setPid] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);

  const { isDarkMode } = useDarkMode(); // Use dark mode context

  // Set dynamic colors based on the mode
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const subTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const whiteTextColor = isDarkMode ? "text-white" : "text-black";
  const backgroundColor = isDarkMode ? "bg-gray-800" : "bg-white";

  const getProfileDetails = async () => {
    setLoading(true);
    try {
      const docRef = await getDoc(doc(db, "users", currentUser.uid));
      console.log(docRef);
      const user = docRef.data();
      safeSetToStorage("medvault_passport_profile", user)
      setUserPic(user.profilePic);
      setFullName(user.fullName);
      setEmail(user.email);
      setTitle(user.title);
      setPhone(user.phone);
      setPid(user.uid);
      setBloodType(user.bloodType)
    } catch (e) {
      toast.error(e.code);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!hasValidStorageValue("medvault_passport_profile")){
      console.log(currentUser)
      getProfileDetails();
      console.log("I got from firebase")
    }else{
      const user = safeGetFromStorage("medvault_passport_profile", {});
      console.log(user);
      console.log("got from local storage")
      setUserPic(user.profilePic || "");
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setPid(user.uid || "");
      setBloodType(user.bloodType || "");
      setTitle(user.title || "");
    }
  }, []);

  const signOut = async () => {
    try {
      await doSignOut();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SettingSection icon={User} title={"Personal Info"}>
      {loading ? (
        <div className="u-center-hrz">
          <Lottie animationData={animation} style={{ width: "500px" }} />
        </div>
      ) : (
        <>
          <div className={`flex flex-col sm:flex-row items-center mb-6`}>
            <img
              src={userPic}
              alt="Profile"
              className="rounded-full w-20 h-20 object-cover mr-4"
            />
            <div>
              <h3 className={`text-lg  ${textColor}`}>
                {title} {fullName}
              </h3>
              <p className={subTextColor}>{email}</p>
            </div>
          </div>
          <div className="mb-6">
            <p className={subTextColor}>Phone Number: {phone}</p>
            <p className={subTextColor}>Patient ID: {pid}</p>
            <p className={subTextColor}>Blood Type: {bloodType}</p>
          </div>

          <div className="center-hrz--col--on-phone">
            <button
              className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 sm:w-auto btnn"
              onClick={signOut}
            >
              Sign Out
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 sm:w-auto btnn"
              onClick={() => {
                navigate("/editprofile");
              }}
            >
              Edit Profile
            </button>
          </div>
        </>
      )}
    </SettingSection>
  );
};

export default Profile;
