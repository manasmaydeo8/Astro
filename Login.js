// src/Components/Login.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Auth.css";

// 🔹 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtanw9URU2cVWqGpAG32vgab2eXrCIZ3Q",
  authDomain: "astrolens-f1a07.firebaseapp.com",
  projectId: "astrolens-f1a07",
  storageBucket: "astrolens-f1a07.firebasestorage.app",
  messagingSenderId: "895279882591",
  appId: "1:895279882591:web:72a72f7def3c76aff616ea",
  measurementId: "G-397Q1WJNC3"
};

// 🔹 Firebase Setup
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Login() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 Email Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/api/auth/login", form);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.msg || "Login failed");
    }
  };

  // 🔹 Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Optional: Send token to backend for verification
      await API.post("/api/auth/google-login", { token: idToken });

      localStorage.setItem("token", idToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        })
      );
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google Sign-In failed. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{t("auth.login")}</h2>
        {error && <div className="error">{error}</div>}
        <input
          name="email"
          placeholder={t("auth.email")}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder={t("auth.password")}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <div className="divider">or</div>
        <button type="button" className="google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={{ width: "18px", marginRight: "8px" }}
          />
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
