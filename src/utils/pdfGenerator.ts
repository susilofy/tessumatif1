import { jsPDF } from 'jspdf';
import { CONFIG } from '../config';
import { ExamResult, Question } from '../types';
import { getQuestionBlueprint, getBlueprintStatistics, formatCorrectAnswer } from '../data/blueprintData';
import { computeItemAnalysis } from './itemAnalysisHelper';

/**
 * Format tanggal dalam bahasa Indonesia
 */
export function formatIndonesianDate(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) {
    return new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * 1. Download Lembar Hasil Tes Siswa (Tanda Tangan Guru & Orang Tua/Wali)
 */
export function downloadStudentResultPDF(result: ExamResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // --- KOP SURAT SEKOLAH ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.setFontSize(14);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 3;

  // Garis Pembatas Kop
  doc.setLineWidth(0.8);
  doc.line(15, y, pageWidth - 15, y);
  doc.setLineWidth(0.2);
  doc.line(15, y + 0.8, pageWidth - 15, y + 0.8);
  y += 8;

  // --- JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('LEMBAR LAPORAN HASIL TES SUMATIF', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tahun Ajaran 2025/2026`, pageWidth / 2, y, { align: 'center' });
  y += 9;

  // --- DATA IDENTITAS SISWA ---
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 36, 2, 2, 'FD');

  doc.setFontSize(10);
  const leftX = 20;
  const col2X = 58;
  const rightX = 115;
  const col4X = 150;

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Nama Peserta', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.nama}`, col2X, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Mata Pelajaran', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${CONFIG.MATA_PELAJARAN}`, col4X, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Nomor Absen', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.noAbsen}`, col2X, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Materi / Pokok', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${CONFIG.MATERI}`, col4X, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Kelas', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.kelas || CONFIG.KELAS}`, col2X, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Standar KKTP', rightX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${CONFIG.KKTP} (Skala 100)`, col4X, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Waktu Pengerjaan', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${result.timestamp}`, col2X, y);

  y += 12;

  // --- TABEL PEROLEHAN HASIL ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('A. Hasil Perolehan Nilai Tes', 15, y);
  y += 5;

  // Header Tabel
  doc.setFillColor(30, 58, 138); // Dark Navy Blue
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Komponen Penilaian', 20, y + 5.5);
  doc.text('Jumlah / Nilai', pageWidth - 45, y + 5.5, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  y += 8;

  // Baris-baris tabel
  const totalQuestionsCount = (result.benar || 0) + (result.salah || 0) > 0 ? (result.benar || 0) + (result.salah || 0) : 30;
  const tableRows = [
    { label: 'Jumlah Soal Keseluruhan', value: `${totalQuestionsCount} Butir Soal` },
    { label: 'Jumlah Jawaban Benar', value: `${result.benar} Soal` },
    { label: 'Jumlah Jawaban Salah / Tidak Tepat', value: `${result.salah} Soal` },
    { label: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)', value: `${CONFIG.KKTP}` },
  ];

  doc.setFont('helvetica', 'normal');
  tableRows.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
    doc.rect(15, y, pageWidth - 30, 7.5, 'F');
    doc.rect(15, y, pageWidth - 30, 7.5, 'S');
    doc.text(row.label, 20, y + 5);
    doc.text(row.value, pageWidth - 45, y + 5, { align: 'right' });
    y += 7.5;
  });

  // Baris Nilai Akhir & Status
  const isPass = result.status === 'Lulus' || result.nilai >= CONFIG.KKTP;
  doc.setFillColor(isPass ? 240 : 254, isPass ? 253 : 242, isPass ? 244 : 242);
  doc.rect(15, y, pageWidth - 30, 10, 'F');
  doc.rect(15, y, pageWidth - 30, 10, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('NILAI AKHIR TES SUMATIF (Skala 0 - 100)', 20, y + 6.5);
  doc.setFontSize(13);
  doc.setTextColor(isPass ? 22 : 185, isPass ? 101 : 28, isPass ? 52 : 28);
  doc.text(String(result.nilai), pageWidth - 45, y + 7, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  y += 10;

  // Status Baris
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 9, 'F');
  doc.rect(15, y, pageWidth - 30, 9, 'S');
  doc.setFontSize(10);
  doc.text('Keterangan Kelulusan', 20, y + 6);
  doc.setFontSize(10);
  doc.setTextColor(isPass ? 22 : 185, isPass ? 101 : 28, isPass ? 52 : 28);
  doc.text(isPass ? 'LULUS (Mencapai KKTP)' : 'BELUM LULUS (Perlu Remedial)', pageWidth - 45, y + 6, {
    align: 'right',
  });
  doc.setTextColor(0, 0, 0);
  y += 14;

  // --- CATATAN GURU ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('B. Catatan Pembelajaran Guru Kelas:', 15, y);
  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  const note = isPass
    ? 'Selamat atas pencapaian yang memuaskan. Tingkatkan terus semangat belajar dan ketelitian dalam menyelesaikan soal matematika.'
    : 'Perlu bimbingan dan pengulangan materi terutama pada konsep soal kompleks dan pemecahan masalah (remedial). Tetap semangat belajar.';
  doc.text(note, 15, y, { maxWidth: pageWidth - 30 });
  y += 16;

  // --- TANDA TANGAN (HANYA GURU & ORANG TUA/WALI) ---
  // Syarat eksplisit dari pengguna: "hanya ditandatangi oleh guru dan orang tua/wali"
  const ttdY = Math.max(y, 220);
  const colLeft = 20;
  const colRight = pageWidth - 65;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);

  // Kolom Kiri: Orang Tua / Wali
  doc.text('Mengetahui,', colLeft, ttdY);
  doc.text('Orang Tua / Wali Siswa,', colLeft, ttdY + 5);

  // Kolom Kanan: Guru Kelas VI
  const tglFormatted = formatIndonesianDate();
  doc.text(`Jembrana, ${tglFormatted}`, colRight, ttdY);
  doc.text('Guru Mata Pelajaran / Kelas VI,', colRight, ttdY + 5);

  // Area tanda tangan (spasi vertikal)
  const lineY = ttdY + 27;

  // Garis nama Orang Tua
  doc.line(colLeft, lineY, colLeft + 45, lineY);
  doc.text('( ......................................... )', colLeft, lineY + 4);

  // Garis nama Guru
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.GURU, colRight, lineY - 1);
  doc.line(colRight, lineY, colRight + 48, lineY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`NIP. ${CONFIG.NIP_GURU}`, colRight, lineY + 4);

  // Simpan PDF
  const safeName = (result.nama || 'siswa').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Hasil_Tes_Sumatif_${safeName}_Absen_${result.noAbsen}.pdf`);
}

/**
 * 2. Download Naskah Soal Ujian (PDF)
 */
export function downloadExamQuestionsPDF(questions: Question[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 16;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
      addPageHeader();
    }
  };

  const addPageHeader = () => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `${CONFIG.SEKOLAH} | Naskah Soal Tes Sumatif Matematika Kelas VI`,
      pageWidth / 2,
      9,
      { align: 'center' }
    );
    doc.setTextColor(0, 0, 0);
  };

  // --- KOP SOAL ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(13);
  doc.text('NASKAH SOAL TES SUMATIF SEMESTER', pageWidth / 2, y, { align: 'center' });
  y += 3;

  doc.setLineWidth(0.6);
  doc.line(15, y, pageWidth - 15, y);
  y += 6;

  // Metadata Soal
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Mata Pelajaran : ${CONFIG.MATA_PELAJARAN}`, 16, y);
  doc.text(`Kelas / Semester : Kelas ${CONFIG.KELAS}`, 120, y);
  y += 4.5;
  doc.text(`Materi Pokok    : ${CONFIG.MATERI}`, 16, y);
  doc.text(`Alokasi Waktu    : 60 Menit`, 120, y);
  y += 4.5;
  doc.text(`Kriteria KKTP   : ${CONFIG.KKTP}`, 16, y);
  doc.text(`Jumlah Soal      : ${questions.length} Butir`, 120, y);
  y += 6;

  doc.setDrawColor(180, 180, 180);
  doc.setFillColor(245, 247, 250);
  doc.rect(15, y, pageWidth - 30, 11, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.text('PETUNJUK UMUM:', 18, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    '1. Tulislah identitas pada lembar jawaban. 2. Kerjakan soal dengan teliti dan jujur. 3. Periksa kembali jawaban sebelum dikirimkan.',
    18,
    y + 8,
    { maxWidth: pageWidth - 36 }
  );
  y += 16;

  // Iterasi Soal
  questions.forEach((q, idx) => {
    checkPageBreak(25);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);

    let typeLabel = 'Pilihan Ganda';
    if (q.type === 'pgk') typeLabel = 'Pilihan Ganda Kompleks (Bisa >1 jawaban benar)';
    if (q.type === 'pgk_kategori') typeLabel = 'Pilihan Ganda Kompleks Kategori (Benar / Salah)';

    doc.setTextColor(30, 58, 138);
    doc.text(`Soal No. ${idx + 1} [${typeLabel}]`, 15, y);
    doc.setTextColor(0, 0, 0);
    y += 5;

    // Teks Soal
    doc.setFont('helvetica', 'normal');
    const textLines = doc.splitTextToSize(q.text, pageWidth - 32);
    checkPageBreak(textLines.length * 4.5 + 15);
    doc.text(textLines, 16, y);
    y += textLines.length * 4.5 + 2;

    // Opsi Jawaban
    if (q.options && q.options.length > 0) {
      q.options.forEach((opt) => {
        checkPageBreak(8);
        const optLines = doc.splitTextToSize(`${opt.id}. ${opt.text}`, pageWidth - 36);
        doc.text(optLines, 20, y);
        y += optLines.length * 4.2 + 1;
      });
      y += 3;
    }

    // Pernyataan Kategori (Benar / Salah)
    if (q.statements && q.statements.length > 0) {
      q.statements.forEach((st, sIdx) => {
        checkPageBreak(10);
        const stLines = doc.splitTextToSize(
          `Pernyataan ${sIdx + 1}: ${st.text}   [  ] Benar   [  ] Salah`,
          pageWidth - 36
        );
        doc.text(stLines, 20, y);
        y += stLines.length * 4.5 + 1.5;
      });
      y += 3;
    }
  });

  doc.save(`Naskah_Soal_Matematika_Kelas_VI_${CONFIG.SEKOLAH.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/**
 * 3. Export Rekap Nilai ke Format CSV (Bisa dibuka langsung di Microsoft Excel)
 */
export function exportResultsToCSV(results: ExamResult[]): void {
  const headers = ['Timestamp', 'Nama Siswa', 'Kelas', 'Nomor Absen', 'Tanggal Lahir', 'Benar', 'Salah', 'Nilai', 'Status'];

  const rows = results.map((r) => [
    `"${r.timestamp || ''}"`,
    `"${r.nama || ''}"`,
    `"${r.kelas || CONFIG.KELAS}"`,
    `"${r.noAbsen || ''}"`,
    `"${r.tglLahir || ''}"`,
    r.benar,
    r.salah,
    r.nilai,
    `"${r.status}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Nilai_Tes_Sumatif_Kelas_${CONFIG.KELAS}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 4. Download Rekapitulasi Data Nilai Siswa (PDF Resmi Berkop dan Bertanda Tangan)
 */
export function downloadResultsRecapPDF(results: ExamResult[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 12;
  const marginRight = 12;
  const contentWidth = pageWidth - marginLeft - marginRight; // 186mm

  // Hitung Statistik
  const total = results.length;
  const lulus = results.filter((r) => r.status === 'Lulus' || r.nilai >= CONFIG.KKTP).length;
  const belumLulus = total - lulus;
  const persenLulus = total > 0 ? Math.round((lulus / total) * 100) : 0;
  const rataRata = total > 0 ? (results.reduce((acc, r) => acc + (r.nilai || 0), 0) / total).toFixed(1) : '0';
  const nilaiTertinggi = total > 0 ? Math.max(...results.map((r) => r.nilai || 0)) : 0;
  const nilaiTerendah = total > 0 ? Math.min(...results.map((r) => r.nilai || 0)) : 0;

  let y = 14;

  // --- KOP DOKUMEN SEKOLAH ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 5.5;
  doc.setFontSize(13);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 2.5;

  // Garis Pembatas Kop Ganda
  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  doc.setLineWidth(0.2);
  doc.line(marginLeft, y + 0.8, pageWidth - marginRight, y + 0.8);
  y += 6;

  // --- JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DAFTAR REKAPITULASI NILAI HASIL TES SUMATIF', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Mata Pelajaran: ${CONFIG.MATA_PELAJARAN} • Materi: ${CONFIG.MATERI} • Kelas ${CONFIG.KELAS} • KKTP: ${CONFIG.KKTP}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // --- KOTAK RINGKASAN STATISTIK ---
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginLeft, y, contentWidth, 14, 1.5, 1.5, 'FD');

  const statCols = [
    { label: 'Total Peserta', val: `${total} Siswa` },
    { label: 'Jumlah Lulus', val: `${lulus} Siswa (${persenLulus}%)` },
    { label: 'Belum Lulus', val: `${belumLulus} Siswa` },
    { label: 'Rata-rata Nilai', val: `${rataRata}` },
    { label: 'Tertinggi / Terendah', val: `${nilaiTertinggi} / ${nilaiTerendah}` },
  ];
  const colW = contentWidth / statCols.length;
  statCols.forEach((col, idx) => {
    const cx = marginLeft + idx * colW + colW / 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(col.label, cx, y + 5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(col.val, cx, y + 10.5, { align: 'center' });
  });

  doc.setTextColor(0, 0, 0);
  y += 18;

  // Definisi Kolom Tabel
  const cols = [
    { key: 'no', title: 'No', width: 9, align: 'center' as const },
    { key: 'noAbsen', title: 'Absen', width: 13, align: 'center' as const },
    { key: 'nama', title: 'Nama Siswa', width: 56, align: 'left' as const },
    { key: 'kelas', title: 'Kelas', width: 12, align: 'center' as const },
    { key: 'benar', title: 'Benar', width: 13, align: 'center' as const },
    { key: 'salah', title: 'Salah', width: 13, align: 'center' as const },
    { key: 'nilai', title: 'Nilai', width: 14, align: 'center' as const },
    { key: 'status', title: 'Keterangan', width: 24, align: 'center' as const },
    { key: 'timestamp', title: 'Waktu Submit', width: 32, align: 'center' as const },
  ];

  const drawTableHeader = (curY: number) => {
    doc.setFillColor(30, 58, 138); // Dark blue
    doc.rect(marginLeft, curY, contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    let curX = marginLeft;
    cols.forEach((col) => {
      const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      doc.text(col.title, textX, curY + 4.8, { align: col.align });
      curX += col.width;
    });
    doc.setTextColor(0, 0, 0);
  };

  drawTableHeader(y);
  y += 7;

  if (results.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text('Belum ada data nilai siswa yang tersimpan.', pageWidth / 2, y + 8, { align: 'center' });
    y += 16;
  } else {
    results.forEach((r, idx) => {
      // Check for page break
      if (y + 6.5 > pageHeight - 38) {
        doc.addPage();
        y = 15;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text('Lanjutan Rekapitulasi Nilai Siswa:', marginLeft, y - 2);
        drawTableHeader(y);
        y += 7;
      }

      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(marginLeft, y, contentWidth, 6.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(marginLeft, y, contentWidth, 6.5, 'S');

      let curX = marginLeft;
      const isLulus = r.status === 'Lulus' || r.nilai >= CONFIG.KKTP;

      cols.forEach((col) => {
        let val = '';
        if (col.key === 'no') val = String(idx + 1);
        else if (col.key === 'noAbsen') val = String(r.noAbsen || '-');
        else if (col.key === 'nama') val = r.nama || '-';
        else if (col.key === 'kelas') val = r.kelas || CONFIG.KELAS;
        else if (col.key === 'benar') val = String(r.benar ?? 0);
        else if (col.key === 'salah') val = String(r.salah ?? 0);
        else if (col.key === 'nilai') val = String(r.nilai ?? 0);
        else if (col.key === 'status') val = isLulus ? 'Lulus' : 'Remedial';
        else if (col.key === 'timestamp') val = (r.timestamp || '-').substring(0, 16);

        doc.setFont('helvetica', col.key === 'nilai' ? 'bold' : 'normal');
        doc.setFontSize(7.8);

        if (col.key === 'status') {
          doc.setTextColor(isLulus ? 22 : 185, isLulus ? 101 : 28, isLulus ? 52 : 28);
        } else if (col.key === 'nilai') {
          doc.setTextColor(isLulus ? 15 : 185, isLulus ? 23 : 28, isLulus ? 42 : 28);
        } else {
          doc.setTextColor(30, 41, 59);
        }

        const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;

        if (col.key === 'nama') {
          const truncated = doc.splitTextToSize(val, col.width - 3)[0] || val;
          doc.text(truncated, textX, y + 4.5);
        } else {
          doc.text(val, textX, y + 4.5, { align: col.align });
        }

        curX += col.width;
      });

      doc.setTextColor(0, 0, 0);
      y += 6.5;
    });
  }

  // Cek apakah muat untuk tanda tangan (perlu ~38mm)
  if (y + 38 > pageHeight - 16) {
    doc.addPage();
    y = 18;
  } else {
    y += 8;
  }

  // --- TANDA TANGAN (KEPALA SEKOLAH & GURU) ---
  const tglStr = formatIndonesianDate();
  const colLeftX = marginLeft + 8;
  const colRightX = pageWidth - marginRight - 55;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  // Kiri: Kepala Sekolah
  doc.text('Mengetahui,', colLeftX, y);
  doc.text('Kepala Sekolah,', colLeftX, y + 4.5);

  // Kanan: Guru Pengampu
  doc.text(`Jembrana, ${tglStr}`, colRightX, y);
  doc.text('Guru Mata Pelajaran,', colRightX, y + 4.5);

  const sigLineY = y + 23;
  // Nama & NIP Kepala Sekolah
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.KEPALA_SEKOLAH, colLeftX, sigLineY);
  doc.line(colLeftX, sigLineY + 1, colLeftX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, colLeftX, sigLineY + 5);

  // Nama & NIP Guru
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(CONFIG.GURU, colRightX, sigLineY);
  doc.line(colRightX, sigLineY + 1, colRightX + 50, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${CONFIG.NIP_GURU}`, colRightX, sigLineY + 5);

  // --- FOOTER DI SETIAP HALAMAN ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Dokumen Rekapitulasi Nilai Resmi • ${CONFIG.SEKOLAH} • Dicetak otomatis sistem`,
      marginLeft,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 6, {
      align: 'right',
    });
  }

  doc.save(`Rekap_Nilai_Tes_Sumatif_Matematika_Kelas_${CONFIG.KELAS}.pdf`);
}

/**
 * 5. Download Matriks Kisi-Kisi Penulisan Soal (Landscape A4 Resmi Kedinasan)
 */
export function downloadKisiKisiPDF(questions: Question[]): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
  const marginLeft = 14;
  const marginRight = 14;
  const contentWidth = pageWidth - marginLeft - marginRight; // 269mm

  const stats = getBlueprintStatistics(questions);

  let y = 14;

  // --- KOP RESMI SEKOLAH ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 5.5;
  doc.setFontSize(13);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 2.5;

  // Garis Pembatas Kop
  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  doc.setLineWidth(0.2);
  doc.line(marginLeft, y + 0.8, pageWidth - marginRight, y + 0.8);
  y += 6;

  // --- JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('MATRIKS KISI-KISI PENULISAN SOAL TES SUMATIF', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Kurikulum Merdeka • Mata Pelajaran: ${CONFIG.MATA_PELAJARAN} • Fase C / Kelas ${CONFIG.KELAS} • Tahun Ajaran 2026/2027`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // --- RINGKASAN DISTRIBUSI LEVEL KOGNITIF & BENTUK SOAL ---
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginLeft, y, contentWidth, 10, 1.5, 1.5, 'FD');

  const l1Count = stats.levelDistribution.find((l) => l.level === 'L1')?.count || 0;
  const l2Count = stats.levelDistribution.find((l) => l.level === 'L2')?.count || 0;
  const l3Count = stats.levelDistribution.find((l) => l.level === 'L3')?.count || 0;

  const pgCount = stats.typeDistribution.find((t) => t.type === 'pg')?.count || 0;
  const pgkCount = stats.typeDistribution.find((t) => t.type === 'pgk')?.count || 0;
  const catCount = stats.typeDistribution.find((t) => t.type === 'pgk_kategori')?.count || 0;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  const summaryText =
    `Total: ${stats.total} Butir Soal  |  Level Kognitif: L1 (Pemahaman)=${l1Count}, L2 (Aplikasi)=${l2Count}, L3 (Penalaran HOTS)=${l3Count}  |  Bentuk Soal: Pilihan Ganda (PG)=${pgCount}, PG Kompleks (PGK)=${pgkCount}, Benar/Salah (PGK Kategori)=${catCount}`;
  doc.text(summaryText, pageWidth / 2, y + 6.2, { align: 'center' });

  y += 13;
  doc.setTextColor(0, 0, 0);

  // Definisi Kolom Tabel Kisi-Kisi (Total: 269mm)
  const cols = [
    { key: 'no', title: 'No', width: 9, align: 'center' as const },
    { key: 'elemen', title: 'Elemen / CP', width: 30, align: 'left' as const },
    { key: 'tp', title: 'Tujuan Pembelajaran (TP)', width: 62, align: 'left' as const },
    { key: 'materi', title: 'Materi Pokok', width: 33, align: 'left' as const },
    { key: 'indikator', title: 'Indikator Soal', width: 73, align: 'left' as const },
    { key: 'level', title: 'Level', width: 14, align: 'center' as const },
    { key: 'bentuk', title: 'Bentuk', width: 28, align: 'center' as const },
    { key: 'kunci', title: 'Kunci / Bobot', width: 20, align: 'center' as const },
  ];

  const drawTableHeader = (curY: number) => {
    doc.setFillColor(30, 58, 138); // Dark blue
    doc.rect(marginLeft, curY, contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);

    let curX = marginLeft;
    cols.forEach((col) => {
      const textX = col.align === 'center' ? curX + col.width / 2 : curX + 2;
      doc.text(col.title, textX, curY + 4.8, { align: col.align });
      curX += col.width;
    });
    doc.setTextColor(0, 0, 0);
  };

  drawTableHeader(y);
  y += 7;

  // Render Rows
  stats.blueprints.forEach((bp, idx) => {
    // Estimasi tinggi row berdasarkan pembagian teks
    const tpLines = doc.splitTextToSize(bp.tujuanPembelajaran, cols[2].width - 3);
    const indLines = doc.splitTextToSize(bp.indikatorSoal, cols[4].width - 3);
    const matLines = doc.splitTextToSize(bp.materiPokok, cols[3].width - 3);
    const maxLines = Math.max(tpLines.length, indLines.length, matLines.length, 1);
    const rowHeight = Math.max(7, maxLines * 3.4 + 2);

    // Cek batas halaman
    if (y + rowHeight > pageHeight - 35) {
      doc.addPage();
      y = 14;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('Lanjutan Matriks Kisi-Kisi Penulisan Soal:', marginLeft, y - 2);
      drawTableHeader(y);
      y += 7;
    }

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(marginLeft, y, contentWidth, rowHeight, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginLeft, y, contentWidth, rowHeight, 'S');

    let curX = marginLeft;
    cols.forEach((col) => {
      doc.setDrawColor(226, 232, 240);
      doc.line(curX, y, curX, y + rowHeight);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(30, 41, 59);

      if (col.key === 'no') {
        doc.setFont('helvetica', 'bold');
        doc.text(String(bp.noSoal), curX + col.width / 2, y + 4.5, { align: 'center' });
      } else if (col.key === 'elemen') {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(29, 78, 216);
        doc.text(bp.elemen, curX + 2, y + 4.5);
      } else if (col.key === 'tp') {
        doc.text(tpLines, curX + 2, y + 3.8);
      } else if (col.key === 'materi') {
        doc.text(matLines, curX + 2, y + 3.8);
      } else if (col.key === 'indikator') {
        doc.text(indLines, curX + 2, y + 3.8);
      } else if (col.key === 'level') {
        doc.setFont('helvetica', 'bold');
        if (bp.levelKognitif === 'L1') doc.setTextColor(16, 185, 129);
        else if (bp.levelKognitif === 'L2') doc.setTextColor(37, 99, 235);
        else doc.setTextColor(217, 119, 6);
        doc.text(bp.levelKognitif, curX + col.width / 2, y + 4.5, { align: 'center' });
      } else if (col.key === 'bentuk') {
        const shortBentuk =
          bp.bentukSoal.includes('Kategori')
            ? 'PGK Kategori (B/S)'
            : bp.bentukSoal.includes('Kompleks')
            ? 'PGK (Kompleks)'
            : 'Pilihan Ganda';
        doc.text(shortBentuk, curX + col.width / 2, y + 4.5, { align: 'center' });
      } else if (col.key === 'kunci') {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(bp.kunciJawaban, curX + col.width / 2, y + 3.8, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Skor: ${bp.bobotSkor}`, curX + col.width / 2, y + 7, { align: 'center' });
      }

      curX += col.width;
    });

    y += rowHeight;
  });

  // Cek apakah muat untuk tanda tangan (~32mm)
  if (y + 35 > pageHeight - 15) {
    doc.addPage();
    y = 18;
  } else {
    y += 8;
  }

  // --- TANDA TANGAN (KEPALA SEKOLAH & GURU PENGAMPU) ---
  const tglStr = formatIndonesianDate();
  const colLeftX = marginLeft + 14;
  const colRightX = pageWidth - marginRight - 65;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  // Kiri: Kepala Sekolah
  doc.text('Mengetahui,', colLeftX, y);
  doc.text('Kepala Sekolah,', colLeftX, y + 4.5);

  // Kanan: Guru Pengampu
  doc.text(`Jembrana, ${tglStr}`, colRightX, y);
  doc.text('Guru Mata Pelajaran,', colRightX, y + 4.5);

  const sigLineY = y + 21;
  // Nama & NIP Kepala Sekolah
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.KEPALA_SEKOLAH, colLeftX, sigLineY);
  doc.line(colLeftX, sigLineY + 1, colLeftX + 55, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, colLeftX, sigLineY + 5);

  // Nama & NIP Guru
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(CONFIG.GURU, colRightX, sigLineY);
  doc.line(colRightX, sigLineY + 1, colRightX + 55, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${CONFIG.NIP_GURU}`, colRightX, sigLineY + 5);

  // --- FOOTER DI SETIAP HALAMAN ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Dokumen Kisi-Kisi Soal Kurikulum Merdeka • ${CONFIG.SEKOLAH} • Dicetak otomatis sistem`,
      marginLeft,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 6, {
      align: 'right',
    });
  }

  doc.save(`Kisi_Kisi_Soal_Matematika_Kelas_${CONFIG.KELAS}.pdf`);
}

/**
 * 6. Download Laporan Analisis Butir Soal & Matriks Respon Siswa (Landscape A4 Resmi)
 */
export function downloadAnalisisButirPDF(results: ExamResult[], questions: Question[]): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
  const marginLeft = 10;
  const marginRight = 10;
  const contentWidth = pageWidth - marginLeft - marginRight; // 277mm

  const { itemStats, allResponses } = computeItemAnalysis(results, questions);

  let y = 13;

  // --- KOP RESMI SEKOLAH ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PEMERINTAH KABUPATEN JEMBRANA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.text('DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, y, { align: 'center' });
  y += 5.5;
  doc.setFontSize(13);
  doc.text(CONFIG.SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(CONFIG.ALAMAT_SEKOLAH, pageWidth / 2, y, { align: 'center' });
  y += 2.5;

  // Garis Pembatas Kop
  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  doc.setLineWidth(0.2);
  doc.line(marginLeft, y + 0.8, pageWidth - marginRight, y + 0.8);
  y += 5.5;

  // --- JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('LAPORAN ANALISIS BUTIR SOAL DAN MATRIKS RESPON SISWA', pageWidth / 2, y, {
    align: 'center',
  });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    `Mata Pelajaran: ${CONFIG.MATA_PELAJARAN} • Materi: ${CONFIG.MATERI} • Kelas ${CONFIG.KELAS} • KKTP: ${CONFIG.KKTP} • Total Siswa: ${results.length}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // Lebar kolom tetap untuk identitas dan ringkasan
  const colNoW = 7;
  const colAbsenW = 10;
  const colNamaW = 38;
  const colSkorW = 12;
  const colNilaiW = 12;
  const colStatusW = 16;

  const fixedColsWidth = colNoW + colAbsenW + colNamaW + colSkorW + colNilaiW + colStatusW; // 95mm
  const remainingForQuestions = contentWidth - fixedColsWidth; // 182mm
  const qColW = Math.min(6.5, remainingForQuestions / questions.length);

  const drawTableHeader = (curY: number) => {
    doc.setFillColor(30, 58, 138);
    doc.rect(marginLeft, curY, contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);

    let curX = marginLeft;
    doc.text('No', curX + colNoW / 2, curY + 4.8, { align: 'center' });
    curX += colNoW;
    doc.text('Absen', curX + colAbsenW / 2, curY + 4.8, { align: 'center' });
    curX += colAbsenW;
    doc.text('Nama Siswa', curX + 2, curY + 4.8);
    curX += colNamaW;

    // Kolom Butir Soal 1..N
    questions.forEach((_, qIdx) => {
      doc.text(`S${qIdx + 1}`, curX + qColW / 2, curY + 4.8, { align: 'center' });
      curX += qColW;
    });

    // Kolom Hasil
    doc.text('Skor', curX + colSkorW / 2, curY + 4.8, { align: 'center' });
    curX += colSkorW;
    doc.text('Nilai', curX + colNilaiW / 2, curY + 4.8, { align: 'center' });
    curX += colNilaiW;
    doc.text('Status', curX + colStatusW / 2, curY + 4.8, { align: 'center' });

    doc.setTextColor(0, 0, 0);
  };

  drawTableHeader(y);
  y += 7;

  // Render Baris Siswa
  results.forEach((r, sIdx) => {
    if (y + 6 > pageHeight - 45) {
      doc.addPage();
      y = 14;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('Lanjutan Matriks Respon Butir Soal Siswa:', marginLeft, y - 2);
      drawTableHeader(y);
      y += 7;
    }

    const key = `${r.nama}_${r.noAbsen}_${r.timestamp}`;
    const studentResponses = allResponses.get(key) || {};
    const isPass = r.status === 'Lulus' || r.nilai >= CONFIG.KKTP;

    const isEven = sIdx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(marginLeft, y, contentWidth, 5.8, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginLeft, y, contentWidth, 5.8, 'S');

    let curX = marginLeft;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(30, 41, 59);

    // No
    doc.text(String(sIdx + 1), curX + colNoW / 2, y + 4.2, { align: 'center' });
    curX += colNoW;

    // Absen
    doc.text(String(r.noAbsen || '-'), curX + colAbsenW / 2, y + 4.2, { align: 'center' });
    curX += colAbsenW;

    // Nama
    const truncatedNama = doc.splitTextToSize(r.nama || 'Siswa', colNamaW - 3)[0] || r.nama;
    doc.text(truncatedNama, curX + 2, y + 4.2);
    curX += colNamaW;

    // Respon Butir Soal (1 = Benar Hijau, 0.5 = Sebagian Kuning, 0 = Salah Merah)
    questions.forEach((q) => {
      const resp = studentResponses[q.id];
      const isBenar = resp && resp.status === 'benar';
      const isSebagian = resp && resp.status === 'sebagian';

      if (isBenar) {
        doc.setFillColor(220, 252, 231); // green-100
        doc.rect(curX + 0.3, y + 0.5, qColW - 0.6, 4.8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(22, 101, 52); // green-800
        doc.text('1', curX + qColW / 2, y + 4.1, { align: 'center' });
      } else if (isSebagian) {
        doc.setFillColor(254, 243, 199); // amber-100
        doc.rect(curX + 0.3, y + 0.5, qColW - 0.6, 4.8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(180, 83, 9); // amber-700
        doc.text('½', curX + qColW / 2, y + 4.1, { align: 'center' });
      } else {
        doc.setFillColor(254, 226, 226); // red-100
        doc.rect(curX + 0.3, y + 0.5, qColW - 0.6, 4.8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(185, 28, 28); // red-700
        doc.text('0', curX + qColW / 2, y + 4.1, { align: 'center' });
      }

      curX += qColW;
    });

    // Total Skor
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(String(r.benar ?? 0), curX + colSkorW / 2, y + 4.2, { align: 'center' });
    curX += colSkorW;

    // Nilai
    doc.setTextColor(isPass ? 22 : 185, isPass ? 101 : 28, isPass ? 52 : 28);
    doc.text(String(r.nilai ?? 0), curX + colNilaiW / 2, y + 4.2, { align: 'center' });
    curX += colNilaiW;

    // Status
    doc.text(isPass ? 'Tuntas' : 'Remedial', curX + colStatusW / 2, y + 4.2, { align: 'center' });

    y += 5.8;
  });

  // --- BARIS STATISTIK BUTIR SOAL DI BAWAH ---
  const statsRows = [
    {
      label: 'Kunci Jawaban',
      valGetter: (idx: number) => formatCorrectAnswer(questions[idx]),
      bgColor: [241, 245, 249],
      textColor: [30, 41, 59],
    },
    {
      label: 'Σ Benar',
      valGetter: (idx: number) => String(itemStats[idx]?.correctCount ?? 0),
      bgColor: [236, 253, 245],
      textColor: [6, 95, 70],
    },
    {
      label: '% Ketercapaian',
      valGetter: (idx: number) => `${itemStats[idx]?.persentaseKetercapaian ?? 0}%`,
      bgColor: [239, 246, 255],
      textColor: [29, 78, 216],
    },
    {
      label: 'Tingkat Kesukaran',
      valGetter: (idx: number) => {
        const k = itemStats[idx]?.klasifikasiKesukaran || 'Sedang';
        return k === 'Mudah' ? 'M' : k === 'Sedang' ? 'Sd' : 'Sk';
      },
      bgColor: [254, 242, 242],
      textColor: [153, 27, 27],
    },
    {
      label: 'Daya Pembeda (D)',
      valGetter: (idx: number) => String(itemStats[idx]?.dayaPembeda ?? 0),
      bgColor: [250, 245, 255],
      textColor: [107, 33, 168],
    },
  ];

  statsRows.forEach((sRow) => {
    if (y + 5.5 > pageHeight - 35) {
      doc.addPage();
      y = 15;
    }

    doc.setFillColor(sRow.bgColor[0], sRow.bgColor[1], sRow.bgColor[2]);
    doc.rect(marginLeft, y, contentWidth, 5.2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(marginLeft, y, contentWidth, 5.2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(sRow.textColor[0], sRow.textColor[1], sRow.textColor[2]);

    // Label spans across first columns
    const labelSpanW = colNoW + colAbsenW + colNamaW;
    doc.text(sRow.label, marginLeft + labelSpanW - 2, y + 3.8, { align: 'right' });

    let curX = marginLeft + labelSpanW;
    questions.forEach((_, qIdx) => {
      const val = sRow.valGetter(qIdx);
      doc.text(val, curX + qColW / 2, y + 3.8, { align: 'center' });
      curX += qColW;
    });

    y += 5.2;
  });

  // Cek apakah muat untuk tanda tangan
  if (y + 35 > pageHeight - 15) {
    doc.addPage();
    y = 18;
  } else {
    y += 8;
  }

  // --- TANDA TANGAN (KEPALA SEKOLAH & GURU) ---
  const tglStr = formatIndonesianDate();
  const colLeftX = marginLeft + 14;
  const colRightX = pageWidth - marginRight - 65;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  // Kiri: Kepala Sekolah
  doc.text('Mengetahui,', colLeftX, y);
  doc.text('Kepala Sekolah,', colLeftX, y + 4.5);

  // Kanan: Guru Pengampu
  doc.text(`Jembrana, ${tglStr}`, colRightX, y);
  doc.text('Guru Mata Pelajaran,', colRightX, y + 4.5);

  const sigLineY = y + 21;
  // Nama & NIP Kepala Sekolah
  doc.setFont('helvetica', 'bold');
  doc.text(CONFIG.KEPALA_SEKOLAH, colLeftX, sigLineY);
  doc.line(colLeftX, sigLineY + 1, colLeftX + 55, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${CONFIG.NIP_KEPALA_SEKOLAH}`, colLeftX, sigLineY + 5);

  // Nama & NIP Guru
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(CONFIG.GURU, colRightX, sigLineY);
  doc.line(colRightX, sigLineY + 1, colRightX + 55, sigLineY + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${CONFIG.NIP_GURU}`, colRightX, sigLineY + 5);

  // --- FOOTER DI SETIAP HALAMAN ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Dokumen Analisis Butir Soal Empiris • ${CONFIG.SEKOLAH} • Dicetak otomatis sistem`,
      marginLeft,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginRight, pageHeight - 6, {
      align: 'right',
    });
  }

  doc.save(`Analisis_Butir_Soal_Matematika_Kelas_${CONFIG.KELAS}.pdf`);
}

