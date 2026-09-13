/**
 * Aplikasi Website Tes Sumatif
 * SEKOLAH DASAR - JEMBRANA - KELAS VI
 * Mata Pelajaran: MATEMATIKA (TKA)
 */

import React, { useState, useEffect } from 'react';
import { CONFIG } from './config';
import { AppStage, StudentIdentity, ExamResult, Question } from './types';
import { INITIAL_QUESTIONS } from './data/defaultQuestions';
import { Navbar } from './components/Navbar';
import { Stage1Identity } from './components/Stage1Identity';
import { Stage2Exam } from './components/Stage2Exam';
import { Stage3Result } from './components/Stage3Result';
import { Stage4TeacherPanel } from './components/Stage4TeacherPanel';
import { TeacherAuthModal } from './components/TeacherAuthModal';

const STORAGE_QUESTIONS_KEY = 'sd3_loloan_timur_questions_v2';
const STORAGE_ALLOW_REVIEW_KEY = 'sd3_loloan_timur_allow_review';

export default function App() {
  // Tahap aktif: 1 (Identitas), 2 (Soal Tes), 3 (Hasil Tes), 4 (Panel Guru)
  const [currentStage, setCurrentStage] = useState<AppStage>(1);
  const [prevStage, setPrevStage] = useState<AppStage>(1);

  // Data identitas siswa yang sedang mengerjakan
  const [studentIdentity, setStudentIdentity] = useState<StudentIdentity | null>(null);

  // Hasil ujian siswa terakhir
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Bank Soal (dimuat dari default & sinkron dengan localStorage jika diedit guru)
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_QUESTIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Pastikan jumlah dan struktur sesuai dengan distribusi soal terbaru (30 soal: 18 PG, 3 PGK, 9 PGK Kategori)
        if (Array.isArray(parsed) && parsed.length === INITIAL_QUESTIONS.length) {
          return parsed;
        }
      }
    } catch {
      // Fallback ke initial questions
    }
    return INITIAL_QUESTIONS;
  });

  // Otorisasi guru melihat pembahasan
  const [allowReview, setAllowReview] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ALLOW_REVIEW_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Status autentikasi guru
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(false);
  const [showTeacherAuthModal, setShowTeacherAuthModal] = useState<boolean>(false);

  // Update soal dari panel guru
  const handleUpdateQuestion = (updated: Question) => {
    setQuestions((prev) => {
      const next = prev.map((q) => (q.id === updated.id ? updated : q));
      try {
        localStorage.setItem(STORAGE_QUESTIONS_KEY, JSON.stringify(next));
      } catch {
        // Storage fail silent
      }
      return next;
    });
  };

  // Reset soal ke 30 butir standar (18 PG, 3 PGK, 9 PGK Kategori)
  const handleResetDefaultQuestions = () => {
    setQuestions(INITIAL_QUESTIONS);
    try {
      localStorage.setItem(STORAGE_QUESTIONS_KEY, JSON.stringify(INITIAL_QUESTIONS));
    } catch {
      // Storage fail silent
    }
  };

  // Toggle izin review siswa
  const handleToggleAllowReview = (val: boolean) => {
    setAllowReview(val);
    try {
      localStorage.setItem(STORAGE_ALLOW_REVIEW_KEY, String(val));
    } catch {
      // Storage fail silent
    }
  };

  // Transisi Tahap 1 -> Tahap 2 (Mulai Tes)
  const handleStartExam = (identity: StudentIdentity) => {
    setStudentIdentity(identity);
    setCurrentStage(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transisi Tahap 2 -> Tahap 3 (Selesai Tes & Simpan Hasil)
  const handleFinishExam = (result: ExamResult) => {
    setExamResult(result);
    setCurrentStage(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restart / Siswa Baru
  const handleRestartExam = () => {
    setExamResult(null);
    setCurrentStage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Buka Panel Guru
  const handleOpenTeacherPanel = () => {
    if (isTeacherAuthenticated) {
      setPrevStage(currentStage);
      setCurrentStage(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowTeacherAuthModal(true);
    }
  };

  // Sukses login guru
  const handleTeacherAuthSuccess = () => {
    setIsTeacherAuthenticated(true);
    setShowTeacherAuthModal(false);
    setPrevStage(currentStage);
    setCurrentStage(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Kembali dari Panel Guru ke halaman siswa
  const handleBackToStudentView = () => {
    setCurrentStage(prevStage === 4 ? 1 : prevStage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Header Navigasi Atas */}
      <Navbar
        currentStage={currentStage}
        onOpenTeacherPanel={handleOpenTeacherPanel}
        onBackToStudentView={handleBackToStudentView}
      />

      {/* Konten Utama Berdasarkan Tahap */}
      <main className="flex-1">
        {/* TAHAP 1: IDENTITAS SISWA */}
        {currentStage === 1 && (
          <Stage1Identity
            onStartExam={handleStartExam}
            initialIdentity={studentIdentity || undefined}
          />
        )}

        {/* TAHAP 2: SOAL TES */}
        {currentStage === 2 && studentIdentity && (
          <Stage2Exam
            student={studentIdentity}
            questions={questions}
            onFinishExam={handleFinishExam}
          />
        )}

        {/* TAHAP 3: HASIL TES */}
        {currentStage === 3 && examResult && (
          <Stage3Result
            result={examResult}
            questions={questions}
            allowReview={allowReview}
            onRestart={handleRestartExam}
          />
        )}

        {/* TAHAP 4: PANEL GURU */}
        {currentStage === 4 && (
          <Stage4TeacherPanel
            questions={questions}
            onUpdateQuestion={handleUpdateQuestion}
            onResetDefaultQuestions={handleResetDefaultQuestions}
            allowReview={allowReview}
            onToggleAllowReview={handleToggleAllowReview}
          />
        )}
      </main>

      {/* Footer Resmi */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p id="footer-developer-credit" className="font-semibold text-slate-700">
            Web Developer-susilo fitri yatmoko
          </p>
          <p>
            Mata Pelajaran: {CONFIG.MATA_PELAJARAN} (Materi: {CONFIG.MATERI}) | Kelas {CONFIG.KELAS} | KKTP: {CONFIG.KKTP}
          </p>
        </div>
      </footer>

      {/* Modal Autentikasi Guru */}
      <TeacherAuthModal
        isOpen={showTeacherAuthModal}
        onClose={() => setShowTeacherAuthModal(false)}
        onSuccess={handleTeacherAuthSuccess}
      />
    </div>
  );
}
