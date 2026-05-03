import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Library ikon (opsional)

const DashboardLayout = ({ children }) => {
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
        <h2 className="text-xl font-bold text-orange-500 mb-10">SP CVT BEAT</h2>
        <nav className="space-y-4">
          <a href="#" className="block hover:text-orange-400">Dashboard</a>
          <a href="#" className="block hover:text-orange-400">Mulai Diagnosa</a>
          <div className="pt-4 text-gray-500 text-sm">USER</div>
          <a href="#" className="block hover:text-orange-400">Riwayat</a>
          <a href="#" className="block text-red-400">Logout</a>
        </nav>
      </div>

      {/* Overlay: Klik di luar menu untuk menutup di HP */}
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