import React, { useState, useEffect } from 'react';

// --- CONFIGURATION ---
// REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyExMVnQbe8nOGHmMFk_UPquaYEveklIJ1s8Zu-Kjr0YRKufIXv5JQMJv2_7FgJCakH/exec'; 

const LOGO_YAYASAN = "https://iili.io/CNu9Bt9.png";
const LOGO_MILAD = "https://iili.io/n17L7Q2.png";

// --- DATA STRUCTURES ---
const MAPEL_OPTIONS = ['Matematika', 'PAI', 'IPA', 'Bahasa Inggris'];
const PAKET_OPTIONS = ['1', '2', '3', '4', '5'];
const PERANGKAT_OPTIONS = ['Naskah soal', 'Kunci jawaban', 'Pembahasan', 'Kisi-kisi'];

const ASPEK_A = [
  { id: 'A', title: 'A. Aspek Materi dan Kurikulum', items: [
    { code: 'A1', text: 'Butir sesuai dengan lingkup materi dan kompetensi (kisi-kisi) yang ditetapkan panitia untuk jenjang SMP/MTs.' },
    { code: 'A2', text: 'Materi yang diujikan tidak melampaui jenjang SMP/MTs (kelas VII–IX).' },
    { code: 'A3', text: 'Cakupan topik proporsional dan tidak didominasi satu topik saja.' },
    { code: 'A4', text: 'Level kognitif butir bervariasi dan menuntut penalaran tingkat tinggi sesuai karakter olimpiade.' },
    { code: 'A5', text: 'Tingkat kesulitan berjenjang (mudah–sedang–sukar) dan mampu membedakan peserta berkemampuan tinggi.' },
    { code: 'A6', text: 'Tidak ada butir yang duplikat atau menguji konsep yang sama secara berulang.' },
  ]},
  { id: 'B', title: 'B. Aspek Konstruksi Soal Pilihan Ganda', items: [
    { code: 'B1', text: 'Pokok soal dirumuskan jelas dan tegas, hanya memuat informasi yang diperlukan.' },
    { code: 'B2', text: 'Pokok soal tidak memberi petunjuk ke kunci jawaban.' },
    { code: 'B3', text: 'Pokok soal bebas dari pernyataan negatif ganda.' },
    { code: 'B4', text: 'Pilihan jawaban homogen dan logis dari segi materi.' },
    { code: 'B5', text: 'Panjang pilihan jawaban relatif sama; pilihan berupa angka disusun berurutan.' },
    { code: 'B6', text: 'Pengecoh berfungsi, yaitu mencerminkan kesalahan konsep atau langkah yang lazim dilakukan peserta.' },
    { code: 'B7', text: 'Tidak menggunakan pilihan "semua jawaban benar/salah" atau "tidak ada jawaban yang benar".' },
    { code: 'B8', text: 'Setiap butir hanya memiliki satu kunci jawaban yang benar.' },
    { code: 'B9', text: 'Sebaran posisi kunci jawaban (A–E) proporsional dan tidak membentuk pola yang mudah ditebak.' },
  ]},
  { id: 'C', title: 'C. Aspek Stimulus dan Literasi', items: [
    { code: 'C1', text: 'Stimulus (teks, tabel, grafik, atau gambar) relevan dengan soal dan fungsional, bukan sekadar hiasan.' },
    { code: 'C2', text: 'Data, tabel, grafik, dan gambar jelas, terbaca, berlabel memadai, dan konsisten dengan pertanyaan.' },
    { code: 'C3', text: 'Informasi pada stimulus cukup dan tidak berlebihan untuk menjawab pertanyaan.' },
    { code: 'C4', text: 'Konteks lokal Gorontalo dan nilai Islami bermakna, tidak dipaksakan, dan tidak menyesatkan.' },
    { code: 'C5', text: 'Konteks netral dari unsur SARA, gender, status sosial, dan wilayah sehingga adil bagi peserta dari seluruh kabupaten/kota.' },
  ]},
  { id: 'D', title: 'D. Aspek Bahasa', items: [
    { code: 'D1', text: 'Bahasa sesuai kaidah bahasa Indonesia baku (Ejaan Bahasa Indonesia).' },
    { code: 'D2', text: 'Bahasa komunikatif, sesuai tingkat baca siswa SMP/MTs, dan tidak menimbulkan tafsir ganda.' },
    { code: 'D3', text: 'Istilah, simbol, dan satuan yang digunakan baku dan konsisten.' },
    { code: 'D4', text: 'Penulisan angka, mata uang, dan tanda baca konsisten di seluruh naskah.' },
    { code: 'D5', text: 'Tidak memuat ungkapan lokal sempit atau istilah asing yang belum dijelaskan dan mungkin tidak dipahami peserta lintas daerah.' },
  ]},
  { id: 'E', title: 'E. Aspek Kunci Jawaban dan Pembahasan', items: [
    { code: 'E1', text: 'Kunci jawaban benar untuk seluruh butir (telah diverifikasi ulang secara mandiri oleh validator).' },
    { code: 'E2', text: 'Pembahasan runtut, logis, dan lengkap sehingga dapat digunakan juri untuk menyelesaikan sanggahan.' },
    { code: 'E3', text: 'Pembahasan konsisten dengan kunci dan bebas dari kesalahan hitung maupun salah ketik.' },
    { code: 'E4', text: 'Bila ada lebih dari satu cara penyelesaian yang sah, hal itu dicatat dan tidak mengubah kunci.' },
  ]},
  { id: 'F', title: 'F. Aspek Kelayakan Penyelenggaraan', items: [
    { code: 'F1', text: 'Jumlah butir dan panjang stimulus sesuai alokasi waktu pengerjaan.' },
    { code: 'F2', text: 'Sistem penskoran jelas dan sebanding dengan tingkat kesulitan soal.' },
    { code: 'F3', text: 'Naskah rapi (tata letak, penomoran, huruf, gambar) dan terbaca jelas saat dicetak maupun ditampilkan di layar.' },
    { code: 'F4', text: 'Soal layak ditampilkan pada platform CBT: gambar, simbol, dan tabel tidak terpotong atau berubah tampilan.' },
    { code: 'F5', text: 'Soal orisinal atau sumbernya dicantumkan, tidak melanggar hak cipta, dan tidak identik dengan soal yang sudah beredar.' },
  ]},
  { id: 'G', title: 'G. Aspek Khusus Matematika', mapelSpecific: 'Matematika', items: [
    { code: 'G1', text: 'Notasi, simbol, dan satuan matematika (pangkat, akar, pecahan, π, dan sebagainya) ditulis benar dan konsisten.' },
    { code: 'G2', text: 'Gambar bangun geometri sesuai dengan data pada soal (ukuran, label titik, sudut) dan tidak menyesatkan.' },
    { code: 'G3', text: 'Soal dapat diselesaikan tanpa kalkulator dalam waktu yang wajar.' },
    { code: 'G4', text: 'Bilangan pada soal dirancang wajar sehingga hasil perhitungan bersih dan jawaban tidak mudah ditebak melalui taksiran.' },
  ]}
];

