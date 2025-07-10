// firebase.js or firebase.jsx

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "ite-site-8df0a.firebaseapp.com",
  projectId: "ite-site-8df0a",
  storageBucket: "ite-site-8df0a.firebasestorage.app",
  messagingSenderId: "338688141895",
  appId: "1:338688141895:web:3d5ef40de89b9eb66a5f62",
  measurementId: "G-8QMGDN0LSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, analytics };
export const db = getFirestore(app);
