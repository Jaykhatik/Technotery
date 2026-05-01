// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmI5EfwCJ0GazW-5d7jlFSilmdFoDCgsc",
  authDomain: "authentication-react-7bbca.firebaseapp.com",
  projectId: "authentication-react-7bbca",
  storageBucket: "authentication-react-7bbca.firebasestorage.app",
  messagingSenderId: "109051838650",
  appId: "1:109051838650:web:e073a5f9d2cf7dc259c283",
  measurementId: "G-Z2S8HH13JW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const realTimeDb = getDatabase(app);
export const auth = getAuth(app);

export default app;