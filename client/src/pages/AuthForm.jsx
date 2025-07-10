import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import {
  setDoc,
  getDoc,
  doc
} from 'firebase/firestore';

import './AuthForm.css';

const AuthForm = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');

  const handleToggle = () => {
    setIsSignUp(prev => !prev);
    setError('');
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const redirectAfterAuth = () => {
    const redirect = localStorage.getItem('redirectAfterLogin');
    navigate(redirect ? redirect : '/');
    localStorage.removeItem('redirectAfterLogin');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

        await updateProfile(userCredential.user, {
          displayName: form.username
        });

        // Store user in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: form.username,
          role: 'user',
          createdAt: new Date().toISOString()
        });

        alert('Signed Up successfully!');
        setIsSignUp(false);
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
        alert('Signed In successfully!');
        redirectAfterAuth();
      }
    } catch (err) {
      console.error('Firebase Auth Error:', err.code, err.message);
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }

      alert("Signed in with Google successfully!");
      redirectAfterAuth();
    } catch (err) {
      console.error('Google Auth Error:', err.code, err.message);
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <img src="/img/login-page.png" alt="Welcome" />
      </div>

      <div className="auth-right">
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isSignUp ? 'Create Account' : 'Login'}</button>
          {error && <p className="error">{error}</p>}
        </form>

        <button className="google-btn" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>

        <p onClick={handleToggle} className="toggle">
          {isSignUp
            ? 'Already have an account? Sign In'
            : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
