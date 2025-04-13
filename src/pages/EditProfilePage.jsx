import { Navigate, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { useAuth } from "../contexts/authContext";
import SettingSection from "../components/settings/SettingSection";
import { Dice1, User, UserRoundPen } from "lucide-react";
import { useEffect, useState } from "react";
import Avatar from "react-avatar-edit";
import { db, storage } from "../firebase/firebase"; // Import your Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase storage functions
import { doc, updateDoc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import animation from "../assets/animation/loadingcubes.json";
import { useDarkMode } from "../contexts/darkModeContext"; // Import dark mode context
import PhoneInput from "react-phone-number-input";

function base64ToBlob(base64) {
  const [metadata, base64String] = base64.split(",");
  const mime = metadata.match(/:(.*?);/)[1];
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mime });
}

const EditProfilePage = () => {
  const [preview, setPreview] = useState(null);
  const [src, setSrc] = useState("");
  const [changingPic, setChangingPic] = useState(false);
  const [userPic, setUserPic] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [organization, setOrganization] = useState("");
  const [practiceNumber, setPracticeNumber] = useState("");
  const { isDarkMode } = useDarkMode(); // Access dark mode state
  const navigate = useNavigate();

  const { userLoggedIn, currentUser } = useAuth();

  const backgroundColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  const getProfile = async () => {
    setLoading(true);
    setLoading3(true);

    try {
      const docSnap = await getDoc(doc(db, "users", currentUser.uid));
      const user = docSnap.data();
      localStorage.setItem("medvault_passport_profile", JSON.stringify(user))
      setUserPic(user.profilePic);
      setTitle(user.title);
      setFullName(user.fullName);
      setGender(user.gender);
      setOrganization(user.organization);
      setPracticeNumber(user.practiceNumber);
      setEmail(user.email);
      setPhone(user.phone);
      setBloodType(user.bloodType);
    } catch (e) {
      console.log(e);
      toast.error(e.code);
    } finally {
      setLoading(false);
      setLoading3(false);
    }
  };

  useEffect(() => {
    if(!JSON.parse(localStorage.getItem("medvault_passport_profile"))){
    getProfile();
    console.log("i got from firebase");
    }else{
      const user = JSON.parse(localStorage.getItem("medvault_passport_profile"));
      console.log(user);
      console.log("got from local storage")
      setUserPic(user.profilePic);
      setTitle(user.title);
      setFullName(user.fullName);
      setGender(user.gender);
      setOrganization(user.organization);
      setPracticeNumber(user.practiceNumber);
      setEmail(user.email);
      setPhone(user.phone);
      setBloodType(user.bloodType);
    }
  }, []);

  const onClose = () => {
    setPreview(null);
  };

  const onCrop = (preview) => {
    setPreview(preview);
  };

  const onBeforeFileLoad = (elem) => {
    console.log(elem.target.files[0]);
    // if (elem.target.files[0].size > 71680) {
    // 	alert("File is too big!");
    // 	elem.target.value = "";
    // };
  };

  const uploadFile = async () => {
    setLoading2(true);
    const uid = currentUser.uid;
    console.log(uid);
    const blob = base64ToBlob(preview);
    // Get the MIME type from the Blob
    const mimeType = blob.type;
    // Determine the file extension from the MIME type
    const extension = mimeType.split("/")[1]; // e.g., 'png', 'jpeg'
    // Append the extension to the file name
    const fileNameWithExtension = `profile.${extension}`;
    const storageRef = ref(
      storage,
      `profile-pics/${uid}/${fileNameWithExtension}`
    ); // Use the file name with extension
    try {
      // Upload the Blob to Firebase Storage
      await uploadBytes(storageRef, blob);
      console.log("Upload successful");
      const downloadURL = await getDownloadURL(storageRef);
      setUserPic(downloadURL);
      await updateDoc(doc(db, "users", uid), {
        profilePic: downloadURL,
      });

      const userObj = {
        email,
        title,
        fullName,
        gender,
        phone,
        bloodType,
        profilePic: userPic,
      };
      const prevObj = JSON.parse(localStorage.getItem("currentuser"));
      const prevObj2 = JSON.parse(localStorage.getItem("medvault_passport_profile"));

      localStorage.setItem("currentUser", JSON.stringify({
        ...prevObj,
        ...userObj,
      }));
      localStorage.setItem("medvault_passport_profile", JSON.stringify({
        ...prevObj2,
        ...userObj,
      }));


      setChangingPic(false);
      setPreview(null);
      navigate("/settings")

    } catch (error) {
      console.error("Upload failed", error);
      toast.error(error.code);
    } finally {
      setLoading2(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading3(true);
    try {
      const userObj = {
        email,
        title,
        fullName,
        gender,
        phone,
        bloodType,
        profilePic: userPic,
      };
      await updateDoc(doc(db, "users", currentUser.uid), userObj);
      const prevObj = JSON.parse(localStorage.getItem("currentuser"));
      const prevObj2 = JSON.parse(localStorage.getItem("medvault_passport_profile"));

      localStorage.setItem("currentUser", JSON.stringify({
        ...prevObj,
        ...userObj,
      }));
      localStorage.setItem("medvault_passport_profile", JSON.stringify({
        ...prevObj2,
        ...userObj,
      }));
    } catch (e) {
      toast.error(e.code);
      console.log(e);
    } finally {
      setLoading3(false);
      navigate("/settings");
    }
  };

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${backgroundColor}`}>
      {!userLoggedIn ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <>
          <Header
            title="Edit Profile"
            icon={<UserRoundPen className="mr-2" color="#56BB6E" />}
          />
          <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
            <SettingSection icon={User} title={"Profile Picture"}>
              {loading ? (
                <div className="u-center-hrz">
                  <Lottie
                    animationData={animation}
                    style={{ width: "500px" }}
                  />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center mb-6 center-hrz--col">
                  <img
                    src={userPic}
                    alt="Profile"
                    className="rounded-full  object-cover mr-4 mb-5"
                    style={{ width: "200px" }}
                  />
                  {changingPic ? null : (
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 sm:w-auto mr-5"
                      onClick={() => {
                        setChangingPic(true);
                      }}
                    >
                      Change Profile Picture
                    </button>
                  )}
                </div>
              )}
            </SettingSection>
            {loading2 ? (
              <div className="u-center-hrz">
                <Lottie animationData={animation} style={{ width: "500px" }} />
              </div>
            ) : changingPic ? (
              <SettingSection icon={User} title={"Choose Profile Picture"}>
                <button
                  className="u-margin-bottom bg-red-600 hover:bg-red-700 text-white  py-2 px-4 rounded transition duration-200 w-full sm:w-auto mr-5"
                  onClick={() => {
                    setChangingPic(false);
                    setPreview(null);
                  }}
                >
                  Cancel
                </button>

                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div className="mr-10">
                    <Avatar
                      width={300}
                      height={300}
                      onCrop={onCrop}
                      onClose={onClose}
                      onBeforeFileLoad={onBeforeFileLoad}
                      mimeTypes="image/png, image/jpeg"
                      src=""
                    />
                  </div>

                  <div
                    style={{
                      width: "300px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "black",
                        }}
                      ></div>
                    )}
                  </div>
                </div>
                <div className="u-center-hrz">
                  <button
                    className="u-margin-bottom u-margin-top bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 sm:w-auto mr-5"
                    onClick={uploadFile}
                  >
                    Change Profile Picture
                  </button>
                </div>
              </SettingSection>
            ) : null}
            <SettingSection icon={User} title={"Change Personal Information"}>
              {loading3 ? (
                <div className="u-center-hrz">
                  <Lottie
                    animationData={animation}
                    style={{ width: "500px" }}
                  />
                </div>
              ) : (
                <>
                  <form
                    onSubmit={onSubmit}
                    className={`space-y-4 white-text ${textColor}`}
                    style={{ width: "90%" }}
                  >
                    <div>
                      <label className={`text-sm  ${textColor}`}>Title</label>
                      <input
                        type="text"
                        autoComplete="title"
                        required
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                        className={`w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300 ${textColor}`}
                      />
                    </div>
                    <div>
                      <label className={`text-sm  ${textColor}`}>
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
                        className={`w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300 ${textColor}`}
                      />
                    </div>
                    <div>
                      <label className={`text-sm  ${textColor}`}>Gender</label>
                      <select
                        required
                        value={gender}
                        onChange={(e) => {
                          setGender(e.target.value);
                        }}
                        className={`w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300 ${textColor}`}
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
                      <label className={`${textColor} text-sm `}>
                        Blood Type (Skip if unknown)
                      </label>
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
                        <option value="unknown" className="black-text">
                          Unknown
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
                      <label className={`text-sm  ${textColor}`}>
                        Phone Number
                      </label>
                      <PhoneInput
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={setPhone}
                        required
                      />
                    </div>

                    <div>
                      <label className={`text-sm  ${textColor}`}>Email</label>
                      <input
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        className={`w-full mt-2 px-3 py-2 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300 ${textColor}`}
                      />
                    </div>

                    <button className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200 sm:w-auto mr-5">
                      Change Profile Details
                    </button>
                  </form>
                </>
              )}
            </SettingSection>
          </main>
        </>
      )}
    </div>
  );
};
export default EditProfilePage;
