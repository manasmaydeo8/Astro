// src/Components/Register.js
import React, { useState } from "react";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // ✅ FIXED IMPORT
import "./Auth.css";

const firebaseConfig = {
  apiKey: "AIzaSyDtanw9URU2cVWqGpAG32vgab2eXrCIZ3Q",
  authDomain: "astrolens-f1a07.firebaseapp.com",
  projectId: "astrolens-f1a07",
  storageBucket: "astrolens-f1a07.firebasestorage.app",
  messagingSenderId: "895279882591",
  appId: "1:895279882591:web:72a72f7def3c76aff616ea",
  measurementId: "G-397Q1WJNC3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [zodiacSign, setZodiacSign] = useState("");
  const navigate = useNavigate(); // ✅ Now defined properly

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = { name, email, password, birthDate, zodiacSign };
    try {
      const res = await axios.post(
        "http://127.0.0.1:3001/api/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("user", JSON.stringify(res.data.user || formData));
      navigate("/dashboard");
    } catch (error) {
      alert("❌ Registration failed. Check console.");
      console.error(error);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await axios.post(
        "http://127.0.0.1:3001/api/auth/google-login",
        { token: idToken },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", idToken);
      localStorage.setItem("user", JSON.stringify(res.data.user || user));
      navigate("/dashboard");
    } catch (error) {
      alert("❌ Google Sign-In failed.");
      console.error(error);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleRegister} className="auth-form">
        <h2>Register</h2>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="date" placeholder="Birth Date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        <input type="text" placeholder="Zodiac Sign" value={zodiacSign} onChange={(e) => setZodiacSign(e.target.value)} />
        <button type="submit">Register</button>
        <div className="divider">or</div>
        <button type="button" className="google-btn" onClick={handleGoogleRegister}>
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: "18px", marginRight: "8px" }} />
          Continue with Google
        </button>
      </form>
    </div>
  );
}

export default Register;
