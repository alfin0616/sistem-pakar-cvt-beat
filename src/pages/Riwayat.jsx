import React, { useState, useEffect } from 'react';

const Riwayat = () => {
  const [dataRiwayat, setDataRiwayat] = useState([]);

  useEffect(() => {
    // Ambil data dari localStorage saat halaman dibuka
    const data = JSON.parse(localStorage.getItem('riwayat_diagnosa')) || [];
    setDataRiwayat(data);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Riwayat Diagnosa</h1>
      
      {dataRiwayat.length === 0 ? (
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 italic">Belum ada data riwayat diagnosa.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">Tanggal</th>
                <th className="p-3 border-b">Hasil Kerusakan</th>
                <th className="p-3 border-b">Keyakinan</th>
              </tr>
            </thead>
            <tbody>
              {dataRiwayat.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b text-sm">{item.tanggal}</td>
                  <td className="p-3 border-b font-medium">{item.kerusakan}</td>
                  <td className="p-3 border-b">{item.yakin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Riwayat;