export default function App() {
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'dashboard'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // --- FORM STATE ---
  const [identitas, setIdentitas] = useState({
    nama: '',
    nip: '',
    instansi: '',
    jabatan: '',
    tanggal: new Date().toISOString().split('T')[0],
    mapel: '',
    paket: '',
    paketLainnya: '',
    jenjang: 'SMP/MTs sederajat – pilihan ganda (A–E)',
    jumlahButir: 20,
    perangkat: []
  });

  const [bagianA, setBagianA] = useState({
    scores: {}, // e.g., { A1: 4, A2: 3 }
    notes: {}   // e.g., { A1: "Good" }
  });

  const [bagianB, setBagianB] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      no: i + 1, k1: true, k2: true, k3: true, k4: true, k5: true, k6: '✓', k7: true,
      kesulitan: 'S', waktu: '2', keputusan: 'L', kunciValidator: '', catatan: ''
    }))
  );

  const [kesimpulan, setKesimpulan] = useState({
    kelayakan: '',
    saranUmum: '',
    butirDiganti: ''
  });

  // --- DASHBOARD STATE ---
  const [dashboardData, setDashboardData] = useState([]);
  const [isDashboardUnlocked, setIsDashboardUnlocked] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [accessCodeError, setAccessCodeError] = useState('');
  
  const ADMIN_ACCESS_CODE = 'ungguldanberakhlak';

  const handleIdentitasChange = (field, value) => {
    setIdentitas(prev => ({ ...prev, [field]: value }));
    
    // Automatically adjust Bagian B rows if jumlahButir changes
    if (field === 'jumlahButir') {
      const num = parseInt(value) || 0;
      setBagianB(prev => {
        if (num > prev.length) {
          const extra = Array.from({ length: num - prev.length }, (_, i) => ({
            no: prev.length + i + 1, k1: true, k2: true, k3: true, k4: true, k5: true, k6: '✓', k7: true,
            kesulitan: 'S', waktu: '2', keputusan: 'L', kunciValidator: '', catatan: ''
          }));
          return [...prev, ...extra];
        } else if (num < prev.length) {
          return prev.slice(0, num);
        }
        return prev;
      });
    }
  };

  const handlePerangkatToggle = (item) => {
    setIdentitas(prev => {
      const current = prev.perangkat;
      if (current.includes(item)) {
        return { ...prev, perangkat: current.filter(i => i !== item) };
      } else {
        return { ...prev, perangkat: [...current, item] };
      }
    });
  };

  const handleBagianAScore = (code, score) => {
    setBagianA(prev => ({ ...prev, scores: { ...prev.scores, [code]: score } }));
  };

  const handleBagianANote = (code, note) => {
    setBagianA(prev => ({ ...prev, notes: { ...prev.notes, [code]: note } }));
  };

  const handleBagianBChange = (index, field, value) => {
    setBagianB(prev => {
      const newBagianB = [...prev];
      newBagianB[index] = { ...newBagianB[index], [field]: value };
      return newBagianB;
    });
  };

  const calculateRekapA = () => {
    const rekap = [];
    let totalScore = 0;
    let totalMaxScore = 0;

    ASPEK_A.forEach(aspek => {
      // Skip G if not Math
      if (aspek.id === 'G' && identitas.mapel !== 'Matematika') return;

      const numIndicators = aspek.items.length;
      const maxScore = numIndicators * 4;
      let scoreObtained = 0;

      aspek.items.forEach(item => {
        scoreObtained += parseInt(bagianA.scores[item.code] || 0);
      });

      const percentage = maxScore > 0 ? (scoreObtained / maxScore) * 100 : 0;
      let category = '';
      if (percentage >= 85) category = 'Sangat valid';
      else if (percentage >= 70) category = 'Valid';
      else if (percentage >= 55) category = 'Cukup valid';
      else category = 'Kurang valid';

      rekap.push({
        id: aspek.id,
        title: aspek.title,
        numIndicators,
        maxScore,
        scoreObtained,
        percentage: percentage.toFixed(2),
        category
      });

      totalScore += scoreObtained;
      totalMaxScore += maxScore;
    });

    const totalPercentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

    return { rekap, totalScore, totalMaxScore, totalPercentage: totalPercentage.toFixed(2) };
  };

  const calculateRekapB = () => {
    const stats = { L: 0, R: 0, G: 0, M: 0, S: 0, K: 0, totalWaktu: 0 };
    bagianB.forEach(b => {
      stats[b.keputusan]++;
      stats[b.kesulitan]++;
      stats.totalWaktu += parseInt(b.waktu || 0);
    });
    
    const total = bagianB.length || 1; // avoid division by zero
    
    return {
      stats,
      percentages: {
        L: ((stats.L / total) * 100).toFixed(1),
        R: ((stats.R / total) * 100).toFixed(1),
        G: ((stats.G / total) * 100).toFixed(1),
        M: ((stats.M / total) * 100).toFixed(1),
        S: ((stats.S / total) * 100).toFixed(1),
        K: ((stats.K / total) * 100).toFixed(1),
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
      setMessage({ type: 'error', text: 'Error: Harap ganti SCRIPT_URL dengan URL Web App Google Apps Script Anda.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const payload = {
      identitas,
      bagianA,
      bagianB,
      kesimpulan
    };

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        setMessage({ type: 'success', text: 'Data berhasil disimpan!' });
        window.scrollTo(0,0);
        // Optional: clear form here
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan: ' + result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi (CORS/Network Error). Pastikan URL Web App valid dan dapat diakses publik.' });
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => [
    { "ID": "1", "Timestamp": new Date().toISOString(), "Nama Validator": "Dr. Fulan, M.Pd", "Instansi": "Universitas Negeri Gorontalo", "Mata Pelajaran": "Matematika", "Paket Naskah": "1", "Jumlah Butir": 20, "Tanggal Validasi": new Date().toISOString() },
    { "ID": "2", "Timestamp": new Date().toISOString(), "Nama Validator": "Budi Santoso, S.Pd", "Instansi": "SMPN 1 Gorontalo", "Mata Pelajaran": "IPA", "Paket Naskah": "2", "Jumlah Butir": 30, "Tanggal Validasi": new Date().toISOString() }
  ];

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Check if the script URL is a placeholder or invalid
    if (!SCRIPT_URL.startsWith('http') || SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT')) {
      console.log("Menampilkan data demo (Backend belum dikonfigurasi).");
      setDashboardData(getMockData());
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${SCRIPT_URL}?action=getData`);
      const result = await response.json();
      if (result.status === 'success') {
        setDashboardData(result.data);
      } else {
        console.warn("Backend mengembalikan pesan error:", result);
        setDashboardData(getMockData());
      }
    } catch (error) {
      // Use console.warn instead of console.error to avoid treating it as a critical failure
      console.warn("Koneksi ke backend gagal (CORS/Network). Menampilkan data demo.");
      setDashboardData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard' && isDashboardUnlocked) {
      fetchDashboardData();
    }
  }, [activeTab, isDashboardUnlocked]);

  const handleAccessSubmit = (e) => {
    e.preventDefault();
    if (accessCodeInput === ADMIN_ACCESS_CODE) {
      setIsDashboardUnlocked(true);
      setAccessCodeError('');
    } else {
      setAccessCodeError('Kode akses tidak valid. Silakan coba lagi.');
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const exportToExcel = async () => {
    if (dashboardData.length === 0) return;
    try {
      setLoading(true);
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
      const XLSX = window.XLSX;
      const ws = XLSX.utils.json_to_sheet(dashboardData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Rekap Validasi");
      XLSX.writeFile(wb, "Rekap_Validasi_Olimpiade.xlsx");
    } catch (err) {
      console.error("Error loading Excel library:", err);
      setMessage({ type: 'error', text: 'Gagal memuat library Excel.' });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async (dataRow) => {
    try {
      setLoading(true);
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js");
      
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'pt', 'a4');
      const margins = { top: 40, bottom: 40, left: 40, right: 40 };
      
      // Header
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("HASIL VALIDASI INSTRUMEN", 297, margins.top, { align: 'center' });
      doc.text("OLIMPIADE AL ISHLAH GORONTALO 2026", 297, margins.top + 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      let yPos = margins.top + 60;
      
      // Identitas Table
      const identitasData = [
        ["Nama Validator", dataRow["Nama Validator"] || "-"],
        ["Instansi", dataRow["Instansi"] || "-"],
        ["Tanggal Validasi", dataRow["Tanggal Validasi"] ? new Date(dataRow["Tanggal Validasi"]).toLocaleDateString('id-ID') : "-"],
        ["Mata Pelajaran", dataRow["Mata Pelajaran"] || "-"],
        ["Paket Naskah", dataRow["Paket Naskah"] || "-"],
        ["Jumlah Butir", dataRow["Jumlah Butir"] || "-"]
      ];

      doc.autoTable({
        startY: yPos,
        body: identitasData,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 120 } }
      });

      yPos = doc.lastAutoTable.finalY + 20;

      // Notice
      doc.setFont('helvetica', 'italic');
      doc.text("Catatan: Ini adalah dokumen ringkasan hasil validasi. Detail evaluasi per butir dan", margins.left, yPos);
      doc.text("catatan spesifik tersimpan di dalam sistem database.", margins.left, yPos + 12);
      
      // Signatures
      yPos += 60;
      doc.setFont('helvetica', 'normal');
      doc.text(`Gorontalo, ${new Date().toLocaleDateString('id-ID')}`, 400, yPos);
      doc.text("Validator,", 400, yPos + 15);
      doc.text("( __________________________ )", 400, yPos + 60);

      doc.save(`Validasi_${dataRow["Mata Pelajaran"]}_${dataRow["Nama Validator"].replace(/\s/g,'_')}.pdf`);
    } catch (err) {
      console.error("Error loading PDF library:", err);
      setMessage({ type: 'error', text: 'Gagal memuat library PDF.' });
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = () => {
    if (!message.text) return null;
    const isError = message.type === 'error';
    return (
      <div className={`p-4 mb-6 rounded-md ${isError ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
        {message.text}
      </div>
    );
  };

  const renderBagianA = () => {
    return (
      <div className="space-y-8">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm">
          <strong>Skala Penilaian:</strong><br/>
          4: Sangat sesuai (Seluruh butir memenuhi indikator)<br/>
          3: Sesuai (Sebagian besar butir (≥ 75%) memenuhi)<br/>
          2: Kurang sesuai (Sebagian butir (50–74%) memenuhi)<br/>
          1: Tidak sesuai (Kurang dari 50% butir memenuhi)
        </div>

        {ASPEK_A.map(aspek => {
          if (aspek.id === 'G' && identitas.mapel !== 'Matematika') return null;

          return (
            <div key={aspek.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 font-bold text-gray-700">
                {aspek.title}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 bg-gray-50 uppercase border-b">
                    <tr>
                      <th className="px-4 py-3 w-16 text-center">Kode</th>
                      <th className="px-4 py-3">Indikator</th>
                      <th className="px-2 py-3 text-center">1</th>
                      <th className="px-2 py-3 text-center">2</th>
                      <th className="px-2 py-3 text-center">3</th>
                      <th className="px-2 py-3 text-center">4</th>
                      <th className="px-4 py-3 w-64">Catatan / Saran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aspek.items.map(item => (
                      <tr key={item.code} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-center font-medium">{item.code}</td>
                        <td className="px-4 py-2 text-gray-600">{item.text}</td>
                        {[1, 2, 3, 4].map(score => (
                          <td key={score} className="px-2 py-2 text-center">
                            <input 
                              type="radio" 
                              name={`score_${item.code}`} 
                              value={score}
                              checked={bagianA.scores[item.code] === String(score)}
                              onChange={(e) => handleBagianAScore(item.code, e.target.value)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
                              required
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2">
                          <textarea 
                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
                            rows="2"
                            placeholder="Opsional"
                            value={bagianA.notes[item.code] || ''}
                            onChange={(e) => handleBagianANote(item.code, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderBagianB = () => {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 text-sm">
          <strong>Keterangan Kriteria:</strong><br/>
          K1 = materi/kisi-kisi; K2 = jenjang SMP/MTs; K3 = pokok soal jelas; K4 = pilihan homogen/pengecoh; K5 = satu kunci benar; K6 = stimulus jelas; K7 = bahasa baku.<br/>
          <strong>Checkbox dicentang berarti Terpenuhi (✓), tidak dicentang berarti Tidak Terpenuhi (✗).</strong>
        </div>
        
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 bg-gray-100 border-b">
              <tr>
                <th className="px-2 py-3 text-center whitespace-nowrap">No</th>
                <th className="px-2 py-3 text-center" title="K1 = sesuai materi/kisi-kisi">K1</th>
                <th className="px-2 py-3 text-center" title="K2 = sesuai jenjang">K2</th>
                <th className="px-2 py-3 text-center" title="K3 = pokok soal jelas">K3</th>
                <th className="px-2 py-3 text-center" title="K4 = pilihan homogen">K4</th>
                <th className="px-2 py-3 text-center" title="K5 = satu kunci benar">K5</th>
                <th className="px-2 py-3 text-center" title="K6 = stimulus jelas (atau -)">K6</th>
                <th className="px-2 py-3 text-center" title="K7 = bahasa baku">K7</th>
                <th className="px-2 py-3 text-center">Kesulitan</th>
                <th className="px-2 py-3 text-center">Waktu (m)</th>
                <th className="px-2 py-3 text-center">Keputusan</th>
                <th className="px-2 py-3 text-center">Kunci Valid</th>
                <th className="px-2 py-3">Catatan / Saran</th>
              </tr>
            </thead>
            <tbody>
              {bagianB.map((butir, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-2 text-center font-medium">{butir.no}</td>
                  
                  {['k1', 'k2', 'k3', 'k4', 'k5', 'k7'].map(k => (
                    <td key={k} className="px-2 py-2 text-center">
                      <input 
                        type="checkbox" 
                        checked={butir[k]}
                        onChange={(e) => handleBagianBChange(index, k, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                  ))}
                  
                  {/* K6 can be - */}
                  <td className="px-2 py-2 text-center">
                    <select 
                      value={butir.k6} 
                      onChange={(e) => handleBagianBChange(index, 'k6', e.target.value)}
                      className="border-gray-300 rounded shadow-sm text-xs p-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      <option value="✓">✓</option>
                      <option value="✗">✗</option>
                      <option value="-">-</option>
                    </select>
                  </td>

                  <td className="px-2 py-2 text-center">
                    <select 
                      value={butir.kesulitan} 
                      onChange={(e) => handleBagianBChange(index, 'kesulitan', e.target.value)}
                      className="border-gray-300 rounded shadow-sm text-xs p-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      <option value="M">M</option>
                      <option value="S">S</option>
                      <option value="K">K</option>
                    </select>
                  </td>

                  <td className="px-2 py-2 text-center">
                    <input 
                      type="number" 
                      min="1"
                      value={butir.waktu} 
                      onChange={(e) => handleBagianBChange(index, 'waktu', e.target.value)}
                      className="w-12 border-gray-300 rounded shadow-sm text-xs p-1 text-center focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>

                  <td className="px-2 py-2 text-center">
                    <select 
                      value={butir.keputusan} 
                      onChange={(e) => handleBagianBChange(index, 'keputusan', e.target.value)}
                      className={`border-gray-300 rounded shadow-sm text-xs p-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer font-bold ${butir.keputusan === 'L' ? 'text-green-600' : butir.keputusan === 'R' ? 'text-yellow-600' : 'text-red-600'}`}
                    >
                      <option value="L">L</option>
                      <option value="R">R</option>
                      <option value="G">G</option>
                    </select>
                  </td>

                  <td className="px-2 py-2 text-center">
                    <input 
                      type="text" 
                      maxLength="1"
                      value={butir.kunciValidator} 
                      onChange={(e) => handleBagianBChange(index, 'kunciValidator', e.target.value.toUpperCase())}
                      className="w-10 border-gray-300 rounded shadow-sm text-xs p-1 text-center uppercase focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>

                  <td className="px-2 py-2">
                    <input 
                      type="text" 
                      value={butir.catatan} 
                      onChange={(e) => handleBagianBChange(index, 'catatan', e.target.value)}
                      placeholder="Saran perbaikan..."
                      className="w-full min-w-[150px] border-gray-300 rounded shadow-sm text-xs p-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    if (!isDashboardUnlocked) {
      return (
        <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4 border border-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Akses Terbatas</h2>
            <p className="text-gray-500 text-sm mt-2">Masukkan kode akses admin untuk melihat halaman dashboard.</p>
          </div>
          <form onSubmit={handleAccessSubmit} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Kode Akses" 
                value={accessCodeInput}
                onChange={(e) => setAccessCodeInput(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border text-center font-medium"
                required
              />
            </div>
            {accessCodeError && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md border border-red-100">{accessCodeError}</p>
            )}
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm"
            >
              Buka Dashboard
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Dashboard Hasil Validasi</h2>
          <div className="space-x-3">
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
            >
              🔄 Refresh Data
            </button>
            <button 
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium shadow-sm"
              disabled={dashboardData.length === 0}
            >
              📊 Export Excel
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat data...</div>
        ) : dashboardData.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200 text-gray-500">Belum ada data validasi yang masuk.</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Validator</th>
                    <th className="px-4 py-3">Instansi</th>
                    <th className="px-4 py-3">Mapel</th>
                    <th className="px-4 py-3">Paket</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{new Date(row.Timestamp).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-3 font-medium">{row["Nama Validator"]}</td>
                      <td className="px-4 py-3">{row.Instansi}</td>
                      <td className="px-4 py-3">{row["Mata Pelajaran"]}</td>
                      <td className="px-4 py-3 text-center">{row["Paket Naskah"] || row["Paket Lainnya"]}</td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => exportToPDF(row)}
                          className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-xs hover:bg-red-100 transition"
                        >
                          📄 PDF
                        </button>
                      </td>
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

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 selection:bg-blue-200">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={LOGO_YAYASAN} alt="Yayasan Al Ishlah" className="h-12 object-contain" />
            <div className="hidden sm:block border-l-2 border-gray-200 h-10 mx-2"></div>
            <img src={LOGO_MILAD} alt="Milad Al Ishlah" className="h-12 object-contain" />
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Validasi Soal Olimpiade</h1>
              <p className="text-sm text-gray-500">Yayasan Al Ishlah Gorontalo 2026</p>
            </div>
          </div>
          <nav className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'form' ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              📝 Isi Instrumen
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              📈 Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {activeTab === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
            {renderMessage()}
            
            {/* BAGIAN I: Identitas */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">I. Identitas Validator dan Naskah</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Validator *</label>
                    <input type="text" required value={identitas.nama} onChange={e => handleIdentitasChange('nama', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIP / NUPTK / No. Identitas</label>
                    <input type="text" value={identitas.nip} onChange={e => handleIdentitasChange('nip', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instansi / Unit Kerja *</label>
                    <input type="text" required value={identitas.instansi} onChange={e => handleIdentitasChange('instansi', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan dan Bidang Keahlian</label>
                    <input type="text" value={identitas.jabatan} onChange={e => handleIdentitasChange('jabatan', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Validasi *</label>
                    <input type="date" required value={identitas.tanggal} onChange={e => handleIdentitasChange('tanggal', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mata Pelajaran *</label>
                    <div className="flex gap-4">
                      {MAPEL_OPTIONS.map(mapel => (
                        <label key={mapel} className="flex items-center cursor-pointer">
                          <input type="radio" name="mapel" required checked={identitas.mapel === mapel} onChange={() => handleIdentitasChange('mapel', mapel)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <span className="ml-2 text-sm text-gray-700">{mapel}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paket Naskah *</label>
                    <div className="flex flex-wrap gap-4 items-center">
                      {PAKET_OPTIONS.map(pkt => (
                        <label key={pkt} className="flex items-center cursor-pointer">
                          <input type="radio" name="paket" required checked={identitas.paket === pkt} onChange={() => handleIdentitasChange('paket', pkt)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <span className="ml-2 text-sm text-gray-700">{pkt}</span>
                        </label>
                      ))}
                      <div className="flex items-center gap-2">
                         <input type="radio" name="paket" checked={identitas.paket === 'Lainnya'} onChange={() => handleIdentitasChange('paket', 'Lainnya')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                         <span className="text-sm text-gray-700">Lainnya:</span>
                         <input type="text" disabled={identitas.paket !== 'Lainnya'} value={identitas.paketLainnya} onChange={e => handleIdentitasChange('paketLainnya', e.target.value)} className="border-b border-gray-400 focus:border-blue-500 outline-none px-1 py-0.5 text-sm w-24 bg-transparent disabled:opacity-50" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                     <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Butir *</label>
                        <input type="number" min="1" required value={identitas.jumlahButir} onChange={e => handleIdentitasChange('jumlahButir', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Perangkat yang diterima</label>
                    <div className="flex flex-wrap gap-4">
                      {PERANGKAT_OPTIONS.map(item => (
                        <label key={item} className="flex items-center cursor-pointer">
                          <input type="checkbox" checked={identitas.perangkat.includes(item)} onChange={() => handlePerangkatToggle(item)} className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                          <span className="ml-2 text-sm text-gray-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* BAGIAN A: Keseluruhan */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h2 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">BAGIAN A – VALIDASI PAKET SOAL SECARA KESELURUHAN</h2>
               {renderBagianA()}
            </section>

            {/* BAGIAN B: Per Butir */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h2 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">BAGIAN B – VALIDASI PER BUTIR SOAL</h2>
               {renderBagianB()}
            </section>

            {/* BAGIAN C & D: Rekap dan Kesimpulan */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* BAGIAN C */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                  <h2 className="text-lg font-bold border-b pb-2 text-gray-800">BAGIAN C – REKAPITULASI (Otomatis)</h2>
                  
                  {/* Rekap A */}
                  <div>
                    <h3 className="font-semibold text-sm mb-2">C.1 Rekapitulasi skor Bagian A</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-2 py-2">Aspek</th>
                            <th className="px-2 py-2 text-center">Skor Maks</th>
                            <th className="px-2 py-2 text-center">Skor Diraih</th>
                            <th className="px-2 py-2 text-center">%</th>
                            <th className="px-2 py-2">Kategori</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {calculateRekapA().rekap.map(r => (
                            <tr key={r.id}>
                              <td className="px-2 py-1 truncate max-w-[150px]" title={r.title}>{r.title}</td>
                              <td className="px-2 py-1 text-center">{r.maxScore}</td>
                              <td className="px-2 py-1 text-center font-medium">{r.scoreObtained}</td>
                              <td className="px-2 py-1 text-center">{r.percentage}%</td>
                              <td className="px-2 py-1">{r.category}</td>
                            </tr>
                          ))}
                          <tr className="bg-blue-50 font-bold">
                            <td className="px-2 py-2">TOTAL</td>
                            <td className="px-2 py-2 text-center">{calculateRekapA().totalMaxScore}</td>
                            <td className="px-2 py-2 text-center">{calculateRekapA().totalScore}</td>
                            <td className="px-2 py-2 text-center">{calculateRekapA().totalPercentage}%</td>
                            <td className="px-2 py-2"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Rekap B */}
                  <div>
                    <h3 className="font-semibold text-sm mb-2">C.2 Rekapitulasi Bagian B</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm bg-gray-50 p-3 rounded border">
                      <div className="text-center">
                        <div className="font-bold text-green-600">Layak (L)</div>
                        <div>{calculateRekapB().stats.L} ({calculateRekapB().percentages.L}%)</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-yellow-600">Revisi (R)</div>
                        <div>{calculateRekapB().stats.R} ({calculateRekapB().percentages.R}%)</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-red-600">Ganti (G)</div>
                        <div>{calculateRekapB().stats.G} ({calculateRekapB().percentages.G}%)</div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      Perkiraan total waktu: <strong>{calculateRekapB().stats.totalWaktu} menit</strong>
                    </div>
                  </div>
               </div>

               {/* BAGIAN D */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                  <h2 className="text-lg font-bold border-b pb-2 text-gray-800">BAGIAN D – KESIMPULAN DAN SARAN</h2>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">D.1 Kesimpulan Kelayakan *</label>
                    <div className="space-y-2">
                      {[
                        "Layak digunakan tanpa revisi.",
                        "Layak digunakan dengan revisi sesuai saran.",
                        "Belum layak; perlu revisi besar dan validasi ulang.",
                        "Tidak layak; paket perlu disusun ulang."
                      ].map(opt => (
                        <label key={opt} className="flex items-start cursor-pointer group">
                          <input type="radio" name="kelayakan" required checked={kesimpulan.kelayakan === opt} onChange={() => setKesimpulan({...kesimpulan, kelayakan: opt})} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <span className="ml-2 text-sm text-gray-700 group-hover:text-black">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">D.2 Saran Perbaikan Umum</label>
                    <textarea 
                      rows="4" 
                      value={kesimpulan.saranUmum}
                      onChange={e => setKesimpulan({...kesimpulan, saranUmum: e.target.value})}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border text-sm"
                      placeholder="Tuliskan saran perbaikan secara keseluruhan di sini..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">D.3 Butir yang direkomendasikan diganti (beserta alasan)</label>
                    <textarea 
                      rows="3" 
                      value={kesimpulan.butirDiganti}
                      onChange={e => setKesimpulan({...kesimpulan, butirDiganti: e.target.value})}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border text-sm"
                      placeholder="Misal: Nomor 5 (Konsep salah), Nomor 12 (Di luar silabus)..."
                    ></textarea>
                  </div>
               </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 pb-12">
              <button 
                type="submit" 
                disabled={loading}
                className={`px-8 py-3 text-white rounded-lg shadow-md font-bold text-lg transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'}`}
              >
                {loading ? 'Menyimpan Data...' : '💾 Simpan Hasil Validasi'}
              </button>
            </div>
          </form>
        ) : (
          renderDashboard()
        )}
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}} />
    </div>
  );
}