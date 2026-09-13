import React, { useState, useMemo } from 'react';
import { CONFIG } from '../config';
import {
  Question,
  ShuffledQuestion,
  StudentIdentity,
  AnswerValue,
  ExamResult,
  OptionItem,
} from '../types';
import { gasService } from '../services/gasService';
import { downloadExamQuestionsPDF } from '../utils/pdfGenerator';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Download,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  User,
  Check,
  RefreshCw,
} from 'lucide-react';

interface Stage2ExamProps {
  student: StudentIdentity;
  questions: Question[];
  onFinishExam: (result: ExamResult) => void;
}

// Fisher-Yates shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const Stage2Exam: React.FC<Stage2ExamProps> = ({
  student,
  questions,
  onFinishExam,
}) => {
  // 1. Acak urutan soal dan opsi jawaban saat tes dimulai
  const shuffledQuestions = useMemo<ShuffledQuestion[]>(() => {
    // Acak urutan soal
    const shuffledQ: Question[] = shuffleArray<Question>(questions);

    return shuffledQ.map((q: Question) => {
      if (q.type === 'pg' || q.type === 'pgk') {
        if (q.options && q.options.length > 0) {
          // Acak opsi jawaban tetapi beri label baru A, B, C, D yang rapi
          const shuffledOpts: OptionItem[] = shuffleArray<OptionItem>(q.options);
          const standardLabels = ['A', 'B', 'C', 'D'];
          const remappedOptions: OptionItem[] = shuffledOpts.map((opt, idx) => ({
            id: standardLabels[idx] || opt.id,
            text: opt.text,
          }));

          return {
            ...q,
            originalQuestionId: q.id,
            shuffledOptions: remappedOptions,
          };
        }
      }
      return {
        ...q,
        originalQuestionId: q.id,
      };
    });
  }, [questions]);

  // State pengerjaan
  const [currentIndex, setCurrentIndex] = useState(0);
  // Answers state keyed by question index (0 to 21)
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  // Konfirmasi kirim modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // Status pengiriman
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentQ = shuffledQuestions[currentIndex];
  const totalQuestions = shuffledQuestions.length;

  // Cek apakah soal nomor tertentu sudah dijawab
  const isQuestionAnswered = (idx: number): boolean => {
    const ans = answers[idx];
    if (!ans) return false;

    const q = shuffledQuestions[idx];
    if (q.type === 'pg') {
      return typeof ans === 'string' && ans.length > 0;
    }
    if (q.type === 'pgk') {
      return Array.isArray(ans) && ans.length > 0;
    }
    if (q.type === 'pgk_kategori') {
      if (typeof ans === 'object' && !Array.isArray(ans)) {
        const statements = q.statements || [];
        return statements.every((st) => ans[st.id] !== undefined);
      }
      return false;
    }
    return false;
  };

  // Hitung jumlah soal yang telah dijawab
  const answeredCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < totalQuestions; i++) {
      if (isQuestionAnswered(i)) count++;
    }
    return count;
  }, [answers, totalQuestions, shuffledQuestions]);

  const allAnswered = answeredCount === totalQuestions;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Handler jawaban Pilihan Ganda (PG)
  const handleSelectPG = (optionText: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionText,
    }));
  };

  // Handler jawaban Pilihan Ganda Kompleks (PGK)
  const handleTogglePGK = (optionText: string) => {
    setAnswers((prev) => {
      const currentList = Array.isArray(prev[currentIndex]) ? (prev[currentIndex] as string[]) : [];
      if (currentList.includes(optionText)) {
        return {
          ...prev,
          [currentIndex]: currentList.filter((item) => item !== optionText),
        };
      } else {
        return {
          ...prev,
          [currentIndex]: [...currentList, optionText],
        };
      }
    });
  };

  // Handler jawaban PGK Kategori (Benar / Salah)
  const handleSetCategoryStatement = (statementId: string, value: boolean) => {
    setAnswers((prev) => {
      const currentMap =
        typeof prev[currentIndex] === 'object' && !Array.isArray(prev[currentIndex])
          ? { ...(prev[currentIndex] as Record<string, boolean>) }
          : {};
      currentMap[statementId] = value;
      return {
        ...prev,
        [currentIndex]: currentMap,
      };
    });
  };

  // Navigasi soal
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1);
  };

  // Hitung Nilai & Validasi
  const calculateResult = (): ExamResult => {
    let totalScore = 0;
    let benarCount = 0;

    shuffledQuestions.forEach((sq, idx) => {
      const userAns = answers[idx];
      // Cari soal original untuk periksa kunci jawaban
      const origQ = questions.find((q) => q.id === sq.originalQuestionId) || sq;

      if (sq.type === 'pg') {
        // Cocokkan teks opsi yang dipilih dengan teks opsi dari kunci jawaban original
        const correctOpt = origQ.options?.find((o) => o.id === origQ.correctAnswer);
        if (correctOpt && userAns === correctOpt.text) {
          totalScore += 1;
          benarCount += 1;
        }
      } else if (sq.type === 'pgk') {
        // Jawaban benar bisa lebih dari satu
        const correctKeys = Array.isArray(origQ.correctAnswer) ? origQ.correctAnswer : [];
        const correctTexts = (origQ.options || [])
          .filter((o) => correctKeys.includes(o.id))
          .map((o) => o.text);

        const userSelected = Array.isArray(userAns) ? userAns : [];
        const isMatch =
          correctTexts.length === userSelected.length &&
          correctTexts.every((txt) => userSelected.includes(txt));

        if (isMatch) {
          totalScore += 1;
          benarCount += 1;
        }
      } else if (sq.type === 'pgk_kategori') {
        // 3 pernyataan Benar/Salah
        const statements = origQ.statements || [];
        const userMap = (typeof userAns === 'object' && !Array.isArray(userAns) ? userAns : {}) as Record<string, boolean>;

        let statementsCorrect = 0;
        statements.forEach((st) => {
          if (userMap[st.id] === st.correctAnswer) {
            statementsCorrect += 1;
          }
        });

        if (statementsCorrect === statements.length) {
          totalScore += 1;
          benarCount += 1;
        } else {
          // Memberi bobot proporsional untuk nilai akhir
          totalScore += statementsCorrect / statements.length;
        }
      }
    });

    // Skala 0 - 100
    const finalScore = Math.round((totalScore / totalQuestions) * 100);
    const salahCount = totalQuestions - benarCount;
    const status: 'Lulus' | 'Belum Lulus' = finalScore >= CONFIG.KKTP ? 'Lulus' : 'Belum Lulus';

    const tglLahirStr = student.tglLahir
      ? `${student.tglLahir.hari} ${student.tglLahir.bulan} ${student.tglLahir.tahun}`
      : '-';

    return {
      id: `res-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      nama: student.nama,
      noAbsen: student.noAbsen,
      kelas: CONFIG.KELAS,
      tglLahir: tglLahirStr,
      benar: benarCount,
      salah: salahCount,
      nilai: finalScore,
      status,
      detailJawaban: answers,
    };
  };

  // Proses Kirim Jawaban ke Google Apps Script
  const handleConfirmSubmit = async () => {
    // Validasi ulang semua soal terjawab
    if (!allAnswered) {
      alert('Masih ada butir soal yang belum dijawab. Harap jawab seluruh soal terlebih dahulu!');
      setShowConfirmModal(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const calculatedResult = calculateResult();

    try {
      // Kirim data ke Google Apps Script
      await gasService.submitExamResult(calculatedResult);
      // Hanya tampilkan berhasil / pindah halaman setelah server merespons sukses!
      setIsSubmitting(false);
      setShowConfirmModal(false);
      onFinishExam(calculatedResult);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(
        err.message ||
          'Gagal mengirim data ke server. Periksa koneksi internet atau konfigurasi Google Apps Script.'
      );
    }
  };

  // Opsi aktif untuk soal saat ini
  const currentOptions = currentQ.shuffledOptions || currentQ.options || [];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Header Info Siswa & Progres */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{student.nama}</span>
                <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                  Absen: {student.noAbsen}
                </span>
                <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                  Kelas {CONFIG.KELAS}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {CONFIG.SEKOLAH} • {CONFIG.MATA_PELAJARAN} ({CONFIG.MATERI})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Unduh Naskah Soal PDF */}
            <button
              id="btn-download-questions-pdf"
              onClick={() => downloadExamQuestionsPDF(questions)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300 cursor-pointer"
              title="Unduh Lembar Naskah Soal dalam bentuk PDF"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Unduh Soal (PDF)</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-slate-600">
              Progres Pengerjaan: <span className="text-blue-700 font-bold">{answeredCount}</span> dari {totalQuestions} Soal Terjawab
            </span>
            <span className="text-blue-700 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Layout: Konten Soal + Navigasi Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Lembar Soal Aktif */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 min-h-[420px] flex flex-col justify-between">
            <div>
              {/* Header Nomor & Tipe Soal */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm sm:text-base font-extrabold px-3 py-1 bg-blue-700 text-white rounded-xl shadow-2xs">
                    Soal No. {currentIndex + 1}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {currentQ.type === 'pg' && 'Pilihan Ganda'}
                    {currentQ.type === 'pgk' && 'Pilihan Ganda Kompleks'}
                    {currentQ.type === 'pgk_kategori' && 'PGK Kategori (Benar / Salah)'}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {currentQ.topic}
                </span>
              </div>

              {/* Petunjuk Pengisian Berdasarkan Tipe */}
              <div className="mb-4 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-100 inline-block">
                {currentQ.type === 'pg' && 'Pilihlah salah satu jawaban yang paling tepat.'}
                {currentQ.type === 'pgk' && 'Pilihlah seluruh pernyataan yang bernilai benar (bisa lebih dari satu).'}
                {currentQ.type === 'pgk_kategori' && 'Tentukan pilihan Benar atau Salah untuk setiap pernyataan di bawah ini.'}
              </div>

              {/* Teks Soal */}
              <div className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium whitespace-pre-line mb-6">
                {currentQ.text}
              </div>

              {/* Tampilan Opsi Jawaban: Pilihan Ganda (PG) */}
              {currentQ.type === 'pg' && (
                <div className="space-y-2.5">
                  {currentOptions.map((opt) => {
                    const isSelected = answers[currentIndex] === opt.text;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectPG(opt.text)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold ring-1 ring-blue-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.id}
                        </div>
                        <span className="text-xs sm:text-sm mt-0.5 leading-normal flex-1">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tampilan Opsi Jawaban: Pilihan Ganda Kompleks (PGK) */}
              {currentQ.type === 'pgk' && (
                <div className="space-y-2.5">
                  {currentOptions.map((opt) => {
                    const currentList = Array.isArray(answers[currentIndex])
                      ? (answers[currentIndex] as string[])
                      : [];
                    const isChecked = currentList.includes(opt.text);

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleTogglePGK(opt.text)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                          isChecked
                            ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isChecked ? <Check className="w-4 h-4" /> : opt.id}
                        </div>
                        <span className="text-xs sm:text-sm mt-0.5 leading-normal flex-1">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tampilan Opsi Jawaban: PGK Kategori (Benar / Salah) */}
              {currentQ.type === 'pgk_kategori' && (
                <div className="space-y-3">
                  {(currentQ.statements || []).map((st, sIdx) => {
                    const ansMap =
                      typeof answers[currentIndex] === 'object' && !Array.isArray(answers[currentIndex])
                        ? (answers[currentIndex] as Record<string, boolean>)
                        : {};
                    const currentVal = ansMap[st.id];

                    return (
                      <div
                        key={st.id}
                        className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/60"
                      >
                        <p className="text-xs sm:text-sm text-slate-800 font-medium mb-3">
                          <span className="font-bold text-blue-700 mr-1.5">
                            {sIdx + 1}.
                          </span>
                          {st.text}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleSetCategoryStatement(st.id, true)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                              currentVal === true
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>BENAR</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetCategoryStatement(st.id, false)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                              currentVal === false
                                ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>SALAH</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tombol Aksi Bawah: Sebelumnya & Berikutnya */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 gap-3">
              <button
                id="btn-prev-question"
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  id="btn-next-question"
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="btn-finish-test-prompt"
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Jawaban</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Grid Navigasi Nomor Soal & Ringkasan */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
              <span>Nomor Soal Ujian</span>
              <span className="text-[11px] font-normal text-slate-500">22 Butir</span>
            </h4>

            {/* Grid 22 Soal */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 mb-4">
              {shuffledQuestions.map((_, i) => {
                const isCurrent = currentIndex === i;
                const isAnswered = isQuestionAnswered(i);

                let btnClass = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
                if (isAnswered) {
                  btnClass = 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700';
                }
                if (isCurrent) {
                  btnClass = 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300 font-extrabold';
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center border transition-all cursor-pointer ${btnClass}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Keterangan Warna */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span>Soal Sedang Dikerjakan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span>Sudah Dijawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-200" />
                <span>Belum Dijawab ({totalQuestions - answeredCount})</span>
              </div>
            </div>

            {/* Tombol Kirim Utama */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                id="btn-sidebar-submit"
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  allAnswered
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {allAnswered ? 'Selesai & Kirim Jawaban' : 'Kirim Jawaban'}
                </span>
              </button>

              {!allAnswered && (
                <p className="mt-2 text-[11px] text-amber-700 text-center font-medium">
                  Harap jawab seluruh {totalQuestions} soal sebelum mengirim.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Kirim Jawaban */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Konfirmasi Pengiriman Jawaban
                </h3>
                <p className="text-xs text-slate-500">
                  Periksa kembali kepastian jawaban Anda
                </p>
              </div>
            </div>

            {!allAnswered ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-5">
                <p className="font-bold mb-1">Peringatan: Belum Semua Soal Dijawab!</p>
                <p>
                  Anda baru menjawab <span className="font-bold">{answeredCount}</span> dari {totalQuestions} butir soal. Sesuai ketentuan, Anda tidak dapat mengirim tes sebelum seluruh soal terjawab.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs mb-5 space-y-1">
                <p className="font-bold">Apakah Anda yakin ingin mengirim jawaban?</p>
                <p>
                  Setelah dikirim, nilai akan dihitung dan tersimpan secara permanen ke rekap Google Spreadsheet sekolah.
                </p>
              </div>
            )}

            {submitError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs mb-4">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Gagal Mengirim Data
                </p>
                <p>{submitError}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                id="btn-cancel-submit"
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setShowConfirmModal(false);
                  setSubmitError(null);
                }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal / Kembali ke Soal
              </button>

              {allAnswered && (
                <button
                  id="btn-confirm-submit-answers"
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmSubmit}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim ke Server...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Ya, Kirim Jawaban</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
