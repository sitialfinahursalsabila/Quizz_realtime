import { useEffect, useState } from 'react'
import { fetchCategories } from '../api/opentdb'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Button from '../components/common/Button'

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

export default function SettingsPage({ username, onStart, isLoading, errorMessage, onViewHistory }) {
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
      <Card>
        <p className="eyebrow">Halo, {username} </p>
        <h1 className="title">Atur Kuismu</h1>
        <p className="subtitle">Jumlah soal, tipe soal, dan durasi waktu sepenuhnya bebas kamu tentukan.</p>

        <form onSubmit={handleSubmit} className="form">
          <Input
            label="Jumlah Soal"
            type="number"
            min={1}
            max={50}
            value={settings.amount}
            onChange={(event) => updateField('amount', event.target.value)}
          />

          <Select
            label="Kategori"
            value={settings.category}
            onChange={(event) => updateField('category', event.target.value)}
            hint={categoriesError}
            options={[{ value: '', label: 'Semua Kategori' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
          />

          <div className="field-row">
            <Select
              label="Tipe Soal"
              value={settings.type}
              onChange={(event) => updateField('type', event.target.value)}
              options={TYPE_OPTIONS}
            />
            <Select
              label="Kesulitan"
              value={settings.difficulty}
              onChange={(event) => updateField('difficulty', event.target.value)}
              options={DIFFICULTY_OPTIONS}
            />
          </div>

          <Input
            label="Durasi Pengerjaan (menit)"
            type="number"
            min={1}
            max={120}
            value={settings.durationMinutes}
            onChange={(event) => updateField('durationMinutes', event.target.value)}
          />

          {(formError || errorMessage) && <p className="error-text">{formError || errorMessage}</p>}

          <Button type="submit" block disabled={isLoading}>
            {isLoading ? 'Menyiapkan soal…' : 'Mulai Kuis'}
          </Button>
        </form>

        <Button variant="ghost" block className="settings-history-btn" onClick={onViewHistory}>
          Lihat Riwayat Pengerjaan
        </Button>
      </Card>
    </div>
  )
}
