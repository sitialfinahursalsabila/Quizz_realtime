import { useEffect, useState } from 'react'
import { fetchCategories } from '../api/opentdb'

const DIFFICULTY_OPTIONS = [
  { value: '', label: 'Semua Tingkat' },
  { value: 'easy', label: 'Mudah' },
  { value: 'medium', label: 'Sedang' },
  { value: 'hard', label: 'Sulit' },
]

const TYPE_OPTIONS = [
  { value: '', label: 'Semua Tipe' },
  { value: 'multiple', label: 'Pilihan Ganda' },
  { value: 'boolean', label: 'Benar / Salah' },
]

const DEFAULT_SETTINGS = {
  amount: 10,
  category: '',
  difficulty: '',
  type: '',
  durationMinutes: 5,
}

export default function Settings({ userName, onStart, isLoading, errorMessage }) {
  const [categories, setCategories] = useState([])
  const [categoriesError, setCategoriesError] = useState('')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    let isMounted = true
    fetchCategories()
      .then((list) => {
        if (isMounted) setCategories(list)
      })
      .catch(() => {
        if (isMounted) setCategoriesError('Gagal memuat daftar kategori, kamu masih bisa pakai "Semua Kategori".')
      })
    return () => {
      isMounted = false
    }
  }, [])

  function updateField(field, rawValue) {
    setSettings((prev) => ({ ...prev, [field]: rawValue }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const amount = Number(settings.amount)
    const durationMinutes = Number(settings.durationMinutes)

    if (!Number.isInteger(amount) || amount < 1 || amount > 50) {
      setFormError('Jumlah soal harus angka antara 1 sampai 50.')
      return
    }
    if (!Number.isFinite(durationMinutes) || durationMinutes < 1 || durationMinutes > 120) {
      setFormError('Durasi pengerjaan harus antara 1 sampai 120 menit.')
      return
    }

    setFormError('')
    onStart({ ...settings, amount, durationMinutes })
  }

  return (
    <div className="screen screen-center">
      <div className="card card-narrow">
        <p className="eyebrow">Halo, {userName} </p>
        <h1 className="title">Atur Kuismu</h1>
        <p className="subtitle">Jumlah soal, tipe soal, dan durasi waktu sepenuhnya bebas kamu tentukan.</p>

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span className="field-label">Jumlah Soal</span>
            <input
              className="input"
              type="number"
              min={1}
              max={50}
              value={settings.amount}
              onChange={(event) => updateField('amount', event.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">Kategori</span>
            <select
              className="input"
              value={settings.category}
              onChange={(event) => updateField('category', event.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categoriesError && <span className="hint-text">{categoriesError}</span>}
          </label>

          <div className="field-row">
            <label className="field">
              <span className="field-label">Tipe Soal</span>
              <select
                className="input"
                value={settings.type}
                onChange={(event) => updateField('type', event.target.value)}
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field-label">Kesulitan</span>
              <select
                className="input"
                value={settings.difficulty}
                onChange={(event) => updateField('difficulty', event.target.value)}
              >
                {DIFFICULTY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span className="field-label">Durasi Pengerjaan (menit)</span>
            <input
              className="input"
              type="number"
              min={1}
              max={120}
              value={settings.durationMinutes}
              onChange={(event) => updateField('durationMinutes', event.target.value)}
            />
          </label>

          {(formError || errorMessage) && <p className="error-text">{formError || errorMessage}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Menyiapkan soal…' : 'Mulai Kuis'}
          </button>
        </form>
      </div>
    </div>
  )
}
