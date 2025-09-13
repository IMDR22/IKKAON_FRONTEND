import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // User is not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }

  // User is logged in, render the protected component
  return children;
};

export default ProtectedRoute;
