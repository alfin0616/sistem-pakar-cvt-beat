import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Riwayat = () => {
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data langsung dari backend Django
  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/riwayat/');
        // Urutkan riwayat dari yang paling baru jika Django belum mengurutkannya
        setDataRiwayat(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data riwayat dari Django:", error);
        setLoading(false);
      }
    };
    fetchRiwayat();
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-500">Memuat data riwayat...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Riwayat Diagnosa</h1>
      
      {dataRiwayat.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow border border-slate-200">
          <p className="text-gray-500 italic text-center">Belum ada data riwayat diagnosa di database.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100">
                <tr className="text-slate-700 uppercase text-xs">
                  <th className="p-4 border-b">No</th>
                  <th className="p-4 border-b">Tanggal & Waktu</th>
                  <th className="p-4 border-b">Gejala yang Dialami</th>
                  <th className="p-4 border-b">Hasil Kerusakan</th>
                  <th className="p-4 border-b">Solusi Penanganan</th>
                </tr>
              </thead>
              <tbody>
                {dataRiwayat.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50 transition border-b last:border-none">
                    <td className="p-4 text-sm font-medium text-slate-600">{index + 1}</td>
                    <td className="p-4 text-sm text-slate-500">
                      {item.tanggal ? new Date(item.tanggal).toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="p-4 text-sm text-slate-700 max-w-xs truncate" title={item.gejala_dipilih}>
                      {item.gejala_dipilih}
                    </td>
                    <td className="p-4 font-bold text-blue-600">{item.nama_kerusakan}</td>
                    <td className="p-4 text-sm text-slate-600 max-w-sm">{item.solusi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Riwayat;