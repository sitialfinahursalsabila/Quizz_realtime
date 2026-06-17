# QuizDash — React Quiz App (OpenTDB)

Aplikasi kuis berbasis React + Vite yang mengambil soal dari [Open Trivia Database](https://opentdb.com/).

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

Build untuk produksi:

```bash
npm run build
npm run preview
```

## Struktur Project

```
quiz-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # entry point React
    ├── App.jsx               # state machine: login → settings → quiz → result
    ├── index.css             # seluruh styling (dark theme + timer ring)
    ├── api/
    │   └── opentdb.js        # semua komunikasi ke OpenTDB API
    ├── hooks/
    │   ├── useLocalStorage.js  # sinkronisasi state <-> localStorage (resume)
    │   └── useCountdown.js     # timer berbasis timestamp absolut
    ├── utils/
    │   └── helpers.js          # decode teks, shuffle, format waktu, normalisasi soal
    └── components/
        ├── Login.jsx
        ├── Settings.jsx        # form jumlah soal, kategori, tipe, durasi
        ├── QuizScreen.jsx       # container saat kuis berjalan
        ├── QuestionCard.jsx     # satu soal per halaman
        ├── Timer.jsx            # ring SVG countdown
        ├── ProgressBar.jsx      # total soal & jumlah terjawab
        ├── ResultScreen.jsx     # rekap hasil pengerjaan
        └── Loader.jsx
```

## Pemenuhan Kriteria Tugas

| Poin | Kriteria | Implementasi |
|---|---|---|
| a | Fitur login | `Login.jsx` — input nama peserta sebelum bisa lanjut ke kuis |
| b | Soal dari opentdb.com | `api/opentdb.js` — `fetchQuestions`, `fetchCategories`, `requestSessionToken` |
| c | Jumlah & tipe soal bebas | `Settings.jsx` — user mengatur jumlah soal (1–50), kategori, tipe (pilihan ganda/benar-salah/semua), dan kesulitan |
| d | Total soal & jumlah dikerjakan ditampilkan | `ProgressBar.jsx`, ditampilkan real-time di `quiz-topbar` |
| e | Timer pengerjaan | `Timer.jsx` + `hooks/useCountdown.js`, durasi diatur bebas di Settings |
| f | Satu soal per halaman, otomatis pindah | `QuestionCard.jsx` — memilih jawaban langsung memicu `onAnswer` (delay singkat untuk feedback visual) lalu `App.jsx` memajukan index soal |
| g | Timer habis → tutup soal & tampilkan hasil (benar/salah/jawab) | `App.jsx` (`handleTimeUp`) mengubah stage ke `result`; `ResultScreen.jsx` menghitung total, terjawab, benar, salah, tidak dijawab |
| h | Resume saat browser ditutup (localStorage) | `hooks/useLocalStorage.js` menyimpan seluruh state (soal, jawaban, index soal, dan **timestamp** akhir timer) ke localStorage. Saat dibuka kembali, state dibaca ulang dan sisa waktu dihitung dari timestamp, bukan counter — jadi akurat walau browser ditutup beberapa saat |

## Catatan teknis tambahan

- **Akurasi timer saat resume**: timer tidak disimpan sebagai "sisa detik", melainkan sebagai `endAt` (epoch ms kapan kuis berakhir). Ini membuat sisa waktu tetap benar walau tab di-suspend atau browser ditutup lama, karena dihitung dari `endAt - Date.now()`, bukan dari counter yang berhenti.
- **Session token OpenTDB**: digunakan agar soal yang sudah pernah keluar tidak diulang dalam sesi yang sama. Jika token kehabisan stok soal unik (`response_code 4`), aplikasi otomatis me-reset token sekali sebelum mencoba lagi.
- **Rate limit OpenTDB**: jika API membalas `response_code 5` (terlalu banyak request), aplikasi otomatis menunggu lalu mencoba ulang.
- **Decode teks**: soal diminta dengan `encode=url3986` lalu di-decode dengan `decodeURIComponent`, lebih aman daripada decode HTML entity manual.

## Upload ke GitHub

```bash
git init
git add .
git commit -m "feat: quiz app with opentdb, timer, login, resume"
git branch -M main
git remote add origin <URL_REPO_GITHUB_KAMU>
git push -u origin main
```
