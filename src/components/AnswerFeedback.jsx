import correctGif from '../assets/correct.png'

import wrongGif from '../assets/wrong.png'

function AnswerFeedback({ isCorrect, onNext }) {

    return (

        <div className="feedback-screen">

            <div className="feedback-card">

                <img

                    src={isCorrect ? correctGif : wrongGif}

                    alt="feedback"

                    className="feedback-gif"

                />

                <h1 className="feedback-title">

                    {isCorrect

                        ? 'Jawaban Benar'

                        : 'Jawaban Salah'}

                </h1>

                <p className="feedback-desc">

                    {isCorrect

                        ? 'Bagus. Pertahankan fokus dan lanjutkan ke pertanyaan berikutnya.'

                        : 'Tenang. Baca kembali dengan teliti dan coba lagi.'}

                </p>

                <button

                    className="feedback-btn"

                    onClick={onNext}

                >

                    Lanjutkan

                </button>

            </div>

        </div>

    )

}

export default AnswerFeedback