// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZ6bkcpmScffQKCxLG0Z-x6MKIsbqm8i0",
    authDomain: "rs-pathlab.firebaseapp.com",
    projectId: "rs-pathlab",
    storageBucket: "rs-pathlab.firebasestorage.app",
    messagingSenderId: "54109608724",
    appId: "1:54109608724:web:2c123731a425531b754001",
    measurementId: "G-9L58VQK3PM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, RecaptchaVerifier, signInWithPhoneNumber };
