import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'

export type CategoryId = 'bank' | 'capital' | 'insurance' | 'infra' | ''

export const categories: { id: CategoryId; label: string; color: string; text: string }[] = [
  { id: 'bank', label: 'بانک، اعتبار و پرداخت', color: '#f3e8dc', text: '#8a6d4d' },
  { id: 'capital', label: 'بازار سرمایه و سرمایه‌گذاری', color: '#e3f0e0', text: '#3f6b4d' },
  { id: 'insurance', label: 'بیمه و مدیریت ریسک', color: '#dbe8f7', text: '#3d5a80' },
  { id: 'infra', label: 'زیرساخت، فناوری و نهادهای پشتیبان', color: '#eee2f2', text: '#6b4d80' },
]

export const DAYS = [
  { id: 1, label: 'روز اول', date: '۱۲ آذر', realDate: new Date(2026, 11, 3) },
  { id: 2, label: 'روز دوم', date: '۱۳ آذر', realDate: new Date(2026, 11, 4) },
  { id: 3, label: 'روز سوم', date: '۱۴ آذر', realDate: new Date(2026, 11, 5) },
  { id: 4, label: 'روز چهارم', date: '۱۵ آذر', realDate: new Date(2026, 11, 6) },
]

export function categoryInfo(id: CategoryId) {
  return categories.find((c) => c.id === id)
}

export interface Speaker {
  id: string
  name: string
  role: string
}

export interface PanelSession {
  id: string
  title: string
  speakers: Speaker[]
  topic: string
  category: CategoryId
  dayId: number
  time: string
  location: string
  published: boolean
  recordingLink: string
}

function emptySpeaker(): Speaker {
  return { id: Date.now().toString() + Math.random().toString(36).slice(2, 6), name: '', role: '' }
}

const emptySession: Omit<PanelSession, 'id'> = {
  title: '',
  speakers: [emptySpeaker()],
  topic: '',
  category: '',
  dayId: 1,
  time: '',
  location: '',
  published: false,
  recordingLink: '',
}

export function isPast(dayId: number) {
  const day = DAYS.find((d) => d.id === dayId)
  if (!day) return false
  return Date.now() > day.realDate.getTime() + 24 * 60 * 60 * 1000
}

