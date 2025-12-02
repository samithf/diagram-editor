// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCquL6de8Tmj7uMCFXs-wKQnRvfVvpDiOw",
  authDomain: "vdb-new.firebaseapp.com",
  projectId: "vdb-new",
  storageBucket: "vdb-new.firebasestorage.app",
  messagingSenderId: "519429857484",
  appId: "1:519429857484:web:27f3a6c51e2f5f55836269",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
