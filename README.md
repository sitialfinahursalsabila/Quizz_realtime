# ⚡ QuizDash

Aplikasi kuis interaktif berbasis **React + Vite** yang mengambil soal langsung dari [Open Trivia Database](https://opentdb.com/) — lengkap dengan sistem akun, riwayat skor, timer, dan kemampuan resume otomatis.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=000&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=fff&style=flat-square)
![Sass](https://img.shields.io/badge/Sass-SCSS-CC6699?logo=sass&logoColor=fff&style=flat-square)
![OpenTDB](https://img.shields.io/badge/API-OpenTDB-2b2b2b?style=flat-square)

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Cara Menjalankan](#-cara-menjalankan)
- [Struktur Folder](#-struktur-folder)
- [Pemenuhan Kriteria Tugas](#-pemenuhan-kriteria-tugas)
- [Konsep Pemrograman yang Diterapkan](#-konsep-pemrograman-yang-diterapkan)
- [Catatan Keamanan](#-catatan-keamanan)
- [Upload ke GitHub](#-upload-ke-github)

---

## ✨ Fitur Utama

- 🔐 **Akun sungguhan** — daftar & login dengan username/password, tersimpan persisten di browser (localStorage), bisa logout lalu login lagi kapan saja
- 🌐 **Soal real-time dari OpenTDB** — kategori, jumlah, tipe (pilihan ganda / benar-salah), dan tingkat kesulitan bisa diatur bebas
- 📊 **Progress & timer** — jumlah soal terjawab ditampilkan real-time, timer berbentuk ring yang berkurang seiring waktu
- ➡️ **Satu soal per halaman** — otomatis pindah ke soal berikutnya setelah dijawab
- ⏰ **Auto-submit saat waktu habis** — soal otomatis ditutup dan hasil langsung ditampilkan
- 💾 **Resume otomatis** — tutup browser di tengah kuis, timer & posisi soal tetap akurat saat dibuka lagi
- 🏆 **Banner performa adaptif** — tampilan berbeda di halaman hasil tergantung skor (semangat / lumayan / reward + confetti)
- 📜 **Riwayat per akun** — setiap pengerjaan otomatis tersimpan ke akun, bisa dilihat lagi lewat halaman Riwayat
- 🎨 **Desain dark & colorful** — terinspirasi tampilan game-show modern (Quizizz-style), dengan sudut membundar dan aksen gradasi ungu-pink

## 🚀 Cara Menjalankan

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:5173` di browser. Tidak perlu Laragon/Apache/PHP — proyek ini murni frontend (cukup Node.js + Vite dev server), karena soal diambil langsung dari API publik lewat `fetch()`.

Build untuk produksi:

```bash
npm run build
npm run preview
```

## 📁 Struktur Folder

```
quiz-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                   # entry point React
    ├── App.jsx                    # state machine: login/register → settings → quiz → result → history
    │
    ├── assets/scss/                # seluruh styling, dipecah per partial (Sass)
    │   ├── main.scss               #   entry, @use semua partial
    │   ├── _variables.scss         #   token warna, font, radius
    │   ├── _base.scss              #   reset & background
    │   ├── _layout.scss            #   app-shell, header, screen, card
    │   ├── _forms.scss             #   input, select, label
    │   ├── _buttons.scss           #   tombol
    │   ├── _common.scss            #   badge, loader
    │   ├── _quiz.scss              #   question card, timer ring, progress bar
    │   ├── _result.scss            #   stats, review, banner semangat/reward
    │   └── _history.scss           #   halaman riwayat
    │
    ├── api/
    │   └── opentdb.js              # semua komunikasi ke OpenTDB API
    │
    ├── models/                     # class OOP (encapsulation)
    │   ├── User.js                 #   akun + statistik riwayat
    │   └── QuizAttempt.js          #   satu baris riwayat + logic kategori performa
    │
    ├── services/
    │   └── AuthService.js          # register/login + simpan riwayat (struktur data Map)
    │
    ├── hooks/
    │   ├── useLocalStorage.js      # sinkron state React <-> localStorage (basis resume)
    │   └── useCountdown.js         # timer berbasis timestamp absolut (akurat lintas reload)
    │
    ├── utils/
    │   ├── helpers.js              # decode teks HTML, shuffle (Fisher-Yates), format waktu
    │   └── hash.js                 # hashing password sederhana (djb2)
    │
    ├── components/
    │   ├── common/                 # atom UI generik, dipakai di banyak halaman
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── Select.jsx
    │   │   ├── Card.jsx
    │   │   ├── Badge.jsx
    │   │   └── Loader.jsx
    │   ├── quiz/                   # komponen khusus saat kuis berjalan
    │   │   ├── QuestionCard.jsx
    │   │   ├── Timer.jsx
    │   │   └── ProgressBar.jsx
    │   └── result/                 # komponen khusus halaman hasil
    │       ├── PerformanceBanner.jsx
    │       ├── StatsGrid.jsx
    │       └── ReviewList.jsx
    │
    └── pages/                      # satu file = satu halaman penuh
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        ├── SettingsPage.jsx
        ├── QuizPage.jsx
        ├── ResultPage.jsx
        └── HistoryPage.jsx
```

## ✅ Pemenuhan Kriteria Tugas

| # | Kriteria | Implementasi |
|---|---|---|
| a | Fitur login | `pages/LoginPage.jsx` + `pages/RegisterPage.jsx`, akun nyata via `AuthService` |
| b | Soal dari opentdb.com | `api/opentdb.js` |
| c | Jumlah & tipe soal bebas diatur | `pages/SettingsPage.jsx` |
| d | Total soal & jumlah dikerjakan ditampilkan | `components/quiz/ProgressBar.jsx` |
| e | Timer pengerjaan | `components/quiz/Timer.jsx` + `hooks/useCountdown.js` |
| f | Satu soal per halaman, otomatis pindah | `components/quiz/QuestionCard.jsx` |
| g | Timer habis → tutup soal & tampilkan hasil | `App.jsx` (`handleTimeUp`) + `pages/ResultPage.jsx` |
| h | Resume saat browser ditutup | `hooks/useLocalStorage.js`, timer disimpan sebagai timestamp (`endAt`), bukan counter biasa |

## 🧠 Konsep Pemrograman yang Diterapkan

| Konsep | Penjelasan | Lokasi |
|---|---|---|
| OOP — Encapsulation | Data & perilaku digabung dalam satu class, gak nyebar di komponen UI | `models/User.js`, `models/QuizAttempt.js` |
| OOP — Factory Method | Method statis untuk membangun object dari data mentah | `QuizAttempt.fromAnswers()`, `User.fromJSON()` |
| OOP — Singleton | Satu instance service dipakai bersama di seluruh app | `services/AuthService.js` (`export const authService`) |
| Struktur Data — Map | Pencarian akun by-username O(1), tanpa looping | `AuthService` |
| Algoritma — Fisher-Yates Shuffle | Mengacak posisi opsi jawaban secara adil, O(n) | `utils/helpers.js` |
| Algoritma — Hashing (djb2) | Password tidak tersimpan sebagai teks polos | `utils/hash.js` |
| Algoritma — Sorting | Riwayat diurutkan dari yang terbaru | `AuthService.getHistory()` |
| Algoritma — Agregasi (reduce) | Hitung skor terbaik & rata-rata | `User.getBestScore()`, `User.getAverageScore()` |

## 🔒 Catatan Keamanan

Password di-hash dengan algoritma sederhana (bukan bcrypt/argon2) dan disimpan di localStorage browser. Ini cukup untuk keperluan tugas/demo, **tapi jangan dipakai untuk data sensitif sungguhan** — localStorage bisa diakses lewat DevTools dan tidak ada server yang memverifikasi kredensial.

## 📤 Upload ke GitHub

```bash
git init
git add .
git commit -m "feat: quiz app with accounts, history, opentdb, timer, resume"
git branch -M main
git remote add origin <URL_REPO_GITHUB_KAMU>
git push -u origin main
```

---

<p align="center">Dibuat dengan React + Vite ⚡</p>
