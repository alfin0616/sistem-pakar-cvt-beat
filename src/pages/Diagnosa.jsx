import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const Diagnosa = () => {
  const [daftarGejala, setDaftarGejala] = useState([]);
  const [daftarRules, setDaftarRules] = useState([]);
  const [selectedGejala, setSelectedGejala] = useState([]);
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resGejala = await axios.get(`${BASE_URL}/api/gejala/`);
        const resRules = await axios.get(`${BASE_URL}/api/rules/`);
        
        const sortedGejala = resGejala.data.sort((a, b) => 
          a.kode_gejala.localeCompare(b.kode_gejala, undefined, { numeric: true })
        );

        setDaftarGejala(sortedGejala);
        setDaftarRules(resRules.data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal sinkronisasi data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (id) => {
    const numericId = Number(id);
    if (selectedGejala.includes(numericId)) {
      setSelectedGejala(selectedGejala.filter((item) => item !== numericId));
    } else {
      setSelectedGejala([...selectedGejala, numericId]);
    }
  };

  const prosesDiagnosa = async () => {
    if (selectedGejala.length === 0) {
      alert('Silakan pilih minimal satu gejala!');
      return;
    }

    if (daftarRules.length === 0) {
      alert('Sistem belum siap: Data aturan gagal dimuat.');
      return;
    }

    const userGejalaSorted = [...selectedGejala].sort((a, b) => a - b);
    let hasilTemuan = null;

    // =========================================================
    // ALGORITMA FORWARD CHAINING (EXACT MATCHING OPTIMIZED)
    // =========================================================
    for (const rule of daftarRules) {
      // Mengambil data dari gejala_detail karena field 'gejala' murni write-only pada serializer
      const ruleGejalaIds = rule.gejala_detail 
        ? rule.gejala_detail.map(g => g.id).sort((a, b) => a - b)
        : [];

      if (ruleGejalaIds.length === 0) continue;

      // 1. Cek apakah jumlah gejala yang dipilih user SAMA PERSIS dengan jumlah kriteria di Rule
      const isLengthMatch = ruleGejalaIds.length === userGejalaSorted.length;

      // 2. Cek apakah seluruh itemnya berpasangan dengan benar
      const isContentMatch = ruleGejalaIds.every(id => userGejalaSorted.includes(id));

      // Aturan dinyatakan sah jika memenuhi kedua kondisi di atas (Mutlak/Presisi)
      if (isLengthMatch && isContentMatch) {
        hasilTemuan = {
          nama_kerusakan: rule.kerusakan_detail?.nama_kerusakan || "Kerusakan Terdeteksi",
          solusi: rule.kerusakan_detail?.solusi || "Hubungi mekanik untuk pengecekan lebih lanjut.",
          gejala_text: daftarGejala.filter(g => selectedGejala.includes(g.id)).map(g => g.nama_gejala).join(', ')
        };
        break; // Hentikan pencarian jika sudah ketemu yang pas mutlak
      }
    }

    if (!hasilTemuan) {
      hasilTemuan = {
        nama_kerusakan: 'Kerusakan Tidak Spesifik',
        solusi: 'Gejala belum terdaftar di basis aturan kami. Silakan konsultasi dengan mekanik.',
        gejala_text: daftarGejala.filter(g => selectedGejala.includes(g.id)).map(g => g.nama_gejala).join(', ')
      };
    }

    setHasil(hasilTemuan);

    // MENGIRIM RIWAYAT KE BACKEND 
    try {
      const payload = {
        gejala_dipilih: hasilTemuan.gejala_text,
        nama_kerusakan: hasilTemuan.nama_kerusakan,
        solusi: hasilTemuan.solusi
      };
      await axios.post(`${BASE_URL}/api/riwayat/`, payload);
      console.log("Berhasil simpan otomatis riwayat!");
    } catch (error) {
      console.error("Gagal simpan ke database riwayat:", error.response?.data);
    }
  };

  // =========================================================
  // FUNGSI DOWNLOAD PDF DENGAN CORRECTION LAYOUT MOBILE
  // =========================================================
  const downloadPDF = () => {
    if (!hasil) return;
    
    const doc = new jsPDF('p', 'mm', 'a4');

    const primaryColor = [30, 41, 59];  
    const accentColor = [29, 78, 216];  
    const textColor = [51, 65, 85];     
    const lightBg = [248, 250, 252];    

    // Header Banner
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 32, 'F'); 

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('SISTEM PAKAR CVT MATIC', 15, 14);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text('Hasil Analisis Diagnosa Kerusakan Komponen Transmisi Honda Beat', 15, 22);

    // FIX LAPORAN MELUBER DI HP: Persingkat format string penulisan tanggal
    const tanggalSekarang = new Date().toLocaleDateString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric'
    }) + " - " + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    doc.setTextColor(148, 163, 184); 
    doc.setFontSize(8.5);
    doc.text(`Waktu Pemeriksaan: ${tanggalSekarang}`, 15, 41);

    doc.setDrawColor(226, 232, 240); 
    doc.setLineWidth(0.5);
    doc.line(15, 45, 195, 45);

    // Seksi Gejala
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Gejala Fisik Yang Terpilih:', 15, 54);

    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    
    const txtGejala = hasil.gejala_text || "Gejala terpilih tidak terekam.";
    const splitGejala = doc.splitTextToSize(txtGejala, 175); 
    doc.text(splitGejala, 15, 60);

    // Penghitungan Jarak Dinamis Kotak Hasil
    const yPosSetelahGejala = 64 + (splitGejala.length * 5.5);

    doc.setFillColor(...lightBg);
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.8);
    doc.rect(15, yPosSetelahGejala, 180, 25, 'FD');

    doc.setTextColor(...accentColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('KESIMPULAN DIAGNOSA AKHIR:', 21, yPosSetelahGejala + 8);

    doc.setTextColor(...primaryColor);
    doc.setFontSize(13);
    doc.text(hasil.nama_kerusakan.toUpperCase(), 21, yPosSetelahGejala + 17);

    // FIX SOLUSI MENABRAK KOTAK DI HP: Tambahkan offset margin dasar menjadi +38
    const yPosSolusiLabel = yPosSetelahGejala + 38;
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Rekomendasi Solusi & Tindakan Perbaikan:', 15, yPosSolusiLabel);

    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);

    const txtSolusi = hasil.solusi || "Segera lakukan pemeriksaan fisik komprehensif di bengkel terdekat.";
    const splitSolusi = doc.splitTextToSize(txtSolusi, 175);
    doc.text(splitSolusi, 15, yPosSolusiLabel + 7);

    // Footer Dokumen
    const yPosFooter = yPosSolusiLabel + 25 + (splitSolusi.length * 5.5);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(15, yPosFooter, 195, yPosFooter);

    doc.setTextColor(148, 163, 184); 
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('*Catatan: Data di atas diolah secara otomatis berdasarkan aturan penalaran sistem pakar forward chaining.', 15, yPosFooter + 6);

    const cleanFileName = hasil.nama_kerusakan.toLowerCase().replace(/[^a-z0-9]/g, '_');
    doc.save(`laporan_diagnosa_${cleanFileName}.pdf`);
  };

  if (loading) return <div className="p-10 text-center text-slate-600 font-medium">Memuat data gejala dan aturan...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-slate-800 tracking-tight">
        Diagnosa Sistem Pakar CVT
      </h1>

      {!hasil ? (
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 border border-slate-200">
          
          {/* FIX GEJALA TERPOTONG DI HP: Membaca max-h & overflow scroll-y agar tidak bentrok dengan tombol */}
          <div className="grid sm:grid-cols-2 gap-3 max-h-[58vh] overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
            {daftarGejala.map((g) => (
              <label 
                key={g.id} 
                className={`flex items-center gap-3 border rounded-xl p-3 md:p-4 cursor-pointer transition select-none ${
                  selectedGejala.includes(g.id) 
                    ? 'bg-blue-50 border-blue-500 shadow-sm' 
                    : 'hover:bg-slate-100 border-slate-200 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedGejala.includes(g.id)}
                  onChange={() => handleCheckboxChange(g.id)} 
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm md:text-base text-slate-700 leading-tight">
                  <strong className="text-blue-600 font-bold mr-1">{g.kode_gejala}</strong> - {g.nama_gejala}
                </span>
              </label>
            ))}
          </div>

          {/* FIX TOMBOL MACET DI HP: Menghilangkan z-index rendah yang menumpuk di bawah list */}
          <button 
             onClick={prosesDiagnosa} 
             className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-base shadow-lg transition active:scale-[0.99]"
          >
             Mulai Analisis Sekarang
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 border border-slate-200">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Hasil Analisis</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-1">{hasil.nama_kerusakan}</h2>
          
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-700 text-sm md:text-base">Rekomendasi Tindakan:</h3>
            <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">{hasil.solusi}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button 
              onClick={() => setHasil(null)} 
              className="w-full sm:flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition text-sm"
            >
              Coba Lagi
            </button>
            <button 
              onClick={downloadPDF} 
              className="w-full sm:flex-1 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 rounded-xl shadow transition text-sm"
            >
              Cetak PDF Premium
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diagnosa;
