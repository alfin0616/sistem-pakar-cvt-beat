import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Data statistik (nanti bisa dihubungkan ke localStorage atau API)
  const stats = [
    { label: 'Total Gejala', value: '12', icon: '🔍', color: 'bg-blue-500' },
    { label: 'Total Kerusakan', value: '5', icon: '🛠️', color: 'bg-orange-500' },
    { label: 'Basis Aturan', value: '8', icon: '📜', color: 'bg-green-500' },
    { label: 'Riwayat Diagnosa', value: '24', icon: '📊', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Selamat Datang, Admin! 👋</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Sistem Pakar Diagnosa Kerusakan CVT Honda Beat.
          </p>
        </div>
        <div className="hidden md:block">
          <img 
            src="gambar_honda_beat.png" 
            alt="Honda Beat" 
            className="h-32 object-contain"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-8 rounded-2xl text-white shadow-xl">
          <h3 className="text-xl font-bold mb-4">Mulai Diagnosa Baru</h3>
          <p className="text-slate-300 mb-6">
            Lakukan pengecekan sistem transmisi secara cepat dengan input gejala yang dialami motor konsumen.
          </p>
          <Link 
            to="/diagnosa" 
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-orange-900/20"
          >
            Buka Panel Diagnosa →
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Info Pemeliharaan CVT</h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <span className="text-green-500 font-bold">✓</span>
              <p className="text-slate-600 text-sm">Pembersihan CVT idealnya dilakukan setiap 8.000 KM.</p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-green-500 font-bold">✓</span>
              <p className="text-slate-600 text-sm">Ganti V-Belt secara rutin setiap 24.000 KM.</p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-green-500 font-bold">✓</span>
              <p className="text-slate-600 text-sm">Cek kondisi roller dan slide piece jika tarikan terasa bergetar.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;