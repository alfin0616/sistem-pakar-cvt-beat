import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rule = () => {
  const [listRule, setListRule] = useState([]); 
  const [daftarKerusakan, setDaftarKerusakan] = useState([]); 
  const [daftarGejala, setDaftarGejala] = useState([]); 
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: '',
    kerusakan: '', 
    gejala: [],    
  });

  const [isEdit, setIsEdit] = useState(false);

  // ==========================================
  // GET DATA DARI DJANGO (REAL-TIME)
  // ==========================================
  const fetchData = async () => {
    try {
      setLoading(true);
      const resRules = await axios.get('http://127.0.0.1:8000/api/rules/');
      const resKerusakan = await axios.get('http://127.0.0.1:8000/api/kerusakan/');
      const resGejala = await axios.get('http://127.0.0.1:8000/api/gejala/');

      setListRule(resRules.data);
      setDaftarKerusakan(resKerusakan.data);
      setDaftarGejala(resGejala.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data dari database:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // OPEN TAMBAH MODAL
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: '', 
      kerusakan: '',
      gejala: [], 
    });
    setIsModalOpen(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (rule) => {
    setIsEdit(true);
    // Tetap ambil rule.id asli database untuk kebutuhan PUT request backend
    const cleanId = typeof rule.id === 'string' ? Number(rule.id.replace('R-', '')) : rule.id;

    setFormData({
      id: cleanId, 
      kerusakan: rule.kerusakan_detail?.id || rule.kerusakan,
      gejala: rule.gejala || [], 
    });
    setIsModalOpen(true);
  };

  // HANDLE CHECKBOX DI MODAL FORM
  const handleCheckboxChange = (gejalaId) => {
    const numericId = Number(gejalaId);
    if (formData.gejala.includes(numericId)) {
      setFormData({
        ...formData,
        gejala: formData.gejala.filter((id) => id !== numericId),
      });
    } else {
      setFormData({
        ...formData,
        gejala: [...formData.gejala, numericId],
      });
    }
  };

  // =============================================================
  // SIMPAN DATA (POST & PUT KE DATABASE) - FIX KATA KUNCI 'async'
  // =============================================================
  const handleSave = async (e) => {
    e.preventDefault();

    console.log("ISI FORM DATA SAAT INI:", formData);

    if (!formData.kerusakan) {
      alert("Silakan pilih jenis kerusakan terlebih dahulu!");
      return;
    }
    if (formData.gejala.length === 0) {
      alert("Silakan pilih minimal satu kombinasi gejala!");
      return;
    }

    const payload = {
      kerusakan: Number(formData.kerusakan),
      gejala: formData.gejala, 
    };

    console.log("PAYLOAD YANG AKAN DIKIRIM KE DJANGO:", payload);

    try {
      if (isEdit) {
        // PUT / UPDATE DATA
        await axios.put(`http://127.0.0.1:8000/api/rules/${formData.id}/`, payload);
        alert('Rule berhasil diperbarui!');
      } else {
        // POST / TAMBAH BARU DATA
        await axios.post('http://127.0.0.1:8000/api/rules/', payload);
        alert('Rule baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchData(); 
    } catch (error) {
      console.error("Gagal menyimpan rule:", error.response?.data);
      alert("Terjadi kesalahan saat menyimpan data. Periksa kembali inputan.");
    }
  };

  // ==========================================
  // HAPUS DATA (DELETE DARI DATABASE)
  // ==========================================
  const handleHapus = async (id) => {
    const cleanId = typeof id === 'string' ? id.replace('R-', '') : id;

    if (window.confirm(`Yakin ingin menghapus rule ID: ${cleanId} dari database?`)) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/rules/${cleanId}/`);
        alert('Rule berhasil dihapus!');
        fetchData(); 
      } catch (error) {
        console.error("Gagal menghapus rule:", error.response?.data);
        alert("Gagal menghapus data dari database.");
      }
    }
  };

  // FILTER SEARCH
  const filteredRule = listRule.filter((r) => {
    const namaKerusakan = r.kerusakan_detail?.nama_kerusakan || '';
    return (
      String(r.id).includes(search) ||
      namaKerusakan.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) return <div className="p-10 text-center">Menghubungkan ke Database...</div>;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Basis Aturan (Rules)</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow transition"
        >
          + Tambah Rule
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari rule berdasarkan kerusakan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-100 z-10">
              <tr className="text-slate-700 uppercase text-xs">
                <th className="p-4">No</th>
                <th className="p-4">ID Aturan</th>
                <th className="p-4">Hasil Kerusakan</th>
                <th className="p-4">Kombinasi Gejala</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRule.length > 0 ? (
                filteredRule.map((rule, index) => (
                  <tr key={rule.id} className="border-t hover:bg-slate-50 transition">
                    <td className="p-4">{index + 1}</td>
                    
                    {/* PERBAIKAN UTAMA: Menggunakan index + 1 agar ID Aturan berurutan dari R-1 */}
                    <td className="p-4 font-bold text-blue-600">R-{index + 1}</td>
                    
                    <td className="p-4 font-semibold text-slate-700">
                      {rule.kerusakan_detail?.nama_kerusakan || "Tidak Diketahui"}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {rule.gejala_detail && rule.gejala_detail.length > 0 ? (
                          rule.gejala_detail.map((g) => (
                            <span key={g.id} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                              {g.kode_gejala} - {g.nama_gejala}
                            </span>
                          ))
                        ) : (
                          <span className="text-red-500 text-xs">Tidak ada gejala terpilih</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(rule)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleHapus(rule.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-slate-500">
                    Data rule tidak ditemukan di database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM INTEGRASI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4 text-lg font-bold">
              {isEdit ? 'Edit Aturan Database' : 'Tambah Aturan Database'}
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* DROPDOWN PILIH KERUSAKAN */}
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Hasil Kerusakan</label>
                <select
                  value={formData.kerusakan}
                  onChange={(e) => setFormData({ ...formData, kerusakan: e.target.value })}
                  className="w-full border rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">-- Pilih Jenis Kerusakan --</option>
                  {daftarKerusakan.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama_kerusakan}
                    </option>
                  ))}
                </select>
              </div>

              {/* CHECKBOX GEJALA DARI DB */}
              <div>
                <label className="block mb-2 font-semibold text-slate-700">Pilih Kombinasi Gejala</label>
                <div className="border rounded-xl p-4 max-h-48 overflow-y-auto space-y-2 bg-slate-50">
                  {daftarGejala.map((g) => (
                    <label key={g.id} className="flex items-center gap-3 cursor-pointer hover:bg-slate-200 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={formData.gejala.includes(g.id)}
                        onChange={() => handleCheckboxChange(g.id)}
                        className="rounded border-slate-300 text-blue-600"
                      />
                      <span className="text-sm text-slate-700">
                        <strong>{g.kode_gejala}</strong> - {g.nama_gejala}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* TOMBOL AKSI */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 py-3 rounded-xl font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow transition"
                >
                  Simpan ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rule;