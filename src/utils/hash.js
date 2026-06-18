/**
 * djb2 — algoritma hashing string klasik, ringan & cepat.
 *
 * CATATAN PENTING: ini BUKAN algoritma kriptografi yang aman untuk produksi
 * sungguhan (tidak ada salt, tidak tahan brute-force). Di proyek ini dipakai
 * sekadar supaya password tidak tersimpan sebagai teks polos di localStorage.
 * Untuk aplikasi nyata, hashing password wajib dilakukan di server dengan
 * algoritma seperti bcrypt/argon2.
 *
 * Cara kerja singkat: setiap karakter dikonversi ke kode ASCII, lalu
 * diakumulasikan ke sebuah angka hash lewat perkalian + XOR. Hasil akhirnya
 * diubah ke string heksadesimal agar ringkas disimpan.
 */
export function hashPassword(rawText) {
  let hash = 5381

  for (let i = 0; i < rawText.length; i++) {
    const charCode = rawText.charCodeAt(i)
    hash = (hash * 33) ^ charCode
  }

  // ">>> 0" memaksa hasil jadi unsigned 32-bit sebelum diubah ke hex.
  return (hash >>> 0).toString(16)
}
