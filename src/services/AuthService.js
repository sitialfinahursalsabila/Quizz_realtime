import { User } from '../models/User'
import { hashPassword } from '../utils/hash'

const USERS_STORAGE_KEY = 'quizdash_users_v1'

/**
 * AuthService = satu-satunya "pintu masuk" untuk segala hal terkait akun:
 * daftar, login, dan simpan/baca riwayat kuis.
 *
 * STRUKTUR DATA: di memori, akun disimpan dalam `Map<username, User>`.
 * Map dipilih (bukan Array) karena pencarian by-username jadi O(1) —
 * tinggal `this.users.get(username)`, gak perlu looping satu-satu seperti
 * kalau pakai Array.find(). Map ini lalu disinkronkan ke localStorage
 * sebagai object biasa, karena Map tidak bisa langsung di-JSON-kan.
 */
export class AuthService {
  constructor() {
    this.users = this._loadFromStorage()
  }

  _loadFromStorage() {
    const map = new Map()
    try {
      const raw = window.localStorage.getItem(USERS_STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : {}
      Object.values(parsed).forEach((data) => {
        const user = User.fromJSON(data)
        map.set(user.username, user)
      })
    } catch (error) {
      console.error('Gagal memuat data akun dari localStorage:', error)
    }
    return map
  }

  _persist() {
    const plainObject = {}
    this.users.forEach((user, username) => {
      plainObject[username] = user.toJSON()
    })
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(plainObject))
  }

  register(rawUsername, rawPassword) {
    const username = rawUsername.trim().toLowerCase()

    if (username.length < 3) {
      throw new Error('Username minimal 3 karakter.')
    }
    if (rawPassword.length < 4) {
      throw new Error('Password minimal 4 karakter.')
    }
    if (this.users.has(username)) {
      throw new Error('Username sudah dipakai, coba nama lain.')
    }

    const user = new User(username, hashPassword(rawPassword))
    this.users.set(username, user)
    this._persist()
    return user
  }

  login(rawUsername, rawPassword) {
    const username = rawUsername.trim().toLowerCase()
    const user = this.users.get(username)

    if (!user) {
      throw new Error('Akun belum terdaftar. Daftar dulu, yuk.')
    }
    if (user.passwordHash !== hashPassword(rawPassword)) {
      throw new Error('Password salah.')
    }
    return user
  }

  getUser(username) {
    if (!username) return undefined
    return this.users.get(username.trim().toLowerCase())
  }

  addHistoryEntry(username, quizAttempt) {
    const user = this.getUser(username)
    if (!user) return
    user.addAttempt(quizAttempt.toJSON())
    this._persist()
  }

  getHistory(username) {
    const user = this.getUser(username)
    if (!user) return []
    return [...user.history].sort((a, b) => b.finishedAt - a.finishedAt)
  }
}

// Singleton: satu instance AuthService dipakai bersama di seluruh app,
// supaya data akun yang sudah ke-load di memori tidak perlu dibaca ulang
// dari localStorage setiap kali sebuah komponen butuh akses.
export const authService = new AuthService()
