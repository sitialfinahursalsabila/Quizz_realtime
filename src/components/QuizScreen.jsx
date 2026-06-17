import { useState } from 'react'

import { useCountdown } from '../hooks/useCountdown'

import Timer from './Timer'

import ProgressBar from './ProgressBar'

import QuestionCard from './QuestionCard'

import AnswerFeedback from './AnswerFeedback'

export default function QuizScreen({

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

  const answeredCount = answers.filter(

    answer => answer !== null

  ).length

  const currentQuestion = questions[currentIndex]



  const [showFeedback, setShowFeedback] = useState(false)

  const [isCorrect, setIsCorrect] = useState(false)



  function handleFinishEarly() {

    const confirmed = window.confirm(

      'Selesaikan kuis sekarang? Soal yang belum dijawab akan dihitung salah.'

    )



    if (confirmed) {

      onFinishEarly()

    }

  }



  function handleAnswer(selected) {

    const correct =

      selected === currentQuestion.correctAnswer



    setIsCorrect(correct)

    setShowFeedback(true)



    onAnswer(selected)

  }



  function handleNext() {

    setShowFeedback(false)

  }



  return (

    <div className="screen">

      <div className="quiz-topbar">

        <ProgressBar

          currentIndex={currentIndex}

          total={questions.length}

          answeredCount={answeredCount}

        />



        <Timer

          secondsLeft={secondsLeft}

          totalSeconds={totalSeconds}

        />

      </div>



      <div className="quiz-body">

        {

          showFeedback ? (

            <AnswerFeedback

              isCorrect={isCorrect}

              onNext={handleNext}

            />

          ) : (

            <QuestionCard

              key={currentIndex}

              question={currentQuestion}

              questionNumber={currentIndex + 1}

              onAnswer={handleAnswer}

            />

          )

        }

      </div>



      <div className="quiz-footer">

        <button

          type="button"

          className="btn btn-ghost"

          onClick={handleFinishEarly}

        >

          Selesaikan Sekarang

        </button>

      </div>

    </div>

  )

}