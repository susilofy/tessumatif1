import React, { useState } from 'react';
import { CONFIG } from '../config';
import { StudentIdentity } from '../types';
import {
  User,
  Hash,
  Calendar,
  ArrowRight,
  School,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Award,
} from 'lucide-react';

interface Stage1IdentityProps {
  onStartExam: (identity: StudentIdentity) => void;
  initialIdentity?: StudentIdentity;
}

const BULAN_LIST = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const Stage1Identity: React.FC<Stage1IdentityProps> = ({
  onStartExam,
  initialIdentity,
}) => {
  const [nama, setNama] = useState(initialIdentity?.nama || '');
  const [noAbsen, setNoAbsen] = useState(initialIdentity?.noAbsen || '');
  const [hari, setHari] = useState(initialIdentity?.tglLahir?.hari || '');
  const [bulan, setBulan] = useState(initialIdentity?.tglLahir?.bulan || '');
  const [tahun, setTahun] = useState(initialIdentity?.tglLahir?.tahun || '');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi data wajib diisi
    if (!nama.trim()) {
      setErrorMessage('Silakan isi Nama Lengkap terlebih dahulu.');
      return;
    }
    if (!noAbsen.trim()) {
      setErrorMessage('Silakan isi Nomor Absen.');
      return;
    }
    if (!hari || !bulan || !tahun) {
      setErrorMessage('Silakan lengkapi data Tanggal Lahir (Hari, Bulan, dan Tahun).');
      return;
    }

    setErrorMessage('');
    onStartExam({
      nama: nama.trim(),
      noAbsen: noAbsen.trim(),
      tglLahir: { hari, bulan, tahun },
    });
  };

  // Generate opsi hari (1 - 31)
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  // Generate opsi tahun (2010 - 2016 untuk siswa kelas 6 SD)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear - 16 + i));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Pengumuman Tes */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tes Sumatif Matematika Kelas {CONFIG.KELAS}
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
          Materi Pokok: <span className="font-semibold text-slate-800">{CONFIG.MATERI}</span>.
          Silakan lengkapi identitas Anda dengan benar sebelum memulai pengerjaan soal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Form Identitas Siswa */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tahap 1: Formulir Identitas Siswa
              </h3>
              <p className="text-xs text-slate-500">
                Seluruh kolom bertanda bintang (<span className="text-red-500">*</span>) wajib diisi
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              Siswa Terverifikasi
            </span>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Lengkap */}
            <div>
              <label
                htmlFor="input-nama-lengkap"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Nama Lengkap Siswa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="input-nama-lengkap"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: I Putu Agus Wirawan"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Nomor Absen */}
            <div>
              <label
                htmlFor="input-no-absen"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Nomor Absen Siswa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  id="input-no-absen"
                  type="number"
                  min="1"
                  max="60"
                  value={noAbsen}
                  onChange={(e) => setNoAbsen(e.target.value)}
                  placeholder="Contoh: 15"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Tanggal Lahir (Hari, Bulan, Tahun) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tanggal Lahir Siswa <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Hari */}
                <div>
                  <select
                    id="select-tgl-hari"
                    value={hari}
                    onChange={(e) => setHari(e.target.value)}
                    className="w-full px-2.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                    required
                  >
                    <option value="">Hari</option>
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bulan */}
                <div>
                  <select
                    id="select-tgl-bulan"
                    value={bulan}
                    onChange={(e) => setBulan(e.target.value)}
                    className="w-full px-2.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                    required
                  >
                    <option value="">Bulan</option>
                    {BULAN_LIST.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tahun */}
                <div>
                  <select
                    id="select-tgl-tahun"
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    className="w-full px-2.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                    required
                  >
                    <option value="">Tahun</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Pilih tanggal, bulan, dan tahun kelahiran Anda.
              </p>
            </div>

            {/* Tombol Mulai Tes */}
            <div className="pt-3">
              <button
                id="btn-mulai-tes"
                type="submit"
                className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                <span>Mulai Tes</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Kolom Kanan: Rincian Info Tes & Ketentuan */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card Komposisi Soal & Aturan */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" />
              Komposisi & Format Soal
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span>1. Pilihan Ganda (PG)</span>
                <span className="font-bold text-blue-300">18 Butir</span>
              </div>
              <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span>2. Pilihan Ganda Kompleks (PGK)</span>
                <span className="font-bold text-emerald-300">3 Butir</span>
              </div>
              <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span>3. PGK Kategori (Benar / Salah)</span>
                <span className="font-bold text-amber-300">9 Butir</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-slate-300">
                <span>Total Butir Soal:</span>
                <span className="font-extrabold text-white text-sm">30 Soal</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <p className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Soal dan opsi jawaban diacak otomatis secara adil untuk setiap siswa.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Seluruh 30 soal wajib dijawab sebelum jawaban dapat dikirimkan ke server.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
