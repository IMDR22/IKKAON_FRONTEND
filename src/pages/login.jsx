import React, { useEffect } from "react";
import ikkaonLOGO from "../assets/ikkaonLOGO.png";
import "../style/login.css";
import { useNavigate } from "react-router-dom"; 
import { loginWithGoogle } from "../firebaseConfig.js"; 
import { BACKEND_API } from "../API.jsx"; 
import axios from "axios";

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home", { replace: true });
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle(); 
      const { token } = user;

      // Get profile from backend
      const res = await axios.get(`${BACKEND_API}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      const userData = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/home");

    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <div className="login_container">
      <img src={ikkaonLOGO} alt="IKKAON Logo" className="IKKAON_LOGO" />
      <button className="google_login_button" onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleLoginButton;
