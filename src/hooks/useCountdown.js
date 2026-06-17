import { useState, useEffect, useRef } from 'react'

/**
 * Hitung mundur berdasarkan TIMESTAMP akhir (endAt), bukan sekadar mengurangi
 * counter setiap detik. Pendekatan ini penting untuk fitur resume: walau
 * browser ditutup beberapa menit lalu dibuka lagi, sisa waktu tetap akurat
 * karena dihitung ulang dari selisih waktu sebenarnya, bukan dari counter
 * yang berhenti saat tab nonaktif.
 *
 * @param {number|null} endAt - epoch ms kapan timer berakhir
 * @param {() => void} onExpire - dipanggil sekali saat waktu mencapai 0
 */
export function useCountdown(endAt, onExpire) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    endAt ? Math.max(0, Math.round((endAt - Date.now()) / 1000)) : 0
  )
  const hasExpiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (!endAt) return

    hasExpiredRef.current = false

    function tick() {
      const remainingMs = endAt - Date.now()
      const remainingSeconds = Math.max(0, Math.round(remainingMs / 1000))
      setSecondsLeft(remainingSeconds)

      if (remainingMs <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true
        onExpireRef.current?.()
      }
    }

    tick() // jalankan langsung biar tidak nunggu 1 detik pertama
    const intervalId = setInterval(tick, 1000)
    return () => clearInterval(intervalId)
  }, [endAt])

  return secondsLeft
}
