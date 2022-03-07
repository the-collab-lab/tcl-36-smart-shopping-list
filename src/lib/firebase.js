// NOTE: import only the Firebase modules that you need in your app.
import { initializeApp } from 'firebase/app';
import { getFirestore, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// Initialize Firebase.
// These details will need to be replaced with the project specific env vars at the start of each new cohort.
const firebaseConfig = {
  apiKey: 'AIzaSyAYwyfvPer1Z7KLemz8Xi7Z4wmFr_jgg9E',
  authDomain: 'smart-shopper-4c6e4.firebaseapp.com',
  projectId: 'smart-shopper-4c6e4',
  storageBucket: 'smart-shopper-4c6e4.appspot.com',
  messagingSenderId: '640903200234',
  appId: '1:640903200234:web:5483d6ec1e12b4f7ed0693',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();

// UPDATED this function to accommodate changes to multiple values on an item object
export const setUpdateToDb = async (collection, itemId, dataToUpdate) => {
  const itemRef = doc(db, collection, itemId);
  await updateDoc(itemRef, dataToUpdate);
};
//create a function to delete item from db
export const deleteItemFromDb = async (token, itemId) => {
  await deleteDoc(doc(db, token, itemId));
};