export default function ExhibitorPanels({
  sessions,
  setSessions,
  onBack,
}: {
  sessions: PanelSession[]
  setSessions: React.Dispatch<React.SetStateAction<PanelSession[]>>
  onBack: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<PanelSession, 'id'>>(emptySession)

  const fieldClass = 'flex items-center gap-2 bg-white rounded-xl px-3.5 py-3'
  const inputClass = 'flex-1 border-none outline-none text-xs bg-transparent'

  const openNewForm = () => {
    setForm({ ...emptySession, speakers: [emptySpeaker()] })
    setEditingId(null)
    setShowForm(true)
  }

  const openEditForm = (s: PanelSession) => {
    setForm({
      title: s.title,
      speakers: s.speakers.length ? s.speakers : [emptySpeaker()],
      topic: s.topic,
      category: s.category,
      dayId: s.dayId,
      time: s.time,
      location: s.location,
      published: s.published,
      recordingLink: s.recordingLink,
    })
    setEditingId(s.id)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptySession)
  }

  const addSpeaker = () => {
    if (form.speakers.length >= 5) return
    setForm((prev) => ({ ...prev, speakers: [...prev.speakers, emptySpeaker()] }))
  }

  const removeSpeaker = (id: string) => {
    setForm((prev) => ({ ...prev, speakers: prev.speakers.filter((sp) => sp.id !== id) }))
  }

  const updateSpeaker = (id: string, patch: Partial<Speaker>) => {
    setForm((prev) => ({
      ...prev,
      speakers: prev.speakers.map((sp) => (sp.id === id ? { ...sp, ...patch } : sp)),
    }))
  }

  const conflictingSession = sessions.find(
    (s) =>
      s.id !== editingId &&
      s.dayId === form.dayId &&
      form.time.trim() !== '' &&
      s.time.trim() === form.time.trim()
  )

  const isValid =
    form.title.trim() !== '' &&
    form.speakers.some((sp) => sp.name.trim() !== '') &&
    form.time.trim() !== '' &&
    form.location.trim() !== ''

  const saveSession = () => {
    if (!isValid) return
    const cleanedSpeakers = form.speakers.filter((sp) => sp.name.trim() !== '')
    const finalForm = { ...form, speakers: cleanedSpeakers }
    if (editingId) {
      setSessions((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...finalForm } : s)))
    } else {
      setSessions((prev) => [...prev, { id: Date.now().toString(), ...finalForm }])
    }
    closeForm()
  }

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  const togglePublished = (id: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, published: !s.published } : s)))
  }

  const updateRecordingLink = (id: string, link: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, recordingLink: link } : s)))
  }

  const dayLabel = (dayId: number) => {
    const d = DAYS.find((dd) => dd.id === dayId)
    return d ? `${d.label} (${d.date})` : ''
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden px-6 py-8"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={showForm ? closeForm : onBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="relative z-10 mt-6">
        <PageTitle>پنل‌ها و همایش‌های غرفه</PageTitle>

        {!showForm && (
          <>
            {sessions.length === 0 && (
              <p className="text-[11px] text-center mb-4" style={{ color: '#9b9baf' }}>
                هنوز پنلی اضافه نکرده‌اید
              </p>
            )}

            <div className="flex flex-col gap-2.5 mb-4">
              {sessions.map((s) => {
                const cat = categoryInfo(s.category)
                const past = isPast(s.dayId)
                return (
                  <div key={s.id} className="bg-white rounded-2xl p-3.5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold" style={{ color: '#1b2134' }}>
                        {s.title}
                      </span>
                      <span
                        className="text-[8px] font-bold px-2 py-1 rounded-md flex-shrink-0"
                        style={{
                          background: past ? 'rgba(155,155,175,0.15)' : '#dbe8f7',
                          color: past ? '#9b9baf' : '#3d5a80',
                        }}
                      >
                        {past ? 'برگزار شده' : 'پیش رو'}
                      </span>
                    </div>

                    {cat && (
                      <span
                        className="inline-block text-[8.5px] font-bold px-1.5 py-0.5 rounded-md mb-1.5"
                        style={{ background: cat.color, color: cat.text }}
                      >
                        {cat.label}
                      </span>
                    )}

                    <div className="text-[9.5px] leading-relaxed" style={{ color: '#9b9baf' }}>
                      {s.speakers.map((sp) => `${sp.name}${sp.role ? '، ' + sp.role : ''}`).join(' / ')}
                    </div>
                    {s.topic && (
                      <div className="text-[9.5px] mt-1" style={{ color: '#9b9baf' }}>
                        موضوع: {s.topic}
                      </div>
                    )}

                    <div className="flex gap-2.5 mt-2 text-[9px]" style={{ color: '#8a6d4d' }}>
                      <span>{dayLabel(s.dayId)} · {s.time}</span>
                      <span>{s.location}</span>
                    </div>

                    {past && (
                      <div className="mt-2.5 pt-2.5" style={{ borderTop: '1px solid #f0ede6' }}>
                        <input
                          value={s.recordingLink}
                          onChange={(e) => updateRecordingLink(s.id, e.target.value)}
                          placeholder="لینک ضبط یا محتوای پنل (اختیاری)"
                          dir="ltr"
                          className="w-full rounded-lg px-2.5 py-1.5 text-[10px] outline-none"
                          style={{ border: '1px solid #eee', color: '#1b2134' }}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2.5">
                      <button
                        onClick={() => togglePublished(s.id)}
                        className="text-[8.5px] font-bold px-2 py-1 rounded-md"
                        style={{
                          background: s.published ? '#e3f0e0' : 'rgba(155,155,175,0.15)',
                          color: s.published ? '#3f6b4d' : '#9b9baf',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {s.published ? '● منتشر شده' : '○ پیش‌نویس'}
                      </button>
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => openEditForm(s)}
                          className="text-[9.5px] underline"
                          style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => deleteSession(s.id)}
                          className="text-[9.5px] underline"
                          style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={openNewForm}
              className="w-full rounded-xl py-3 text-[11px] font-bold"
              style={{ border: '1.5px dashed rgba(190,156,119,0.5)', color: '#be9c77', background: 'transparent', cursor: 'pointer' }}
            >
              + افزودن پنل جدید
            </button>
          </>
        )}

        {showForm && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[11px] font-bold mb-1" style={{ color: '#e8cfa8' }}>
              {editingId ? 'ویرایش پنل' : 'افزودن پنل جدید'}
            </div>

            <div className={fieldClass}>
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="عنوان پنل / همایش"
                className={inputClass}
                style={{ color: '#1b2134' }}
              />
            </div>

            <div className="flex flex-col gap-2">
              {form.speakers.map((sp, idx) => (
                <div key={sp.id} className="flex gap-1.5">
                  <div className={fieldClass + ' flex-1'}>
                    <input
                      value={sp.name}
                      onChange={(e) => updateSpeaker(sp.id, { name: e.target.value })}
                      placeholder={`نام سخنران ${idx + 1}`}
                      className={inputClass}
                      style={{ color: '#1b2134' }}
                    />
                  </div>
                  <div className={fieldClass + ' flex-1'}>
                    <input
                      value={sp.role}
                      onChange={(e) => updateSpeaker(sp.id, { role: e.target.value })}
                      placeholder="سمت"
                      className={inputClass}
                      style={{ color: '#1b2134' }}
                    />
                  </div>
                  {form.speakers.length > 1 && (
                    <button
                      onClick={() => removeSpeaker(sp.id)}
                      className="px-2 text-[9px]"
                      style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      حذف
                    </button>
                  )}
                </div>
              ))}
              {form.speakers.length < 5 && (
                <button
                  onClick={addSpeaker}
                  className="text-[10px] font-bold self-start"
                  style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  + افزودن سخنران دیگر
                </button>
              )}
            </div>

            <div className={fieldClass}>
              <textarea
                value={form.topic}
                onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
                placeholder="موضوع / توضیحات"
                className={inputClass + ' resize-none'}
                style={{ color: '#1b2134', minHeight: '44px' }}
              />
            </div>

            <div className={fieldClass}>
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as CategoryId }))}
                className={inputClass}
                style={{ color: '#1b2134' }}
              >
                <option value="">بدون دسته‌بندی</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2.5">
              <div className={fieldClass + ' flex-1'}>
                <select
                  value={form.dayId}
                  onChange={(e) => setForm((prev) => ({ ...prev, dayId: Number(e.target.value) }))}
                  className={inputClass}
                  style={{ color: '#1b2134' }}
                >
                  {DAYS.map((d) => (
                    <option key={d.id} value={d.id}>{d.label} ({d.date})</option>
                  ))}
                </select>
              </div>
              <div className={fieldClass + ' flex-1'}>
                <input
                  value={form.time}
                  onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
                  placeholder="ساعت (مثلاً ۱۵:۰۰)"
                  className={inputClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
            </div>

            {conflictingSession && (
              <div
                className="text-[9.5px] px-3 py-2 rounded-lg"
                style={{ background: 'rgba(217,83,79,0.1)', color: '#d9534f', border: '1px solid rgba(217,83,79,0.3)' }}
              >
                این زمان با پنل «{conflictingSession.title}» تداخل دارد
              </div>
            )}

            <div className={fieldClass}>
              <input
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="مکان (مثلاً سالن B)"
                className={inputClass}
                style={{ color: '#1b2134' }}
              />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={closeForm}
                className="flex-1 rounded-full py-2.5 font-bold text-[11.5px]"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}
              >
                انصراف
              </button>
              <button
                onClick={saveSession}
                disabled={!isValid}
                className="flex-[2] rounded-full py-2.5 font-bold text-xs"
                style={{
                  background: isValid ? '#be9c77' : '#6b6375',
                  color: '#1b2134',
                  border: 'none',
                  cursor: isValid ? 'pointer' : 'not-allowed',
                }}
              >
                ذخیره
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}