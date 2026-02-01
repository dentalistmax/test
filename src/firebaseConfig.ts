// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcDV8lZW1sjNzvewosmnCElOD_kb5VaGI",
  authDomain: "DentlistMax-web.firebaseapp.com",
  projectId: "DentlistMax-web",
  storageBucket: "DentlistMax-web.firebasestorage.app",
  messagingSenderId: "554374262613",
  appId: "1:554374262613:web:e2321b3e6439bfc2e609dc",
  measurementId: "G-WR27S5HMNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);