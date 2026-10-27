/**
 * Definisi Type & Interface Aplikasi Tes Sumatif
 */

export type QuestionType = 'pg' | 'pgk' | 'pgk_kategori';
export type Difficulty = 'Mudah' | 'Sedang' | 'Sukar';

export interface StudentBirthDate {
  hari: string;
  bulan: string;
  tahun: string;
}

export interface StudentIdentity {
  nama: string;
  noAbsen: string;
  tglLahir: StudentBirthDate;
}

export interface OptionItem {
  id: string; // e.g. 'A', 'B', 'C', 'D'
  text: string;
}

export interface StatementItem {
  id: string; // e.g. 's1', 's2', 's3'
  text: string;
  correctAnswer: boolean; // true = Benar, false = Salah
}

export type CognitiveLevel = 'L1' | 'L2' | 'L3';
export type KurikulumElemen =
  | 'Bilangan'
  | 'Aljabar'
  | 'Pengukuran'
  | 'Geometri'
  | 'Analisis Data dan Peluang';

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: OptionItem[]; // Untuk 'pg' (4 opsi) dan 'pgk' (3 opsi)
  statements?: StatementItem[]; // Untuk 'pgk_kategori' (3 pernyataan)
  correctAnswer?: string | string[]; // string untuk 'pg' (e.g. 'B'), array untuk 'pgk' (e.g. ['A', 'C'])
  difficulty: Difficulty;
  explanation: string;
  topic: string;
  // Kurikulum Merdeka Blueprint fields
  elemen?: string;
  tujuanPembelajaran?: string;
  indikatorSoal?: string;
  levelKognitif?: CognitiveLevel;
  bobot?: number;
}

export interface ShuffledQuestion extends Question {
  originalQuestionId: number;
  shuffledOptions?: OptionItem[];
}

export type AnswerValue = string | string[] | Record<string, boolean>;

export interface StudentItemResponse {
  questionId: number;
  isCorrect: boolean;
  score: number; // 0, 1, or partial fraction (e.g. 0.33, 0.67)
  maxScore: number;
  status: 'benar' | 'salah' | 'sebagian';
  userAnswerText?: string;
}

export interface QuestionItemAnalysis {
  questionId: number;
  questionNumber: number;
  topic: string;
  elemen: string;
  type: QuestionType;
  levelKognitif: CognitiveLevel;
  difficulty: Difficulty;
  correctCount: number;
  partialCount: number;
  wrongCount: number;
  totalStudents: number;
  persentaseKetercapaian: number; // 0 - 100
  klasifikasiKesukaran: 'Mudah' | 'Sedang' | 'Sukar'; // >70% Mudah, 30-70% Sedang, <30% Sukar
  dayaPembeda: number; // Indeks diskriminasi (D)
  dayaPembedaLabel: string;
  kunciJawaban: string;
  bobot: number;
}

export interface QuestionBlueprint {
  questionId: number;
  noSoal: number;
  elemen: string;
  tujuanPembelajaran: string;
  materiPokok: string;
  indikatorSoal: string;
  levelKognitif: CognitiveLevel;
  levelKognitifLabel: string;
  bentukSoal: string;
  kunciJawaban: string;
  bobotSkor: number;
  difficulty: Difficulty;
}

export interface StudentDiagnostic {
  result: ExamResult;
  totalScore: number;
  maxPossibleScore: number;
  nilaiAkhir: number;
  isLulus: boolean;
  correctQuestions: number[];
  partialQuestions: number[];
  wrongQuestions: number[];
  weakTopics: { topic: string; elemen: string; wrongQuestions: number[] }[];
  weakIndicators: string[];
  recommendations: string[];
}

export interface ExamResult {
  id?: string;
  timestamp: string;
  nama: string;
  noAbsen: string;
  kelas: string;
  tglLahir?: string;
  benar: number;
  salah: number;
  nilai: number;
  status: 'Lulus' | 'Belum Lulus';
  detailJawaban?: Record<number, AnswerValue>;
  itemResponses?: Record<number, StudentItemResponse>;
  durasiPengerjaan?: string;
}

export type AppStage = 1 | 2 | 3 | 4;

