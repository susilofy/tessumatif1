import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  // --- PILIHAN GANDA (18 SOAL) ---
  {
    id: 1,
    type: 'pg',
    topic: 'Bilangan Bulat',
    difficulty: 'Mudah',
    text: 'Suhu sebongkah es mula-mula adalah -5°C. Es tersebut dipanaskan di atas kompor sehingga suhunya naik rata-rata 3°C setiap 2 menit. Suhu es tersebut setelah dipanaskan selama 10 menit adalah...',
    options: [
      { id: 'A', text: '8°C' },
      { id: 'B', text: '10°C' },
      { id: 'C', text: '15°C' },
      { id: 'D', text: '-2°C' },
    ],
    correctAnswer: 'B',
    explanation:
      'Kenaikan suhu terjadi selama 10 menit dengan kenaikan 3°C tiap 2 menit.\nBanyak periode kenaikan = 10 ÷ 2 = 5 kali.\nTotal kenaikan suhu = 5 × 3°C = 15°C.\nSuhu akhir = Suhu awal + Kenaikan = -5°C + 15°C = 10°C.',
  },
  {
    id: 2,
    type: 'pg',
    topic: 'Operasi Pecahan & Bilangan Cacah',
    difficulty: 'Sedang',
    text: 'Pak Ahmad memanen 2,5 kuintal beras dari sawahnya. Sebanyak 3/5 kuintal dijual ke pasar, dan sisanya dibagikan kepada 5 orang tetangga sama banyak. Berapa kilogram beras yang diterima oleh masing-masing tetangga?',
    options: [
      { id: 'A', text: '32 kg' },
      { id: 'B', text: '35 kg' },
      { id: 'C', text: '38 kg' },
      { id: 'D', text: '42 kg' },
    ],
    correctAnswer: 'C',
    explanation:
      '1 kuintal = 100 kg.\nPanen = 2,5 kuintal = 250 kg.\nDijual ke pasar = 3/5 kuintal = (3/5 × 100 kg) = 60 kg.\nSisa beras = 250 kg - 60 kg = 190 kg.\nBeras tiap tetangga = 190 kg ÷ 5 = 38 kg.',
  },
  {
    id: 3,
    type: 'pg',
    topic: 'FPB & KPK',
    difficulty: 'Sedang',
    text: 'Ibu Guru memiliki 48 buku tulis, 72 pensil, dan 96 penghapus. Seluruh perlengkapan tersebut akan dibagikan ke sebanyak-banyaknya siswa berprestasi dengan jumlah tiap jenis barang yang sama banyak. Berapa banyak siswa yang menerima dan berapa banyak pensil yang didapat oleh setiap siswa?',
    options: [
      { id: 'A', text: '24 siswa dan masing-masing mendapat 3 pensil' },
      { id: 'B', text: '24 siswa dan masing-masing mendapat 4 pensil' },
      { id: 'C', text: '16 siswa dan masing-masing mendapat 3 pensil' },
      { id: 'D', text: '12 siswa dan masing-masing mendapat 6 pensil' },
    ],
    correctAnswer: 'A',
    explanation:
      'Mencari pembagian sama banyak menggunakan FPB:\n48 = 2⁴ × 3\n72 = 2³ × 3²\n96 = 2⁵ × 3\nFPB = 2³ × 3 = 8 × 3 = 24 siswa.\nJumlah pensil tiap siswa = 72 ÷ 24 = 3 pensil.',
  },
  {
    id: 4,
    type: 'pg',
    topic: 'KPK (Kelipatan Persekutuan Terkecil)',
    difficulty: 'Mudah',
    text: 'Di sebuah pos kamling terdapat tiga lonceng pengingat ronda. Lonceng pertama berbunyi setiap 12 menit, lonceng kedua setiap 15 menit, dan lonceng ketiga setiap 20 menit. Jika ketiga lonceng berbunyi bersamaan pada pukul 08.00, pada pukul berapa ketiga lonceng akan berbunyi bersamaan kembali untuk kedua kalinya?',
    options: [
      { id: 'A', text: '08.45' },
      { id: 'B', text: '09.00' },
      { id: 'C', text: '09.15' },
      { id: 'D', text: '09.30' },
    ],
    correctAnswer: 'B',
    explanation:
      'Mencari waktu bersamaan kembali menggunakan KPK:\n12 = 2² × 3\n15 = 3 × 5\n20 = 2² × 5\nKPK = 2² × 3 × 5 = 4 × 3 × 5 = 60 menit (1 jam).\nKetiga lonceng berbunyi bersamaan lagi pada: 08.00 + 1 jam = 09.00.',
  },
  {
    id: 5,
    type: 'pg',
    topic: 'Perbandingan & Skala',
    difficulty: 'Mudah',
    text: 'Jarak antara Kota Denpasar dan Kota Negara pada peta adalah 6 cm. Jika skala yang digunakan pada peta tersebut adalah 1 : 1.500.000, maka jarak sebenarnya antara kedua kota tersebut adalah...',
    options: [
      { id: 'A', text: '75 km' },
      { id: 'B', text: '90 km' },
      { id: 'C', text: '120 km' },
      { id: 'D', text: '150 km' },
    ],
    correctAnswer: 'B',
    explanation:
      'Jarak Sebenarnya = Jarak pada Peta ÷ Skala\n= 6 cm × 1.500.000 = 9.000.000 cm.\nUbah cm ke km (dibagi 100.000):\n9.000.000 ÷ 100.000 = 90 km.',
  },
  {
    id: 6,
    type: 'pg',
    topic: 'Perbandingan Senilai',
    difficulty: 'Sedang',
    text: 'Perbandingan umur Ayah dan Dayu adalah 7 : 3. Jika selisih umur Ayah dan Dayu adalah 28 tahun, berapakah jumlah umur Ayah dan Dayu seluruhnya?',
    options: [
      { id: 'A', text: '56 tahun' },
      { id: 'B', text: '63 tahun' },
      { id: 'C', text: '70 tahun' },
      { id: 'D', text: '77 tahun' },
    ],
    correctAnswer: 'C',
    explanation:
      'Selisih perbandingan = 7 - 3 = 4 bagian.\nNilai 1 bagian = 28 tahun ÷ 4 = 7 tahun.\nJumlah perbandingan = 7 + 3 = 10 bagian.\nJumlah umur = 10 × 7 tahun = 70 tahun.',
  },
  {
    id: 7,
    type: 'pg',
    topic: 'Kecepatan & Waktu Berpapasan',
    difficulty: 'Sukar',
    text: 'Jarak antara kota P dan kota Q adalah 180 km. Pak Made mengendarai mobil dari kota P ke kota Q pada pukul 07.15 dengan kecepatan rata-rata 55 km/jam. Pada saat yang sama, Pak Ketut mengendarai sepeda motor dari kota Q ke kota P melalui jalur yang sama dengan kecepatan rata-rata 35 km/jam. Pukul berapakah mereka akan berpapasan di jalan?',
    options: [
      { id: 'A', text: '08.45' },
      { id: 'B', text: '09.00' },
      { id: 'C', text: '09.15' },
      { id: 'D', text: '09.30' },
    ],
    correctAnswer: 'C',
    explanation:
      'Waktu berpapasan = Jarak Total ÷ (Kecepatan 1 + Kecepatan 2)\nKecepatan gabungan = 55 km/jam + 35 km/jam = 90 km/jam.\nWaktu = 180 km ÷ 90 km/jam = 2 jam.\nWaktu berpapasan = 07.15 + 2 jam = 09.15.',
  },
  {
    id: 8,
    type: 'pg',
    topic: 'Debit Air & Volume',
    difficulty: 'Sedang',
    text: 'Sebuah bak penampungan air berbentuk balok memiliki ukuran panjang 120 cm, lebar 80 cm, dan tinggi 50 cm. Bak tersebut diisi air dari kran yang memiliki debit aliran tetap 20 liter per menit. Waktu yang diperlukan untuk mengisi bak penampungan tersebut dari kosong hingga penuh adalah...',
    options: [
      { id: 'A', text: '18 menit' },
      { id: 'B', text: '24 menit' },
      { id: 'C', text: '32 menit' },
      { id: 'D', text: '48 menit' },
    ],
    correctAnswer: 'B',
    explanation:
      'Volume bak = panjang × lebar × tinggi = 120 cm × 80 cm × 50 cm = 480.000 cm³.\n1 liter = 1.000 cm³, maka Volume = 480.000 ÷ 1.000 = 480 liter.\nWaktu = Volume ÷ Debit = 480 liter ÷ 20 liter/menit = 24 menit.',
  },
  {
    id: 9,
    type: 'pg',
    topic: 'Keliling Lingkaran',
    difficulty: 'Mudah',
    text: 'Sebuah taman kota di Jembrana berbentuk lingkaran dengan panjang diameter 28 meter. Di sekeliling tepi taman tersebut akan dipasangi lampu penerangan dengan jarak antarlampu 4 meter. Berapa banyak lampu penerangan yang dibutuhkan? (Gunakan π = 22/7)',
    options: [
      { id: 'A', text: '22 buah' },
      { id: 'B', text: '24 buah' },
      { id: 'C', text: '28 buah' },
      { id: 'D', text: '44 buah' },
    ],
    correctAnswer: 'A',
    explanation:
      'Keliling lingkaran = π × diameter = 22/7 × 28 m = 88 meter.\nBanyak lampu = Keliling ÷ Jarak antarlampu = 88 m ÷ 4 m = 22 buah.',
  },
  {
    id: 10,
    type: 'pg',
    topic: 'Luas Gabungan Bangun Datar',
    difficulty: 'Sedang',
    text: 'Sebuah bidang datar gabungan terdiri dari persegi panjang berukuran panjang 20 cm dan lebar 14 cm, serta sebuah setengah lingkaran yang menempel berhimpit pada sisi lebarnya (diameter setengah lingkaran = 14 cm). Luas total bidang gabungan tersebut adalah... (Gunakan π = 22/7)',
    options: [
      { id: 'A', text: '318 cm²' },
      { id: 'B', text: '357 cm²' },
      { id: 'C', text: '394 cm²' },
      { id: 'D', text: '434 cm²' },
    ],
    correctAnswer: 'B',
    explanation:
      'Luas persegi panjang = p × l = 20 cm × 14 cm = 280 cm².\nJari-jari lingkaran (r) = 14 ÷ 2 = 7 cm.\nLuas setengah lingkaran = 1/2 × π × r² = 1/2 × (22/7) × 7 × 7 = 77 cm².\nLuas gabungan = 280 cm² + 77 cm² = 357 cm².',
  },
  {
    id: 11,
    type: 'pg',
    topic: 'Volume Bangun Ruang (Tabung)',
    difficulty: 'Sukar',
    text: 'Sebuah drum penampung minyak berbentuk tabung memiliki jari-jari alas 35 cm dan tinggi 100 cm. Jika drum tersebut saat ini sudah terisi minyak sebanyak 3/5 bagian, berapa liter minyak yang masih harus dituangkan agar drum tersebut terisi penuh? (Gunakan π = 22/7)',
    options: [
      { id: 'A', text: '124 liter' },
      { id: 'B', text: '154 liter' },
      { id: 'C', text: '231 liter' },
      { id: 'D', text: '385 liter' },
    ],
    correctAnswer: 'B',
    explanation:
      'Volume tabung penuh = π × r² × t = (22/7) × 35 × 35 × 100 = 385.000 cm³.\n1 liter = 1.000 cm³, maka Volume = 385 liter.\nBagian yang belum terisi = 1 - 3/5 = 2/5 bagian.\nVolume yang harus ditambahkan = 2/5 × 385 liter = 154 liter.',
  },
  {
    id: 12,
    type: 'pg',
    topic: 'Luas Permukaan Kubus',
    difficulty: 'Mudah',
    text: 'Edo ingin membungkus kotak kado berbentuk kubus dengan kertas kado berwarna emas. Jika panjang rusuk kotak kado tersebut adalah 15 cm, luas minimal kertas kado yang dibutuhkan untuk menutupi seluruh permukaan luar kotak adalah...',
    options: [
      { id: 'A', text: '900 cm²' },
      { id: 'B', text: '1.125 cm²' },
      { id: 'C', text: '1.350 cm²' },
      { id: 'D', text: '3.375 cm²' },
    ],
    correctAnswer: 'C',
    explanation:
      'Kubus memiliki 6 sisi persegi yang identik.\nLuas permukaan kubus = 6 × rusuk² = 6 × 15 cm × 15 cm = 6 × 225 cm² = 1.350 cm².',
  },
  {
    id: 13,
    type: 'pg',
    topic: 'Statistika (Rata-rata / Mean)',
    difficulty: 'Mudah',
    text: 'Berikut adalah perolehan nilai ulangan matematika harian dari 8 orang siswa kelas VI: 75, 80, 85, 70, 90, 85, 75, dan 80. Berapakah nilai rata-rata (mean) dari data nilai ulangan tersebut?',
    options: [
      { id: 'A', text: '78,5' },
      { id: 'B', text: '79,0' },
      { id: 'C', text: '80,0' },
      { id: 'D', text: '81,5' },
    ],
    correctAnswer: 'C',
    explanation:
      'Jumlah total nilai = 75 + 80 + 85 + 70 + 90 + 85 + 75 + 80 = 640.\nBanyak siswa = 8 orang.\nNilai rata-rata = 640 ÷ 8 = 80,0.',
  },
  {
    id: 14,
    type: 'pg',
    topic: 'Statistika (Median & Modus)',
    difficulty: 'Sedang',
    text: 'Data berat badan (dalam kg) sembilan siswa peserta lomba cerdas cermat adalah sebagai berikut: 34, 36, 35, 34, 37, 36, 35, 36, 38. Nilai median dan modus dari data berat badan tersebut berturut-turut adalah...',
    options: [
      { id: 'A', text: '35 kg dan 34 kg' },
      { id: 'B', text: '36 kg dan 36 kg' },
      { id: 'C', text: '36 kg dan 35 kg' },
      { id: 'D', text: '35 kg dan 36 kg' },
    ],
    correctAnswer: 'B',
    explanation:
      'Urutkan data dari terkecil ke terbesar: 34, 34, 35, 35, 36, 36, 36, 37, 38 (total 9 data).\nMedian (nilai tengah, data ke-5) = 36 kg.\nModus (nilai yang paling sering muncul) = 36 kg (muncul 3 kali).\nJadi, median = 36 kg dan modus = 36 kg.',
  },
  {
    id: 15,
    type: 'pg',
    topic: 'Aritmatika Sosial (Diskon)',
    difficulty: 'Mudah',
    text: 'Dalam rangka Hari Belanja Pendidikan, Toko Seragam Pelajar memberikan potongan harga (diskon) sebesar 25% untuk sepasang sepatu sekolah. Jika harga sepasang sepatu sebelum diskon adalah Rp160.000,00, berapakah jumlah uang yang harus dibayarkan oleh pembeli?',
    options: [
      { id: 'A', text: 'Rp110.000,00' },
      { id: 'B', text: 'Rp120.000,00' },
      { id: 'C', text: 'Rp125.000,00' },
      { id: 'D', text: 'Rp135.000,00' },
    ],
    correctAnswer: 'B',
    explanation:
      'Besar diskon = 25% × Rp160.000,00 = (25/100) × 160.000 = Rp40.000,00.\nHarga setelah diskon = Rp160.000,00 - Rp40.000,00 = Rp120.000,00.',
  },
  {
    id: 16,
    type: 'pg',
    topic: 'Pengolahan Data (Diagram Lingkaran)',
    difficulty: 'Sedang',
    text: 'Sebuah diagram lingkaran menunjukkan pilihan kegiatan ekstrakurikuler dari 120 siswa kelas VI di Sekolah Dasar: Pramuka 35%, Bulu Tangkis 25%, Seni Tari 15%, dan sisanya Robotika. Berapakah banyak siswa yang memilih ekstrakurikuler Robotika?',
    options: [
      { id: 'A', text: '24 siswa' },
      { id: 'B', text: '30 siswa' },
      { id: 'C', text: '36 siswa' },
      { id: 'D', text: '42 siswa' },
    ],
    correctAnswer: 'B',
    explanation:
      'Total persentase satu lingkaran penuh = 100%.\nPersentase Robotika = 100% - (35% + 25% + 15%) = 100% - 75% = 25%.\nBanyak siswa Robotika = 25% × 120 siswa = (25/100) × 120 = 30 siswa.',
  },
  {
    id: 17,
    type: 'pg',
    topic: 'Pangkat dan Akar Pangkat Tiga',
    difficulty: 'Sedang',
    text: 'Sebuah bak penampungan air berbentuk kubus memiliki volume 91.125 cm³. Panjang rusuk bagian dalam bak kubus tersebut adalah...',
    options: [
      { id: 'A', text: '35 cm' },
      { id: 'B', text: '45 cm' },
      { id: 'C', text: '55 cm' },
      { id: 'D', text: '65 cm' },
    ],
    correctAnswer: 'B',
    explanation:
      'Panjang rusuk = ∛Volume = ∛91.125.\nPerhatikan akhiran angka 5, akar satuannya adalah 5.\nKelompok ribuan 91 berada di antara 4³ = 64 dan 5³ = 125, sehingga puluhannya adalah 4.\nJadi ∛91.125 = 45 cm.',
  },
  {
    id: 18,
    type: 'pg',
    topic: 'Konversi Satuan Kecepatan',
    difficulty: 'Sedang',
    text: 'Seorang pelari maraton cilik melintasi jalan raya sejauh 3,6 kilometer dalam waktu 15 menit. Kecepatan rata-rata pelari tersebut bila dinyatakan dalam satuan meter per detik (m/s) adalah...',
    options: [
      { id: 'A', text: '3 m/s' },
      { id: 'B', text: '4 m/s' },
      { id: 'C', text: '5 m/s' },
      { id: 'D', text: '6 m/s' },
    ],
    correctAnswer: 'B',
    explanation:
      'Jarak = 3,6 km = 3,6 × 1.000 meter = 3.600 meter.\nWaktu = 15 menit = 15 × 60 detik = 900 detik.\nKecepatan = Jarak ÷ Waktu = 3.600 m ÷ 900 s = 4 m/s.',
  },

  // --- PILIHAN GANDA KOMPLEKS (3 SOAL) ---
  // Ketentuan: Kemungkinan lebih dari 1 pilihan jawaban benar, setiap soal memiliki 3 pilihan jawaban
  {
    id: 19,
    type: 'pgk',
    topic: 'Sifat-Sifat Bangun Datar',
    difficulty: 'Sedang',
    text: 'Perhatikan sifat-sifat bangun datar layang-layang berikut. Pilihlah SEMUA pernyataan yang BENAR mengenai bangun datar layang-layang! (Pilihan benar bisa lebih dari satu)',
    options: [
      { id: 'A', text: 'Mempunyai dua pasang sisi yang sama panjang dan berdekatan' },
      { id: 'B', text: 'Kedua diagonalnya saling berpotongan tegak lurus (membentuk sudut 90°)' },
      { id: 'C', text: 'Mempunyai dua pasang sudut berhadapan yang sama besar' },
    ],
    correctAnswer: ['A', 'B'],
    explanation:
      'Sifat layang-layang:\n- Memiliki 2 pasang sisi berdekatan yang sama panjang (Benar - A)\n- Kedua diagonal berpotongan tegak lurus (Benar - B)\n- Memiliki TEPAT SATU pasang sudut berhadapan yang sama besar, bukan dua pasang (C Salah).\nJadi pilihan yang benar adalah A dan B.',
  },
  {
    id: 20,
    type: 'pgk',
    topic: 'Keliling, Luas, & Aritmatika',
    difficulty: 'Sukar',
    text: 'Pak Budi memiliki sebidang tanah kebun berbentuk persegi panjang dengan ukuran panjang 24 meter dan lebar 16 meter. Manakah dari pernyataan-pernyataan berikut yang bernilai BENAR? (Pilihan benar bisa lebih dari satu)',
    options: [
      { id: 'A', text: 'Luas tanah kebun Pak Budi adalah 384 meter persegi (m²)' },
      { id: 'B', text: 'Keliling tanah kebun Pak Budi adalah 80 meter' },
      { id: 'C', text: 'Jika tanah tersebut dijual dengan harga Rp500.000,00 per m², maka total uang hasil penjualan tanah adalah Rp192.000.000,00' },
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation:
      'Perhitungan:\n- Luas = panjang × lebar = 24 m × 16 m = 384 m² (Benar - A)\n- Keliling = 2 × (p + l) = 2 × (24 + 16) = 2 × 40 = 80 meter (Benar - B)\n- Total harga jual = 384 m² × Rp500.000 = Rp192.000.000,00 (Benar - C).\nKetiga pernyataan bernilai benar.',
  },
  {
    id: 21,
    type: 'pgk',
    topic: 'Operasi Hitung Campuran & Satuan Berat',
    difficulty: 'Sedang',
    text: 'Ibu berbelanja ke pasar membeli 3 kantong beras yang masing-masing seberat 2,5 kg dan 4 kantong gula pasir yang masing-masing seberat 0,75 kg. Manakah dari pernyataan-pernyataan berikut yang bernilai BENAR? (Pilihan jawaban benar bisa lebih dari satu)',
    options: [
      { id: 'A', text: 'Total berat seluruh beras yang dibeli Ibu adalah 7,5 kg' },
      { id: 'B', text: 'Total berat seluruh gula pasir yang dibeli Ibu adalah 3,0 kg' },
      { id: 'C', text: 'Total berat seluruh belanjaan beras dan gula pasir Ibu adalah 11,5 kg' },
    ],
    correctAnswer: ['A', 'B'],
    explanation:
      'Perhitungan belanjaan Ibu:\n- Berat beras = 3 × 2,5 kg = 7,5 kg (Benar - A)\n- Berat gula pasir = 4 × 0,75 kg = 3,0 kg (Benar - B)\n- Total berat belanjaan = 7,5 kg + 3,0 kg = 10,5 kg (C Salah, karena pada opsi tertulis 11,5 kg).\nJadi pernyataan yang bernilai benar adalah A dan B.',
  },

  // --- PILIHAN GANDA KOMPLEKS KATEGORI (9 SOAL) ---
  // Ketentuan: Setiap soal memiliki 3 deskripsi/pernyataan yang harus direspons Benar / Salah
  {
    id: 22,
    type: 'pgk_kategori',
    topic: 'Aritmatika Sosial (Bruto, Neto, Tara, & Laba)',
    difficulty: 'Sukar',
    text: 'Seorang pedagang buah membeli 5 keranjang buah mangga di pasar induk. Setiap keranjang memiliki berat kotor (bruto) 40 kg dengan tara 5%. Harga beli mangga adalah Rp12.000,00 per kg neto. Seluruh mangga tersebut kemudian dijual kembali secara eceran dengan harga Rp15.000,00 per kg. Tentukan kebenaran dari masing-masing pernyataan berikut (Pilih Benar atau Salah):',
    statements: [
      {
        id: 's1',
        text: 'Berat bersih (neto) seluruh buah mangga dari 5 keranjang tersebut adalah 190 kg.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Total modal yang dikeluarkan pedagang untuk membeli seluruh mangga neto adalah Rp2.400.000,00.',
        correctAnswer: false,
      },
      {
        id: 's3',
        text: 'Keuntungan bersih yang diperoleh pedagang apabila seluruh mangga laku terjual adalah Rp570.000,00.',
        correctAnswer: true,
      },
    ],
    explanation:
      '1. Tara tiap keranjang = 5% × 40 kg = 2 kg. Neto tiap keranjang = 40 - 2 = 38 kg. Total neto 5 keranjang = 5 × 38 = 190 kg (BENAR).\n2. Modal pembelian = 190 kg × Rp12.000 = Rp2.280.000,00 (SALAH, tertulis Rp2.400.000).\n3. Total hasil penjualan = 190 kg × Rp15.000 = Rp2.850.000,00. Keuntungan = Rp2.850.000 - Rp2.280.000 = Rp570.000,00 (BENAR).',
  },
  {
    id: 23,
    type: 'pgk_kategori',
    topic: 'Statistika & Analisis KKTP',
    difficulty: 'Sedang',
    text: 'Berikut disajikan data rekap nilai ulangan matematika dari 30 siswa kelas VI Sekolah Dasar:\n• Nilai 60 diperoleh oleh 3 siswa\n• Nilai 70 diperoleh oleh 7 siswa\n• Nilai 80 diperoleh oleh 12 siswa\n• Nilai 90 diperoleh oleh 6 siswa\n• Nilai 100 diperoleh oleh 2 siswa\nKKTP mata pelajaran matematika yang ditetapkan sekolah adalah 70. Tentukan kebenaran dari masing-masing pernyataan berikut (Pilih Benar atau Salah):',
    statements: [
      {
        id: 's1',
        text: 'Modus dari perolehan nilai matematika siswa kelas VI tersebut adalah 80.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Banyak siswa yang telah berhasil mencapai atau melampaui KKTP (nilai ≥ 70) adalah sebanyak 27 siswa.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Persentase siswa yang belum mencapai KKTP terhadap seluruh siswa di kelas adalah sebesar 15%.',
        correctAnswer: false,
      },
    ],
    explanation:
      '1. Modus adalah data dengan frekuensi tertinggi, yaitu nilai 80 sebanyak 12 siswa (BENAR).\n2. Siswa tuntas (≥70) = 7 + 12 + 6 + 2 = 27 siswa (BENAR).\n3. Siswa belum tuntas (<70) = 3 orang. Persentase = (3 ÷ 30) × 100% = 10% (SALAH, tertulis 15%).',
  },
  {
    id: 24,
    type: 'pgk_kategori',
    topic: 'Volume Bangun Ruang (Balok) & Satuan Liter',
    difficulty: 'Sedang',
    text: 'Sebuah bak penampungan air berbentuk balok di sekolah memiliki ukuran panjang 150 cm, lebar 80 cm, dan tinggi 100 cm. Bak tersebut pada mulanya kosong kemudian diisi air hingga mencapai 3/4 dari kapasitas totalnya. Tentukan kebenaran dari masing-masing pernyataan berikut (Pilih Benar atau Salah):',
    statements: [
      {
        id: 's1',
        text: 'Volume total bak penampungan air tersebut jika terisi penuh adalah 1.200 liter.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Volume air yang ada di dalam bak saat ini adalah 900 liter.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Volume air yang masih harus ditambahkan agar bak terisi penuh adalah 350 liter.',
        correctAnswer: false,
      },
    ],
    explanation:
      '1. Volume bak penuh = 150 cm × 80 cm × 100 cm = 1.200.000 cm³ = 1.200 liter (BENAR).\n2. Volume air saat ini (3/4 bagian) = 3/4 × 1.200 liter = 900 liter (BENAR).\n3. Air yang masih harus ditambahkan = 1.200 liter - 900 liter = 300 liter (SALAH, tertulis 350 liter).',
  },
  {
    id: 25,
    type: 'pgk_kategori',
    topic: 'Geometri Lingkaran (Keliling & Luas)',
    difficulty: 'Sedang',
    text: 'Sebuah meja hias bundar memiliki permukaan berbentuk lingkaran dengan panjang diameter 140 cm. Di sekeliling tepi meja akan dipasang pita renda hias, dan seluruh permukaan meja akan ditutup dengan kaca bening. (Gunakan π = 22/7). Tentukan kebenaran dari masing-masing pernyataan berikut (Pilih Benar atau Salah):',
    statements: [
      {
        id: 's1',
        text: 'Panjang jari-jari permukaan meja bundar tersebut adalah 70 cm.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Panjang pita renda hias minimal yang dibutuhkan untuk mengelilingi meja adalah 440 cm.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Luas permukaan kaca bening penutup meja tersebut adalah 15.400 cm².',
        correctAnswer: true,
      },
    ],
    explanation:
      '1. Jari-jari meja (r) = diameter ÷ 2 = 140 ÷ 2 = 70 cm (BENAR).\n2. Keliling meja = π × d = 22/7 × 140 cm = 440 cm (BENAR).\n3. Luas permukaan meja = π × r² = 22/7 × 70 × 70 = 15.400 cm² (BENAR).',
  },
  {
    id: 26,
    type: 'pgk_kategori',
    topic: 'Skala, Denah, & Luas Sebenarnya',
    difficulty: 'Sedang',
    text: 'Denah lapangan upacara di Sekolah Dasar digambar dengan skala 1 : 400. Pada denah tersebut, lapangan digambarkan berbentuk persegi panjang dengan ukuran panjang 12 cm dan lebar 8 cm. Tentukan kebenaran dari masing-masing pernyataan berikut (Pilih Benar atau Salah):',
    statements: [
      {
        id: 's1',
        text: 'Panjang sebenarnya dari lapangan upacara tersebut adalah 48 meter.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Lebar sebenarnya dari lapangan upacara tersebut adalah 32 meter.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Luas sebenarnya dari lapangan upacara tersebut adalah 1.536 meter persegi (m²).',
        correctAnswer: true,
      },
    ],
    explanation:
      '1. Panjang sebenarnya = 12 cm × 400 = 4.800 cm = 48 meter (BENAR).\n2. Lebar sebenarnya = 8 cm × 400 = 3.200 cm = 32 meter (BENAR).\n3. Luas sebenarnya = 48 m × 32 m = 1.536 m² (BENAR).',
  },
  {
    id: 27,
    type: 'pgk_kategori',
    topic: 'Jarak, Waktu Tempuh, & Kecepatan',
    difficulty: 'Sukar',
    text: 'Sebuah bus pariwisata membawa rombongan siswa kelas VI menempuh perjalanan dari sekolah ke tempat wisata sejauh 120 km. Bus berangkat pada pukul 06.30 dan tiba di lokasi tujuan pada pukul 09.00. Selama dalam perjalanan, bus sempat berhenti di rest area selama 30 menit untuk istirahat. Tentukan kebenaran dari masing-masing pernyataan berikut (Pilih Benar atau Salah):',
    statements: [
      {
        id: 's1',
        text: 'Total waktu perjalanan dari waktu berangkat hingga tiba di tujuan adalah 2 jam 30 menit.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Waktu murni bus berjalan (melaju) di jalan raya adalah 2 jam.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Kecepatan rata-rata bus saat sedang melaju di jalan raya adalah 50 km/jam.',
        correctAnswer: false,
      },
    ],
    explanation:
      '1. Waktu tempuh total = 09.00 - 06.30 = 2 jam 30 menit (BENAR).\n2. Waktu gerak murni = 2 jam 30 menit - 30 menit istirahat = 2 jam (BENAR).\n3. Kecepatan rata-rata bus saat melaju = Jarak ÷ Waktu gerak = 120 km ÷ 2 jam = 60 km/jam (SALAH, tertulis 50 km/jam).',
  },
  {
    id: 28,
    type: 'pgk_kategori',
    topic: 'Operasi Pecahan & Persentase',
    difficulty: 'Mudah',
    text: 'Koperasi Siswa memiliki persediaan awal buku tulis sebanyak 200 buah. Pada hari Senin, terjual 30% dari persediaan awal tersebut. Pada hari Selasa, terjual 2/5 bagian dari persediaan awal. Tentukan kebenaran dari masing-masing pernyataan berikut (Pilih Benar atau Salah):',
    statements: [
      {
        id: 's1',
        text: 'Banyak buku tulis yang terjual pada hari Senin adalah 60 buah.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Banyak buku tulis yang terjual pada hari Selasa adalah 80 buah.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Sisa buku tulis di koperasi siswa setelah hari Selasa adalah sebanyak 70 buah.',
        correctAnswer: false,
      },
    ],
    explanation:
      '1. Penjualan hari Senin = 30% × 200 = 60 buku (BENAR).\n2. Penjualan hari Selasa = 2/5 × 200 = 80 buku (BENAR).\n3. Sisa buku = 200 - (60 + 80) = 200 - 140 = 60 buku (SALAH, tertulis 70 buah).',
  },
  {
    id: 29,
    type: 'pgk_kategori',
    topic: 'FPB & Penerapan Pembagian Paket',
    difficulty: 'Sedang',
    text: 'Pak Guru menyiapkan 36 penggaris, 54 bolpoin, dan 72 buku gambar sebagai paket hadiah lomba kebersihan kelas. Paket-paket tersebut akan dibagikan kepada sebanyak-banyaknya regu dengan isi masing-masing jenis barang yang sama banyak. Tentukan kebenaran dari masing-masing pernyataan berikut (Pilih Benar atau Salah):',
    statements: [
      {
        id: 's1',
        text: 'Faktor Persekutuan Terbesar (FPB) dari 36, 54, dan 72 adalah 18.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Banyak regu terbanyak yang dapat menerima paket hadiah tersebut adalah 18 regu.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Setiap regu akan menerima paket hadiah berupa 2 penggaris, 3 bolpoin, dan 4 buku gambar.',
        correctAnswer: true,
      },
    ],
    explanation:
      '1. FPB dari 36, 54, dan 72: 36 = 2² × 3²; 54 = 2 × 3³; 72 = 2³ × 3². FPB = 2 × 3² = 18 (BENAR).\n2. Jumlah regu terbanyak penerima hadiah = FPB = 18 regu (BENAR).\n3. Isi setiap regu: Penggaris = 36 ÷ 18 = 2 buah, Bolpoin = 54 ÷ 18 = 3 buah, Buku gambar = 72 ÷ 18 = 4 buah (BENAR).',
  },
  {
    id: 30,
    type: 'pgk_kategori',
    topic: 'Koordinat Kartesius & Geometri',
    difficulty: 'Sukar',
    text: 'Pada bidang koordinat Kartesius, digambar empat titik sudut yaitu: titik A(-2, 1), titik B(4, 1), titik C(4, 5), dan titik D(-2, 5). Keempat titik tersebut dihubungkan dengan garis lurus berurutan membentuk bangun datar segiempat ABCD. Tentukan kebenaran dari masing-masing pernyataan berikut (Pilih Benar atau Salah):',
    statements: [
      {
        id: 's1',
        text: 'Bangun datar segiempat ABCD yang terbentuk adalah bangun persegi panjang.',
        correctAnswer: true,
      },
      {
        id: 's2',
        text: 'Keliling dari bangun datar ABCD tersebut adalah 20 satuan panjang.',
        correctAnswer: true,
      },
      {
        id: 's3',
        text: 'Luas dari bangun datar ABCD tersebut adalah 30 satuan luas.',
        correctAnswer: false,
      },
    ],
    explanation:
      '1. Titik koordinat membentuk persegi panjang dengan panjang alas AB = 4 - (-2) = 6 satuan dan tinggi BC = 5 - 1 = 4 satuan (BENAR).\n2. Keliling = 2 × (panjang + lebar) = 2 × (6 + 4) = 2 × 10 = 20 satuan panjang (BENAR).\n3. Luas = panjang × lebar = 6 × 4 = 24 satuan luas (SALAH, tertulis 30 satuan luas).',
  },
];
