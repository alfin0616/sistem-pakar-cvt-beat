import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Gejala = () => {
  const [listGejala, setListGejala] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ kode_gejala: '', nama_gejala: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    fetchGejala();
  }, []);

  const fetchGejala = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/gejala/');
      setListGejala(response.data);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    }
  };

  // =========================
  // GENERATE KODE (PINTAR: Mencari angka yang kosong/hilang)
  // =========================
  const generateKode = () => {
    if (listGejala.length === 0) return 'G01';

    // Ambil semua angka dari kode yang ada (G01 -> 1, G02 -> 2)
    const existingNumbers = listGejala.map(g => {
      const num = parseInt(g.kode_gejala?.replace('G', ''));
      return isNaN(num) ? 0 : num;
    }).sort((a, b) => a - b);

    // Cari angka terkecil yang belum ada (supaya G11 yang dihapus bisa dipakai lagi)
    let nextNumber = 1;
    while (existingNumbers.includes(nextNumber)) {
      nextNumber++;
    }

    return `G${String(nextNumber).padStart(2, '0')}`;
  };

  // =========================
  // OPEN MODAL
  // =========================
  const openModal = (data = null) => {
    if (data) {
      setIsEdit(true);
      setSelectedId(data.id);
      setFormData({
        kode_gejala: data.kode_gejala,
        nama_gejala: data.nama_gejala,
      });
    } else {
      setIsEdit(false);
      setFormData({
        kode_gejala: generateKode(),
        nama_gejala: '',
      });
    }
    setIsModalOpen(true);
  };

  // =========================
  // SIMPAN DATA
  // =========================
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const dataKirim = {
        kode_gejala: formData.kode_gejala,
        nama_gejala: formData.nama_gejala,
      };

      if (isEdit) {
        await axios.put(`http://127.0.0.1:8000/api/gejala/${selectedId}/`, dataKirim);
        alert('Data berhasil diupdate');
      } else {
        await axios.post('http://127.0.0.1:8000/api/gejala/', dataKirim);
        alert('Data berhasil ditambahkan');
      }
      fetchGejala();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Detail Error:', error.response?.data);
      alert('Terjadi kesalahan: ' + JSON.stringify(error.response?.data));
    }
  };

  // =========================
  // HAPUS DATA
  // =========================
  const handleHapus = async (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/gejala/${id}/`);
        fetchGejala();
        alert('Data berhasil dihapus');
      } catch (error) {
        alert('Gagal menghapus data');
      }
    }
  };

  // =========================
  // SEARCH & SORT (Tetap Urut G01, G02, dst)
  // =========================
  const filteredGejala = listGejala
    .filter((g) =>
      g.nama_gejala?.toLowerCase().includes(search.toLowerCase()) ||
      g.kode_gejala?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      return a.kode_gejala.localeCompare(b.kode_gejala, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Data Gejala</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 transition">
          + Tambah Gejala
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari gejala..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-100 z-10">
              <tr className="text-slate-700 uppercase text-xs">
                <th className="p-4">No</th>
                <th className="p-4">Kode</th>
                <th className="p-4">Nama Gejala</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredGejala.length > 0 ? (
                filteredGejala.map((g, index) => (
                  <tr key={g.id} className="border-t hover:bg-slate-50 transition">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-bold text-blue-600">{g.kode_gejala}</td>
                    <td className="p-4 text-slate-700">{g.nama_gejala}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openModal(g)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition">Edit</button>
                        <button onClick={() => handleHapus(g.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-slate-500">Data gejala tidak ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4 text-lg font-bold">
              {isEdit ? 'Edit Gejala' : 'Tambah Gejala'}
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Kode Gejala</label>
                <input
                  type="text"
                  // DISABLED DIHAPUS agar bisa diklik/diedit jika perlu
                  value={formData.kode_gejala}
                  onChange={(e) => setFormData({ ...formData, kode_gejala: e.target.value.toUpperCase() })}
                  className="w-full bg-white border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Nama Gejala</label>
                <input
                  type="text"
                  value={formData.nama_gejala}
                  onChange={(e) => setFormData({ ...formData, nama_gejala: e.target.value })}
                  placeholder="Masukkan nama gejala..."
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-200 hover:bg-slate-300 py-3 rounded-xl font-semibold transition">Batal</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow transition">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gejala;