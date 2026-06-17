import { buildOpenTdbUrl, normalizeQuestion } from '../utils/helpers'

const BASE_URL = 'https://opentdb.com'

// Kode respons OpenTDB, dijadikan konstanta biar gak ada angka ajaib di logic.
const RESPONSE_CODE = {
  SUCCESS: 0,
  NO_RESULTS: 1, // kombinasi kategori/kesulitan/jumlah tidak tersedia
  INVALID_PARAMETER: 2,
  TOKEN_NOT_FOUND: 3,
  TOKEN_EMPTY: 4, // semua soal unik utk token ini sudah pernah keluar
  RATE_LIMIT: 5, // terlalu banyak request, harus tunggu 5 detik
}

/**
 * Ambil daftar kategori soal dari OpenTDB.
 * Return: [{ id, name }]
 */
export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/api_category.php`)
  if (!response.ok) {
    throw new Error('Gagal mengambil daftar kategori dari OpenTDB.')
  }
  const data = await response.json()
  return data.trivia_categories
}

/**
 * Minta session token baru. Token dipakai supaya soal yang sudah keluar
 * tidak diulang lagi untuk sesi yang sama.
 */
export async function requestSessionToken() {
  const response = await fetch(`${BASE_URL}/api_token.php?command=request`)
  const data = await response.json()
  if (data.response_code !== RESPONSE_CODE.SUCCESS) {
    throw new Error('Gagal membuat session token.')
  }
  return data.token
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Ambil soal dari OpenTDB sesuai konfigurasi user, lalu normalisasi
 * (decode HTML entity + acak posisi jawaban).
 *
 * @param {{amount:number, category:string, difficulty:string, type:string, token:string}} options
 */
export async function fetchQuestions(options, retryCount = 0) {
  const url = buildOpenTdbUrl(options)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Tidak bisa terhubung ke OpenTDB. Cek koneksi internet kamu.')
  }

  const data = await response.json()

  switch (data.response_code) {
    case RESPONSE_CODE.SUCCESS:
      return data.results.map(normalizeQuestion)

    case RESPONSE_CODE.NO_RESULTS:
      throw new Error(
        'Soal tidak ditemukan untuk kombinasi kategori/kesulitan/jumlah ini. Coba kurangi jumlah soal atau ganti kategori.'
      )

    case RESPONSE_CODE.TOKEN_EMPTY: {
      // Semua soal unik sudah pernah ditampilkan ke token ini -> reset token & retry sekali.
      if (retryCount > 0) {
        throw new Error('Stok soal unik untuk sesi ini sudah habis. Coba kurangi jumlah soal.')
      }
      await fetch(`${BASE_URL}/api_token.php?command=reset&token=${options.token}`)
      return fetchQuestions(options, retryCount + 1)
    }

    case RESPONSE_CODE.TOKEN_NOT_FOUND:
      throw new Error('Session token tidak valid. Silakan mulai ulang quiz.')

    case RESPONSE_CODE.RATE_LIMIT: {
      // OpenTDB membatasi 1 request per 5 detik per IP, beri sedikit delay & retry sekali.
      if (retryCount > 1) {
        throw new Error('Server OpenTDB sedang sibuk. Coba lagi dalam beberapa saat.')
      }
      await delay(5500)
      return fetchQuestions(options, retryCount + 1)
    }

    default:
      throw new Error('Terjadi kesalahan tak terduga saat mengambil soal.')
  }
}
