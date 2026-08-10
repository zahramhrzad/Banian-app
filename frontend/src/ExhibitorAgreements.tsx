import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'

export type CategoryId = 'bank' | 'capital' | 'insurance' | 'infra' | ''
export type Status = 'negotiating' | 'signed' | 'cancelled'
type SortMode = 'newest' | 'status'

export const categories: { id: CategoryId; label: string; color: string; text: string }[] = [
  { id: 'bank', label: 'بانک، اعتبار و پرداخت', color: '#f3e8dc', text: '#8a6d4d' },
  { id: 'capital', label: 'بازار سرمایه و سرمایه‌گذاری', color: '#e3f0e0', text: '#3f6b4d' },
  { id: 'insurance', label: 'بیمه و مدیریت ریسک', color: '#dbe8f7', text: '#3d5a80' },
  { id: 'infra', label: 'زیرساخت، فناوری و نهادهای پشتیبان', color: '#eee2f2', text: '#6b4d80' },
]

export const statusInfo: Record<Status, { label: string; bg: string; text: string; order: number }> = {
  negotiating: { label: 'در حال مذاکره', bg: 'rgba(190,156,119,0.18)', text: '#8a6d4d', order: 0 },
  signed: { label: 'امضا شده', bg: '#e3f0e0', text: '#3f6b4d', order: 1 },
  cancelled: { label: 'لغو شده', bg: 'rgba(217,83,79,0.12)', text: '#c76b5f', order: 2 },
}

function categoryInfo(id: CategoryId) {
  return categories.find((c) => c.id === id)
}

export interface Agreement {
  id: string
  partnerName: string
  topic: string
  date: string
  location: string
  category: CategoryId
  status: Status
  privateNote: string
  fileUrl: string | null
  fileName: string | null
  fileIsImage: boolean
  createdAt: number
}

const emptyAgreement: Omit<Agreement, 'id' | 'createdAt'> = {
  partnerName: '',
  topic: '',
  date: '',
  location: '',
  category: '',
  status: 'negotiating',
  privateNote: '',
  fileUrl: null,
  fileName: null,
  fileIsImage: false,
}

