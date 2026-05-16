import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  
  // STATE BARU: Untuk kontrol lihat/sembunyi password
  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // HANDLE LOGIN
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email.endsWith('@gmail.com')) {
      alert('Login gagal! Gunakan akun Gmail.');
      return;
    }

    let role = 'user';

    // LOGIN ADMIN
    if (email === 'alfinrs@gmail.com' && password === 'alfin123') {
      role = 'admin';
    }

    // SIMPAN SESSION (Agar tidak balik ke login saat refresh)
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);

    alert(`Login berhasil sebagai ${role}`);

    // Kirim role ke App.jsx
    onLogin(role);

    // Redirect ke dashboard/home
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* HEADER IMAGE */}
        <div className="relative h-64 bg-slate-800 flex flex-col justify-end p-6 overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-60 bg-cover bg-center"
            style={{
              backgroundImage: "url('/gambar_motor_beat.png')",
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
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

        {/* FORM LOGIN */}
        <div className="p-8 flex flex-col bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">LOGIN SISTEM</h2>
            <p className="text-slate-500 text-xs mt-1">Masukkan email dan password</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-sm"
                placeholder="@gmail.com"
              />
            </div>

            {/* PASSWORD DENGAN FITUR LIHAT PASSWORD */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // DINAMIS
                  name="password"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-sm"
                  placeholder="••••••••"
                />
                {/* Tombol Lihat Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? "SEMBUNYI" : "LIHAT"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-black shadow-lg hover:bg-orange-600 transition-all duration-300 mt-2"
            >
              LOG IN
            </button>
          </form>

          {/* REGISTER */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Belum punya akun?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-orange-600 font-bold cursor-pointer hover:underline"
            >
              Daftar Sekarang
            </span>
          </p>

          <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            © 2026 Alfin Rizqi Sujuda
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;