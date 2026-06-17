export default function ProgressBar({ currentIndex, total, answeredCount }) {
  const percentage = total > 0 ? ((currentIndex) / total) * 100 : 0

  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        <span>
          Soal <strong>{currentIndex + 1}</strong> dari <strong>{total}</strong>
        </span>
        <span>
          Terjawab: <strong>{answeredCount}</strong> / {total}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
