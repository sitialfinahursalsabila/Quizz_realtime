import { PERFORMANCE_TIER } from '../../models/QuizAttempt'

// Konten tiap tingkat performa dikumpulkan di satu object, jadi kalau mau
// ganti copy/icon, gak perlu utak-atik logic JSX di bawah.
const TIER_CONTENT = {
  [PERFORMANCE_TIER.ENCOURAGEMENT]: {
    title: 'Tetap Semangat!',
    message: 'Belum maksimal gak masalah, ini baru pemanasan. Pelan-pelan, pasti naik kok!',
    bannerClass: 'banner-encouragement',
  },
  [PERFORMANCE_TIER.GOOD]: {
    title: 'Lumayan, Terus Tingkatkan!',
    message: 'Hasil kamu udah cukup baik. Sedikit lagi buat nembus level Excellent.',
    bannerClass: 'banner-good',
  },
  [PERFORMANCE_TIER.EXCELLENT]: {
    title: 'Reward: Performa Excellent!',
    message: 'Jawabanmu cepat & tepat. Sebagai apresiasi, kamu dapat lencana Bonus Time Master 🎉',
    bannerClass: 'banner-reward',
  },
}

export default function PerformanceBanner({ tier }) {
  const content = TIER_CONTENT[tier]
  const isReward = tier === PERFORMANCE_TIER.EXCELLENT

  return (
    <div className={`performance-banner ${content.bannerClass}`}>
      {isReward && (
        <div className="confetti" aria-hidden="true">
          {/* 12 keping confetti, posisi & delay tiap keping diatur lewat CSS var --i */}
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index} className="confetti-piece" style={{ '--i': index }} />
          ))}
        </div>
      )}
      <span className="performance-icon">{content.icon}</span>
      <div className="performance-text">
        <p className="performance-title">{content.title}</p>
        <p className="performance-message">{content.message}</p>
      </div>
    </div>
  )
}
