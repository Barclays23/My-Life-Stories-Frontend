import { initializeApp } from "firebase/app";

import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';


import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';


import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


// FOR BROCAMP STORIES PROJECT
// const firebaseConfig = {
//   apiKey: "AIzaSyBsrOMpd8ZQqa91zg15SIgLsFsIaLorXI0",
//   authDomain: "brocamp-life-stories-40246.firebaseapp.com",
//   projectId: "brocamp-life-stories-40246",
//   storageBucket: "brocamp-life-stories-40246.firebasestorage.app",
//   messagingSenderId: "981226335243",
//   appId: "1:981226335243:web:81bb9def0f92ca25cbab0e"
// };


// FOR MY STORIES PROJECT
const firebaseConfig = {
  apiKey: "AIzaSyD-HthNv8YHP5T_mMChbnkAeZIIQysNxRM",
  authDomain: "my-life-stories-23.firebaseapp.com",
  projectId: "my-life-stories-23",
  storageBucket: "my-life-stories-23.firebasestorage.app",
  messagingSenderId: "346720107374",
  appId: "1:346720107374:web:07bef588a02a0270aa9f7f"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);



export { 
  auth, db, storage, 

  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  collection, 
  ref, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  uploadBytes, 
  getDownloadURL 
};