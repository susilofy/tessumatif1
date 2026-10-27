import React, { useState, useMemo } from 'react';
import { CONFIG } from '../config';
import { ExamResult, Question } from '../types';
import {
  computeItemAnalysis,
  exportItemAnalysisMatrixToCSV,
} from '../utils/itemAnalysisHelper';
import { downloadAnalisisButirPDF } from '../utils/pdfGenerator';
import { StudentAnalysisModal } from './StudentAnalysisModal';
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
} from 'lucide-react';

interface MatriksAnalisisButirTabProps {
  results: ExamResult[];
  questions: Question[];
}

export const MatriksAnalisisButirTab: React.FC<MatriksAnalisisButirTabProps> = ({
  results,
  questions,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Tuntas' | 'Remedial'>('Semua');
  const [selectedStudent, setSelectedStudent] = useState<ExamResult | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [hoveredQuestion, setHoveredQuestion] = useState<{
    qNum: number;
    topic: string;
    elemen: string;
    kunci: string;
  } | null>(null);

  // Komputasi analisis butir soal
  const { itemStats, allResponses } = useMemo(
    () => computeItemAnalysis(results, questions),
    [results, questions]
  );

  // Filter siswa
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      // Filter status
      const isLulus = r.status === 'Lulus' || r.nilai >= CONFIG.KKTP;
      if (filterStatus === 'Tuntas' && !isLulus) return false;
      if (filterStatus === 'Remedial' && isLulus) return false;

      // Filter search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.nama.toLowerCase().includes(q);
        const matchAbsen = (r.noAbsen || '').includes(q);
        if (!matchName && !matchAbsen) return false;
      }

      return true;
    });
  }, [results, filterStatus, searchQuery]);

  // Statistik ringkasan butir soal
  const summaryStats = useMemo(() => {
    if (itemStats.length === 0) {
      return { avgKetercapaian: 0, mudahCount: 0, sedangCount: 0, sukarCount: 0, hardest: null, easiest: null };
    }

    const avg =
      Math.round(
        itemStats.reduce((acc, s) => acc + s.persentaseKetercapaian, 0) / itemStats.length
      );

    const mudah = itemStats.filter((s) => s.klasifikasiKesukaran === 'Mudah').length;
    const sedang = itemStats.filter((s) => s.klasifikasiKesukaran === 'Sedang').length;
    const sukar = itemStats.filter((s) => s.klasifikasiKesukaran === 'Sukar').length;

    const sortedByKetercapaian = [...itemStats].sort(
      (a, b) => a.persentaseKetercapaian - b.persentaseKetercapaian
    );
    const hardest = sortedByKetercapaian[0];
    const easiest = sortedByKetercapaian[sortedByKetercapaian.length - 1];

    return {
      avgKetercapaian: avg,
      mudahCount: mudah,
      sedangCount: sedang,
      sukarCount: sukar,
      hardest,
      easiest,
    };
  }, [itemStats]);

  const handleExportCSV = () => {
    exportItemAnalysisMatrixToCSV(results, questions, itemStats, allResponses);
  };

  const handleDownloadPDF = () => {
    setIsExportingPDF(true);
    try {
      downloadAnalisisButirPDF(filteredResults.length > 0 ? filteredResults : results, questions);
    } finally {
      setTimeout(() => setIsExportingPDF(false), 600);
    }
  };

  return (
    <div className="space-y-6">
      {/* Kartu Header Analisis */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30">
              <BarChart3 className="w-3.5 h-3.5 text-blue-300" />
              <span>Matriks Respon Siswa &amp; Daya Pembeda Empiris</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Analisis Butir Soal per Siswa
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Matriks pemetaan skor jawaban siswa butir per butir (S1 s.d. S30) dengan visualisasi
              status jawaban, ketercapaian daya serap empiris, serta diagnosis kelemahan materi tiap
              siswa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tombol Ekspor CSV */}
            <button
              id="btn-export-matriks-csv"
              onClick={handleExportCSV}
              disabled={results.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="Unduh file spreadsheet matriks jawaban siswa (Excel/CSV)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Ekspor Matriks (CSV/Excel)</span>
            </button>

            {/* Tombol Cetak PDF */}
            <button
              id="btn-download-analisis-pdf"
              onClick={handleDownloadPDF}
              disabled={results.length === 0 || isExportingPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="Unduh Laporan Analisis Butir Soal Berkop Resmi (PDF)"
            >
              <Download className="w-4 h-4 text-blue-700" />
              <span>{isExportingPDF ? 'Menyiapkan PDF...' : 'Unduh Laporan (PDF)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRIK RINGKASAN ANALISIS DAYA SERAP KELAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 block">Rata-rata Ketercapaian</span>
            <span className="text-2xl font-black text-slate-900 block">
              {summaryStats.avgKetercapaian}%
            </span>
            <span className="text-[11px] text-blue-600 font-medium">Daya serap klasikal</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 block">Klasifikasi Butir Soal</span>
            <span className="text-2xl font-black text-slate-900 block">
              {summaryStats.mudahCount} <span className="text-xs font-normal text-slate-400">M</span> /{' '}
              {summaryStats.sedangCount} <span className="text-xs font-normal text-slate-400">Sd</span> /{' '}
              {summaryStats.sukarCount} <span className="text-xs font-normal text-slate-400">Sk</span>
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">Mudah / Sedang / Sukar</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-slate-500 block">Butir Paling Sukar</span>
            <span className="text-lg font-black text-rose-900 block truncate">
              {summaryStats.hardest ? `Soal ${summaryStats.hardest.questionNumber} (${summaryStats.hardest.persentaseKetercapaian}%)` : '-'}
            </span>
            <span className="text-[11px] text-rose-600 font-medium truncate block">
              {summaryStats.hardest?.topic || 'Perlu bimbingan'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-slate-500 block">Butir Paling Dikuasai</span>
            <span className="text-lg font-black text-indigo-900 block truncate">
              {summaryStats.easiest ? `Soal ${summaryStats.easiest.questionNumber} (${summaryStats.easiest.persentaseKetercapaian}%)` : '-'}
            </span>
            <span className="text-[11px] text-indigo-600 font-medium truncate block">
              {summaryStats.easiest?.topic || 'Tuntas optimal'}
            </span>
          </div>
        </div>
      </div>

      {/* TOOLBAR FILTER & PETUNJUK STATUS */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa atau nomor absen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-colors"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setFilterStatus('Semua')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'Semua' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Siswa ({results.length})
              </button>
              <button
                onClick={() => setFilterStatus('Tuntas')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'Tuntas' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tuntas (≥{CONFIG.KKTP})
              </button>
              <button
                onClick={() => setFilterStatus('Remedial')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'Remedial' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Remedial
              </button>
            </div>
          </div>
        </div>

        {/* Legend status jawaban */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600 gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-slate-700">Keterangan Visual Status Jawaban:</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-5 h-5 rounded-md bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center">
                1
              </span>
              <span>Benar Penuh (Skor 1.0)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-5 h-5 rounded-md bg-amber-400 text-amber-950 font-black text-[10px] flex items-center justify-center">
                ½
              </span>
              <span>Benar Sebagian (PGK / Kategori)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-5 h-5 rounded-md bg-rose-500 text-white font-black text-[10px] flex items-center justify-center">
                0
              </span>
              <span>Salah (Skor 0)</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            * Klik baris nama siswa untuk membuka <strong>Diagnosis Remedial &amp; Kelemahan Materi</strong>.
          </div>
        </div>
      </div>

      {/* Info tooltip saat kursor diarahkan ke header soal */}
      {hoveredQuestion && (
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs flex items-center justify-between shadow-lg animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-300">Soal {hoveredQuestion.qNum}:</span>
            <span className="font-semibold">{hoveredQuestion.topic}</span>
            <span className="text-slate-400">• Elemen: {hoveredQuestion.elemen}</span>
          </div>
          <span className="bg-slate-800 px-2.5 py-0.5 rounded text-slate-200 font-mono font-bold text-[11px]">
            Kunci: {hoveredQuestion.kunci}
          </span>
        </div>
      )}

      {/* TABEL MATRIKS RESPON SISWA */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Baris Header Atas */}
              <tr className="bg-slate-900 text-white font-bold tracking-wider text-[11px]">
                <th className="py-3 px-2 text-center w-10 border-b border-slate-800 sticky left-0 z-20 bg-slate-900">
                  No
                </th>
                <th className="py-3 px-2 text-center w-12 border-b border-slate-800 sticky left-10 z-20 bg-slate-900">
                  Absen
                </th>
                <th className="py-3 px-3 min-w-[170px] border-b border-slate-800 sticky left-[88px] z-20 bg-slate-900">
                  Nama Siswa
                </th>

                {/* Kolom Butir Soal S1 s.d. S30 */}
                {questions.map((q, idx) => {
                  const qNum = idx + 1;
                  return (
                    <th
                      key={q.id}
                      onMouseEnter={() =>
                        setHoveredQuestion({
                          qNum,
                          topic: q.topic,
                          elemen: itemStats[idx]?.elemen || 'Matematika',
                          kunci: itemStats[idx]?.kunciJawaban || '-',
                        })
                      }
                      onMouseLeave={() => setHoveredQuestion(null)}
                      className="py-3 px-1 text-center min-w-[34px] border-b border-slate-800 font-mono font-bold cursor-help hover:bg-slate-800 transition-colors"
                      title={`Soal ${qNum}: ${q.topic} (Elemen: ${itemStats[idx]?.elemen || '-'})`}
                    >
                      S{qNum}
                    </th>
                  );
                })}

                {/* Kolom Rekapitulasi Kanan */}
                <th className="py-3 px-3 text-center w-16 border-b border-slate-800 bg-slate-900">
                  Skor
                </th>
                <th className="py-3 px-3 text-center w-16 border-b border-slate-800 bg-slate-900">
                  Nilai
                </th>
                <th className="py-3 px-3 text-center w-24 border-b border-slate-800 bg-slate-900">
                  Status
                </th>
                <th className="py-3 px-3 text-center w-28 border-b border-slate-800 bg-slate-900">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={questions.length + 7} className="py-12 text-center text-slate-400">
                    Belum ada data nilai siswa yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredResults.map((r, sIdx) => {
                  const key = `${r.nama}_${r.noAbsen}_${r.timestamp}`;
                  const studentResponses = allResponses.get(key) || {};
                  const isPass = r.status === 'Lulus' || r.nilai >= CONFIG.KKTP;
                  const isEven = sIdx % 2 === 0;

                  return (
                    <tr
                      key={r.id || `${r.nama}-${sIdx}`}
                      className={`hover:bg-blue-50/70 transition-colors cursor-pointer group ${
                        isEven ? 'bg-white' : 'bg-slate-50/60'
                      }`}
                      onClick={() => setSelectedStudent(r)}
                    >
                      {/* No */}
                      <td className="py-2.5 px-2 text-center text-slate-500 font-bold sticky left-0 z-10 bg-inherit border-r border-slate-100">
                        {sIdx + 1}
                      </td>

                      {/* Absen */}
                      <td className="py-2.5 px-2 text-center font-bold text-slate-700 sticky left-10 z-10 bg-inherit border-r border-slate-100">
                        {r.noAbsen || '-'}
                      </td>

                      {/* Nama Siswa */}
                      <td className="py-2.5 px-3 font-extrabold text-slate-900 sticky left-[88px] z-10 bg-inherit border-r border-slate-200 truncate max-w-[200px]">
                        <span className="group-hover:text-blue-700 transition-colors">
                          {r.nama}
                        </span>
                      </td>

                      {/* Matriks Skor Butir Soal S1 .. S30 */}
                      {questions.map((q) => {
                        const resp = studentResponses[q.id];
                        const isBenar = resp && resp.status === 'benar';
                        const isSebagian = resp && resp.status === 'sebagian';

                        return (
                          <td key={q.id} className="p-1 text-center">
                            {isBenar ? (
                              <span
                                className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500 text-white font-black text-[11px] shadow-2xs"
                                title={`Soal ${q.id}: Benar (1.0)`}
                              >
                                1
                              </span>
                            ) : isSebagian ? (
                              <span
                                className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-400 text-amber-950 font-black text-[11px] shadow-2xs"
                                title={`Soal ${q.id}: Benar Sebagian (${resp.score})`}
                              >
                                ½
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-rose-500 text-white font-black text-[11px] shadow-2xs"
                                title={`Soal ${q.id}: Salah (0)`}
                              >
                                0
                              </span>
                            )}
                          </td>
                        );
                      })}

                      {/* Total Skor */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800 bg-inherit">
                        {r.benar ?? 0}
                      </td>

                      {/* Nilai Akhir */}
                      <td className="py-2.5 px-3 text-center bg-inherit">
                        <span
                          className={`font-black text-sm ${
                            isPass ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {r.nilai}
                        </span>
                      </td>

                      {/* Status KKTP */}
                      <td className="py-2.5 px-3 text-center bg-inherit">
                        <span
                          className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isPass
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isPass ? 'Tuntas' : 'Remedial'}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-2.5 px-3 text-center bg-inherit" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedStudent(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 cursor-pointer"
                          title="Lihat Detail Analisis Siswa & Rekomendasi Remedial"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Diagnosis</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* BARIS STATISTIK PER BUTIR SOAL DI BAWAH (STICKY/PINNED STATS) */}
            <tfoot>
              {/* 1. Baris Kunci Jawaban */}
              <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300 text-[11px]">
                <td
                  colSpan={3}
                  className="py-2.5 px-3 text-right font-black uppercase text-slate-600 sticky left-0 z-10 bg-slate-100 border-r border-slate-200"
                >
                  Kunci Jawaban
                </td>
                {questions.map((q, idx) => (
                  <td key={q.id} className="py-2 px-1 text-center font-mono font-bold text-slate-900">
                    <span className="inline-block bg-white px-1 py-0.5 rounded border border-slate-300 text-[10px]">
                      {itemStats[idx]?.kunciJawaban || '-'}
                    </span>
                  </td>
                ))}
                <td colSpan={4} className="bg-slate-100" />
              </tr>

              {/* 2. Baris Jumlah Benar */}
              <tr className="bg-emerald-50/80 font-bold text-emerald-900 border-t border-emerald-200 text-[11px]">
                <td
                  colSpan={3}
                  className="py-2.5 px-3 text-right font-black uppercase text-emerald-800 sticky left-0 z-10 bg-emerald-50 border-r border-emerald-200"
                >
                  Σ Siswa Benar
                </td>
                {questions.map((q, idx) => (
                  <td key={q.id} className="py-2 px-1 text-center font-black text-emerald-800">
                    {itemStats[idx]?.correctCount ?? 0}
                  </td>
                ))}
                <td colSpan={4} className="bg-emerald-50/80" />
              </tr>

              {/* 3. Baris Persentase Ketercapaian */}
              <tr className="bg-blue-50/80 font-bold text-blue-900 border-t border-blue-200 text-[11px]">
                <td
                  colSpan={3}
                  className="py-2.5 px-3 text-right font-black uppercase text-blue-800 sticky left-0 z-10 bg-blue-50 border-r border-blue-200"
                >
                  % Ketercapaian
                </td>
                {questions.map((q, idx) => {
                  const pct = itemStats[idx]?.persentaseKetercapaian ?? 0;
                  return (
                    <td key={q.id} className="py-2 px-1 text-center font-bold text-blue-900 text-[11px]">
                      {pct}%
                    </td>
                  );
                })}
                <td colSpan={4} className="bg-blue-50/80" />
              </tr>

              {/* 4. Baris Klasifikasi Tingkat Kesukaran Empiris */}
              <tr className="bg-indigo-50/80 font-bold text-indigo-900 border-t border-indigo-200 text-[11px]">
                <td
                  colSpan={3}
                  className="py-2.5 px-3 text-right font-black uppercase text-indigo-800 sticky left-0 z-10 bg-indigo-50 border-r border-indigo-200"
                >
                  Kesukaran Empiris
                </td>
                {questions.map((q, idx) => {
                  const k = itemStats[idx]?.klasifikasiKesukaran || 'Sedang';
                  let badge = 'bg-blue-100 text-blue-800';
                  if (k === 'Mudah') badge = 'bg-emerald-100 text-emerald-800';
                  else if (k === 'Sukar') badge = 'bg-rose-100 text-rose-800 font-black';

                  return (
                    <td key={q.id} className="py-2 px-1 text-center">
                      <span className={`inline-block px-1 py-0.5 rounded text-[9px] font-bold ${badge}`}>
                        {k === 'Mudah' ? 'M' : k === 'Sedang' ? 'Sd' : 'Sk'}
                      </span>
                    </td>
                  );
                })}
                <td colSpan={4} className="bg-indigo-50/80 text-xs text-indigo-700 px-3 font-semibold text-center">
                  M:&gt;70%, Sd:30-70%, Sk:&lt;30%
                </td>
              </tr>

              {/* 5. Baris Daya Pembeda (D) */}
              <tr className="bg-slate-900 text-white font-bold border-t border-slate-700 text-[11px]">
                <td
                  colSpan={3}
                  className="py-2.5 px-3 text-right font-black uppercase text-slate-300 sticky left-0 z-10 bg-slate-900 border-r border-slate-800"
                >
                  Daya Pembeda (D)
                </td>
                {questions.map((q, idx) => {
                  const d = itemStats[idx]?.dayaPembeda ?? 0;
                  return (
                    <td key={q.id} className="py-2 px-1 text-center font-mono text-[10px] text-slate-300">
                      {d.toFixed(2)}
                    </td>
                  );
                })}
                <td colSpan={4} className="bg-slate-900 text-[10px] text-slate-400 px-3 text-center">
                  Indeks Diskriminasi
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal Detail Analisis Siswa */}
      <StudentAnalysisModal
        result={selectedStudent}
        questions={questions}
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};
