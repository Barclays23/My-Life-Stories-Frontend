import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// const functions = getFunctions(app);

export { auth, db, storage, signOut };


// ==================================================================


// import { initializeApp } from "firebase/app";

// import { 
//   getAuth, 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   signOut 
// } from 'firebase/auth';


// import {
//   getFirestore,
//   collection,
//   addDoc,
//   doc,
//   getDoc,
//   getDocs,
//   setDoc,
//   updateDoc,
//   deleteDoc,
// } from 'firebase/firestore';


// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';



// // FOR MY STORIES PROJECT
// const firebaseConfig = {
//   apiKey: "AIzaSyD-HthNv8YHP5T_mMChbnkAeZIIQysNxRM",
//   authDomain: "my-life-stories-23.firebaseapp.com",
//   projectId: "my-life-stories-23",
//   storageBucket: "my-life-stories-23.firebasestorage.app",
//   messagingSenderId: "346720107374",
//   appId: "1:346720107374:web:07bef588a02a0270aa9f7f"
// };



// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);



// export { 
//   auth, db, storage, 

//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   signOut, 
//   collection, 
//   ref, 
//   doc, 
//   addDoc, 
//   getDoc, 
//   getDocs, 
//   setDoc,
//   updateDoc, 
//   deleteDoc, 
//   uploadBytes, 
//   getDownloadURL 
// };