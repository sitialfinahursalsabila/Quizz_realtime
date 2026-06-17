import { formatTime } from '../utils/helpers'

const RADIUS = 26
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function Timer({ secondsLeft, totalSeconds }) {
  const ratio = totalSeconds > 0 ? secondsLeft / totalSeconds : 0
  const dashOffset = CIRCUMFERENCE * (1 - ratio)
  const isUrgent = secondsLeft <= 30

  return (
    <div className={`timer ${isUrgent ? 'timer-urgent' : ''}`}>
      <svg className="timer-ring" viewBox="0 0 60 60" width="60" height="60">
        <circle className="timer-ring-bg" cx="30" cy="30" r={RADIUS} />
        <circle
          className="timer-ring-fg"
          cx="30"
          cy="30"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="timer-label">{formatTime(secondsLeft)}</span>
    </div>
  )
}
