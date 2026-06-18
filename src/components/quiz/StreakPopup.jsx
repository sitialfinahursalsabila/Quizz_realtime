import { useEffect } from 'react'

const POPUP_DURATION_MS = 1800

const CONTENT = {
  correct: {
    image: '/images/correct.png',
    title: '5 Beruntun! 🔥',
    message: 'Mantap, jawabanmu benar 5 kali berturut-turut!',
  },
  wrong: {
    image: '/images/wrong.png',
    title: 'Tetap Coba Lagi 💪',
    message: 'Udah 5 kali keliru berturut-turut, pelan-pelan lagi ya.',
  },
}

export default function StreakPopup({ type, onClose }) {
  // Otomatis hilang sendiri setelah beberapa saat, gak perlu diklik.
  useEffect(() => {
    const timer = setTimeout(onClose, POPUP_DURATION_MS)
    return () => clearTimeout(timer)
  }, [onClose])

  const content = CONTENT[type]

  return (
    <div className="streak-backdrop" onClick={onClose} role="presentation">
      <div className={`streak-popup streak-${type}`}>
        <img src={content.image} alt={type === 'correct' ? 'Benar' : 'Salah'} className="streak-image" />
        <p className="streak-title">{content.title}</p>
        <p className="streak-message">{content.message}</p>
      </div>
    </div>
  )
}
