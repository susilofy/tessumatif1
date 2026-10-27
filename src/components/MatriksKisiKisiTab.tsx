import React, { useState, useMemo } from 'react';
import { Question, CognitiveLevel, Difficulty } from '../types';
import {
  getBlueprintStatistics,
  getQuestionBlueprint,
  getCognitiveLevelLabel,
} from '../data/blueprintData';
import { downloadKisiKisiPDF } from '../utils/pdfGenerator';
import {
  FileText,
  Download,
  Filter,
  Search,
  BookOpen,
  Layers,
  Brain,
  Gauge,
  HelpCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface MatriksKisiKisiTabProps {
  questions: Question[];
}

export const MatriksKisiKisiTab: React.FC<MatriksKisiKisiTabProps> = ({ questions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterElemen, setFilterElemen] = useState('Semua');
  const [filterLevel, setFilterLevel] = useState('Semua');
  const [filterBentuk, setFilterBentuk] = useState('Semua');
  const [filterDifficulty, setFilterDifficulty] = useState('Semua');
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Hitung statistik distribusi
  const stats = useMemo(() => getBlueprintStatistics(questions), [questions]);

  // Filter daftar blueprint
  const filteredBlueprints = useMemo(() => {
    return stats.blueprints.filter((bp) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSearch =
          bp.materiPokok.toLowerCase().includes(q) ||
          bp.indikatorSoal.toLowerCase().includes(q) ||
          bp.tujuanPembelajaran.toLowerCase().includes(q) ||
          bp.elemen.toLowerCase().includes(q) ||
          String(bp.noSoal).includes(q);
        if (!matchSearch) return false;
      }

      // Filter Elemen
      if (filterElemen !== 'Semua' && bp.elemen !== filterElemen) {
        return false;
      }

      // Filter Level
      if (filterLevel !== 'Semua' && bp.levelKognitif !== filterLevel) {
        return false;
      }

      // Filter Bentuk
      if (filterBentuk !== 'Semua') {
        if (filterBentuk === 'pg' && !bp.bentukSoal.includes('(PG)')) return false;
        if (filterBentuk === 'pgk' && !bp.bentukSoal.includes('(PGK)')) return false;
        if (filterBentuk === 'pgk_kategori' && !bp.bentukSoal.includes('Kategori')) return false;
      }

      // Filter Kesukaran
      if (filterDifficulty !== 'Semua' && bp.difficulty !== filterDifficulty) {
        return false;
      }

      return true;
    });
  }, [stats.blueprints, searchQuery, filterElemen, filterLevel, filterBentuk, filterDifficulty]);

  const handleDownloadPDF = () => {
    setIsExportingPDF(true);
    try {
      downloadKisiKisiPDF(questions);
    } finally {
      setTimeout(() => setIsExportingPDF(false), 600);
    }
  };

  return (
    <div className="space-y-6">
      {/* Kartu Header Kisi-Kisi */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Standar Kurikulum Merdeka • Fase C (Kelas VI)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Matriks Kisi-Kisi Penulisan Soal
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Spesifikasi instrumen asesmen sumatif yang memetakan Capaian Pembelajaran (CP), Tujuan
              Pembelajaran (TP), Indikator Asesmen, Level Kognitif, dan Bentuk Butir Soal aktif.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-download-kisi-kisi-pdf"
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-extrabold text-xs sm:text-sm shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-blue-700" />
              <span>{isExportingPDF ? 'Menyiapkan PDF...' : 'Unduh PDF Kisi-Kisi Resmi'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KARTU RINGKASAN DISTRIBUSI (SUMMARY CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Distribusi Elemen */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                Elemen / CP
              </span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                {stats.elemenDistribution.length} Elemen
              </span>
            </div>
            <div className="space-y-2">
              {stats.elemenDistribution.map((el) => (
                <div key={el.elemen} className="text-xs">
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span className="truncate pr-2">{el.elemen}</span>
                    <span className="font-bold text-slate-900">
                      {el.count} ({el.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${el.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 block">
            Capaian Pembelajaran Matematika Fase C
          </span>
        </div>

        {/* 2. Distribusi Level Kognitif */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-600" />
                Level Kognitif
              </span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                L1 - L3
              </span>
            </div>
            <div className="space-y-2.5">
              {stats.levelDistribution.map((lvl) => {
                const barColor =
                  lvl.level === 'L1'
                    ? 'bg-emerald-500'
                    : lvl.level === 'L2'
                    ? 'bg-blue-600'
                    : 'bg-amber-500';
                return (
                  <div key={lvl.level} className="text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">{lvl.label}</span>
                      <span className="font-extrabold text-slate-900">
                        {lvl.count} butir ({lvl.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${lvl.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 block">
            Proporsi L1=27%, L2=53%, L3=20% (HOTS)
          </span>
        </div>

        {/* 3. Distribusi Tingkat Kesukaran */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-600" />
                Tingkat Kesukaran
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Standar Normal
              </span>
            </div>
            <div className="space-y-2.5">
              {stats.difficultyDistribution.map((diff) => {
                const barColor =
                  diff.difficulty === 'Mudah'
                    ? 'bg-emerald-500'
                    : diff.difficulty === 'Sedang'
                    ? 'bg-blue-500'
                    : 'bg-rose-500';
                return (
                  <div key={diff.difficulty} className="text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">{diff.difficulty}</span>
                      <span className="font-extrabold text-slate-900">
                        {diff.count} butir ({diff.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${diff.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 block">
            Distribusi kesukaran seimbang (Mudah, Sedang, Sukar)
          </span>
        </div>

        {/* 4. Distribusi Bentuk Soal */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-600" />
                Bentuk Soal
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                3 Tipe Soal
              </span>
            </div>
            <div className="space-y-2.5">
              {stats.typeDistribution.map((t) => (
                <div key={t.type} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">{t.label}</span>
                    <span className="font-extrabold text-slate-900">{t.count} butir</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${t.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 block">
            18 PG Tunggal • 3 PGK • 9 PGK Kategori (B/S)
          </span>
        </div>
      </div>

      {/* FILTER & PENCARIAN KISI-KISI */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari materi pokok, indikator, tujuan pembelajaran, atau no. soal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Elemen */}
            <select
              value={filterElemen}
              onChange={(e) => setFilterElemen(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            >
              <option value="Semua">Semua Elemen</option>
              {stats.elemenDistribution.map((el) => (
                <option key={el.elemen} value={el.elemen}>
                  {el.elemen} ({el.count})
                </option>
              ))}
            </select>

            {/* Filter Level Kognitif */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            >
              <option value="Semua">Semua Level</option>
              <option value="L1">L1 (Pemahaman)</option>
              <option value="L2">L2 (Aplikasi)</option>
              <option value="L3">L3 (Penalaran HOTS)</option>
            </select>

            {/* Filter Bentuk Soal */}
            <select
              value={filterBentuk}
              onChange={(e) => setFilterBentuk(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            >
              <option value="Semua">Semua Bentuk</option>
              <option value="pg">Pilihan Ganda (PG)</option>
              <option value="pgk">PG Kompleks (PGK)</option>
              <option value="pgk_kategori">Benar / Salah (PGK Kategori)</option>
            </select>

            {/* Filter Kesukaran */}
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            >
              <option value="Semua">Semua Kesukaran</option>
              <option value="Mudah">Mudah</option>
              <option value="Sedang">Sedang</option>
              <option value="Sukar">Sukar</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Menampilkan <strong className="text-slate-800">{filteredBlueprints.length}</strong> dari total{' '}
            <strong className="text-slate-800">{stats.total}</strong> butir soal kisi-kisi
          </span>
          {(filterElemen !== 'Semua' ||
            filterLevel !== 'Semua' ||
            filterBentuk !== 'Semua' ||
            filterDifficulty !== 'Semua' ||
            searchQuery) && (
            <button
              onClick={() => {
                setFilterElemen('Semua');
                setFilterLevel('Semua');
                setFilterBentuk('Semua');
                setFilterDifficulty('Semua');
                setSearchQuery('');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* TABEL MATRIKS KISI-KISI SOAL */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold tracking-wider uppercase text-[11px]">
                <th className="py-3 px-3 text-center w-12 border-b border-slate-800">No</th>
                <th className="py-3 px-3 w-32 border-b border-slate-800">Elemen / CP</th>
                <th className="py-3 px-4 min-w-[220px] border-b border-slate-800">
                  Tujuan Pembelajaran (TP)
                </th>
                <th className="py-3 px-3 w-40 border-b border-slate-800">Materi Pokok</th>
                <th className="py-3 px-4 min-w-[260px] border-b border-slate-800">
                  Indikator Asesmen Butir Soal
                </th>
                <th className="py-3 px-2 text-center w-20 border-b border-slate-800">Level</th>
                <th className="py-3 px-3 text-center w-36 border-b border-slate-800">Bentuk Soal</th>
                <th className="py-3 px-3 text-center w-28 border-b border-slate-800">Kunci / Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBlueprints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada butir soal yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredBlueprints.map((bp, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={bp.questionId}
                      className={`hover:bg-blue-50/60 transition-colors ${
                        isEven ? 'bg-white' : 'bg-slate-50/70'
                      }`}
                    >
                      {/* No Soal */}
                      <td className="py-3 px-3 text-center font-black text-slate-800">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
                          {bp.noSoal}
                        </span>
                      </td>

                      {/* Elemen */}
                      <td className="py-3 px-3">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100/70 text-blue-800 border border-blue-200/60">
                          {bp.elemen}
                        </span>
                      </td>

                      {/* Tujuan Pembelajaran */}
                      <td className="py-3 px-4 text-slate-700 leading-relaxed font-normal">
                        {bp.tujuanPembelajaran}
                      </td>

                      {/* Materi Pokok */}
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {bp.materiPokok}
                        <div className="mt-1">
                          <span
                            className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              bp.difficulty === 'Mudah'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : bp.difficulty === 'Sedang'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {bp.difficulty}
                          </span>
                        </div>
                      </td>

                      {/* Indikator Soal */}
                      <td className="py-3 px-4 text-slate-700 leading-relaxed">
                        {bp.indikatorSoal}
                      </td>

                      {/* Level Kognitif */}
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded-md text-[11px] font-black ${
                            bp.levelKognitif === 'L1'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : bp.levelKognitif === 'L2'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                          title={getCognitiveLevelLabel(bp.levelKognitif)}
                        >
                          {bp.levelKognitif}
                        </span>
                      </td>

                      {/* Bentuk Soal */}
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {bp.bentukSoal}
                        </span>
                      </td>

                      {/* Kunci Jawaban & Bobot */}
                      <td className="py-3 px-3 text-center">
                        <div className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-300 inline-block text-[11px]">
                          {bp.kunciJawaban}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                          Bobot: {bp.bobotSkor}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            * Format matriks kisi-kisi penulisan soal sesuai panduan asesmen pembelajaran Kementerian
            Pendidikan Dasar dan Menengah.
          </span>
          <button
            onClick={handleDownloadPDF}
            className="text-blue-700 hover:text-blue-900 font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Format PDF Resmi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
