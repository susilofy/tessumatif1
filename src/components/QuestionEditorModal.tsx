import React, { useState } from 'react';
import { Question, OptionItem, StatementItem, Difficulty } from '../types';
import { X, Save, Edit3, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface QuestionEditorModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedQuestion: Question) => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  question,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !question) return null;

  const [text, setText] = useState(question.text);
  const [topic, setTopic] = useState(question.topic);
  const [difficulty, setDifficulty] = useState<Difficulty>(question.difficulty);
  const [explanation, setExplanation] = useState(question.explanation);

  // State untuk options (PG & PGK)
  const [options, setOptions] = useState<OptionItem[]>(
    question.options ? JSON.parse(JSON.stringify(question.options)) : []
  );

  // State untuk kunci jawaban PG & PGK
  const [correctAnswer, setCorrectAnswer] = useState<string | string[]>(
    question.correctAnswer || (question.type === 'pgk' ? [] : 'A')
  );

  // State untuk statements (PGK Kategori)
  const [statements, setStatements] = useState<StatementItem[]>(
    question.statements ? JSON.parse(JSON.stringify(question.statements)) : []
  );

  const handleOptionTextChange = (idx: number, newText: string) => {
    const updated = [...options];
    updated[idx].text = newText;
    setOptions(updated);
  };

  const handleTogglePgkCorrect = (optId: string) => {
    const currentList = Array.isArray(correctAnswer) ? [...correctAnswer] : [];
    if (currentList.includes(optId)) {
      setCorrectAnswer(currentList.filter((id) => id !== optId));
    } else {
      setCorrectAnswer([...currentList, optId]);
    }
  };

  const handleStatementTextChange = (idx: number, newText: string) => {
    const updated = [...statements];
    updated[idx].text = newText;
    setStatements(updated);
  };

  const handleStatementAnswerChange = (idx: number, val: boolean) => {
    const updated = [...statements];
    updated[idx].correctAnswer = val;
    setStatements(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: Question = {
      ...question,
      text: text.trim(),
      topic: topic.trim(),
      difficulty,
      explanation: explanation.trim(),
      options: question.type !== 'pgk_kategori' ? options : undefined,
      statements: question.type === 'pgk_kategori' ? statements : undefined,
      correctAnswer: question.type !== 'pgk_kategori' ? correctAnswer : undefined,
    };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Edit Soal Nomor {question.id}
              </h3>
              <p className="text-xs text-slate-500">
                Tipe: {question.type.toUpperCase()} • {question.topic}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 pr-1 text-xs sm:text-sm">
          {/* Topik & Tingkat Kesulitan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Topik / Materi Soal
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tingkat Kesulitan
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sukar">Sukar</option>
              </select>
            </div>
          </div>

          {/* Teks Pertanyaan Soal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Teks Butir Soal
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              required
            />
          </div>

          {/* Opsi Jawaban untuk PG */}
          {question.type === 'pg' && (
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700">
                Pilihan Jawaban &amp; Tentukan Kunci Jawaban (Pilih Radio)
              </label>
              {options.map((opt, idx) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct-opt-pg"
                    id={`opt-radio-${opt.id}`}
                    checked={correctAnswer === opt.id}
                    onChange={() => setCorrectAnswer(opt.id)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="w-6 font-bold text-slate-700 text-xs">{opt.id}.</span>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* Opsi Jawaban untuk PGK */}
          {question.type === 'pgk' && (
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700">
                Pilihan Jawaban &amp; Tentukan Kunci Jawaban (Centang yang Benar)
              </label>
              {options.map((opt, idx) => {
                const currentArr = Array.isArray(correctAnswer) ? correctAnswer : [];
                const isChecked = currentArr.includes(opt.id);

                return (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`opt-check-${opt.id}`}
                      checked={isChecked}
                      onChange={() => handleTogglePgkCorrect(opt.id)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="w-6 font-bold text-slate-700 text-xs">{opt.id}.</span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Pernyataan untuk PGK Kategori */}
          {question.type === 'pgk_kategori' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                3 Deskripsi Pernyataan &amp; Respons Benar / Salah
              </label>
              {statements.map((st, idx) => (
                <div key={st.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">
                      Pernyataan #{idx + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name={`statement-${st.id}`}
                          checked={st.correctAnswer === true}
                          onChange={() => handleStatementAnswerChange(idx, true)}
                        />
                        <span className="text-emerald-700 font-bold">Benar</span>
                      </label>
                      <label className="flex items-center gap-1 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name={`statement-${st.id}`}
                          checked={st.correctAnswer === false}
                          onChange={() => handleStatementAnswerChange(idx, false)}
                        />
                        <span className="text-rose-700 font-bold">Salah</span>
                      </label>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={st.text}
                    onChange={(e) => handleStatementTextChange(idx, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pembahasan Soal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pembahasan Langkah Pengerjaan
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
