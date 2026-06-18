import { authService } from '../services/AuthService'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

function scoreTone(score) {
  if (score < 40) return 'low'
  if (score >= 61) return 'high'
  return 'mid'
}

export default function HistoryPage({ username, onBack }) {
  const history = authService.getHistory(username)
  const user = authService.getUser(username)

  return (
    <div className="screen screen-center">
      <Card size="wide">
        <p className="eyebrow">Riwayat Kuis</p>
        <h1 className="title">Rekap {username}</h1>

        <div className="history-summary">
          <SummaryItem label="Total Pengerjaan" value={user?.getTotalAttempts() ?? 0} />
          <SummaryItem label="Skor Terbaik" value={`${user?.getBestScore() ?? 0}%`} />
          <SummaryItem label="Rata-rata Skor" value={`${user?.getAverageScore() ?? 0}%`} />
        </div>

        {history.length === 0 ? (
          <p className="subtitle">Belum ada riwayat. Yuk kerjakan kuis pertamamu!</p>
        ) : (
          <ul className="history-list">
            {history.map((attempt, index) => (
              <li key={index} className="history-item">
                <div>
                  <p className="history-date">{new Date(attempt.finishedAt).toLocaleString('id-ID')}</p>
                  <p className="history-detail">
                    Benar {attempt.correct} · Salah {attempt.wrong} · Tidak dijawab {attempt.unanswered} dari{' '}
                    {attempt.total} soal
                  </p>
                </div>
                <span className={`history-score score-${scoreTone(attempt.scorePercentage)}`}>
                  {attempt.scorePercentage}%
                </span>
              </li>
            ))}
          </ul>
        )}

        <Button variant="ghost" block onClick={onBack}>
          Kembali
        </Button>
      </Card>
    </div>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className="history-summary-item">
      <span className="history-summary-value">{value}</span>
      <span className="history-summary-label">{label}</span>
    </div>
  )
}
