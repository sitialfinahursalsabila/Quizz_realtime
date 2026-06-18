import { useEffect, useRef } from 'react'

import { authService } from '../services/AuthService'
import { QuizAttempt } from '../models/QuizAttempt'

import Card from '../components/common/Card'
import Button from '../components/common/Button'
import PerformanceBanner from '../components/result/PerformanceBanner'
import StatsGrid from '../components/result/StatsGrid'
import ReviewList from '../components/result/ReviewList'

import correctGif from '../assets/images/correct.png'
import wrongGif from '../assets/images/wrong.png'

export default function ResultPage({
  username,
  questions,
  answers,
  settings,
  wasTimedOut,
  onRestart,
  onViewHistory,
}) {
  const hasSavedRef = useRef(false)

  const attempt = QuizAttempt.fromAnswers(
    questions,
    answers,
    settings,
    wasTimedOut
  )

  const tier = attempt.getPerformanceTier()

  const resultImage =
    attempt.scorePercentage >= 80
      ? correctGif
      : wrongGif

  useEffect(() => {
    if (hasSavedRef.current) return

    hasSavedRef.current = true
    authService.addHistoryEntry(username, attempt)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="screen screen-center">
      <Card size="wide">
        <p className="eyebrow">
          {wasTimedOut ? 'Waktu habis!' : 'Kuis selesai'}
        </p>

        <h1 className="title">
          Hasil Pengerjaan {username}
        </h1>

        <img
          src={resultImage}
          alt="result"
          className="result-image"
        />

        <PerformanceBanner tier={tier} />

        <div className="score-circle">
          <span className="score-number">
            {attempt.scorePercentage}%
          </span>

          <span className="score-label">
            Skor Akhir
          </span>
        </div>

        <StatsGrid
          total={attempt.total}
          answeredCount={attempt.answered}
          correctCount={attempt.correct}
          wrongCount={attempt.wrong}
          unansweredCount={attempt.unanswered}
        />

        <ReviewList
          questions={questions}
          answers={answers}
        />

        <div className="result-actions">
          <Button
            variant="ghost"
            block
            onClick={onViewHistory}
          >
            Lihat Riwayat
          </Button>

          <Button
            block
            onClick={onRestart}
          >
            Mulai Kuis Baru
          </Button>
        </div>
      </Card>
    </div>
  )
}