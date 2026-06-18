import { useEffect, useRef, useState } from 'react'
import Badge from '../common/Badge'

const ADVANCE_DELAY_MS = 550

const DIFFICULTY_LABEL = {
  easy: 'Mudah',
  medium: 'Sedang',
  hard: 'Sulit',
}

export default function QuestionCard({ question, questionNumber, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const timeoutRef = useRef(null)

  // Bersihkan timeout kalau komponen unmount sebelum delay selesai
  // (misalnya timer kuis habis tepat saat user baru klik jawaban).
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  function handleSelect(option) {
    if (selectedOption !== null) return // sudah menjawab, cegah klik dobel
    setSelectedOption(option)
    timeoutRef.current = setTimeout(() => {
      onAnswer(option)
    }, ADVANCE_DELAY_MS)
  }

  function optionClassName(option) {
    if (selectedOption === null) return 'option-btn'
    if (option === selectedOption) {
      return option === question.correctAnswer ? 'option-btn is-correct' : 'option-btn is-wrong'
    }
    if (option === question.correctAnswer) return 'option-btn is-correct-muted'
    return 'option-btn is-disabled'
  }

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
          <button
            key={option}
            type="button"
            className={optionClassName(option)}
            onClick={() => handleSelect(option)}
            disabled={selectedOption !== null}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
