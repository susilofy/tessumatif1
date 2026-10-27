import { CONFIG } from '../config';
import { ExamResult } from '../types';

/**
 * Service untuk komunikasi dengan Google Apps Script Web App & Penyimpanan Lokal
 */

const STORAGE_LOCAL_RESULTS_KEY = 'sd3_local_exam_results_v2';
const STORAGE_CUSTOM_GAS_URL_KEY = 'sd3_custom_gas_url';

export const gasService = {
  /**
   * Mendapatkan URL Google Apps Script yang aktif
   */
  getGasUrl(): string {
    try {
      const custom = localStorage.getItem(STORAGE_CUSTOM_GAS_URL_KEY);
      if (custom && custom.trim().startsWith('http')) {
        // Jika URL tersimpan adalah URL versi lama, perbarui ke URL aktif
        if (custom.includes('AKfycbzBuJrheUE3MRAvNlUEZut3q0LQL5-J62sy8w_rfsBz72VJGt7IHyFPj0WORSB8dUCmeQ')) {
          localStorage.removeItem(STORAGE_CUSTOM_GAS_URL_KEY);
          return CONFIG.GOOGLE_APPS_SCRIPT_URL;
        }
        return custom.trim();
      }
    } catch {
      // ignore
    }
    return CONFIG.GOOGLE_APPS_SCRIPT_URL;
  },

  /**
   * Menyimpan URL Google Apps Script kustom
   */
  setGasUrl(url: string): void {
    try {
      if (!url || !url.trim()) {
        localStorage.removeItem(STORAGE_CUSTOM_GAS_URL_KEY);
      } else {
        localStorage.setItem(STORAGE_CUSTOM_GAS_URL_KEY, url.trim());
      }
    } catch (e) {
      console.warn('Gagal menyimpan URL GAS kustom ke localStorage:', e);
    }
  },

  /**
   * Mengembalikan URL ke default
   */
  resetGasUrl(): void {
    try {
      localStorage.removeItem(STORAGE_CUSTOM_GAS_URL_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Mengambil hasil tes yang tersimpan di perangkat lokal
   */
  /**
   * Mengambil hasil tes yang tersimpan di perangkat lokal
   */
  getLocalExamResults(): ExamResult[] {
    try {
      const saved = localStorage.getItem(STORAGE_LOCAL_RESULTS_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Gagal membaca data hasil tes lokal:', e);
    }

    // Data awal realistis siswa Kelas VI Sekolah Dasar jika penyimpanan belum terisi
    const defaultData: ExamResult[] = [
      {
        id: 'res-default-1',
        timestamp: '19/10/2026, 08:35:12',
        nama: 'I Putu Arya Wijaya',
        noAbsen: '01',
        kelas: CONFIG.KELAS,
        tglLahir: '14 Mei 2014',
        benar: 26,
        salah: 4,
        nilai: 87,
        status: 'Lulus',
      },
      {
        id: 'res-default-2',
        timestamp: '19/10/2026, 08:37:45',
        nama: 'Ni Kadek Dwi Pratiwi',
        noAbsen: '02',
        kelas: CONFIG.KELAS,
        tglLahir: '22 Agustus 2014',
        benar: 28,
        salah: 2,
        nilai: 93,
        status: 'Lulus',
      },
      {
        id: 'res-default-3',
        timestamp: '19/10/2026, 08:40:20',
        nama: 'I Komang Bagus Sasmita',
        noAbsen: '03',
        kelas: CONFIG.KELAS,
        tglLahir: '05 Januari 2014',
        benar: 19,
        salah: 11,
        nilai: 63,
        status: 'Belum Lulus',
      },
      {
        id: 'res-default-4',
        timestamp: '19/10/2026, 08:42:15',
        nama: 'Ni Ketut Ayu Wardani',
        noAbsen: '04',
        kelas: CONFIG.KELAS,
        tglLahir: '18 Oktober 2014',
        benar: 24,
        salah: 6,
        nilai: 80,
        status: 'Lulus',
      },
      {
        id: 'res-default-5',
        timestamp: '19/10/2026, 08:45:00',
        nama: 'I Wayan Aditya Putra',
        noAbsen: '05',
        kelas: CONFIG.KELAS,
        tglLahir: '30 Maret 2014',
        benar: 22,
        salah: 8,
        nilai: 73,
        status: 'Lulus',
      },
      {
        id: 'res-default-6',
        timestamp: '19/10/2026, 08:48:30',
        nama: 'Ni Putu Ratih Anjani',
        noAbsen: '06',
        kelas: CONFIG.KELAS,
        tglLahir: '09 Juli 2014',
        benar: 29,
        salah: 1,
        nilai: 97,
        status: 'Lulus',
      },
      {
        id: 'res-default-7',
        timestamp: '19/10/2026, 08:51:10',
        nama: 'I Made Gede Danendra',
        noAbsen: '07',
        kelas: CONFIG.KELAS,
        tglLahir: '11 Desember 2013',
        benar: 18,
        salah: 12,
        nilai: 60,
        status: 'Belum Lulus',
      },
      {
        id: 'res-default-8',
        timestamp: '19/10/2026, 08:53:40',
        nama: 'Ni Kadek Citra Lestari',
        noAbsen: '08',
        kelas: CONFIG.KELAS,
        tglLahir: '25 Februari 2014',
        benar: 25,
        salah: 5,
        nilai: 83,
        status: 'Lulus',
      },
      {
        id: 'res-default-9',
        timestamp: '19/10/2026, 08:56:05',
        nama: 'I Komang Yoga Mahendra',
        noAbsen: '09',
        kelas: CONFIG.KELAS,
        tglLahir: '16 September 2014',
        benar: 27,
        salah: 3,
        nilai: 90,
        status: 'Lulus',
      },
      {
        id: 'res-default-10',
        timestamp: '19/10/2026, 08:58:22',
        nama: 'Ni Ketut Desi Kurnia',
        noAbsen: '10',
        kelas: CONFIG.KELAS,
        tglLahir: '04 Juni 2014',
        benar: 20,
        salah: 10,
        nilai: 67,
        status: 'Belum Lulus',
      },
    ];

    try {
      localStorage.setItem(STORAGE_LOCAL_RESULTS_KEY, JSON.stringify(defaultData));
    } catch {
      // ignore
    }

    return defaultData;
  },


  /**
   * Menyimpan hasil tes ke penyimpanan lokal (Zero Data Loss)
   */
  saveLocalExamResult(result: ExamResult): void {
    try {
      const current = this.getLocalExamResults();
      // Periksa apakah sudah ada (hindari duplikasi berdasarkan nama & timestamp)
      const existingIdx = current.findIndex(
        (item) =>
          item.id === result.id ||
          (item.nama.toLowerCase() === result.nama.toLowerCase() &&
            item.timestamp === result.timestamp)
      );

      if (existingIdx >= 0) {
        current[existingIdx] = result;
      } else {
        current.unshift(result);
      }

      localStorage.setItem(STORAGE_LOCAL_RESULTS_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('Gagal menyimpan hasil tes ke localStorage:', e);
    }
  },

  /**
   * Menghapus hasil tes dari penyimpanan lokal
   */
  deleteLocalExamResult(idOrTimestamp: string, nama?: string): void {
    try {
      const current = this.getLocalExamResults();
      const filtered = current.filter(
        (r) =>
          r.id !== idOrTimestamp &&
          r.timestamp !== idOrTimestamp &&
          !(nama && r.nama.toLowerCase() === nama.toLowerCase())
      );
      localStorage.setItem(STORAGE_LOCAL_RESULTS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn('Gagal menghapus data hasil tes lokal:', e);
    }
  },

  /**
   * Menguji koneksi ke URL Google Apps Script
   */
  async testGasConnection(
    customUrl?: string
  ): Promise<{ success: boolean; message: string; rowCount?: number }> {
    const url = (customUrl || this.getGasUrl()).trim();
    if (!url || !url.startsWith('http')) {
      return { success: false, message: 'URL Google Apps Script tidak valid.' };
    }

    try {
      const testUrl = `${url}${url.includes('?') ? '&' : '?'}action=read&t=${Date.now()}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(testUrl, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            message:
              'Server merespons HTTP 404 (Not Found). Pastikan Web App sudah di-Deploy dengan jenis "Web App" dan akses "Anyone" (Siapa saja).',
          };
        }
        return {
          success: false,
          message: `Server merespons status HTTP ${response.status}`,
        };
      }

      const text = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        return {
          success: true,
          message: 'Terhubung ke server Google Apps Script (Respons non-JSON).',
          rowCount: 0,
        };
      }

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.rows)
        ? data.rows
        : [];

      return {
        success: true,
        message: `Koneksi berhasil! Terhubung ke Google Spreadsheet (${list.length} baris data ditemukan).`,
        rowCount: list.length,
      };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return {
          success: false,
          message: 'Koneksi waktu habis (Timeout 8 detik). Server Google Apps Script lambat merespons.',
        };
      }
      return {
        success: false,
        message:
          err.message ||
          'Gagal terhubung ke Google Apps Script. Periksa koneksi internet atau hak akses Web App.',
      };
    }
  },

  /**
   * Mengirim hasil tes siswa ke Google Apps Script Web App & Penyimpanan Lokal
   */
  async submitExamResult(
    result: ExamResult
  ): Promise<{ success: boolean; message: string; savedLocally: boolean }> {
    // 1. Selalu amankan penyimpanan ke perangkat lokal terlebih dahulu (Zero Data Loss)
    this.saveLocalExamResult(result);

    const url = this.getGasUrl();
    if (!url || !url.startsWith('http')) {
      return {
        success: true,
        savedLocally: true,
        message: 'Hasil tes berhasil disimpan di perangkat ini.',
      };
    }

    const payload = {
      action: 'submit',
      id: result.id || `res-${Date.now()}`,
      timestamp: result.timestamp || new Date().toLocaleString('id-ID'),
      // Format bahasa Indonesia (sesuai template sheet)
      nama: result.nama,
      kelas: result.kelas || CONFIG.KELAS,
      noAbsen: result.noAbsen,
      tglLahir: result.tglLahir || '',
      benar: result.benar,
      salah: result.salah,
      nilai: result.nilai,
      status: result.status,
      mataPelajaran: CONFIG.MATA_PELAJARAN,
      sekolah: CONFIG.SEKOLAH,
      // Format camelCase alternatif (kompatibilitas menyeluruh)
      studentName: result.nama,
      className: result.kelas || CONFIG.KELAS,
      absenNumber: result.noAbsen,
      birthDate: result.tglLahir || '',
      correctCount: result.benar,
      incorrectCount: result.salah,
      totalQuestions: (result.benar || 0) + (result.salah || 0),
      finalScore: result.nilai,
      answers: result.detailJawaban || {},
    };

    try {
      // Mengirim sebagai text/plain untuk mencegah browser memicu CORS preflight OPTIONS
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn(`GAS POST merespons HTTP ${response.status}`);
        return {
          success: true,
          savedLocally: true,
          message: `Hasil tes tersimpan di perangkat ini. (Cloud respons HTTP ${response.status})`,
        };
      }

      const text = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: true };
      }

      return {
        success: true,
        savedLocally: true,
        message: data.message || 'Jawaban dan hasil tes berhasil disimpan ke Google Spreadsheet.',
      };
    } catch (err: any) {
      console.warn('Gagal sinkronisasi langsung ke Google Apps Script (tersimpan lokal):', err);
      return {
        success: true,
        savedLocally: true,
        message: 'Hasil tes tersimpan di perangkat ini. (Sinkronisasi cloud tertunda)',
      };
    }
  },

  /**
   * Mengambil rekap hasil ujian dari Google Apps Script Web App dan/atau Penyimpanan Lokal
   */
  async fetchExamResults(): Promise<ExamResult[]> {
    const localResults = this.getLocalExamResults();
    const url = this.getGasUrl();

    if (!url || !url.startsWith('http')) {
      return localResults;
    }

    try {
      const readUrl = `${url}${url.includes('?') ? '&' : '?'}action=read&t=${Date.now()}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      // Gunakan Simple GET tanpa custom Accept header agar tidak ditolak CORS saat 302 redirect
      const response = await fetch(readUrl, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Google Apps Script merespons HTTP ${response.status}, menggunakan data lokal.`);
        return localResults;
      }

      const raw = await response.json();
      let list: any[] = [];

      if (Array.isArray(raw)) {
        list = raw;
      } else if (raw && Array.isArray(raw.data)) {
        list = raw.data;
      } else if (raw && raw.status === 'success' && Array.isArray(raw.rows)) {
        list = raw.rows;
      }

      // Standarisasi pemetaan atribut
      const remoteResults: ExamResult[] = list
        .filter((item: any) => {
          const name = item.Nama || item.nama || item.studentName || item['Nama Siswa'];
          return name && String(name).trim().length > 0;
        })
        .map((item: any, idx: number) => {
          const timestamp =
            item.Timestamp || item.timestamp || item.waktu || new Date().toLocaleString('id-ID');
          const nama =
            item.studentName || item.Nama || item.nama || item['Nama Siswa'] || 'Siswa';
          const kelas = item.className || item.Kelas || item.kelas || CONFIG.KELAS;
          const noAbsen = String(
            item.absenNumber || item['Nomor Absen'] || item.noAbsen || item.NoAbsen || '-'
          );
          const benar = Number(item.correctCount ?? item.Benar ?? item.benar ?? 0);
          const salah = Number(item.incorrectCount ?? item.Salah ?? item.salah ?? 0);
          const nilai = Number(item.finalScore ?? item.Nilai ?? item.nilai ?? 0);
          const status = item.status || (nilai >= CONFIG.KKTP ? 'Lulus' : 'Belum Lulus');
          const tglLahir = item.birthDate || item['Tanggal Lahir'] || item.tglLahir || '';

          return {
            id: item.id || `gas-${idx}-${timestamp}`,
            timestamp,
            nama,
            kelas,
            noAbsen,
            tglLahir,
            benar,
            salah,
            nilai,
            status: status === 'Lulus' ? 'Lulus' : 'Belum Lulus',
          };
        });

      // Gabungkan data remote dengan data lokal yang belum ada di remote
      const combined = [...remoteResults];
      localResults.forEach((loc) => {
        const alreadyInRemote = combined.some(
          (rem) =>
            rem.nama.trim().toLowerCase() === loc.nama.trim().toLowerCase() &&
            rem.noAbsen === loc.noAbsen
        );
        if (!alreadyInRemote) {
          combined.push(loc);
        }
      });

      return combined;
    } catch (err: any) {
      console.warn('Error saat fetch dari Google Apps Script, menampilkan data lokal:', err);
      return localResults;
    }
  },

  /**
   * Menghapus data dari Google Spreadsheet via GAS dan Penyimpanan Lokal
   */
  async deleteExamResult(timestamp: string, nama: string): Promise<boolean> {
    // 1. Hapus dari penyimpanan lokal terlebih dahulu
    this.deleteLocalExamResult(timestamp, nama);

    const url = this.getGasUrl();
    if (!url || !url.startsWith('http')) return true;

    const payload = {
      action: 'delete',
      timestamp,
      nama,
      studentName: nama,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (err: any) {
      console.warn('Gagal menghapus di remote GAS (namun sudah terhapus di lokal):', err);
      return true;
    }
  },

  /**
   * Mengosongkan data di penyimpanan lokal perangkat
   */
  clearAllLocalExamResults(): void {
    try {
      localStorage.setItem(STORAGE_LOCAL_RESULTS_KEY, JSON.stringify([]));
    } catch (e) {
      console.warn('Gagal mengosongkan data lokal:', e);
    }
  },

  /**
   * Menghapus SEMUA hasil tes siswa (di penyimpanan lokal dan di remote Google Spreadsheet jika terhubung)
   */
  async clearAllExamResults(): Promise<{ success: boolean; clearedRemote: boolean; message: string }> {
    // 1. Kosongkan penyimpanan lokal segera
    this.clearAllLocalExamResults();

    const url = this.getGasUrl();
    if (!url || !url.startsWith('http')) {
      return {
        success: true,
        clearedRemote: false,
        message: 'Seluruh data nilai di penyimpanan lokal perangkat berhasil dibersihkan.',
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'clearAll' }),
      });

      if (response.ok) {
        return {
          success: true,
          clearedRemote: true,
          message: 'Seluruh data nilai di Google Spreadsheet dan perangkat lokal berhasil dihapus.',
        };
      } else {
        return {
          success: true,
          clearedRemote: false,
          message: 'Data nilai lokal berhasil dibersihkan. Server Spreadsheet merespons dengan kendala.',
        };
      }
    } catch (err: any) {
      console.warn('Gagal menghapus di remote Google Apps Script secara massal:', err);
      return {
        success: true,
        clearedRemote: false,
        message: 'Data lokal berhasil dihapus. Google Spreadsheet tidak dapat diakses saat ini (koneksi offline/URL tidak valid).',
      };
    }
  },

  /**
   * Sinkronisasi seluruh data lokal yang belum masuk ke Google Apps Script
   */
  async syncAllLocalToCloud(): Promise<{ total: number; success: number }> {
    const local = this.getLocalExamResults();
    if (local.length === 0) return { total: 0, success: 0 };

    let successCount = 0;
    for (const item of local) {
      try {
        const res = await this.submitExamResult(item);
        if (res.success) successCount++;
      } catch {
        // ignore
      }
    }
    return { total: local.length, success: successCount };
  },
};

/**
 * Template Skrip Google Apps Script untuk Google Spreadsheet
 */
export const GAS_SCRIPT_TEMPLATE = `/**
 * SKRIP GOOGLE APPS SCRIPT UNTUK REKAP TES SUMATIF
 * SEKOLAH DASAR - JEMBRANA - KELAS VI
 *
 * PANDUAN PEMASANGAN (HANYA 2 MENIT):
 * 1. Buat Spreadsheet baru di https://sheets.new
 * 2. Beri nama: "Rekap Nilai Tes Sumatif Matematika Sekolah Dasar"
 * 3. Buka menu "Ekstensi" -> "Apps Script"
 * 4. Hapus semua kode default, lalu salin dan tempel SELURUH KODE di bawah ini
 * 5. Klik "Simpan" (ikon disket)
 * 6. Klik tombol biru "Terapkan" (Deploy) -> "Penerapan Baru" (New Deployment)
 * 7. Pilih jenis: "Aplikasi Web" (Web App)
 * 8. PENGATURAN WAJIB:
 *    - Jalankan sebagai (Execute as): "Saya" (Me)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> SANGAT PENTING!
 * 9. Klik "Terapkan", berikan Otorisasi Akun Google Anda
 * 10. Salin URL Aplikasi Web (berakhiran /exec) dan tempelkan ke menu "Pengaturan URL Spreadsheet" di Panel Guru.
 */

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var headers = data[0];
    var results = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var item = {};
      for (var j = 0; j < headers.length; j++) {
        var headerKey = String(headers[j]).trim();
        item[headerKey] = row[j];
      }
      results.push(item);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: results }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var raw = e.postData ? e.postData.contents : "{}";
    var contents = JSON.parse(raw);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Inisialisasi Header jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Nama",
        "Kelas",
        "Nomor Absen",
        "Tanggal Lahir",
        "Benar",
        "Salah",
        "Nilai",
        "Status",
        "Mata Pelajaran"
      ]);
    }
    
    // Fitur Delete jika diminta
    if (contents.action === "delete") {
      var data = sheet.getDataRange().getValues();
      var targetTimestamp = String(contents.timestamp || "").trim();
      var targetNama = String(contents.nama || contents.studentName || "").trim().toLowerCase();
      
      for (var i = data.length - 1; i >= 1; i--) {
        var rowTime = String(data[i][0]).trim();
        var rowName = String(data[i][1]).trim().toLowerCase();
        if ((targetTimestamp && rowTime === targetTimestamp) || (targetNama && rowName === targetNama)) {
          sheet.deleteRow(i + 1);
          return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Data berhasil dihapus" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Data tidak ditemukan" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Fitur Hapus Seluruh Data Siswa (Mempertahankan Baris Header Kolom ke-1)
    if (contents.action === "clearAll" || contents.action === "deleteAll") {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true, 
        message: "Seluruh data siswa berhasil dihapus dari Spreadsheet (header kolom tetap tersimpan)" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Fitur Tambah / Simpan Hasil Tes Siswa
    var timestamp = contents.timestamp || Utilities.formatDate(new Date(), "GMT+8", "dd/MM/yyyy HH:mm:ss");
    var nama = contents.studentName || contents.nama || "";
    var kelas = contents.className || contents.kelas || "VI";
    var noAbsen = contents.absenNumber || contents.noAbsen || "";
    var tglLahir = contents.birthDate || contents.tglLahir || "";
    var benar = contents.correctCount !== undefined ? contents.correctCount : (contents.benar || 0);
    var salah = contents.incorrectCount !== undefined ? contents.incorrectCount : (contents.salah || 0);
    var nilai = contents.finalScore !== undefined ? contents.finalScore : (contents.nilai || 0);
    var status = contents.status || (nilai >= 70 ? "Lulus" : "Belum Lulus");
    var mataPelajaran = contents.mataPelajaran || "MATEMATIKA";
    
    sheet.appendRow([
      timestamp,
      nama,
      kelas,
      noAbsen,
      tglLahir,
      benar,
      salah,
      nilai,
      status,
      mataPelajaran
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Hasil tes siswa berhasil disimpan ke spreadsheet"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

