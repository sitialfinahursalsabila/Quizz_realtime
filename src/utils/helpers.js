/**
 * Kumpulan fungsi utilitas murni (pure function) yang dipakai di seluruh app.
 * Dipisah dari komponen agar mudah ditest & dibaca.
 */

// OpenTDB dikirim dengan encode=url3986, jadi setiap string perlu di-decode.
export function decodeText(text) {
  try {
    return decodeURIComponent(text)
  } catch {
    return text
  }
}

// Fisher-Yates shuffle, tidak memodifikasi array asli.
export function shuffleArray(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Ubah total detik -> "MM:SS"
export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/**
 * Ubah satu raw question dari OpenTDB menjadi bentuk siap pakai di UI:
 * - teks di-decode
 * - jawaban benar + salah digabung & diacak sekali saja (urutan tidak berubah saat re-render)
 */
export function normalizeQuestion(raw) {
  const question = decodeText(raw.question)
  const category = decodeText(raw.category)
  const correctAnswer = decodeText(raw.correct_answer)
  const incorrectAnswers = raw.incorrect_answers.map(decodeText)
  const options = shuffleArray([correctAnswer, ...incorrectAnswers])

  return {
    question,
    category,
    difficulty: raw.difficulty,
    type: raw.type, // 'multiple' | 'boolean'
    correctAnswer,
    options,
  }
}

export function buildOpenTdbUrl({ amount, category, difficulty, type, token }) {
  const params = new URLSearchParams()
  params.set('amount', String(amount))
  params.set('encode', 'url3986')
  if (category) params.set('category', String(category))
  if (difficulty) params.set('difficulty', difficulty)
  if (type) params.set('type', type)
  if (token) params.set('token', token)
  return `https://opentdb.com/api.php?${params.toString()}`
}
