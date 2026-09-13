import React, { useState } from 'react';
import { gasService } from '../services/gasService';
import { CONFIG } from '../config';
import {
  Link,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  RotateCcw,
  UploadCloud,
  X,
  Code2,
} from 'lucide-react';

interface GasSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGasGuide: () => void;
  onDataSynced: () => void;
}

export const GasSettingsModal: React.FC<GasSettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenGasGuide,
  onDataSynced,
}) => {
  const [urlInput, setUrlInput] = useState<string>(() => gasService.getGasUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    rowCount?: number;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setSaveSuccess(false);

    const result = await gasService.testGasConnection(urlInput.trim());
    setIsTesting(false);
    setTestResult(result);
  };

  const handleSave = () => {
    gasService.setGasUrl(urlInput.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onDataSynced();
    }, 1500);
  };

  const handleReset = () => {
    gasService.resetGasUrl();
    const defaultUrl = CONFIG.GOOGLE_APPS_SCRIPT_URL;
    setUrlInput(defaultUrl);
    setTestResult(null);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onDataSynced();
    }, 1500);
  };

  const handleSyncOfflineData = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    const res = await gasService.syncAllLocalToCloud();
    setIsSyncing(false);
    if (res.total === 0) {
      setSyncStatus('Tidak ada data hasil tes offline yang perlu disinkronkan.');
    } else {
      setSyncStatus(
        `Berhasil menyinkronkan ${res.success} dari ${res.total} data siswa ke Google Spreadsheet!`
      );
      onDataSynced();
    }
  };

  const localDataCount = gasService.getLocalExamResults().length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Link className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Pengaturan Koneksi Google Apps Script
              </h3>
              <p className="text-xs text-slate-500">
                Hubungkan aplikasi dengan Google Spreadsheet untuk sinkronisasi nilai
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

        {/* Info Box Offline First */}
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2 text-xs text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Penyimpanan Aman (Zero Data Loss):</span>
            Setiap jawaban dan nilai siswa selalu tersimpan secara otomatis di memori browser ini ({localDataCount} data tersimpan). Ujian siswa tetap berjalan normal meskipun koneksi ke Google Spreadsheet sedang gangguan.
          </div>
        </div>

        {/* Input URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            URL Google Apps Script Web App (Berakhiran /exec):
          </label>
          <div className="relative">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setTestResult(null);
              }}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Dapatkan URL ini setelah menerapkan (Deploy) skrip di spreadsheet Anda dengan akses &quot;Anyone&quot;.
          </p>
        </div>

        {/* Action Buttons: Uji Koneksi, Simpan, Reset */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || !urlInput.trim()}
            className="px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Menguji...' : 'Uji Koneksi'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!urlInput.trim()}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan URL</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            title="Kembalikan ke URL default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenGasGuide();
            }}
            className="ml-auto px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Buka Panduan Skrip</span>
          </button>
        </div>

        {/* Hasil Pengujian / Notifikasi */}
        {saveSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>URL Google Apps Script berhasil disimpan!</span>
          </div>
        )}

        {testResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs space-y-1 ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{testResult.success ? 'Koneksi Berhasil!' : 'Koneksi Gagal'}</span>
            </div>
            <p className="text-[11px] leading-relaxed pl-5">{testResult.message}</p>
          </div>
        )}

        {/* Bagian Sinkronisasi Data Offline */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Sinkronisasi Data Siswa ({localDataCount} Tersimpan di Perangkat)
              </span>
              <span className="text-[11px] text-slate-500">
                Unggah semua nilai siswa yang telah tersimpan di browser ini ke spreadsheet
              </span>
            </div>
            <button
              type="button"
              onClick={handleSyncOfflineData}
              disabled={isSyncing || localDataCount === 0}
              className="px-3 py-2 text-xs font-bold text-slate-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-300 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <UploadCloud className={`w-4 h-4 text-emerald-700 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
            </button>
          </div>

          {syncStatus && (
            <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-700 border border-slate-200">
              {syncStatus}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
