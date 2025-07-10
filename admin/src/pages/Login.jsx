import React from "react";
import { auth, googleProvider, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("❌ Access Denied: Your account has no role assigned.");
        return;
      }

      const userData = userSnap.data();

      if (userData.role === "admin") {
        alert("✅ Welcome, Admin!");
        navigate("/dashboard");
      } else {
        alert("❌ Access Denied: You are not an admin.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>🛠️ Admin Panel Login</h2>
        <p>Sign in with your authorized Google account to access the admin dashboard.</p>
        <button className="google-login-btn" onClick={handleLogin}>
          🔐 Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
