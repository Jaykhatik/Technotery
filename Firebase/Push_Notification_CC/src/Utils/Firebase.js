// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from 'firebase/messaging';
const firebaseConfig = {
    apiKey: "AIzaSyDJzD_8vUtmZXrG_HdQc-Atev87Exw4Qu8",
    authDomain: "push-notification-2c01a.firebaseapp.com",
    projectId: "push-notification-2c01a",
    storageBucket: "push-notification-2c01a.firebasestorage.app",
    messagingSenderId: "571979770132",
    appId: "1:571979770132:web:e92a1aae0560d0da333a01",
    measurementId: "G-NDFYQT4LEM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const messaging = getMessaging(app);

export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    console.log(permission);

    if (permission === "granted") {
        const token = await getToken(messaging, {
            vapidKey: "BBzUDXlTl7vQy_-saaVCBnavWlEnukW_9DbSqHJECEl2RCYXschi3Rjfg8NvH8yryjMJFGAgdVK_9rBsl0cIsM0",
        });
        console.log(token);

    }
}
