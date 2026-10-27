import React from 'react';
import { CONFIG } from '../config';
import { ExamResult, Question, StudentDiagnostic } from '../types';
import { getStudentDiagnostic } from '../utils/itemAnalysisHelper';
import { downloadStudentResultPDF } from '../utils/pdfGenerator';
import {
  X,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  BookOpen,
  ArrowRight,
  Download,
  Brain,
  Lightbulb,
  GraduationCap,
} from 'lucide-react';

interface StudentAnalysisModalProps {
  result: ExamResult | null;
  questions: Question[];
  isOpen: boolean;
  onClose: () => void;
}

export const StudentAnalysisModal: React.FC<StudentAnalysisModalProps> = ({
  result,
  questions,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !result) return null;

  const responses = result.itemResponses || {};
  const diagnostic: StudentDiagnostic = getStudentDiagnostic(result, questions, responses);
  const isPass = diagnostic.isLulus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                isPass ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {isPass ? <Award className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">{result.nama}</h3>
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {isPass ? 'Tuntas KKTP' : 'Perlu Remedial'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Nomor Absen: <strong className="text-slate-700">{result.noAbsen}</strong> • Kelas{' '}
                <strong className="text-slate-700">{result.kelas || CONFIG.KELAS}</strong> • Waktu
                Submit: {result.timestamp}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Baris Skor & Ringkasan Pencapaian */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Nilai Akhir
              </span>
              <span
                className={`text-3xl font-black my-1 block ${
                  isPass ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {result.nilai}
              </span>
              <span className="text-[11px] text-slate-400">KKTP: {CONFIG.KKTP}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Benar Penuh
              </span>
              <span className="text-3xl font-black text-emerald-900 my-1 block">
                {diagnostic.correctQuestions.length}
              </span>
              <span className="text-[11px] text-emerald-700">Skor 1.0</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                Benar Sebagian
              </span>
              <span className="text-3xl font-black text-amber-900 my-1 block">
                {diagnostic.partialQuestions.length}
              </span>
              <span className="text-[11px] text-amber-700">Skor Parsial</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                Salah
              </span>
              <span className="text-3xl font-black text-rose-900 my-1 block">
                {diagnostic.wrongQuestions.length}
              </span>
              <span className="text-[11px] text-rose-700">Skor 0</span>
            </div>
          </div>

          {/* MATRIKS STATUS RESPO BUTIR SOAL INDIVIDUAL */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Matriks Respon 30 Butir Soal
              </h4>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Benar
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Sebagian
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Salah
                </span>
              </div>
            </div>

            {/* Grid Butir Soal */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {questions.map((q, idx) => {
                const qNum = idx + 1;
                const isCorrect = diagnostic.correctQuestions.includes(qNum);
                const isPartial = diagnostic.partialQuestions.includes(qNum);

                let badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
                if (isCorrect) badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black';
                else if (isPartial) badgeClass = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';

                return (
                  <div
                    key={q.id}
                    title={`Soal ${qNum}: ${q.topic} (${isCorrect ? 'Benar' : isPartial ? 'Sebagian' : 'Salah'})`}
                    className={`p-2 rounded-xl border text-center transition-all ${badgeClass}`}
                  >
                    <div className="text-[10px] text-slate-500">S{qNum}</div>
                    <div className="text-xs font-bold mt-0.5">
                      {isCorrect ? '1' : isPartial ? '½' : '0'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ANALISIS KELEMAHAN INDIKATOR & TOPIK MATERI */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-rose-600" />
              Analisis Kelemahan Indikator &amp; Topik yang Belum Dikuasai
            </h4>

            {diagnostic.weakTopics.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Luar biasa! Siswa telah menguasai seluruh topik materi dan indikator asesmen dengan
                  sempurna.
                </span>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {diagnostic.weakTopics.map((wt) => (
                    <div
                      key={wt.topic}
                      className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-900 text-xs">{wt.topic}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-200 text-rose-800 rounded-md">
                          Elemen {wt.elemen}
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-700">
                        Belum tuntas pada butir nomor:{' '}
                        <strong>Soal {wt.wrongQuestions.join(', ')}</strong>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Rincian Indikator */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                    Rincian Indikator Soal yang Belum Tercapai:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {diagnostic.weakIndicators.slice(0, 5).map((ind, i) => (
                      <li key={i} className="line-clamp-2">
                        {ind}
                      </li>
                    ))}
                    {diagnostic.weakIndicators.length > 5 && (
                      <li className="text-slate-400 font-medium">
                        ...dan {diagnostic.weakIndicators.length - 5} indikator lainnya.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* REKOMENDASI TINDAK LANJUT PEDAGOGIS */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Rekomendasi Tindak Lanjut Guru (Kurikulum Merdeka)
            </h4>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2.5">
              {diagnostic.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 text-indigo-950 text-xs sm:text-sm">
                  <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-800 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => downloadStudentResultPDF(result)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Unduh PDF Lembar Siswa</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Tutup Diagnosis
          </button>
        </div>
      </div>
    </div>
  );
};
