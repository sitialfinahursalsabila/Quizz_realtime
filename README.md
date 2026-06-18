# QuizDash

## Deskripsi Aplikasi

QuizDash merupakan aplikasi kuis interaktif berbasis React dan Vite yang memanfaatkan Open Trivia Database (OpenTDB) sebagai sumber soal. Pengguna dapat membuat akun, mengatur kuis sesuai keinginan, mengerjakan soal dengan timer, melihat hasil pengerjaan, serta menyimpan riwayat kuis yang pernah dikerjakan.

Aplikasi ini dibuat untuk memenuhi tugas pembuatan aplikasi kuis interaktif dengan menerapkan beberapa konsep pemrograman, struktur data, dan algoritma.

---

## Fitur Aplikasi

Beberapa fitur yang tersedia pada aplikasi ini, yaitu:

* Register dan login akun menggunakan username dan password.
* Mengambil soal secara langsung dari OpenTDB.
* Mengatur kategori, jumlah soal, tipe soal, dan tingkat kesulitan.
* Menampilkan progress pengerjaan selama kuis berlangsung.
* Menampilkan timer pengerjaan kuis.
* Setiap halaman hanya menampilkan satu soal.
* Otomatis berpindah ke soal berikutnya setelah jawaban dipilih.
* Menampilkan hasil ketika waktu habis atau seluruh soal selesai dikerjakan.
* Menyimpan riwayat pengerjaan kuis untuk setiap akun.
* Mendukung fitur resume apabila browser ditutup di tengah pengerjaan.

---

## Cara Menjalankan Aplikasi

Install dependency terlebih dahulu.

```bash
npm install
```

Jalankan aplikasi menggunakan perintah berikut.

```bash
npm run dev
```

Kemudian buka browser dan akses alamat berikut.

```text
http://localhost:5173
```

Apabila ingin menjalankan versi production, gunakan perintah berikut.

```bash
npm run build
npm run preview
```

---

## Struktur Folder

```text
quiz-app/
├── public/
├── src/
│
├── api/
├── components/
├── hooks/
├── models/
├── pages/
├── services/
├── utils/
│
├── App.jsx
├── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

Keterangan:

* `api` : berisi komunikasi dengan OpenTDB.
* `components` : berisi komponen yang digunakan kembali pada beberapa halaman.
* `hooks` : berisi custom hook untuk localStorage dan timer.
* `models` : berisi class yang menerapkan konsep OOP.
* `pages` : berisi halaman utama aplikasi.
* `services` : berisi pengelolaan data akun dan riwayat.
* `utils` : berisi fungsi-fungsi pendukung aplikasi.

---

## Pemenuhan Kriteria Tugas

| Kriteria              | Implementasi                                            |
| --------------------- | ------------------------------------------------------- |
| Fitur login           | Login dan register akun                                 |
| Menggunakan OpenTDB   | Soal diambil dari OpenTDB                               |
| Pengaturan soal       | Jumlah soal, kategori, tipe, dan kesulitan dapat diatur |
| Progress pengerjaan   | Ditampilkan selama kuis berlangsung                     |
| Timer                 | Ditampilkan pada halaman kuis                           |
| Satu soal per halaman | Setiap halaman hanya menampilkan satu soal              |
| Waktu habis           | Hasil otomatis ditampilkan                              |
| Resume                | Kuis dapat dilanjutkan setelah browser dibuka kembali   |

---

## Konsep Pemrograman yang Digunakan

### Object Oriented Programming (OOP)

* Encapsulation diterapkan pada class `User` dan `QuizAttempt`.
* Factory Method digunakan untuk membuat objek dari data yang tersimpan.
* Singleton diterapkan pada `AuthService`.

### Struktur Data dan Algoritma

* `Map` digunakan untuk menyimpan dan mencari data akun.
* Fisher-Yates Shuffle digunakan untuk mengacak pilihan jawaban.
* Hashing sederhana (djb2) digunakan untuk mengamankan password.
* Sorting digunakan untuk mengurutkan riwayat pengerjaan.
* `reduce()` digunakan untuk menghitung statistik pengguna.

---

## Catatan

Aplikasi ini dibuat untuk keperluan pembelajaran dan tugas perkuliahan. Password yang disimpan masih menggunakan hashing sederhana dan disimpan pada localStorage, sehingga belum ditujukan untuk penggunaan pada aplikasi berskala nyata.

---

Dibuat menggunakan React dan Vite.
by Siti Alfinahur Salsabila.
