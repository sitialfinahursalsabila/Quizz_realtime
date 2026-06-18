import Badge from '../common/Badge'

const DIFFICULTY_LABEL = {
  easy: 'Mudah',
  medium: 'Sedang',
  hard: 'Sulit',
}

export default function QuestionCard({ question, questionNumber, onAnswer }) {
  return (
    <div className="card question-card">
      <div className="question-meta">
        <Badge>{question.category}</Badge>
        <Badge outline>{DIFFICULTY_LABEL[question.difficulty] ?? question.difficulty}</Badge>
      </div>

      <h2 className="question-number">Soal #{questionNumber}</h2>
      <p className="question-text">{question.question}</p>

      <div className={`options-grid ${question.type === 'boolean' ? 'options-grid-2col' : ''}`}>
        {question.options.map((option) => (
          <button key={option} type="button" className="option-btn" onClick={() => onAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}