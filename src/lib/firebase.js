// NOTE: import only the Firebase modules that you need in your app.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase.
// These details will need to be replaced with the project specific env vars at the start of each new cohort.
const firebaseConfig = {
  apiKey: "AIzaSyDVqB8ngR5YlYY2VQhWCrPfvORMTHz3ddA",
  authDomain: "tcl-36-smart-shopping-list.firebaseapp.com",
  projectId: "tcl-36-smart-shopping-list",
  storageBucket: "tcl-36-smart-shopping-list.appspot.com",
  messagingSenderId: "423140826190",
  appId: "1:423140826190:web:13a659310e2c8b80eab71f"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
