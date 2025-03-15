import { useContext, useEffect, useState, React, createContext } from "react";
import {auth, db} from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Lottie from "lottie-react";
import animation from "../../assets/animation/loadingcubes.json"
import { ReactComponent as Logo } from "../../assets/svg/logowhite.svg";
import { doc, getDoc } from "firebase/firestore";
const AuthContext = createContext();

export const useAuth = ()=> useContext(AuthContext);

const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    //empty dependency useEffect so you can set up a listener to auth state change
    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, initializeUser) //this will automatically pass user info into the callback function
    }, []);

    const getUserObj = async(uid)=>{
        try{
            const docSnap = await getDoc(doc(db, "users", uid));
            console.log(docSnap.data())
            localStorage.setItem("currentUser", JSON.stringify(docSnap.data()));
        }catch(e){
            console.log(e)
        }
    }

    const initializeUser = async(user)=>{
        console.log(user)
        if(user){
            getUserObj(user.uid)
            setCurrentUser({...user});
            setUserLoggedIn(true);
        }else{
            setCurrentUser(null);
            setUserLoggedIn(false);
            localStorage.setItem("currentUser", JSON.stringify(null))
        }
        setLoading(false);
    }

    const value = {
        currentUser,
        userLoggedIn,
        loading
    }

    return ( 
        <AuthContext.Provider value={value}>
            {loading ?
            <div style={{backgroundColor: "#11181D", width: "100vw", height: "100vh", display: "flex", flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
            <Logo style={{width: "300px"}}/>
            <Lottie animationData={animation} style={{ width: "200px" }} />
            </div>
            :children}
        </AuthContext.Provider>
     );
}
 
export default AuthProvider;