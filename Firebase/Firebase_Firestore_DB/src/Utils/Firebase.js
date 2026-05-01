// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBq4QBab9BalENOKo7xk9e-Q6QwnL_PZHU",
    authDomain: "fir-react-demo-7b42e.firebaseapp.com",
    projectId: "fir-react-demo-7b42e",
    storageBucket: "fir-react-demo-7b42e.firebasestorage.app",
    messagingSenderId: "743688013",
    appId: "1:743688013:web:f39c140a92ac1786289904",
    measurementId: "G-TZYP93ZS6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const realTimeDb = getDatabase(app); 

export default app;