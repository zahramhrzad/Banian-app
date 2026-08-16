import { useState, useRef } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { categories, categoryInfo, type CategoryId } from './ExhibitorProducts'

const MAX_ACTIVE = 5

type Audience = 'all' | 'visitor' | 'exhibitor'
type Status = 'draft' | 'scheduled' | 'active' | 'expired'

const audienceLabels: Record<Audience, string> = {
  all: 'همه',
  visitor: 'بازدیدکنندگان',
  exhibitor: 'غرفه‌داران',
}

const statusInfo: Record<Status, { label: string; bg: string; text: string }> = {
  draft: { label: '○ پیش‌نویس', bg: 'rgba(155,155,175,0.15)', text: '#9b9baf' },
  scheduled: { label: 'زمان‌بندی شده', bg: '#dbe8f7', text: '#3d5a80' },
  active: { label: '● فعال', bg: '#e3f0e0', text: '#3f6b4d' },
  expired: { label: 'منقضی شده', bg: 'rgba(217,83,79,0.12)', text: '#c76b5f' },
}

const toFa = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

interface AdminPromotion {
  id: string
  title: string
  desc: string
  link: string
  imageUrl: string | null
  audience: Audience
  audienceCategory: CategoryId | ''
  startAt: string
  endAt: string
  published: boolean
  clicks: number
  order: number
}

const initialPromotions: AdminPromotion[] = [
  {
    id: 'ap1',
    title: 'تخفیف ویژه ثبت‌نام زودهنگام',
    desc: 'ثبت‌نام تا پایان هفته با ۲۰٪ تخفیف',
    link: 'https://banian.ir/early-bird',
    imageUrl: null,
    audience: 'visitor',
    audienceCategory: '',
    startAt: '',
    endAt: '',
    published: true,
    clicks: 214,
    order: 1,
  },
]

function emptyPromotion(order: number): Omit<AdminPromotion, 'id'> {
  return { title: '', desc: '', link: '', imageUrl: null, audience: 'all', audienceCategory: '', startAt: '', endAt: '', published: false, clicks: 0, order }
}

function computeStatus(p: Omit<AdminPromotion, 'id' | 'order' | 'clicks'>): Status {
  if (!p.published) return 'draft'
  const now = Date.now()
  const start = p.startAt ? new Date(p.startAt).getTime() : null
  const end = p.endAt ? new Date(p.endAt).getTime() : null
  if (end !== null && now > end) return 'expired'
  if (start !== null && now < start) return 'scheduled'
  return 'active'
}

function urgencyText(p: Omit<AdminPromotion, 'id' | 'order' | 'clicks'>): string | null {
  if (!p.endAt) return null
  const end = new Date(p.endAt).getTime()
  const diffDays = Math.ceil((end - Date.now()) / (24 * 60 * 60 * 1000))
  if (diffDays <= 0) return null
  if (diffDays <= 1) return '⏱ تا پایان امروز'
  return `⏱ ${toFa(diffDays)} روز مانده`
}

