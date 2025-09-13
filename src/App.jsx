import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoogleLoginButton from "./pages/login.jsx";
import HomePage from "./pages/homePage.jsx"; 
import ProtectedRoute from "./component/protectRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleLoginButton />} />    
        <Route path="/home" element=
        {<ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
