import React from 'react';
import { CONFIG } from '../config';
import { ExamResult } from '../types';
import { downloadStudentResultPDF } from '../utils/pdfGenerator';
import { X, Download, User, Calendar, Hash, Award, CheckCircle2, XCircle } from 'lucide-react';

interface StudentDetailModalProps {
  result: ExamResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  result,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !result) return null;

  const isPass = result.status === 'Lulus' || result.nilai >= CONFIG.KKTP;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{result.nama}</h3>
              <p className="text-xs text-slate-500">
                Absen {result.noAbsen} • Kelas {result.kelas || CONFIG.KELAS}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4 text-xs sm:text-sm">
          {/* Nilai Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Nilai Tes Sumatif</span>
              <span className="text-xs text-slate-400">KKTP: {CONFIG.KKTP}</span>
            </div>
            <div className="text-right">
              <span
                className={`text-3xl font-black block ${
                  isPass ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {result.nilai}
              </span>
              <span
                className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isPass
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {result.status}
              </span>
            </div>
          </div>

          {/* Grid Rincian */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Benar</span>
              </div>
              <span className="text-xl font-black text-emerald-900">{result.benar} Soal</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs mb-1">
                <XCircle className="w-4 h-4" />
                <span>Salah</span>
              </div>
              <span className="text-xl font-black text-rose-900">{result.salah} Soal</span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Waktu Pengerjaan:</span>
              <span className="font-medium text-slate-800">{result.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tanggal Lahir:</span>
              <span className="font-medium text-slate-800">{result.tglLahir || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Satuan Pendidikan:</span>
              <span className="font-medium text-slate-800">{CONFIG.SEKOLAH}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => downloadStudentResultPDF(result)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Lembar Hasil (PDF)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
