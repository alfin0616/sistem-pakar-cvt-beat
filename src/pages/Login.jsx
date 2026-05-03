import React from 'react';
import { useNavigate } from 'react-router-dom'; // Pastikan import ini ada

const Login = ({ onLogin }) => {
  // Pindahkan useNavigate ke DALAM komponen
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Logika sederhana: jika input username adalah 'admin', set role admin
    const username = e.target[0].value;
    const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';
    
    onLogin(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Bagian Atas: Gambar Motor Honda Beat Street */}
        <div className="relative h-64 bg-slate-800 flex flex-col justify-end p-6 overflow-hidden">
          <div 
            className="absolute inset-0 z-0 opacity-60 bg-cover bg-center"
            style={{ 
              // Gunakan path yang benar ke folder public
              backgroundImage: "url('/gambar_motor_beat.png')",
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
          ></div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>

          <div className="relative z-20">
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">
              Sistem Pakar <span className="text-orange-500">Diagnosa CVT</span>
            </h1>
            <p className="text-slate-300 text-sm font-semibold">Honda Beat Street</p>
          </div>
        </div>

        {/* Bagian Bawah: Form Login */}
        <div className="p-8 flex flex-col bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">LOGIN SISTEM</h2>
            <p className="text-slate-500 text-xs mt-1">Masukkan kredensial untuk akses diagnosa</p>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Username</label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-sm" 
                placeholder="Username" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Password</label>
              <input 
                type="password" 
                required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-sm" 
                placeholder="••••••••" 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-black shadow-lg hover:bg-orange-600 transition-all duration-300 mt-2"
            >
              LOG IN
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Belum punya akun? <span 
              onClick={() => navigate('/register')} 
              className="text-orange-600 font-bold cursor-pointer hover:underline"
            >
              Daftar Sekarang
            </span>
          </p>
          
          <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            © 2026 Bengkel Dua Saudara
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;