import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this line

const firebaseConfig = {
  apiKey: "AIzaSyCJ-1nsz0h_z5FWFLTb_L8nT7cfc17OUIg",
  authDomain: "ite-site-8df0a.firebaseapp.com",
  projectId: "ite-site-8df0a",
  storageBucket: "ite-site-8df0a.appspot.com", // ✅ FIXED: .app → .app**spot**.com
  messagingSenderId: "338688141895",
  appId: "1:338688141895:web:3d5ef40de89b9eb66a5f62",
  measurementId: "G-8QMGDN0LSP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Export this
