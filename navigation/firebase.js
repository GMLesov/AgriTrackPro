// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEj9pALeLIqENN6eWdkiBdUybeovtEx_8",
  authDomain: "agritrackpro.firebaseapp.com",
  projectId: "agritrackpro",
  storageBucket: "agritrackpro.firebasestorage.app",
  messagingSenderId: "647571831210",
  appId: "1:647571831210:web:1ab58757d607856b6693d3",
  measurementId: "G-0KJYCK939Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
