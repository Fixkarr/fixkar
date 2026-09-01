import {initializeApp } from 'firebase/app';
import {getMessaging } from 'firebase/messaging';
import {getAuth, setPersistence, browserLocalPersistence , GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification , signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fixkar-dev.firebaseapp.com",
  projectId: "fixkar-dev",
  storageBucket: "fixkar-dev.firebasestorage.app",
  messagingSenderId: "229725846095",
  appId: "1:229725846095:web:65fc4a8495ec043835083a",
  measurementId: "G-1Z7FKM2JDR"
}

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
setPersistence(auth, browserLocalPersistence);

export const messaging = getMessaging(app);
export {auth, provider, signInWithPopup, signOut, createUserWithEmailAndPassword, sendEmailVerification };