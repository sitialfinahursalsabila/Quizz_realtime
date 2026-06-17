import { useEffect, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { fetchQuestions, requestSessionToken } from './api/opentdb'

import Login from './components/Login'
import Settings from './components/Settings'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import Loader from './components/Loader'

const STORAGE_KEY = 'quizdash_state_v1'

const INITIAL_STATE = {
  stage: 'login', // 'login' | 'settings' | 'quiz' | 'result'
  userName: '',
  questions: [],
  answers: [],
  currentIndex: 0,
  endAt: null,
  totalSeconds: 0,
  wasTimedOut: false,
  sessionToken: null,
}

export default function App() {
  // Seluruh progres kuis disimpan di localStorage lewat hook ini.
  // Saat browser ditutup & dibuka lagi, useLocalStorage akan membaca state
  // terakhir, sehingga user otomatis lanjut dari posisi terakhir (resume).
  const [state, setState] = useLocalStorage(STORAGE_KEY, INITIAL_STATE)
  const [isFetching, setIsFetching] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Jalan sekali saat app pertama dibuka: kalau ternyata waktu kuis sudah
  // habis selagi browser ditutup, langsung tutup soal & tampilkan hasil.
  useEffect(() => {
    if (state.stage === 'quiz' && state.endAt && Date.now() >= state.endAt) {
      setState((prev) => ({ ...prev, stage: 'result', wasTimedOut: true }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleLogin(name) {
    setState({ ...INITIAL_STATE, stage: 'settings', userName: name })
  }

  function handleLogout() {
    setState(INITIAL_STATE)
  }

  async function handleStartQuiz(settings) {
    setErrorMessage('')
    setIsFetching(true)
    try {
      let token = state.sessionToken
      if (!token) {
        try {
          token = await requestSessionToken()
        } catch {
          token = null // tetap lanjut walau token gagal dibuat, hanya kurang fitur anti-duplikat
        }
      }

      const questions = await fetchQuestions({ ...settings, token })
      const totalSeconds = settings.durationMinutes * 60
      const endAt = Date.now() + totalSeconds * 1000

      setState((prev) => ({
        ...prev,
        stage: 'quiz',
        questions,
        answers: new Array(questions.length).fill(null),
        currentIndex: 0,
        endAt,
        totalSeconds,
        wasTimedOut: false,
        sessionToken: token,
      }))
    } catch (error) {
      setErrorMessage(error.message ?? 'Terjadi kesalahan saat menyiapkan kuis.')
    } finally {
      setIsFetching(false)
    }
  }

  function handleAnswer(selectedOption) {
    setState((prev) => {
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
    setState((prev) => ({ ...prev, stage: 'result', wasTimedOut: true }))
  }

  function handleFinishEarly() {
    setState((prev) => ({ ...prev, stage: 'result', wasTimedOut: false }))
  }

  function handleRestart() {
    setState((prev) => ({ ...INITIAL_STATE, stage: 'settings', userName: prev.userName, sessionToken: prev.sessionToken }))
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="brand-mini">⚡ QuizDash</span>
        {state.userName && state.stage !== 'login' && (
          <button type="button" className="link-btn" onClick={handleLogout}>
            Keluar ({state.userName})
          </button>
        )}
      </header>

      <main className="app-main">
        {state.stage === 'login' && <Login onLogin={handleLogin} />}

        {state.stage === 'settings' && !isFetching && (
          <Settings
            userName={state.userName}
            onStart={handleStartQuiz}
            isLoading={isFetching}
            errorMessage={errorMessage}
          />
        )}

        {isFetching && <Loader message="Mengambil soal dari OpenTDB…" />}

        {state.stage === 'quiz' && state.questions.length > 0 && (
          <QuizScreen
            questions={state.questions}
            answers={state.answers}
            currentIndex={state.currentIndex}
            endAt={state.endAt}
            totalSeconds={state.totalSeconds}
            onAnswer={handleAnswer}
            onTimeUp={handleTimeUp}
            onFinishEarly={handleFinishEarly}
          />
        )}

        {state.stage === 'result' && (
          <ResultScreen
            questions={state.questions}
            answers={state.answers}
            wasTimedOut={state.wasTimedOut}
            userName={state.userName}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  )
}
