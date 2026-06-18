import { useCountdown } from '../hooks/useCountdown'
import Timer from '../components/quiz/Timer'
import ProgressBar from '../components/quiz/ProgressBar'
import QuestionCard from '../components/quiz/QuestionCard'
import Button from '../components/common/Button'

export default function QuizPage({
  questions,
  answers,
  currentIndex,
  endAt,
  totalSeconds,
  onAnswer,
  onTimeUp,
  onFinishEarly,
}) {
  const secondsLeft = useCountdown(endAt, onTimeUp)
  const answeredCount = answers.filter((answer) => answer !== null).length
  const currentQuestion = questions[currentIndex]

  function handleFinishEarly() {
    const confirmed = window.confirm('Selesaikan kuis sekarang? Soal yang belum dijawab akan dihitung salah.')
    if (confirmed) onFinishEarly()
  }

  return (
    <div className="screen">
      <div className="quiz-topbar">
        <ProgressBar currentIndex={currentIndex} total={questions.length} answeredCount={answeredCount} />
        <Timer secondsLeft={secondsLeft} totalSeconds={totalSeconds} />
      </div>

      <div className="quiz-body">
        <QuestionCard key={currentIndex} question={currentQuestion} questionNumber={currentIndex + 1} onAnswer={onAnswer} />
      </div>

      <div className="quiz-footer">
        <Button variant="ghost" onClick={handleFinishEarly}>
          Selesaikan Sekarang
        </Button>
      </div>
    </div>
  )
}
