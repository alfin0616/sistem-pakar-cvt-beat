import React, { useState } from 'react';

const Rule = () => {
  const [listRule, setListRule] = useState([
    { id: 'R1', kerusakan: 'V-Belt aus (K1)', gejala: 'G1, G4, G6' },
    { id: 'R2', kerusakan: 'Roller aus (K2)', gejala: 'G2, G5' },
    { id: 'R3', kerusakan: 'Kampas ganda licin (K3)', gejala: 'G2, G3' },
  ]);

  // State untuk kontrol Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', kerusakan: '', gejala: '' });
  const [isEdit, setIsEdit] = useState(false);

  // Fungsi buka modal untuk Tambah
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({ id: `R${listRule.length + 1}`, kerusakan: '', gejala: '' });
    setIsModalOpen(true);
  };

  // Fungsi buka modal untuk Edit
  const openEditModal = (rule) => {
    setIsEdit(true);
    setFormData(rule);
    setIsModalOpen(true);
  };

  // Simpan Data (Tambah atau Edit)
  const handleSave = (e) => {
    e.preventDefault();
    if (isEdit) {
      setListRule(listRule.map(r => r.id === formData.id ? formData : r));
    } else {
      setListRule([...listRule, formData]);
    }
    setIsModalOpen(false);
  };

  const handleHapus = (id) => {
    if (window.confirm(`Hapus aturan ${id}?`)) {
      setListRule(listRule.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Basis Aturan (Rules)</h1>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-md">+ Tambah Aturan</button>
      </div>

      {/* Tabel Rule */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-100 text-slate-600 uppercase text-xs font-bold">
              <th className="p-4 border-b">ID</th>
              <th className="p-4 border-b">Hasil Kerusakan</th>
              <th className="p-4 border-b">Syarat Gejala</th>
              <th className="p-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {listRule.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-50 border-b border-slate-100">
                <td className="p-4 font-bold text-blue-600">{rule.id}</td>
                <td className="p-4">{rule.kerusakan}</td>
                <td className="p-4"><span className="bg-slate-200 px-2 py-1 rounded text-xs">IF {rule.gejala}</span></td>
                <td className="p-4 flex justify-center space-x-2">
                  <button onClick={() => openEditModal(rule)} className="p-2 bg-yellow-400 rounded text-white">✏️</button>
                  <button onClick={() => handleHapus(rule.id)} className="p-2 bg-red-500 rounded text-white">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-blue-600 p-4 text-white font-bold text-lg">
              {isEdit ? "Edit Aturan" : "Tambah Aturan Baru"}
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">ID Aturan</label>
                <input type="text" disabled value={formData.id} className="w-full p-2 bg-slate-100 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Target Kerusakan</label>
                <input 
                  type="text" required value={formData.kerusakan} 
                  onChange={(e) => setFormData({...formData, kerusakan: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="Contoh: Roller aus (K2)"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kombinasi Gejala</label>
                <input 
                  type="text" required value={formData.gejala}
                  onChange={(e) => setFormData({...formData, gejala: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="Contoh: G1, G3, G5"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-200 py-2 rounded-lg font-bold">Batal</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold shadow-lg">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rule;