# Quiz Realtime

A quiz application built with React and Vite that fetches questions in real-time from the Open Trivia Database (OpenTDB), complete with account-based authentication, score history, a configurable timer, and an automatic resume mechanism.

Live demo: https://quizz-realtime.vercel.app

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Assignment Criteria Mapping](#assignment-criteria-mapping)
- [Concepts Applied](#concepts-applied)
- [Security Notes](#security-notes)
- [Deployment](#deployment)

## Features

- Account-based authentication (register and login), persisted in the browser via localStorage
- Questions fetched in real-time from the OpenTDB API, with no hardcoded data
- Fully configurable quiz settings: number of questions, category, type, and difficulty
- Real-time progress indicator showing current question position and number answered
- Countdown timer with configurable duration, displayed as a circular progress ring
- One question displayed per page, with automatic advancement after each answer
- Automatic session closure and result display once the timer reaches zero
- Resume mechanism: quiz progress and remaining time are preserved accurately even if the browser is closed mid-session
- Score history saved per account, viewable on a dedicated history page
- Adaptive performance feedback on the result page, based on overall score percentage
- Streak feedback triggered every five consecutive correct or incorrect answers

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. No backend server is required since this is a frontend-only application that communicates directly with the OpenTDB public API.

To build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```
quiz-app/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── images/
│       ├── correct.png
│       └── wrong.png
└── src/
    ├── main.jsx
    ├── App.jsx
    │
    ├── assets/scss/
    │   ├── main.scss
    │   ├── _variables.scss
    │   ├── _base.scss
    │   ├── _layout.scss
    │   ├── _forms.scss
    │   ├── _buttons.scss
    │   ├── _common.scss
    │   ├── _quiz.scss
    │   ├── _result.scss
    │   └── _history.scss
    │
    ├── api/
    │   └── opentdb.js
    │
    ├── models/
    │   ├── User.js
    │   └── QuizAttempt.js
    │
    ├── services/
    │   └── AuthService.js
    │
    ├── hooks/
    │   ├── useLocalStorage.js
    │   └── useCountdown.js
    │
    ├── utils/
    │   ├── helpers.js
    │   └── hash.js
    │
    ├── components/
    │   ├── common/
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── Select.jsx
    │   │   ├── Card.jsx
    │   │   ├── Badge.jsx
    │   │   └── Loader.jsx
    │   ├── quiz/
    │   │   ├── QuestionCard.jsx
    │   │   ├── Timer.jsx
    │   │   ├── ProgressBar.jsx
    │   │   ├── AnswerFeedback.jsx
    │   │   └── StreakPopup.jsx
    │   └── result/
    │       ├── PerformanceBanner.jsx
    │       ├── StatsGrid.jsx
    │       └── ReviewList.jsx
    │
    └── pages/
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        ├── SettingsPage.jsx
        ├── QuizPage.jsx
        ├── ResultPage.jsx
        └── HistoryPage.jsx
```

## Assignment Criteria Mapping

| Point | Criteria | Implementation |
|---|---|---|
| a | Login feature | `pages/LoginPage.jsx`, `pages/RegisterPage.jsx`, `services/AuthService.js` |
| b | Questions sourced from opentdb.com | `api/opentdb.js` |
| c | Free question count and type | `pages/SettingsPage.jsx` |
| d | Total questions and answered count displayed | `components/quiz/ProgressBar.jsx` |
| e | Quiz timer | `components/quiz/Timer.jsx`, `hooks/useCountdown.js` |
| f | One question per page, automatic advance | `components/quiz/QuestionCard.jsx`, `pages/QuizPage.jsx` |
| g | Timer expiry closes the quiz and shows results | `App.jsx`, `pages/ResultPage.jsx` |
| h | Resume after browser is closed | `hooks/useLocalStorage.js`, timer stored as an absolute timestamp |

## Concepts Applied

| Concept | Description | Location |
|---|---|---|
| OOP — Encapsulation | Data and behavior combined into a single class | `models/User.js`, `models/QuizAttempt.js` |
| OOP — Factory Method | Static methods that construct objects from raw data | `QuizAttempt.fromAnswers()`, `User.fromJSON()` |
| OOP — Singleton | A single shared service instance used across the app | `services/AuthService.js` |
| Data Structure — Map | O(1) account lookup by username | `AuthService` |
| Algorithm — Fisher-Yates Shuffle | Fair randomization of answer order | `utils/helpers.js` |
| Algorithm — Hashing (djb2) | Simple password hashing before storage | `utils/hash.js` |
| Algorithm — Sorting | History sorted by most recent attempt | `AuthService.getHistory()` |
| Algorithm — Aggregation | Best score and average score calculation | `User.getBestScore()`, `User.getAverageScore()` |

## Security Notes

Passwords are hashed using a simple non-cryptographic algorithm (not bcrypt or argon2) and stored in the browser's localStorage. This is sufficient for an academic assignment or demo purpose, but should not be used for real sensitive data, since localStorage can be inspected through browser DevTools and there is no server-side verification.

## Deployment

This project is deployed on Vercel as a static frontend build:

```bash
npm run build
```

The `dist/` output can be deployed directly to Vercel, Netlify, or any static hosting provider, since the application communicates with the OpenTDB API directly from the client and requires no backend server.
```
