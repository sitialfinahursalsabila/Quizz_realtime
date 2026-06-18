import { useEffect, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { fetchQuestions, requestSessionToken } from './api/opentdb'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SettingsPage from './pages/SettingsPage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'
import Loader from './components/common/Loader'

const SESSION_STORAGE_KEY = 'quizdash_session_v1'

// 'login' | 'register' | 'settings' | 'quiz' | 'result' | 'history'
const INITIAL_SESSION = {
  username: null,
  stage: 'login',
  questions: [],
  answers: [],
  currentIndex: 0,
  endAt: null,
  totalSeconds: 0,
  wasTimedOut: false,
  quizSettings: null,
  sessionToken: null,
}

export default function App() {
  // Seluruh progres (siapa yang login, soal, jawaban, sisa waktu) disimpan
  // di localStorage lewat hook ini. Inilah basis mekanisme resume: kalau
  // browser ditutup di tengah kuis lalu dibuka lagi, state ini dibaca ulang
  // persis seperti sebelum ditutup.
  const [session, setSession] = useLocalStorage(SESSION_STORAGE_KEY, INITIAL_SESSION)
  const [isFetching, setIsFetching] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Jalan sekali saat app pertama dibuka: kalau waktu kuis ternyata sudah
  // habis selagi browser ditutup, langsung tutup soal & tampilkan hasil.
  useEffect(() => {
    if (session.stage === 'quiz' && session.endAt && Date.now() >= session.endAt) {
      setSession((prev) => ({ ...prev, stage: 'result', wasTimedOut: true }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleLoginSuccess(user) {
    setSession((prev) => {
      // Kalau yang login adalah user yang sama dengan sesi kuis yang belum
      // selesai, lanjutkan (resume) -- jangan reset progresnya.
      const isSameUserResuming = prev.username === user.username && (prev.stage === 'quiz' || prev.stage === 'result')
      if (isSameUserResuming) {
        return { ...prev, username: user.username }
      }
      return { ...INITIAL_SESSION, username: user.username, stage: 'settings' }
    })
  }

  function handleLogout() {
    setSession(INITIAL_SESSION)
  }

  function goToRegister() {
    setSession((prev) => ({ ...prev, stage: 'register' }))
  }

  function goToLogin() {
    setSession((prev) => ({ ...prev, stage: 'login' }))
  }

  function goToHistory() {
    setSession((prev) => ({ ...prev, stage: 'history' }))
  }

  function backFromHistory() {
    setSession((prev) => ({ ...prev, stage: prev.questions.length > 0 ? 'result' : 'settings' }))
  }

  async function handleStartQuiz(quizSettings) {
    setErrorMessage('')
    setIsFetching(true)
    try {
      let token = session.sessionToken
      if (!token) {
        try {
          token = await requestSessionToken()
        } catch {
          token = null // tetap lanjut walau token gagal dibuat, hanya kurang fitur anti-duplikat
        }
      }

      const questions = await fetchQuestions({ ...quizSettings, token })
      const totalSeconds = quizSettings.durationMinutes * 60
      const endAt = Date.now() + totalSeconds * 1000

      setSession((prev) => ({
        ...prev,
        stage: 'quiz',
        questions,
        answers: new Array(questions.length).fill(null),
        currentIndex: 0,
        endAt,
        totalSeconds,
        wasTimedOut: false,
        quizSettings,
        sessionToken: token,
      }))
    } catch (error) {
      setErrorMessage(error.message ?? 'Terjadi kesalahan saat menyiapkan kuis.')
    } finally {
      setIsFetching(false)
    }
  }

  function handleAnswer(selectedOption) {
    setSession((prev) => {
      const currentQuestion = prev.questions[prev.currentIndex]
      const nextAnswers = [...prev.answers]
      nextAnswers[prev.currentIndex] = {
        selectedOption,
        isCorrect: selectedOption === currentQuestion.correctAnswer,
      }

      const isLastQuestion = prev.currentIndex + 1 >= prev.questions.length
      return {
        ...prev,
        answers: nextAnswers,
        currentIndex: isLastQuestion ? prev.currentIndex : prev.currentIndex + 1,
        stage: isLastQuestion ? 'result' : 'quiz',
        wasTimedOut: false,
      }
    })
  }

  function handleTimeUp() {
    setSession((prev) => ({ ...prev, stage: 'result', wasTimedOut: true }))
  }

  function handleFinishEarly() {
    setSession((prev) => ({ ...prev, stage: 'result', wasTimedOut: false }))
  }

  function handleRestart() {
    setSession((prev) => ({
      ...INITIAL_SESSION,
      stage: 'settings',
      username: prev.username,
      sessionToken: prev.sessionToken,
    }))
  }

  const showHeaderActions = session.username && !['login', 'register'].includes(session.stage)

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="brand-mini">⚡ QuizDash</span>
        {showHeaderActions && (
          <div className="header-actions">
            {session.stage !== 'history' && (
              <button type="button" className="link-btn" onClick={goToHistory}>
                Riwayat
              </button>
            )}
            <button type="button" className="link-btn" onClick={handleLogout}>
              Keluar ({session.username})
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {session.stage === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} onGoToRegister={goToRegister} />}

        {session.stage === 'register' && (
          <RegisterPage onRegisterSuccess={handleLoginSuccess} onGoToLogin={goToLogin} />
        )}

        {session.stage === 'settings' && !isFetching && (
          <SettingsPage
            username={session.username}
            onStart={handleStartQuiz}
            isLoading={isFetching}
            errorMessage={errorMessage}
            onViewHistory={goToHistory}
          />
        )}

        {isFetching && <Loader message="Mengambil soal dari OpenTDB…" />}

        {session.stage === 'quiz' && session.questions.length > 0 && (
          <QuizPage
            questions={session.questions}
            answers={session.answers}
            currentIndex={session.currentIndex}
            endAt={session.endAt}
            totalSeconds={session.totalSeconds}
            onAnswer={handleAnswer}
            onTimeUp={handleTimeUp}
            onFinishEarly={handleFinishEarly}
          />
        )}

        {session.stage === 'result' && (
          <ResultPage
            username={session.username}
            questions={session.questions}
            answers={session.answers}
            settings={session.quizSettings}
            wasTimedOut={session.wasTimedOut}
            onRestart={handleRestart}
            onViewHistory={goToHistory}
          />
        )}

        {session.stage === 'history' && <HistoryPage username={session.username} onBack={backFromHistory} />}
      </main>
    </div>
  )
}
