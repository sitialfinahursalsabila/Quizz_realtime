export default function ReviewList({ questions, answers }) {
  return (
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
  )
}
