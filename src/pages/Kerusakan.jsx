import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Kerusakan = () => {
  const [listKerusakan, setListKerusakan] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id_kerusakan: '', nama_kerusakan: '', solusi: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // 1. FETCH DATA DARI BACKEND
  // =========================
  useEffect(() => {
    fetchKerusakan();
  }, []);

  const fetchKerusakan = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/kerusakan/');
      setListKerusakan(response.data);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // 2. LOGIKA GENERATE KODE
  // =========================
  const generateKode = () => {
    if (listKerusakan.length === 0) return 'K01';
    const maxNumber = Math.max(
      ...listKerusakan.map(k => {
        // Menggunakan k.kode_kerusakan karena itu nama field dari Django
        const num = parseInt(k.kode_kerusakan?.replace('K', ''));
        return isNaN(num) ? 0 : num;
      })
    );
    const nextNumber = maxNumber + 1;
    return `K${String(nextNumber).padStart(2, '0')}`;
  };

  // =========================
  // 3. HANDLER MODAL & SIMPAN
  // =========================
  const openModal = (data = null) => {
    if (data) {
      setIsEdit(true);
      setSelectedId(data.id);
      setFormData({
        id_kerusakan: data.kode_kerusakan, 
        nama_kerusakan: data.nama_kerusakan,
        solui: data.solusi,
      });
    } else {
      setIsEdit(false);
      setFormData({
        id_kerusakan: generateKode(),
        nama_kerusakan: '',
        solusi: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Sinkronisasi dengan Model Django (kode_kerusakan)
    const dataKirim = {
      kode_kerusakan: formData.id_kerusakan, 
      nama_kerusakan: formData.nama_kerusakan,
      solusi: formData.solusi,
    };

    if (!dataKirim.kode_kerusakan || !dataKirim.nama_kerusakan || !dataKirim.solusi) {
      alert("Semua data harus diisi!");
      return;
    }

    try {
      if (isEdit) {
        await axios.put(`http://127.0.0.1:8000/api/kerusakan/${selectedId}/`, dataKirim);
        alert('Data berhasil diperbarui');
      } else {
        await axios.post('http://127.0.0.1:8000/api/kerusakan/', dataKirim);
        alert('Data berhasil ditambahkan');
      }

      fetchKerusakan();
      setIsModalOpen(false);
      
    } catch (error) {
      console.error("Detail Error:", error.response?.data);
      alert("Gagal simpan! Pesan Server: " + JSON.stringify(error.response?.data));
    }
  };

  // =========================
  // 4. HANDLER HAPUS
  // =========================
  const handleHapus = async (id, kode) => {
    if (window.confirm(`Yakin ingin menghapus ${kode}?`)) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/kerusakan/${id}/`);
        fetchKerusakan();
      } catch (error) {
        alert('Gagal menghapus data');
      }
    }
  };

  const filteredKerusakan = listKerusakan.filter(
    (k) => 
      k.nama_kerusakan?.toLowerCase().includes(search.toLowerCase()) || 
      k.kode_kerusakan?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Data Kerusakan</h1>
        <button onClick={() => openModal()} className="bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition active:scale-95">
          + Tambah Kerusakan
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari kode atau nama kerusakan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border border-slate-300 rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[550px]">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-100 z-10">
              <tr className="text-slate-700 uppercase text-xs font-bold tracking-wider">
                <th className="p-4">No</th>
                <th className="p-4">Kode</th>
                <th className="p-4">Nama Kerusakan</th>
                <th className="p-4">Solusi</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-400 italic">Memuat data...</td>
                </tr>
              ) : filteredKerusakan.length > 0 ? (
                filteredKerusakan.map((k, index) => (
                  <tr key={k.id} className="border-t hover:bg-orange-50/50 transition-colors">
                    <td className="p-4 text-slate-500">{index + 1}</td>
                    <td className="p-4 font-bold text-orange-600">{k.kode_kerusakan}</td>
                    <td className="p-4 font-semibold text-slate-700">{k.nama_kerusakan}</td>
                    <td className="p-4 text-sm text-slate-500 leading-relaxed">{k.solusi}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openModal(k)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition shadow-sm">Edit</button>
                        <button onClick={() => handleHapus(k.id, k.kode_kerusakan)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition shadow-sm">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-400">Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-orange-600 text-white p-5 text-lg font-bold flex justify-between items-center">
              <span>{isEdit ? '📝 Edit Kerusakan' : '✨ Tambah Kerusakan'}</span>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-orange-200">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Kode Kerusakan</label>
                <input
                  type="text"
                  value={formData.id_kerusakan}
                  onChange={(e) => setFormData({ ...formData, id_kerusakan: e.target.value.toUpperCase() })}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50 font-mono"
                  placeholder="K01"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Nama Kerusakan</label>
                <input
                  type="text"
                  value={formData.nama_kerusakan}
                  onChange={(e) => setFormData({ ...formData, nama_kerusakan: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Nama kerusakan..."
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Solusi</label>
                <textarea
                  rows="4"
                  value={formData.solusi}
                  onChange={(e) => setFormData({ ...formData, solusi: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                  placeholder="Deskripsi solusi..."
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-semibold hover:bg-slate-200 transition">Batal</button>
                <button type="submit" className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition shadow-md">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kerusakan;