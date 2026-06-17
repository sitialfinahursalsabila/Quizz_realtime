import { useState, useEffect, useRef } from 'react'

/**
 * Sama seperti useState, tapi value-nya otomatis dibaca dari & ditulis ke
 * localStorage. Inilah yang membuat quiz bisa "resume" walau browser ditutup.
 *
 * @param {string} key - kunci di localStorage
 * @param {*} initialValue - dipakai jika belum ada data tersimpan
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch (error) {
      console.error(`Gagal membaca localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Hindari menulis ulang pada render pertama jika tidak perlu.
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
    try {
      if (value === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Gagal menulis localStorage key "${key}":`, error)
    }
  }, [key, value])

  return [value, setValue]
}

export function clearLocalStorage(key) {
  window.localStorage.removeItem(key)
}
