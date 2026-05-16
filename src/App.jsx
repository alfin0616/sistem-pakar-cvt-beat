import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from "react"; // Tambahkan useEffect
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
  // Ambil data awal dari localStorage jika ada
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isChecking, setIsChecking] = useState(true); // State untuk loading pengecekan

  // ==========================================
  // FITUR ANTI-REFRESH: Cek session saat dimuat
  // ==========================================
  useEffect(() => {
    const statusLogin = localStorage.getItem('isLoggedIn');
    const savedRole = localStorage.getItem('userRole');

    if (statusLogin === 'true' && savedRole) {
      setIsLoggedIn(true);
      setUserRole(savedRole);
    }
    setIsChecking(false); // Selesai mengecek
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    // Simpan ke storage saat login berhasil
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    // Hapus storage saat logout
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  };

  // Jangan render apa pun sebelum selesai mengecek storage
  if (isChecking) return null;

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
                <Route path="/" element={<Navigate to="/dashboard" />} />
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
}

export default App;