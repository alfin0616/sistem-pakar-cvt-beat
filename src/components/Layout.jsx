import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Layout = ({ children, role, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutAction = () => {
    onLogout(); // Menghapus status login di App.jsx
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-slate-700 text-orange-500">
          SP CVT BEAT
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="block p-3 hover:bg-slate-700 rounded-lg">Dashboard</Link>
          <Link to="/diagnosa" className="block p-3 hover:bg-slate-700 rounded-lg">Mulai Diagnosa</Link>
          
          {/* Menu Khusus Admin */}
          {role === 'admin' && (
            <>
              <div className="pt-4 pb-2 text-xs font-bold text-slate-500 uppercase">Data Master</div>
              <Link to="/gejala" className="block p-3 hover:bg-slate-700 rounded-lg">Data Gejala</Link>
              <Link to="/kerusakan" className="block p-3 hover:bg-slate-700 rounded-lg">Data Kerusakan</Link>
              <Link to="/rule" className="block p-3 hover:bg-slate-700 rounded-lg">Basis Aturan</Link>
            </>
          )}

          <div className="pt-4 pb-2 text-xs font-bold text-slate-500 uppercase">User</div>
          <Link to="/riwayat" className="block p-3 hover:bg-slate-700 rounded-lg">Riwayat</Link>
          
          <button 
            onClick={handleLogoutAction}
            className="w-full text-left p-3 mt-10 text-red-400 hover:bg-red-900/20 rounded-lg font-bold"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;