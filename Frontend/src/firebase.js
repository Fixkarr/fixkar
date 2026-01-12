import {initializeApp } from 'firebase/app';
import {getMessaging } from 'firebase/messaging';
import {getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification , signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
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

export const messaging = getMessaging(app);
export {auth, provider, signInWithPopup, signOut, createUserWithEmailAndPassword, sendEmailVerification };