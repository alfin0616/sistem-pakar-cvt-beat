import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Visual Singkat */}
        <div className="h-32 bg-slate-800 flex items-center justify-center">
           <h2 className="text-2xl font-black text-white uppercase tracking-widest">
             Daftar <span className="text-orange-500">Akun</span>
           </h2>
        </div>

        <div className="p-8">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/login'); }}>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nama Lengkap</label>
              <input type="text" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nama Anda" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Username</label>
              <input type="text" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="User123" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Password</label>
              <input type="password" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="••••••••" />
            </div>
            
            <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-black shadow-lg hover:bg-orange-700 transition-all mt-4">
              REGISTRASI
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-slate-600">
            Sudah punya akun? <span onClick={() => navigate('/login')} className="text-orange-600 font-bold cursor-pointer hover:underline">Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;