export default function AdminPromotions({
  onLogActivity,
  onBack,
}: {
  onLogActivity: (text: string) => void
  onBack: () => void
}) {
  const [promotions, setPromotions] = useState<AdminPromotion[]>(initialPromotions)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<AdminPromotion, 'id'>>(emptyPromotion(1))
  const [capWarning, setCapWarning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fieldClass = 'flex-1 border-none outline-none text-xs bg-transparent'
  const fieldBoxClass = 'flex items-center gap-2 bg-white rounded-xl px-3.5 py-3'

  const sorted = [...promotions].sort((a, b) => a.order - b.order)

  const openNewForm = () => {
    setForm(emptyPromotion(promotions.length + 1))
    setEditingId(null)
    setCapWarning(false)
    setShowForm(true)
  }

  const openEditForm = (p: AdminPromotion) => {
    setForm(p)
    setEditingId(p.id)
    setCapWarning(false)
    setShowForm(true)
  }

  const closeForm = () => setShowForm(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((prev) => ({ ...prev, imageUrl: URL.createObjectURL(file) }))
  }

  const isValid = form.title.trim() !== ''

  const save = () => {
    if (!isValid) return
    if (editingId) {
      setPromotions((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form } : p)))
      onLogActivity(`پروموشن «${form.title}» را ویرایش کرد`)
    } else {
      setPromotions((prev) => [...prev, { id: Date.now().toString(), ...form, published: false, clicks: 0 }])
      onLogActivity(`پروموشن «${form.title}» را اضافه کرد`)
    }
    setShowForm(false)
  }

  const remove = (id: string) => {
    const item = promotions.find((p) => p.id === id)
    setPromotions((prev) => prev.filter((p) => p.id !== id))
    if (item) onLogActivity(`پروموشن «${item.title}» را حذف کرد`)
  }

  const togglePublished = (id: string) => {
    setCapWarning(false)
    setPromotions((prev) => {
      const target = prev.find((p) => p.id === id)
      if (!target) return prev
      if (!target.published) {
        const wouldBeStatus = computeStatus({ ...target, published: true })
        if (wouldBeStatus === 'active') {
          const activeCount = prev.filter((p) => p.id !== id && computeStatus(p) === 'active').length
          if (activeCount >= MAX_ACTIVE) {
            setCapWarning(true)
            return prev
          }
        }
      }
      return prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    })
  }

  const moveOrder = (id: string, direction: -1 | 1) => {
    const idx = sorted.findIndex((p) => p.id === id)
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= sorted.length) return
    const a = sorted[idx]
    const b = sorted[targetIdx]
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id === a.id) return { ...p, order: b.order }
        if (p.id === b.id) return { ...p, order: a.order }
        return p
      })
    )
  }

  const previewUrgency = urgencyText(form)

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
        <PageTitle>مدیریت پروموشن‌های نمایشگاه</PageTitle>

        {!showForm && (
          <>
            {sorted.length === 0 && (
              <p className="text-[11px] text-center mb-4" style={{ color: '#9b9baf' }}>هنوز پروموشنی اضافه نشده</p>
            )}

            <div className="flex flex-col gap-2.5 mb-4">
              {sorted.map((p, idx) => {
                const status = computeStatus(p)
                const st = statusInfo[status]
                const urgency = status === 'active' ? urgencyText(p) : null
                const audienceCat = p.audienceCategory ? categoryInfo(p.audienceCategory) : null
                return (
                  <div key={p.id} className="bg-white rounded-2xl overflow-hidden">
                    {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-full" style={{ height: '70px', objectFit: 'cover' }} />}
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>{p.title}</span>
                        <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ background: st.bg, color: st.text }}>{st.label}</span>
                      </div>
                      {p.desc && <div className="text-[9px] mt-1" style={{ color: '#9b9baf' }}>{p.desc}</div>}
                      {p.link && <div className="text-[8px] mt-1" dir="ltr" style={{ color: '#3d5a80', textAlign: 'right' }}>{p.link}</div>}
                      <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                        <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(190,156,119,0.15)', color: '#8a6d4d' }}>
                          مخاطب: {audienceLabels[p.audience]}
                          {audienceCat ? ` · ${audienceCat.label}` : ''}
                        </span>
                        {urgency && (
                          <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(217,83,79,0.12)', color: '#c76b5f' }}>{urgency}</span>
                        )}
                        <span className="text-[7px]" style={{ color: '#9b9baf' }}>{toFa(p.clicks)} کلیک</span>
                      </div>
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveOrder(p.id, -1)} disabled={idx === 0} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(190,156,119,0.1)', color: idx === 0 ? '#ccc' : '#be9c77', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>▲</button>
                          <button onClick={() => moveOrder(p.id, 1)} disabled={idx === sorted.length - 1} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(190,156,119,0.1)', color: idx === sorted.length - 1 ? '#ccc' : '#be9c77', border: 'none', cursor: idx === sorted.length - 1 ? 'not-allowed' : 'pointer' }}>▼</button>
                          <button onClick={() => togglePublished(p.id)} className="text-[8px] font-bold px-2 py-1 rounded-md" style={{ background: p.published ? '#e3f0e0' : 'rgba(155,155,175,0.15)', color: p.published ? '#3f6b4d' : '#9b9baf', border: 'none', cursor: 'pointer' }}>
                            {p.published ? 'لغو انتشار' : 'انتشار'}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openEditForm(p)} className="text-[9px] underline" style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}>ویرایش</button>
                          <button onClick={() => remove(p.id)} className="text-[9px] underline" style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}>حذف</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <button onClick={openNewForm} className="w-full rounded-xl py-3 text-[11px] font-bold" style={{ border: '1.5px dashed rgba(190,156,119,0.5)', color: '#be9c77', background: 'transparent', cursor: 'pointer' }}>
              + افزودن پروموشن جدید (حداکثر {toFa(MAX_ACTIVE)} فعال هم‌زمان)
            </button>
          </>
        )}

        {showForm && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[11px] font-bold mb-1" style={{ color: '#e8cfa8' }}>
              {editingId ? 'ویرایش پروموشن' : 'افزودن پروموشن جدید'}
            </div>

            <div className="text-[9.5px] font-bold mb-1" style={{ color: '#9b9baf' }}>پیش‌نمایش زنده</div>
            <div className="rounded-2xl overflow-hidden mb-1" style={{ background: '#fff' }}>
              {form.imageUrl && <img src={form.imageUrl} alt="پیش‌نمایش" className="w-full" style={{ height: '80px', objectFit: 'cover' }} />}
              <div className="p-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>{form.title || 'عنوان پروموشن'}</span>
                  {previewUrgency && <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(217,83,79,0.15)', color: '#c76b5f' }}>{previewUrgency}</span>}
                </div>
                <div className="text-[9px] mt-1" style={{ color: '#9b9baf' }}>{form.desc || 'توضیحات کوتاه'}</div>
              </div>
            </div>

            <div className={fieldBoxClass}>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="عنوان پروموشن" className={fieldClass} style={{ color: '#1b2134' }} />
            </div>
            <div className={fieldBoxClass}>
              <input value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} placeholder="توضیحات کوتاه" className={fieldClass} style={{ color: '#1b2134' }} />
            </div>
            <div className={fieldBoxClass}>
              <input value={form.link} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} placeholder="لینک (اختیاری)" dir="ltr" className={fieldClass} style={{ color: '#1b2134' }} />
            </div>

            <label className={fieldBoxClass} style={{ cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M21 15l-5-5-9 9" /></svg>
              <span className="text-xs flex-1" style={{ color: form.imageUrl ? '#1b2134' : '#9b9baf' }}>{form.imageUrl ? 'تصویر انتخاب شد' : 'آپلود تصویر (اختیاری)'}</span>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            <div className={fieldBoxClass}>
              <select
                value={form.audience}
                onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value as Audience, audienceCategory: '' }))}
                className={fieldClass}
                style={{ color: '#1b2134' }}
              >
                <option value="all">مخاطب: همه</option>
                <option value="visitor">مخاطب: بازدیدکنندگان</option>
                <option value="exhibitor">مخاطب: غرفه‌داران</option>
              </select>
            </div>

            {form.audience !== 'all' && (
              <div className={fieldBoxClass}>
                <select
                  value={form.audienceCategory}
                  onChange={(e) => setForm((p) => ({ ...p, audienceCategory: e.target.value as CategoryId }))}
                  className={fieldClass}
                  style={{ color: '#1b2134' }}
                >
                  <option value="">
                    {form.audience === 'visitor' ? 'همه‌ی حوزه‌های علاقه' : 'همه‌ی گروه‌های کالایی'}
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-2.5">
              <div className={fieldBoxClass + ' flex-1'}>
                <input type="datetime-local" value={form.startAt} onChange={(e) => setForm((p) => ({ ...p, startAt: e.target.value }))} className={fieldClass} style={{ color: '#1b2134', fontSize: '10px' }} />
              </div>
              <div className={fieldBoxClass + ' flex-1'}>
                <input type="datetime-local" value={form.endAt} onChange={(e) => setForm((p) => ({ ...p, endAt: e.target.value }))} className={fieldClass} style={{ color: '#1b2134', fontSize: '10px' }} />
              </div>
            </div>
            <div className="text-[9px] px-1 -mt-1.5" style={{ color: '#9b9baf' }}>شروع اختیاری (خالی = همین الان) · پایان اختیاری</div>

            {capWarning && (
              <div className="text-[9.5px] px-3 py-2 rounded-lg" style={{ background: 'rgba(217,83,79,0.1)', color: '#d9534f', border: '1px solid rgba(217,83,79,0.3)' }}>
                در حال حاضر {toFa(MAX_ACTIVE)} پروموشن فعال دارید. اول یکی از فعال‌ها رو لغو انتشار کنید.
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <button onClick={closeForm} className="flex-1 rounded-full py-2.5 font-bold text-[11.5px]" style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}>انصراف</button>
              <button onClick={save} disabled={!isValid} className="flex-[2] rounded-full py-2.5 font-bold text-xs" style={{ background: isValid ? '#be9c77' : '#6b6375', color: '#1b2134', border: 'none', cursor: isValid ? 'pointer' : 'not-allowed' }}>ذخیره</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}