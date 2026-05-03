import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Gejala from "./pages/Gejala";
import Kerusakan from "./pages/Kerusakan";
import Rule from "./pages/Rule";
import Diagnosa from "./pages/Diagnosa";
import Riwayat from "./pages/Riwayat";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  // State untuk mengecek apakah admin sudah login atau belum
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Fungsi sederhana untuk handle login
  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  // Fungsi Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
        />
        <Route path="/*" element={
          isLoggedIn ? (
            <Layout role={userRole} onLogout={handleLogout}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/diagnosa" element={<Diagnosa />} />
                <Route path="/riwayat" element={<Riwayat />} />
                
                {userRole === 'admin' && (
                  <>
                    <Route path="/gejala" element={<Gejala />} />
                    <Route path="/kerusakan" element={<Kerusakan />} />
                    <Route path="/rule" element={<Rule />} />
                  </>
                )}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
} // Penutup fungsi App yang benar

export default App;