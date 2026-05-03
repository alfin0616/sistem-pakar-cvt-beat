import React, { useState } from 'react';
import jsPDF from 'jspdf';

const Diagnosa = () => {
  const [selectedGejala, setSelectedGejala] = useState([]);
  const [hasil, setHasil] = useState(null);

// Di dalam komponen Diagnosa:
const downloadPDF = () => {
  const doc = new jsPDF();
  
  // Header Laporan
  doc.setFontSize(18);
  doc.text("Laporan Hasil Diagnosa CVT", 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Tanggal: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Isi Laporan
  doc.setFont("helvetica", "bold");
  doc.text("Hasil Kerusakan:", 20, 50);
  doc.setFont("helvetica", "normal");
  doc.text(hasil.kerusakan, 20, 60);
  
  doc.setFont("helvetica", "bold");
  doc.text("Tingkat Keyakinan:", 20, 75);
  doc.setFont("helvetica", "normal");
  doc.text(hasil.yakin, 20, 85);
  
  doc.setFont("helvetica", "bold");
  doc.text("Solusi:", 20, 100);
  doc.setFont("helvetica", "normal");
  // Agar teks solusi tidak terpotong (word wrap)
  const splitSolusi = doc.splitTextToSize(hasil.solusi, 170);
  doc.text(splitSolusi, 20, 110);
  
  // Footer
  doc.setFontSize(10);
  doc.text("Dicetak oleh Sistem Pakar CVT Honda Beat - Bengkel Dua Saudara", 105, 280, { align: 'center' });
  
  doc.save("Hasil-Diagnosa-CVT.pdf"); //
};

  const daftarGejala = [
    { id: 'G1', nama: 'Tarikan motor terasa berat' },
    { id: 'G2', nama: 'Muncul getaran saat berjalan' },
    { id: 'G3', nama: 'Suara berisik pada CVT' },
    { id: 'G4', nama: 'Akselerasi lambat' },
    { id: 'G5', nama: 'Motor terasa tersendat' },
    { id: 'G6', nama: 'RPM tinggi tapi kecepatan rendah' },
  ];

  const handleCheckboxChange = (id) => {
    if (selectedGejala.includes(id)) {
      setSelectedGejala(selectedGejala.filter(item => item !== id));
    } else {
      setSelectedGejala([...selectedGejala, id]);
    }
  };

  const prosesDiagnosa = () => {
    // Fungsi pembantu agar pengecekan lebih akurat
    const cekRule = (gejalaTarget) => {
      // Menghasilkan true jika SEMUA gejala dalam target ada di pilihan user
      return gejalaTarget.every(g => selectedGejala.includes(g));
    };

    let hasilDiagnosa = null;

    // 1. Rule R1: V-Belt aus (K1)
    if (cekRule(['G1', 'G4', 'G6'])) {
      hasilDiagnosa = { 
        kerusakan: 'V-Belt aus (K1)', 
        solusi: 'Ganti V-Belt dengan yang baru sesuai standar pabrikan.', 
        yakin: '100%' 
      };
    } 
    // 2. Rule R2: Roller aus (K2)
    else if (cekRule(['G2', 'G5'])) {
      hasilDiagnosa = { 
        kerusakan: 'Roller aus (K2)', 
        solusi: 'Ganti roller satu set agar keseimbangan putaran terjaga.', 
        yakin: '100%' 
      };
    } 
    // 3. Rule R3: Kampas ganda licin (K3)
    else if (cekRule(['G2', 'G3'])) {
      hasilDiagnosa = { 
        kerusakan: 'Kampas ganda licin (K3)', 
        solusi: 'Ganti kampas ganda atau bersihkan rumah kampas ganda.', 
        yakin: '100%' 
      };
    } 
    // 4. Rule R4: Pulley kotor (K4)
    else if (selectedGejala.includes('G3')) {
      hasilDiagnosa = { 
        kerusakan: 'Pulley kotor (K4)', 
        solusi: 'Bersihkan pulley depan dan belakang dari debu dan kotoran.', 
        yakin: '100%' 
      };
    } 
    // 5. Rule R5: Per CVT lemah (K5)
    else if (cekRule(['G1', 'G5'])) {
      hasilDiagnosa = { 
        kerusakan: 'Per CVT lemah (K5)', 
        solusi: 'Ganti per CVT dengan yang baru (standar atau racing).', 
        yakin: '100%' 
      };
    } 
    // Jika tidak ada yang cocok
    else {
      hasilDiagnosa = { 
        kerusakan: 'Kerusakan tidak terdeteksi', 
        solusi: 'Silakan pilih kombinasi gejala lain atau hubungi mekanik.', 
        yakin: '0%' 
      };
    }

    setHasil(hasilDiagnosa);

    const dataBaru = {
      id: Date.now(),
      tanggal: new Date().toLocaleString(),
      kerusakan: hasilDiagnosa.kerusakan,
      yakin: hasilDiagnosa.yakin
     };
    // Ambil data lama dari localStorage, lalu tambah data baru
      const riwayatLama = JSON.parse(localStorage.getItem('riwayat_diagnosa')) || [];
      const riwayatUpdate = [dataBaru, ...riwayatLama];
      
      // Simpan kembali ke localStorage
      localStorage.setItem('riwayat_diagnosa', JSON.stringify(riwayatUpdate));
      // --------------------------
     };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Diagnosa Kerusakan CVT</h1>
      
      {!hasil ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4 font-medium">Pilih gejala yang dialami pada motor Anda:</p>
          <div className="space-y-3">
            {daftarGejala.map((g) => (
              <label key={g.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-blue-600"
                  onChange={() => handleCheckboxChange(g.id)}
                />
                <span className="text-gray-700">{g.id} - {g.nama}</span>
              </label>
            ))}
          </div>
          <button 
            onClick={prosesDiagnosa}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            Proses Diagnosa
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Hasil Diagnosa</h2>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-700 uppercase font-bold">Kerusakan yang terdeteksi:</p>
            <p className="text-2xl font-bold text-green-900 mt-1">{hasil.kerusakan}</p>
            <p className="text-sm text-green-600 mt-2">Tingkat Keyakinan : {hasil.yakin}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Solusi:</h3>
            <p className="text-gray-600 leading-relaxed">{hasil.solusi}</p>
          </div>

          <div className="flex space-x-3">
            <button 
              onClick={() => setHasil(null)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Diagnosa Lagi
            </button>
            
            <button 
              onClick={downloadPDF} 
              className="flex-1 bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition"
            >
              Cetak Hasil
            </button>
          </div>
            <button 
            onClick={downloadPDF} className="...">
            </button>
          </div>
      )}
    </div>
  );
};

export default Diagnosa;