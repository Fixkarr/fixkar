import {initializeApp } from 'firebase/app';
import {getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification , signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
      apiKey: "AIzaSyA6UvlFZtuNIR_ciOc_JoiGSGLZtbeqins",
  authDomain: "fixkar-62c40.firebaseapp.com",
  projectId: "fixkar-62c40",
  storageBucket: "fixkar-62c40.firebasestorage.app",
  messagingSenderId: "797851996951",
  appId: "1:797851996951:web:b4f30d322684ed82191d52",
  measurementId: "G-FSS54SSSK2"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export {auth, provider, signInWithPopup, signOut, createUserWithEmailAndPassword, sendEmailVerification };