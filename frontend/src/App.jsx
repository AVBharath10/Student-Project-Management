// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Landing from "./Landing/Landing";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Dashboard from "./components/Dashboard/Dashboard";
import React, { useState, useEffect } from 'react';
import Projects from "./components/Dashboard/Projects/Projects";

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>; // Or a nice loading spinner
  }

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          // Add this to your routes
<Route path="/projects" element={<Projects />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;