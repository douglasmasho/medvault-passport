import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyDnPJyg5N5aCX4APLhe4S0EVF8st3UlqGY",
  authDomain: "medvaultapp.firebaseapp.com",
  projectId: "medvaultapp",
  storageBucket: "medvaultapp.firebasestorage.app",
  messagingSenderId: "275707259877",
  appId: "1:275707259877:web:6f134364bb3289df849d0c",
  measurementId: "G-4ZGGMTT51D"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { app, auth, db, storage };