export default function ExhibitorAgreements({
  agreements,
  setAgreements,
  onBack,
}: {
  agreements: Agreement[]
  setAgreements: React.Dispatch<React.SetStateAction<Agreement[]>>
  onBack: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Agreement, 'id' | 'createdAt'>>(emptyAgreement)
  const [sortMode, setSortMode] = useState<SortMode>('newest')

  const fieldClass = 'flex items-center gap-2 bg-white rounded-xl px-3.5 py-3'
  const inputClass = 'flex-1 border-none outline-none text-xs bg-transparent'

  const openNewForm = () => {
    setForm(emptyAgreement)
    setEditingId(null)
    setShowForm(true)
  }

  const openEditForm = (a: Agreement) => {
    setForm({
      partnerName: a.partnerName,
      topic: a.topic,
      date: a.date,
      location: a.location,
      category: a.category,
      status: a.status,
      privateNote: a.privateNote,
      fileUrl: a.fileUrl,
      fileName: a.fileName,
      fileIsImage: a.fileIsImage,
    })
    setEditingId(a.id)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyAgreement)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm((prev) => ({
      ...prev,
      fileUrl: url,
      fileName: file.name,
      fileIsImage: file.type.startsWith('image/'),
    }))
  }

  const removeFile = () => {
    setForm((prev) => ({ ...prev, fileUrl: null, fileName: null, fileIsImage: false }))
  }

  const isValid = form.partnerName.trim() !== '' && form.date.trim() !== '' && form.location.trim() !== ''

  const saveAgreement = () => {
    if (!isValid) return
    if (editingId) {
      setAgreements((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)))
    } else {
      setAgreements((prev) => [...prev, { id: Date.now().toString(), createdAt: Date.now(), ...form }])
    }
    closeForm()
  }

  const deleteAgreement = (id: string) => {
    setAgreements((prev) => prev.filter((a) => a.id !== id))
  }

  const openFile = (url: string) => {
    window.open(url, '_blank')
  }

  const sortedAgreements = [...agreements].sort((a, b) => {
    if (sortMode === 'status') {
      return statusInfo[a.status].order - statusInfo[b.status].order || b.createdAt - a.createdAt
    }
    return b.createdAt - a.createdAt
  })

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
        <PageTitle>قراردادها و تفاهم‌نامه‌ها</PageTitle>

        {!showForm && (
          <>
            {agreements.length === 0 && (
              <p className="text-[11px] text-center mb-4" style={{ color: '#9b9baf' }}>
                هنوز قراردادی ثبت نکرده‌اید
              </p>
            )}

            {agreements.length > 1 && (
              <div className="flex items-center justify-end gap-1.5 mb-3">
                <span className="text-[9.5px]" style={{ color: '#9b9baf' }}>مرتب‌سازی:</span>
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="text-[9.5px] rounded-md px-1.5 py-1 outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#e8cfa8', border: '1px solid rgba(190,156,119,0.3)' }}
                >
                  <option value="newest">جدیدترین</option>
                  <option value="status">وضعیت</option>
                </select>
              </div>
            )}

            <div className="flex flex-col gap-2.5 mb-4">
              {sortedAgreements.map((a) => {
                const cat = categoryInfo(a.category)
                const st = statusInfo[a.status]
                return (
                  <div key={a.id} className="bg-white rounded-2xl p-3.5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold" style={{ color: '#1b2134' }}>
                        {a.partnerName}
                      </span>
                      <span
                        className="text-[8px] font-bold px-2 py-1 rounded-md flex-shrink-0"
                        style={{ background: st.bg, color: st.text }}
                      >
                        {st.label}
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

                    {a.topic && (
                      <div className="text-[9.5px] leading-relaxed" style={{ color: '#9b9baf' }}>
                        موضوع: {a.topic}
                      </div>
                    )}

                    <div className="flex gap-2.5 mt-2 text-[9px]" style={{ color: '#8a6d4d' }}>
                      <span>تاریخ: {a.date}</span>
                      <span>مکان: {a.location}</span>
                    </div>

                    {a.fileUrl && (
                      <div className="mt-2.5">
                        {a.fileIsImage ? (
                          <img src={a.fileUrl} alt={a.fileName || ''} className="w-full rounded-lg" style={{ maxHeight: '100px', objectFit: 'cover' }} />
                        ) : (
                          <button
                            onClick={() => openFile(a.fileUrl as string)}
                            className="text-[9.5px] underline"
                            style={{ color: '#3d5a80', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            فایل: {a.fileName}
                          </button>
                        )}
                      </div>
                    )}

                    {a.privateNote && (
                      <div
                        className="mt-2.5 pt-2 text-[9px] leading-relaxed"
                        style={{ borderTop: '1px solid #f0ede6', color: '#9b9baf' }}
                      >
                        یادداشت: {a.privateNote}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2.5 mt-2.5">
                      <button
                        onClick={() => openEditForm(a)}
                        className="text-[9.5px] underline"
                        style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => deleteAgreement(a.id)}
                        className="text-[9.5px] underline"
                        style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        حذف
                      </button>
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
              + افزودن قرارداد جدید
            </button>
          </>
        )}

        {showForm && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[11px] font-bold mb-1" style={{ color: '#e8cfa8' }}>
              {editingId ? 'ویرایش قرارداد' : 'افزودن قرارداد جدید'}
            </div>

            <div className={fieldClass}>
              <input
                value={form.partnerName}
                onChange={(e) => setForm((prev) => ({ ...prev, partnerName: e.target.value }))}
                placeholder="طرف قرارداد (نام شرکت یا شخص)"
                className={inputClass}
                style={{ color: '#1b2134' }}
              />
            </div>

            <div className={fieldClass}>
              <input
                value={form.topic}
                onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
                placeholder="موضوع قرارداد"
                className={inputClass}
                style={{ color: '#1b2134' }}
              />
            </div>

            <div className="flex gap-2.5">
              <div className={fieldClass + ' flex-1'}>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  className={inputClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
              <div className={fieldClass + ' flex-1'}>
                <input
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="مکان"
                  className={inputClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
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

            <div className={fieldClass}>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Status }))}
                className={inputClass}
                style={{ color: '#1b2134' }}
              >
                <option value="negotiating">در حال مذاکره</option>
                <option value="signed">امضا شده</option>
                <option value="cancelled">لغو شده</option>
              </select>
            </div>

            <div className="bg-white rounded-xl px-3.5 py-3">
              <textarea
                value={form.privateNote}
                onChange={(e) => setForm((prev) => ({ ...prev, privateNote: e.target.value }))}
                placeholder="یادداشت داخلی (فقط خودتان می‌بینید)"
                className="w-full border-none outline-none text-xs bg-transparent resize-none"
                style={{ color: '#1b2134', minHeight: '48px' }}
              />
            </div>

            {!form.fileUrl ? (
              <label className="bg-white rounded-xl px-3.5 py-3 flex items-center gap-2" style={{ cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span className="text-xs flex-1" style={{ color: '#9b9baf' }}>
                  پیوست فایل (اسکن قرارداد یا عکس امضا)
                </span>
                <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
              </label>
            ) : (
              <div className="bg-white rounded-xl px-3.5 py-3 flex items-center justify-between">
                <span className="text-xs truncate" style={{ color: '#1b2134' }}>
                  فایل: {form.fileName}
                </span>
                <button
                  onClick={removeFile}
                  className="text-[9.5px] underline flex-shrink-0"
                  style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  حذف
                </button>
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={closeForm}
                className="flex-1 rounded-full py-2.5 font-bold text-[11.5px]"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}
              >
                انصراف
              </button>
              <button
                onClick={saveAgreement}
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