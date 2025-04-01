//change 3
import { useEffect, useState } from "react";
import SettingSection from "./SettingSection";
import { MailCheck, MailX } from "lucide-react";
import ToggleSwitch2 from "./ToggleSwitch2";
import { useDarkMode } from "../../contexts/darkModeContext"; // Import dark mode context
import { motion } from "framer-motion";
import {doSendEmailVerification} from "../../firebase/auth"; // Import the function to send email verification
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingcubes.json";
import toast from "react-hot-toast";
//change 1
import { getAuth } from "firebase/auth";
const auth2 = getAuth();
//change 1


const EmailVerify = () => {
	const [notifications, setNotifications] = useState({
		push: true,
		email: false,
		sms: true,
	});
	const { isDarkMode, toggleDarkMode } = useDarkMode(); // Use dark mode context
	const [verified, setVerified] = useState(false); // State to track email verification status
	const [isSending, setIsSending] = useState(false); // State to track sending status
	const [isSent, setIsSent] = useState(false);
	
	useEffect(()=>{	
		setVerified(auth2.currentUser.emailVerified);
	},[])

	const handleSendVerification = async () => {
		try{
			setIsSending(true);
			const send = await doSendEmailVerification();
			toast.success("Verification email sent! Please check your inbox.");
			setIsSent(true);
		}catch(e){
			console.log(e)
			toast.error(e.code)
		}finally{
			setIsSending(false);
		}
		
	}

	return (
		<SettingSection icon={MailCheck} title={"Email Verification"}>
			{
				isSent ?
				<p className="text-sm text-gray-500">Verification email sent! Please check your inbox.</p> :
				!verified ?
				<div>
				<MailX size={24} color="#e34949" className="mr-3"/><span>Your email is not verified, this could block you from some features.</span> <br /> <br />
				{
					isSending ?
					<div className="flex justify-center items-center">
						<Lottie animationData={animation} loop={true} className="w-16 h-16" />
					</div> : 
					<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} className="bg-green-600 hover:bg-green-700 text-white  py-2 px-4 rounded transition duration-200  sm:w-auto btnn"
						onClick={handleSendVerification} disabled={isSending}>
						Send Verification Email
					</motion.button>
				}
				
				</div>
				 :
				<p>Your email is verified</p>

			}
		</SettingSection>
	);
};
export default EmailVerify;
