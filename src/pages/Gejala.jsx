import React, { useState } from 'react';

const Gejala = () => {
  const [listGejala, setListGejala] = useState([
    { id: 'G1', nama: 'Tarikan motor terasa berat' },
    { id: 'G2', nama: 'Muncul getaran saat berjalan' },
    { id: 'G3', nama: 'Suara berisik pada CVT' },
    { id: 'G4', nama: 'Akselerasi lambat' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', nama: '' });
  const [isEdit, setIsEdit] = useState(false);

  const openModal = (data = null) => {
    if (data) {
      setIsEdit(true);
      setFormData(data);
    } else {
      setIsEdit(false);
      setFormData({ id: `G${listGejala.length + 1}`, nama: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEdit) {
      setListGejala(listGejala.map(g => g.id === formData.id ? formData : g));
    } else {
      setListGejala([...listGejala, formData]);
    }
    setIsModalOpen(false);
  };

  const handleHapus = (id) => {
    if (window.confirm(`Hapus gejala ${id}?`)) {
      setListGejala(listGejala.filter(g => g.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Data Gejala</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700 transition">+ Tambah Gejala</button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-100 text-slate-600 uppercase text-xs font-bold">
              <th className="p-4 border-b">Kode</th>
              <th className="p-4 border-b">Nama Gejala</th>
              <th className="p-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {listGejala.map((g) => (
              <tr key={g.id} className="hover:bg-slate-50 border-b border-slate-100 transition">
                <td className="p-4 font-bold text-blue-600">{g.id}</td>
                <td className="p-4 text-slate-700">{g.nama}</td>
                <td className="p-4 flex justify-center space-x-2">
                  <button onClick={() => openModal(g)} className="p-2 bg-yellow-400 rounded-lg text-white hover:bg-yellow-500 transition">✏️</button>
                  <button onClick={() => handleHapus(g.id)} className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 text-white font-bold text-lg">{isEdit ? "Edit Gejala" : "Tambah Gejala Baru"}</div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kode Gejala</label>
                <input type="text" disabled value={formData.id} className="w-full p-2 bg-slate-100 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Gejala</label>
                <input type="text" required value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Masukkan nama gejala..." />
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-200 py-2 rounded-lg font-bold hover:bg-slate-300 transition">Batal</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gejala;