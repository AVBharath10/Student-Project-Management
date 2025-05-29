import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCZGtY9Dz4Mf63T52f43V0v2TAUdSU0CZo",
  authDomain: "studo-981e4.firebaseapp.com",
  projectId: "studo-981e4",
  storageBucket: "studo-981e4.firebasestorage.app",
  messagingSenderId: "1098264299079",
  appId: "1:1098264299079:web:027adb2877559813241362",
  measurementId: "G-0CFHQHVMVJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);