export default function StatsGrid({ total, answeredCount, correctCount, wrongCount, unansweredCount }) {
  return (
    <div className="stats-grid">
      <StatBox label="Total Soal" value={total} tone="neutral" />
      <StatBox label="Soal Dikerjakan" value={answeredCount} tone="neutral" />
      <StatBox label="Jawaban Benar" value={correctCount} tone="correct" />
      <StatBox label="Jawaban Salah" value={wrongCount} tone="wrong" />
      <StatBox label="Tidak Dijawab" value={unansweredCount} tone="neutral" />
    </div>
  )
}

function StatBox({ label, value, tone }) {
  return (
    <div className={`stat-box stat-${tone}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
