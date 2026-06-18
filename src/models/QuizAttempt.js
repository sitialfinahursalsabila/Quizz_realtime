/**
 * Tiga kategori performa setelah kuis selesai. Dipakai untuk menentukan
 * banner mana yang muncul di halaman hasil (semangat / lumayan / reward).
 */
export const PERFORMANCE_TIER = {
  ENCOURAGEMENT: 'encouragement', // salah > 60% (otomatis benar < 40%)
  GOOD: 'good', // di antara dua ambang batas
  EXCELLENT: 'excellent', // benar 61% - 100%
}

// Ambang batas skor dikumpulkan jadi konstanta di satu tempat, biar kalau
// suatu saat mau diubah, gak perlu cari-cari ke banyak file.
const EXCELLENT_MIN_SCORE = 61
const ENCOURAGEMENT_MAX_SCORE = 40

/**
 * Class QuizAttempt = satu baris riwayat pengerjaan kuis.
 *
 * Konsep OOP yang dipakai di sini: ENCAPSULATION — semua data mentah
 * (jumlah benar/salah/dst) DAN logic untuk mengolahnya (skor %, kategori
 * performa) dikumpulkan jadi satu unit, bukan tersebar di komponen UI.
 * Jadi kalau besok rumus skor berubah, cukup ubah di class ini saja.
 */
export class QuizAttempt {
  constructor({ total, answered, correct, wrong, settings, wasTimedOut = false, finishedAt = Date.now() }) {
    this.total = total
    this.answered = answered
    this.correct = correct
    this.wrong = wrong
    this.unanswered = total - answered
    this.settings = settings
    this.wasTimedOut = wasTimedOut
    this.finishedAt = finishedAt
  }

  // Getter, jadi bisa dipanggil seperti properti biasa: attempt.scorePercentage
  get scorePercentage() {
    return this.total > 0 ? Math.round((this.correct / this.total) * 100) : 0
  }

  getPerformanceTier() {
    const score = this.scorePercentage
    if (score < ENCOURAGEMENT_MAX_SCORE) return PERFORMANCE_TIER.ENCOURAGEMENT
    if (score >= EXCELLENT_MIN_SCORE) return PERFORMANCE_TIER.EXCELLENT
    return PERFORMANCE_TIER.GOOD
  }

  // Ubah jadi object polos supaya bisa disimpan ke localStorage (JSON).
  toJSON() {
    return {
      total: this.total,
      answered: this.answered,
      correct: this.correct,
      wrong: this.wrong,
      unanswered: this.unanswered,
      settings: this.settings,
      wasTimedOut: this.wasTimedOut,
      finishedAt: this.finishedAt,
      scorePercentage: this.scorePercentage,
    }
  }

  /**
   * Factory method: bikin QuizAttempt langsung dari data mentah kuis
   * (array soal + array jawaban) tanpa caller perlu tahu cara hitungnya.
   */
  static fromAnswers(questions, answers, settings, wasTimedOut) {
    // .filter(Boolean) = trik singkat buang elemen null/undefined dari array
    const answeredEntries = answers.filter(Boolean)
    const correctCount = answeredEntries.filter((entry) => entry.isCorrect).length

    return new QuizAttempt({
      total: questions.length,
      answered: answeredEntries.length,
      correct: correctCount,
      wrong: answeredEntries.length - correctCount,
      settings,
      wasTimedOut,
    })
  }
}
