import React, { useState, useEffect, useMemo } from 'react';
import { CONFIG } from '../config';
import { ExamResult, Question } from '../types';
import { gasService } from '../services/gasService';
import {
  downloadStudentResultPDF,
  downloadExamQuestionsPDF,
  downloadResultsRecapPDF,
  exportResultsToCSV,
} from '../utils/pdfGenerator';
import { QuestionEditorModal } from './QuestionEditorModal';
import { GasGuideModal } from './GasGuideModal';
import { GasSettingsModal } from './GasSettingsModal';
import { StudentDetailModal } from './StudentDetailModal';
import {
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  Download,
  FileDown,
  Trash2,
  Eye,
  FileSpreadsheet,
  Edit3,
  BookOpen,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Code2,
  ToggleLeft,
  ToggleRight,
  Check,
  Award,
  Settings,
  Link,
  RotateCcw,
} from 'lucide-react';

interface Stage4TeacherPanelProps {
  questions: Question[];
  onUpdateQuestion: (updated: Question) => void;
  allowReview: boolean;
  onToggleAllowReview: (val: boolean) => void;
  onResetDefaultQuestions?: () => void;
}

export const Stage4TeacherPanel: React.FC<Stage4TeacherPanelProps> = ({
  questions,
  onUpdateQuestion,
  allowReview,
  onToggleAllowReview,
  onResetDefaultQuestions,
}) => {
  // State data hasil siswa
  const [results, setResults] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Tab aktif di panel guru
  const [activeTab, setActiveTab] = useState<'rekap' | 'soal'>('rekap');

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterTanggal, setFilterTanggal] = useState('');

  // Sorting
  const [sortField, setSortField] = useState<'timestamp' | 'nama' | 'nilai' | 'noAbsen'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<ExamResult | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showGasGuide, setShowGasGuide] = useState(false);
  const [showGasSettings, setShowGasSettings] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<ExamResult | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Ambil data dari Google Apps Script saat komponen dimuat
  const loadDataFromGAS = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await gasService.fetchExamResults();
      setResults(data);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      // Fallback ke penyimpanan lokal
      const localData = gasService.getLocalExamResults();
      setResults(localData);
      setApiError(
        'Sinkronisasi Google Spreadsheet belum aktif. Data hasil tes dimuat dari memori lokal perangkat ini.'
      );
    }
  };

  useEffect(() => {
    loadDataFromGAS();
  }, []);

  // Handler Hapus Data Siswa
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      // Coba kirim request delete ke Google Apps Script
      await gasService.deleteExamResult(studentToDelete.timestamp, studentToDelete.nama);
      // Hapus juga dari state lokal
      setResults((prev) =>
        prev.filter(
          (r) =>
            r.id !== studentToDelete.id &&
            !(r.timestamp === studentToDelete.timestamp && r.nama === studentToDelete.nama)
        )
      );
      setIsDeleting(false);
      setStudentToDelete(null);
    } catch {
      // Fallback tetap hapus di lokal jika remote gagal
      setResults((prev) => prev.filter((r) => r.id !== studentToDelete.id));
      setIsDeleting(false);
      setStudentToDelete(null);
    }
  };

  // Statistik Ringkasan
  const stats = useMemo(() => {
    const total = results.length;
    if (total === 0) {
      return { total: 0, lulus: 0, belumLulus: 0, rataRata: 0 };
    }
    const lulus = results.filter((r) => r.status === 'Lulus' || r.nilai >= CONFIG.KKTP).length;
    const belumLulus = total - lulus;
    const sumNilai = results.reduce((acc, curr) => acc + (Number(curr.nilai) || 0), 0);
    const rataRata = Math.round((sumNilai / total) * 10) / 10;
    return { total, lulus, belumLulus, rataRata };
  }, [results]);

  // Filter & Sort Data
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    // Filter nama
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((r) => r.nama.toLowerCase().includes(q));
    }

    // Filter kelas
    if (filterKelas !== 'Semua') {
      filtered = filtered.filter((r) => (r.kelas || CONFIG.KELAS) === filterKelas);
    }

    // Filter status
    if (filterStatus !== 'Semua') {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }

    // Filter tanggal
    if (filterTanggal.trim()) {
      filtered = filtered.filter((r) => r.timestamp.includes(filterTanggal));
    }

    // Sorting
    filtered.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'nilai' || sortField === 'noAbsen') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [results, searchQuery, filterKelas, filterStatus, filterTanggal, sortField, sortDirection]);

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedResults.length / itemsPerPage));
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedResults.slice(start, start + itemsPerPage);
  }, [filteredAndSortedResults, currentPage, itemsPerPage]);

  const toggleSort = (field: 'timestamp' | 'nama' | 'nilai' | 'noAbsen') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                Dashboard Panel Guru
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Kelas {CONFIG.KELAS} • {CONFIG.MATA_PELAJARAN}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Rekapitulasi &amp; Pengelolaan Tes Sumatif
            </h2>
          </div>

          {/* Tombol Aksi Cepat Atas */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tombol Pengaturan URL Spreadsheet */}
            <button
              id="btn-open-gas-settings"
              onClick={() => setShowGasSettings(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 cursor-pointer"
              title="Pengaturan URL Google Apps Script & Sinkronisasi"
            >
              <Settings className="w-3.5 h-3.5 text-blue-600" />
              <span>Pengaturan URL Spreadsheet</span>
            </button>

            {/* Tombol Panduan Skrip Google Apps Script */}
            <button
              id="btn-open-gas-guide"
              onClick={() => setShowGasGuide(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300 cursor-pointer"
              title="Lihat kode Apps Script & panduan Google Spreadsheet"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Panduan Skrip GAS</span>
            </button>

            {/* Tombol Download Rekap PDF */}
            <button
              id="btn-export-rekap-pdf"
              onClick={() =>
                downloadResultsRecapPDF(
                  filteredAndSortedResults.length > 0 ? filteredAndSortedResults : results
                )
              }
              disabled={results.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              title="Unduh Rekapitulasi Nilai Siswa dalam format PDF Resmi"
            >
              <FileDown className="w-3.5 h-3.5 text-white" />
              <span>Download Rekap (PDF)</span>
            </button>

            {/* Tombol Download Rekap File CSV */}
            <button
              id="btn-export-rekap-csv"
              onClick={() => exportResultsToCSV(results)}
              disabled={results.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-300 disabled:opacity-50 cursor-pointer"
              title="Unduh Rekap Hasil Tes dalam format CSV (Excel)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Download Rekap (Excel/CSV)</span>
            </button>

            {/* Tombol Refresh Data */}
            <button
              id="btn-refresh-data-top"
              onClick={loadDataFromGAS}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>REFRESH DATA</span>
            </button>
          </div>
        </div>

        {/* Toggle Otorisasi Pembahasan Soal untuk Siswa */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Akses Kunci &amp; Pembahasan Siswa:</span>
            <span className="text-slate-500">
              {allowReview
                ? 'Siswa dapat melihat kunci jawaban dan pembahasan setelah selesai.'
                : 'Kunci jawaban dan pembahasan disembunyikan dari siswa.'}
            </span>
          </div>
          <button
            onClick={() => onToggleAllowReview(!allowReview)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              allowReview
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
            }`}
          >
            {allowReview ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4" />}
            <span>{allowReview ? 'Pembahasan Aktif' : 'Pembahasan Nonaktif'}</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Peserta */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Total Peserta</span>
            <span className="text-2xl font-black text-slate-900 block">{stats.total}</span>
            <span className="text-[11px] text-slate-400">Siswa telah submit</span>
          </div>
        </div>

        {/* Jumlah Lulus */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-emerald-700 block font-bold">Jumlah Lulus</span>
            <span className="text-2xl font-black text-emerald-900 block">{stats.lulus}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">Nilai ≥ {CONFIG.KKTP}</span>
          </div>
        </div>

        {/* Jumlah Belum Lulus */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-amber-700 block font-bold">Jumlah Belum Lulus</span>
            <span className="text-2xl font-black text-amber-900 block">{stats.belumLulus}</span>
            <span className="text-[11px] text-amber-600 font-semibold">Perlu Remedial</span>
          </div>
        </div>

        {/* Rata-rata Nilai */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-indigo-700 block font-bold">Rata-rata Nilai</span>
            <span className="text-2xl font-black text-indigo-900 block">{stats.rataRata}</span>
            <span className="text-[11px] text-slate-400">Skala 0 - 100</span>
          </div>
        </div>
      </div>

      {/* Navigasi Tab: Rekap Nilai Siswa vs Bank Soal */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-6 pt-3 gap-6 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('rekap')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'rekap'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Data Nilai Siswa (Google Spreadsheet)</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {results.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('soal')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'soal'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bank Soal &amp; Pembahasan</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {questions.length} Butir
          </span>
        </button>
      </div>

      {/* TAB 1: DATA NILAI SISWA */}
      {activeTab === 'rekap' && (
        <div className="bg-white rounded-b-2xl p-6 shadow-xs border border-t-0 border-slate-200 space-y-4">
          {/* Baris Filter & Pencarian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Pencarian Nama */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari nama siswa..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter Kelas */}
            <div>
              <select
                value={filterKelas}
                onChange={(e) => {
                  setFilterKelas(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              >
                <option value="Semua">Semua Kelas</option>
                <option value="VI">Kelas VI</option>
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              >
                <option value="Semua">Semua Status</option>
                <option value="Lulus">Lulus</option>
                <option value="Belum Lulus">Belum Lulus</option>
              </select>
            </div>

            {/* Filter Tanggal */}
            <div>
              <input
                type="text"
                value={filterTanggal}
                onChange={(e) => {
                  setFilterTanggal(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filter tanggal (cth: 2026 / 12)..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Pesan Status Sinkronisasi */}
          {apiError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{apiError}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowGasSettings(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Atur URL Spreadsheet</span>
                </button>
                <button
                  id="btn-retry-sync"
                  onClick={loadDataFromGAS}
                  className="px-3 py-1.5 bg-amber-200 text-amber-900 font-bold rounded-lg hover:bg-amber-300 transition-colors cursor-pointer text-xs"
                >
                  Muat Ulang
                </button>
              </div>
            </div>
          )}

          {/* Baris Informasi Jumlah Data & Tombol Cepat Ekspor */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 pb-1">
            <div className="text-xs text-slate-600 font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
              <span>
                Menampilkan <strong className="text-slate-800">{filteredAndSortedResults.length}</strong> dari total <strong className="text-slate-800">{results.length}</strong> data siswa
                {filteredAndSortedResults.length !== results.length && ' (Filter aktif)'}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                id="btn-quick-export-pdf"
                onClick={() =>
                  downloadResultsRecapPDF(
                    filteredAndSortedResults.length > 0 ? filteredAndSortedResults : results
                  )
                }
                disabled={results.length === 0}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                title="Download Rekap Nilai Siswa (PDF Resmi Berkop)"
              >
                <FileDown className="w-3.5 h-3.5 text-rose-600" />
                <span>Unduh Rekap PDF ({filteredAndSortedResults.length})</span>
              </button>

              <button
                type="button"
                id="btn-quick-export-csv"
                onClick={() =>
                  exportResultsToCSV(
                    filteredAndSortedResults.length > 0 ? filteredAndSortedResults : results
                  )
                }
                disabled={results.length === 0}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                title="Download Rekap Nilai Excel/CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh Excel/CSV</span>
              </button>
            </div>
          </div>

          {/* Tabel Hasil Tes Siswa */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => toggleSort('timestamp')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Timestamp</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => toggleSort('nama')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Nama Siswa</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3">Kelas</th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-center"
                    onClick={() => toggleSort('noAbsen')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Absen</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center text-emerald-700">Benar</th>
                  <th className="py-3 px-3 text-center text-rose-700">Salah</th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-center"
                    onClick={() => toggleSort('nilai')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Nilai</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                        <span>Mengambil data dari Google Spreadsheet...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedResults.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500">
                      <div className="max-w-xs mx-auto space-y-1">
                        <p className="font-semibold text-slate-700">
                          {results.length === 0
                            ? 'Belum ada data nilai di Google Spreadsheet.'
                            : 'Tidak ada data siswa yang cocok dengan filter pencarian.'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {results.length === 0
                            ? 'Data dari siswa akan otomatis tercatat di sini setelah pengerjaan tes sumatif selesai.'
                            : 'Silakan sesuaikan kata kunci pencarian atau filter Anda.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedResults.map((row, idx) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;
                    const isPass = row.status === 'Lulus' || row.nilai >= CONFIG.KKTP;

                    return (
                      <tr
                        key={row.id || `${row.timestamp}-${row.nama}-${idx}`}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-3 text-center font-mono text-slate-500">
                          {rowNumber}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                          {row.timestamp}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {row.nama}
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-medium">
                          {row.kelas || CONFIG.KELAS}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-700 font-semibold">
                          {row.noAbsen}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-700">
                          {row.benar}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-rose-700">
                          {row.salah}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`font-black text-sm px-2 py-0.5 rounded ${
                              isPass
                                ? 'text-emerald-700 bg-emerald-50'
                                : 'text-amber-700 bg-amber-50'
                            }`}
                          >
                            {row.nilai}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isPass
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* Lihat Detail */}
                            <button
                              id={`btn-detail-${idx}`}
                              onClick={() => setSelectedStudentForDetail(row)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Lihat Detail Hasil"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Download PDF Hasil Siswa */}
                            <button
                              id={`btn-download-pdf-${idx}`}
                              onClick={() => downloadStudentResultPDF(row)}
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Download PDF Lembar Hasil (TTD Guru & Ortu)"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            {/* Hapus Data */}
                            <button
                              id={`btn-delete-${idx}`}
                              onClick={() => setStudentToDelete(row)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Data Siswa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 text-xs text-slate-600">
              <span>
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredAndSortedResults.length)} dari{' '}
                {filteredAndSortedResults.length} data
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-slate-800">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BANK SOAL & PEMBAHASAN */}
      {activeTab === 'soal' && (
        <div className="bg-white rounded-b-2xl p-6 shadow-xs border border-t-0 border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Struktur &amp; Bank Soal Matematika TKA ({questions.length} Butir)
              </h3>
              <p className="text-xs text-slate-500">
                18 Soal Pilihan Ganda, 3 Soal Pilihan Ganda Kompleks, 9 Soal PGK Kategori
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {onResetDefaultQuestions && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        'Kembalikan seluruh bank soal ke 30 butir standar (18 PG, 3 PGK, 9 PGK Kategori)?'
                      )
                    ) {
                      onResetDefaultQuestions();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300 cursor-pointer"
                  title="Reset seluruh soal ke 30 butir standar Kurikulum Merdeka"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                  <span>Reset ke 30 Soal Standar</span>
                </button>
              )}
              <button
                onClick={() => downloadExamQuestionsPDF(questions)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Naskah Soal (PDF)</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs px-2.5 py-1 rounded bg-blue-700 text-white">
                      #{q.id}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {q.type === 'pg' && 'Pilihan Ganda'}
                      {q.type === 'pgk' && 'Pilihan Ganda Kompleks'}
                      {q.type === 'pgk_kategori' && 'PGK Kategori'}
                    </span>
                    <span className="text-xs font-medium text-slate-600">{q.topic}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        q.difficulty === 'Mudah'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.difficulty === 'Sedang'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    <button
                      onClick={() => setEditingQuestion(q)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Soal</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-900 font-medium whitespace-pre-line">
                  {q.text}
                </p>

                {/* Opsi / Pernyataan */}
                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => {
                      const isCorrect = Array.isArray(q.correctAnswer)
                        ? q.correctAnswer.includes(opt.id)
                        : q.correctAnswer === opt.id;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-lg border flex items-start gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="w-5 font-bold">{opt.id}.</span>
                          <span className="flex-1">{opt.text}</span>
                          {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.statements && (
                  <div className="space-y-1.5 text-xs">
                    {q.statements.map((st, sIdx) => (
                      <div
                        key={st.id}
                        className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between"
                      >
                        <span>
                          <strong className="mr-1">{sIdx + 1}.</strong>
                          {st.text}
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            st.correctAnswer
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {st.correctAnswer ? 'BENAR' : 'SALAH'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pembahasan */}
                <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-slate-700">
                  <span className="font-bold text-blue-900 block mb-0.5">Pembahasan:</span>
                  <p className="whitespace-pre-line">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Detail Hasil Siswa */}
      <StudentDetailModal
        result={selectedStudentForDetail}
        isOpen={Boolean(selectedStudentForDetail)}
        onClose={() => setSelectedStudentForDetail(null)}
      />

      {/* Modal Edit Soal */}
      <QuestionEditorModal
        question={editingQuestion}
        isOpen={Boolean(editingQuestion)}
        onClose={() => setEditingQuestion(null)}
        onSave={(updated) => {
          onUpdateQuestion(updated);
          setEditingQuestion(null);
        }}
      />

      {/* Modal Panduan Skrip Google Apps Script */}
      <GasGuideModal isOpen={showGasGuide} onClose={() => setShowGasGuide(false)} />

      {/* Modal Pengaturan URL Google Apps Script */}
      <GasSettingsModal
        isOpen={showGasSettings}
        onClose={() => setShowGasSettings(false)}
        onOpenGasGuide={() => setShowGasGuide(true)}
        onDataSynced={loadDataFromGAS}
      />

      {/* Modal Konfirmasi Hapus Data Siswa */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Data Siswa</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 mb-5">
              Apakah Anda yakin ingin menghapus data ujian atas nama{' '}
              <strong className="text-slate-900 font-bold">{studentToDelete.nama}</strong> (Nomor
              Absen {studentToDelete.noAbsen})?
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Data</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
