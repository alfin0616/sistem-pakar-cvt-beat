import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom'; // Gunakan Link agar navigasi lebih cepat

// 1. Tambahkan { children, onLogout, role } di sini
const Layout = ({ children, onLogout, role }) => { 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Tombol Hamburger untuk HP */}
      <button 
        className="fixed top-4 left-4 z-[60] md:hidden p-2 bg-orange-500 text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] text-white p-5 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0
      `}>
        <h2 className="text-xl font-bold text-orange-500 mb-10 text-center">SP CVT BEAT</h2>
        
        <nav className="space-y-4">
          {/* Gunakan Link to="..." agar halaman tidak reload saat diklik */}
          <Link to="/dashboard" className="block hover:text-orange-400">Dashboard</Link>
          <Link to="/diagnosa" className="block hover:text-orange-400">Mulai Diagnosa</Link>
          
          {/* 2. Menu khusus Admin (muncul jika role adalah admin) */}
          {role === 'admin' && (
            <>
              <div className="pt-4 text-gray-500 text-sm uppercase">Admin Panel</div>
              <Link to="/gejala" className="block hover:text-orange-400">Data Gejala</Link>
              <Link to="/kerusakan" className="block hover:text-orange-400">Data Kerusakan</Link>
              <Link to="/rule" className="block hover:text-orange-400">Basis Aturan</Link>
            </>
          )}

          <div className="pt-4 text-gray-500 text-sm uppercase">User</div>
          <Link to="/riwayat" className="block hover:text-orange-400">Riwayat</Link>
          
          {/* 3. Tambahkan fungsi onLogout pada tombol Logout */}
          <button 
            onClick={onLogout}
            className="block text-red-400 hover:text-red-300 w-full text-left mt-10 font-semibold"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Konten Utama */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;