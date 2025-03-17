import { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { User } from "lucide-react";
import Register from "../components/auth/register";
import { useDarkMode } from "../contexts/darkModeContext"; // Import dark mode context
import OnBoardingOld from "../components/auth/onboardingOld";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Lottie from "lottie-react";
import animation from "../assets/animation/loadingcubes.json";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext/index";
import OnBoardingNew from "../components/auth/onboardingNew";


const OnBoardingPage = () => {
  const { isDarkMode } = useDarkMode(); // Access dark mode state
  const [files, setFiles] = useState([]);
  const [predictedClass, setPredictedClass] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(true);
  const { userLoggedIn } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const {orgID} = useParams();
  const navigate = useNavigate()

  const textColor = isDarkMode ? "white-text" : "text-gray-900";

  const getLogo = async()=>{
    try{
      console.log(orgID)
      const docRef = await getDoc(doc(db, "orgs", orgID));
      if(docRef.exists()){
        const data = docRef.data()
        const logoURL = data.logo
        setLogo(logoURL);
        setLoading(false);
      }else{
        navigate("/")
      }
    
    }catch(e){
      console.log(e)
    }
  }
  useEffect(()=>{
    
    getLogo();
  }, [])

  return (
    <div
      className={`flex-1 overflow-auto relative z-10 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <Header
        title="On Boarding"
        icon={<User style={{ marginRight: "10px" }} />}
      />
      {
        loading ?
        <div className="u-center-hrz">
        <Lottie animationData={animation} style={{ width: "500px" }} />
      </div> :
      <>
      <div className="center-hrz u-margin-top u-margin-bottom">
        <img src={logo} alt="" style={{width: "200px"}}/>
      </div>
      <h2 className={`${textColor} center-text header-text`}>New Patient Form</h2>

      {
        userLoggedIn ? 
        <>
         <p className={`${textColor} center-text`}>You are registering as a patient under Windhoek Neurosurgical Centre, <br/> If this is not your Medvault account <span style={{color: "#56bb6e", cursor: "pointer"}} onClick={()=>{doSignOut();}}>SIGN OUT</span> and login with your account / create a new account.</p>
         <OnBoardingOld orgID={orgID}/>
        </> : 
        <>
        {
          !isRegistering ?
         <p className={`${textColor} center-text`}>You are creating a new Medvault account, <br/> if you already have one, please <span style={{color: "#56bb6e", cursor: "pointer"}} onClick={()=>{
          doSignOut();
          localStorage.setItem("redirectToOnboarding", "true");
          localStorage.setItem("onboardingOrgID", orgID)
          navigate("/login");
        }}>LOGIN</span>.</p> : null
        }
         <OnBoardingNew orgID={orgID} isRegistering2={setIsRegistering}/> 
         </>
 
      }
       
     

     
      </>
      }
      
    </div>
  );
};

export default OnBoardingPage;
