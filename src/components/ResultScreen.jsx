export default function ResultScreen({ questions, answers, wasTimedOut, userName, onRestart }) {
  const total = questions.length
  const answeredEntries = answers.filter((answer) => answer !== null)
  const answeredCount = answeredEntries.length
  const correctCount = answeredEntries.filter((answer) => answer.isCorrect).length
  const wrongCount = answeredCount - correctCount
  const unansweredCount = total - answeredCount
  const scorePercentage = total > 0 ? Math.round((correctCount / total) * 100) : 0

  return (
    <div className="screen screen-center">
      <div className="card card-wide">
        <p className="eyebrow">{wasTimedOut ? 'Waktu habis!' : 'Kuis selesai'}</p>
        <h1 className="title">Hasil Pengerjaan {userName}</h1>

        <div className="score-circle">
          <span className="score-number">{scorePercentage}%</span>
          <span className="score-label">Skor Akhir</span>
        </div>

        <div className="stats-grid">
          <StatBox label="Total Soal" value={total} tone="neutral" />
          <StatBox label="Soal Dikerjakan" value={answeredCount} tone="neutral" />
          <StatBox label="Jawaban Benar" value={correctCount} tone="correct" />
          <StatBox label="Jawaban Salah" value={wrongCount} tone="wrong" />
          <StatBox label="Tidak Dijawab" value={unansweredCount} tone="neutral" />
        </div>

        <details className="review">
          <summary>Lihat rincian per soal</summary>
          <ol className="review-list">
            {questions.map((question, index) => {
              const answer = answers[index]
              return (
                <li key={index} className="review-item">
                  <p className="review-question">{question.question}</p>
                  <p className="review-answer">
                    Jawaban kamu: <strong>{answer ? answer.selectedOption : '— tidak dijawab —'}</strong>
                  </p>
                  <p className="review-answer">
                    Jawaban benar: <strong>{question.correctAnswer}</strong>
                  </p>
                  <span className={`review-tag ${answer?.isCorrect ? 'tag-correct' : 'tag-wrong'}`}>
                    {answer?.isCorrect ? 'Benar' : 'Salah / Belum Dijawab'}
                  </span>
                </li>
              )
            })}
          </ol>
        </details>

        <button type="button" className="btn btn-primary btn-block" onClick={onRestart}>
          Mulai Kuis Baru
        </button>
      </div>
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
