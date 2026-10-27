import { Question, QuestionBlueprint, CognitiveLevel, Difficulty } from '../types';

/**
 * Data Acuan Matriks Kisi-Kisi Penulisan Soal Tes Sumatif
 * Kurikulum Merdeka - Fase C (Kelas VI) Mata Pelajaran Matematika
 */

export interface BlueprintDefinition {
  elemen: string;
  tujuanPembelajaran: string;
  indikatorSoal: string;
  levelKognitif: CognitiveLevel;
  bobotSkor: number;
}

// Peta acuan default 30 butir soal Kurikulum Merdeka
export const DEFAULT_BLUEPRINT_MAP: Record<number, BlueprintDefinition> = {
  1: {
    elemen: 'Bilangan',
    tujuanPembelajaran:
      'Peserta didik dapat menyelesaikan masalah operasi hitung bilangan bulat negatif dan positif dalam kehidupan sehari-hari.',
    indikatorSoal:
      'Disajikan narasi perubahan suhu es yang dipanaskan secara berkala, peserta didik dapat menentukan suhu akhir es setelah waktu pemanasan tertentu.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  2: {
    elemen: 'Bilangan',
    tujuanPembelajaran:
      'Peserta didik dapat menyelesaikan masalah penalaran yang melibatkan operasi hitung campuran pecahan dan bilangan cacah.',
    indikatorSoal:
      'Disajikan cerita kontekstual panen beras (kuintal) yang dijual dan dibagi rata ke beberapa tetangga, peserta didik dapat menghitung berat beras yang diterima tiap orang dalam satuan kilogram.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  3: {
    elemen: 'Bilangan',
    tujuanPembelajaran:
      'Peserta didik dapat mengaplikasikan konsep Faktor Persekutuan Terbesar (FPB) untuk menyelesaikan permasalahan pembagian barang secara merata.',
    indikatorSoal:
      'Disajikan data tiga jenis perlengkapan belajar yang akan dibagikan sama banyak kepada siswa berprestasi, peserta didik dapat menentukan jumlah siswa terbanyak penerima dan jumlah pensil yang didapat masing-masing siswa.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  4: {
    elemen: 'Bilangan',
    tujuanPembelajaran:
      'Peserta didik dapat menerapkan konsep Kelipatan Persekutuan Terkecil (KPK) dalam menentukan jadwal atau waktu kejadian bersamaan.',
    indikatorSoal:
      'Disajikan interval waktu berbunyinya tiga lonceng pos kamling pada pukul tertentu, peserta didik dapat menentukan waktu saat ketiga lonceng berbunyi bersamaan kembali untuk kedua kalinya.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  5: {
    elemen: 'Aljabar',
    tujuanPembelajaran:
      'Peserta didik dapat memahami konsep rasio, perbandingan, dan skala pada peta atau denah.',
    indikatorSoal:
      'Disajikan jarak dua kota pada peta dan skala tertentu, peserta didik dapat menghitung jarak sebenarnya antara kedua kota tersebut dalam satuan kilometer.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  6: {
    elemen: 'Aljabar',
    tujuanPembelajaran:
      'Peserta didik dapat menyelesaikan masalah proporsi dan perbandingan senilai yang berkaitan dengan selisih dan jumlah nilai.',
    indikatorSoal:
      'Disajikan perbandingan umur dua orang dan selisih umur mereka, peserta didik dapat menghitung jumlah umur kedua orang tersebut seluruhnya.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  7: {
    elemen: 'Aljabar',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis permasalahan gerak lurus beraturan (kecepatan rata-rata, jarak, dan waktu) untuk kasus berpapasan.',
    indikatorSoal:
      'Disajikan jarak dua kota, waktu keberangkatan yang sama, dan kecepatan dua kendaraan yang berpapasan, peserta didik dapat menganalisis dan menentukan pukul berapa kedua kendaraan saling berpapasan.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  8: {
    elemen: 'Pengukuran',
    tujuanPembelajaran:
      'Peserta didik dapat menyelesaikan masalah yang melibatkan hubungan antara volume bangun ruang, debit aliran zat cair, dan waktu pengisian.',
    indikatorSoal:
      'Disajikan ukuran bak penampungan air berbentuk balok dan debit kran air pengisi, peserta didik dapat menghitung waktu yang dibutuhkan untuk mengisi bak hingga penuh.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  9: {
    elemen: 'Geometri',
    tujuanPembelajaran:
      'Peserta didik dapat menghitung keliling lingkaran dan mengaplikasikannya dalam pemecahan masalah lingkungan sekitar.',
    indikatorSoal:
      'Disajikan diameter sebuah taman berbentuk lingkaran yang akan dipasangi lampu penerangan dengan jarak tertentu, peserta didik dapat menentukan jumlah lampu yang dibutuhkan.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  10: {
    elemen: 'Geometri',
    tujuanPembelajaran:
      'Peserta didik dapat menghitung luas gabungan bangun datar (persegi panjang dan lingkaran).',
    indikatorSoal:
      'Disajikan gambar bangun datar gabungan antara persegi panjang dan setengah lingkaran berimpit, peserta didik dapat menghitung luas gabungan bangun tersebut.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  11: {
    elemen: 'Pengukuran',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis dan menghitung volume bangun ruang tabung serta konversi volume ke satuan liter.',
    indikatorSoal:
      'Disajikan dimensi drum penampung minyak berbentuk tabung yang telah terisi sebagian (pecahan), peserta didik dapat menganalisis sisa volume minyak yang dibutuhkan hingga penuh dalam satuan liter.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  12: {
    elemen: 'Geometri',
    tujuanPembelajaran:
      'Peserta didik dapat menghitung luas permukaan bangun ruang kubus dalam konteks pemecahan masalah sehari-hari.',
    indikatorSoal:
      'Disajikan ukuran rusuk sebuah kotak kado berbentuk kubus, peserta didik dapat menentukan luas minimal kertas kado yang dibutuhkan untuk menutup seluruh permukaannya.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  13: {
    elemen: 'Analisis Data dan Peluang',
    tujuanPembelajaran:
      'Peserta didik dapat menentukan nilai rata-rata (mean) dari sekumpulan data tunggal.',
    indikatorSoal:
      'Disajikan sekumpulan data perolehan nilai ulangan harian siswa, peserta didik dapat menghitung nilai rata-rata (mean) dari data tersebut.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  14: {
    elemen: 'Analisis Data dan Peluang',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis data tunggal untuk menentukan nilai median (nilai tengah) dan modus.',
    indikatorSoal:
      'Disajikan data berat badan sejumlah siswa peserta cerdas cermat yang belum berurutan, peserta didik dapat menentukan nilai median dan modus secara tepat.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  15: {
    elemen: 'Aljabar',
    tujuanPembelajaran:
      'Peserta didik dapat menyelesaikan masalah aritmatika sosial yang berkaitan dengan persentase diskon (potongan harga).',
    indikatorSoal:
      'Disajikan harga barang sebelum diskon dan persentase potongan harga belanja pendidikan, peserta didik dapat menghitung jumlah uang yang harus dibayar oleh pembeli.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  16: {
    elemen: 'Analisis Data dan Peluang',
    tujuanPembelajaran:
      'Peserta didik dapat menyajikan dan menafsirkan data dalam bentuk diagram lingkaran.',
    indikatorSoal:
      'Disajikan diagram lingkaran persentase pilihan kegiatan ekstrakurikuler beserta jumlah total siswa, peserta didik dapat menghitung banyak siswa yang memilih ekstrakurikuler tertentu.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  17: {
    elemen: 'Bilangan',
    tujuanPembelajaran:
      'Peserta didik dapat menentukan akar pangkat tiga dari bilangan kubik yang berkaitan dengan volume kubus.',
    indikatorSoal:
      'Disajikan volume bak penampungan air berbentuk kubus, peserta didik dapat menentukan panjang rusuk bagian dalam bak tersebut.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  18: {
    elemen: 'Pengukuran',
    tujuanPembelajaran:
      'Peserta didik dapat mengonversi satuan kecepatan dari km/menit ke meter per detik (m/s).',
    indikatorSoal:
      'Disajikan jarak tempuh dan waktu seorang pelari maraton cilik, peserta didik dapat menghitung dan mengonversi kecepatan rata-rata ke satuan meter/detik.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  19: {
    elemen: 'Geometri',
    tujuanPembelajaran:
      'Peserta didik dapat mengidentifikasi dan membedakan sifat-sifat bangun datar layang-layang melalui pilihan berganda kompleks.',
    indikatorSoal:
      'Disajikan tiga deskripsi sifat geometris bangun datar layang-layang, peserta didik dapat memilih semua pernyataan yang benar (lebih dari satu jawaban benar).',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  20: {
    elemen: 'Geometri',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis luas, keliling, dan estimasi nilai ekonomis lahan kebun berbentuk bangun datar.',
    indikatorSoal:
      'Disajikan ukuran kebun berbentuk persegi panjang dan harga jual per meter persegi, peserta didik dapat mengevaluasi dan memilih semua pernyataan yang bernilai benar.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  21: {
    elemen: 'Bilangan',
    tujuanPembelajaran:
      'Peserta didik dapat menerapkan operasi hitung campuran bilangan desimal dan satuan berat dalam belanja sehari-hari.',
    indikatorSoal:
      'Disajikan data belanja kebutuhan pokok beras dan gula pasir, peserta didik dapat memverifikasi kebenaran hitungan berat tiap jenis barang dan total berat belanjaan.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  22: {
    elemen: 'Aljabar',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis konsep aritmatika sosial mengenai bruto, neto, tara, modal, harga jual, dan keuntungan.',
    indikatorSoal:
      'Disajikan narasi pembelian buah dalam keranjang berkategori bruto dan tara, peserta didik dapat menentukan nilai kebenaran (Benar/Salah) pada 3 pernyataan terkait neto, modal, dan laba.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  23: {
    elemen: 'Analisis Data dan Peluang',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis tabel distribusi frekuensi data tunggal dan menghubungkannya dengan kriteria ketercapaian (KKTP).',
    indikatorSoal:
      'Disajikan data frekuensi nilai ulangan dan batas KKTP sekolah, peserta didik dapat menentukan nilai kebenaran (Benar/Salah) pada 3 pernyataan terkait modus, jumlah siswa tuntas, dan persentase remedial.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  24: {
    elemen: 'Pengukuran',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis volume balok dan kapasitas penampungan air dalam satuan liter.',
    indikatorSoal:
      'Disajikan dimensi bak penampungan air balok dan kondisi keterisian 3/4 kapasitas, peserta didik dapat menentukan kebenaran (Benar/Salah) untuk volume penuh, volume isi, dan volume air yang perlu ditambahkan.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  25: {
    elemen: 'Geometri',
    tujuanPembelajaran:
      'Peserta didik dapat menerapkan rumus keliling dan luas lingkaran pada objek kontekstual meja hias bundar.',
    indikatorSoal:
      'Disajikan diameter meja bundar, peserta didik dapat mengevaluasi kebenaran (Benar/Salah) untuk panjang jari-jari, panjang renda hias keliling, dan luas permukaan kaca penutup.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  26: {
    elemen: 'Aljabar',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis skala denah untuk menentukan ukuran panjang, lebar, dan luas sebenarnya.',
    indikatorSoal:
      'Disajikan denah lapangan upacara sekolah dengan skala 1 : 400, peserta didik dapat menilai kebenaran (Benar/Salah) dari pernyataan panjang sebenarnya, lebar sebenarnya, dan luas sebenarnya.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  27: {
    elemen: 'Pengukuran',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis permasalahan jarak, waktu tempuh total, waktu istirahat, dan kecepatan gerak murni bus pariwisata.',
    indikatorSoal:
      'Disajikan jadwal keberangkatan bus karya wisata, waktu tiba, jarak tempuh, dan durasi istirahat, peserta didik dapat memverifikasi nilai kebenaran (Benar/Salah) pada total waktu, waktu gerak murni, dan kecepatan rata-rata saat melaju.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
  28: {
    elemen: 'Bilangan',
    tujuanPembelajaran:
      'Peserta didik dapat menyelesaikan operasi persentase dan pecahan terhadap kuantitas barang persediaan awal.',
    indikatorSoal:
      'Disajikan persediaan awal buku tulis di koperasi dan data penjualan hari Senin (persen) dan Selasa (pecahan), peserta didik dapat menentukan kebenaran (Benar/Salah) dari 3 pernyataan penjualan dan sisa stok.',
    levelKognitif: 'L1',
    bobotSkor: 1,
  },
  29: {
    elemen: 'Bilangan',
    tujuanPembelajaran:
      'Peserta didik dapat mengaplikasikan FPB dalam menentukan paket hadiah dan rincian isi barang per regu penerima.',
    indikatorSoal:
      'Disajikan jumlah tiga perlengkapan hadiah lomba kebersihan kelas, peserta didik dapat mengevaluasi kebenaran (Benar/Salah) nilai FPB, banyak regu terbanyak penerima, dan komposisi isi barang per regu.',
    levelKognitif: 'L2',
    bobotSkor: 1,
  },
  30: {
    elemen: 'Geometri',
    tujuanPembelajaran:
      'Peserta didik dapat menganalisis koordinat Kartesius 4 titik untuk mengidentifikasi bentuk bangun datar, keliling, dan luas.',
    indikatorSoal:
      'Disajikan 4 titik koordinat bidang Kartesius yang saling dihubungkan, peserta didik dapat menganalisis dan menentukan kebenaran (Benar/Salah) dari jenis bangun datar yang terbentuk, keliling, dan luasnya.',
    levelKognitif: 'L3',
    bobotSkor: 1,
  },
};

/**
 * Format label bentuk soal
 */
export function getBentukSoalLabel(type: string): string {
  switch (type) {
    case 'pg':
      return 'Pilihan Ganda (PG)';
    case 'pgk':
      return 'Pilihan Ganda Kompleks (PGK)';
    case 'pgk_kategori':
      return 'Benar / Salah (PGK Kategori)';
    default:
      return 'Pilihan Ganda';
  }
}

/**
 * Format label level kognitif
 */
export function getCognitiveLevelLabel(level: CognitiveLevel): string {
  switch (level) {
    case 'L1':
      return 'L1 (Pemahaman / Mengingat)';
    case 'L2':
      return 'L2 (Aplikasi / Penerapan)';
    case 'L3':
      return 'L3 (Penalaran / Analisis HOTS)';
    default:
      return 'L2 (Aplikasi)';
  }
}

/**
 * Mendapatkan format string ringkas kunci jawaban
 */
export function formatCorrectAnswer(q: Question): string {
  if (q.type === 'pg') {
    return typeof q.correctAnswer === 'string' ? q.correctAnswer : 'A';
  }
  if (q.type === 'pgk') {
    if (Array.isArray(q.correctAnswer)) {
      return q.correctAnswer.join(', ');
    }
    return String(q.correctAnswer || 'A');
  }
  if (q.type === 'pgk_kategori') {
    if (q.statements && q.statements.length > 0) {
      return q.statements
        .map((st, i) => `${i + 1}:${st.correctAnswer ? 'B' : 'S'}`)
        .join(', ');
    }
    return 'B/S';
  }
  return '-';
}

/**
 * Menghasilkan metadata blueprint lengkap untuk butir soal tertentu
 */
export function getQuestionBlueprint(q: Question, index: number): QuestionBlueprint {
  const def = DEFAULT_BLUEPRINT_MAP[q.id];

  // Gunakan data dari definisi atau field internal question, atau inferensi logis
  const elemen =
    q.elemen ||
    (def ? def.elemen : inferElemenFromTopic(q.topic));

  const levelKognitif: CognitiveLevel =
    q.levelKognitif ||
    (def ? def.levelKognitif : inferLevelFromDifficulty(q.difficulty));

  const tujuanPembelajaran =
    q.tujuanPembelajaran ||
    (def
      ? def.tujuanPembelajaran
      : `Peserta didik mampu menerapkan konsep materi ${q.topic} dalam menyelesaikan permasalahan matematika.`);

  const indikatorSoal =
    q.indikatorSoal ||
    (def
      ? def.indikatorSoal
      : `Disajikan stimulus masalah tentang ${q.topic}, peserta didik dapat menentukan jawaban yang tepat.`);

  const bobotSkor = q.bobot || (def ? def.bobotSkor : 1);

  return {
    questionId: q.id,
    noSoal: index + 1,
    elemen,
    tujuanPembelajaran,
    materiPokok: q.topic,
    indikatorSoal,
    levelKognitif,
    levelKognitifLabel: getCognitiveLevelLabel(levelKognitif),
    bentukSoal: getBentukSoalLabel(q.type),
    kunciJawaban: formatCorrectAnswer(q),
    bobotSkor,
    difficulty: q.difficulty,
  };
}

function inferElemenFromTopic(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes('bilangan') || t.includes('pecahan') || t.includes('fpb') || t.includes('kpk') || t.includes('pangkat')) {
    return 'Bilangan';
  }
  if (t.includes('lingkaran') || t.includes('bangun datar') || t.includes('kubus') || t.includes('geometri') || t.includes('layang')) {
    return 'Geometri';
  }
  if (t.includes('debit') || t.includes('volume') || t.includes('kecepatan') || t.includes('jarak')) {
    return 'Pengukuran';
  }
  if (t.includes('skala') || t.includes('perbandingan') || t.includes('diskon') || t.includes('bruto') || t.includes('aritmatika')) {
    return 'Aljabar';
  }
  if (t.includes('statistika') || t.includes('diagram') || t.includes('mean') || t.includes('modus') || t.includes('median')) {
    return 'Analisis Data dan Peluang';
  }
  return 'Bilangan';
}

function inferLevelFromDifficulty(diff: Difficulty): CognitiveLevel {
  if (diff === 'Mudah') return 'L1';
  if (diff === 'Sukar') return 'L3';
  return 'L2';
}

/**
 * Menghitung rekapitulasi distribusi kisi-kisi soal
 */
export function getBlueprintStatistics(questions: Question[]) {
  const total = questions.length;
  const blueprints = questions.map((q, idx) => getQuestionBlueprint(q, idx));

  // Distribusi Elemen
  const elemenCountMap: Record<string, number> = {};
  // Distribusi Level Kognitif
  const levelCountMap: Record<CognitiveLevel, number> = { L1: 0, L2: 0, L3: 0 };
  // Distribusi Tingkat Kesukaran
  const diffCountMap: Record<Difficulty, number> = { Mudah: 0, Sedang: 0, Sukar: 0 };
  // Distribusi Bentuk Soal
  const typeCountMap: Record<string, number> = { pg: 0, pgk: 0, pgk_kategori: 0 };

  blueprints.forEach((bp, idx) => {
    // Elemen
    elemenCountMap[bp.elemen] = (elemenCountMap[bp.elemen] || 0) + 1;
    // Level
    levelCountMap[bp.levelKognitif] = (levelCountMap[bp.levelKognitif] || 0) + 1;
    // Diff
    const q = questions[idx];
    if (q) {
      diffCountMap[q.difficulty] = (diffCountMap[q.difficulty] || 0) + 1;
      typeCountMap[q.type] = (typeCountMap[q.type] || 0) + 1;
    }
  });

  const elemenDistribution = Object.entries(elemenCountMap).map(([elemen, count]) => ({
    elemen,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));

  const levelDistribution = [
    {
      level: 'L1' as const,
      label: 'L1 (Pemahaman / C1-C2)',
      desc: 'Mengingat & Memahami konsep dasar',
      count: levelCountMap.L1,
      percentage: total > 0 ? Math.round((levelCountMap.L1 / total) * 100) : 0,
      color: 'blue',
    },
    {
      level: 'L2' as const,
      label: 'L2 (Aplikasi / C3)',
      desc: 'Menerapkan konsep pada konteks nyata',
      count: levelCountMap.L2,
      percentage: total > 0 ? Math.round((levelCountMap.L2 / total) * 100) : 0,
      color: 'emerald',
    },
    {
      level: 'L3' as const,
      label: 'L3 (Penalaran / C4-C6 HOTS)',
      desc: 'Menganalisis & memecahkan masalah kompleks',
      count: levelCountMap.L3,
      percentage: total > 0 ? Math.round((levelCountMap.L3 / total) * 100) : 0,
      color: 'amber',
    },
  ];

  const difficultyDistribution = [
    {
      difficulty: 'Mudah' as const,
      count: diffCountMap.Mudah,
      percentage: total > 0 ? Math.round((diffCountMap.Mudah / total) * 100) : 0,
      color: 'emerald',
    },
    {
      difficulty: 'Sedang' as const,
      count: diffCountMap.Sedang,
      percentage: total > 0 ? Math.round((diffCountMap.Sedang / total) * 100) : 0,
      color: 'blue',
    },
    {
      difficulty: 'Sukar' as const,
      count: diffCountMap.Sukar,
      percentage: total > 0 ? Math.round((diffCountMap.Sukar / total) * 100) : 0,
      color: 'rose',
    },
  ];

  const typeDistribution = [
    {
      type: 'pg',
      label: 'Pilihan Ganda (PG)',
      count: typeCountMap.pg,
      percentage: total > 0 ? Math.round((typeCountMap.pg / total) * 100) : 0,
    },
    {
      type: 'pgk',
      label: 'Pilihan Ganda Kompleks (PGK)',
      count: typeCountMap.pgk,
      percentage: total > 0 ? Math.round((typeCountMap.pgk / total) * 100) : 0,
    },
    {
      type: 'pgk_kategori',
      label: 'Benar / Salah (PGK Kategori)',
      count: typeCountMap.pgk_kategori,
      percentage: total > 0 ? Math.round((typeCountMap.pgk_kategori / total) * 100) : 0,
    },
  ];

  return {
    total,
    blueprints,
    elemenDistribution,
    levelDistribution,
    difficultyDistribution,
    typeDistribution,
  };
}
