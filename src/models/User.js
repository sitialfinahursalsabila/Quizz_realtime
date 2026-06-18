/**
 * Class User = satu akun pengguna beserta riwayat kuis yang pernah dia kerjakan.
 *
 * Konsep OOP: ENCAPSULATION (data akun + perilaku/statistiknya jadi satu unit)
 * dan STATIC FACTORY METHOD (fromJSON) untuk membangun ulang object User dari
 * data polos yang dibaca dari localStorage.
 */
export class User {
  constructor(username, passwordHash, history = []) {
    this.username = username
    this.passwordHash = passwordHash
    this.history = history // array of plain object (hasil QuizAttempt.toJSON())
  }

  addAttempt(attemptPlainObject) {
    this.history.push(attemptPlainObject)
  }

  getTotalAttempts() {
    return this.history.length
  }

  // Algoritma agregasi sederhana (cari nilai maksimum) memakai reduce.
  getBestScore() {
    if (this.history.length === 0) return 0
    return this.history.reduce((best, item) => Math.max(best, item.scorePercentage), 0)
  }

  // Algoritma agregasi sederhana (rata-rata) memakai reduce.
  getAverageScore() {
    if (this.history.length === 0) return 0
    const totalScore = this.history.reduce((sum, item) => sum + item.scorePercentage, 0)
    return Math.round(totalScore / this.history.length)
  }

  toJSON() {
    return {
      username: this.username,
      passwordHash: this.passwordHash,
      history: this.history,
    }
  }

  static fromJSON(data) {
    return new User(data.username, data.passwordHash, data.history ?? [])
  }
}
