import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import {
  type PromotionCategory,
  categoryGradient,
  categoryAccent,
  categoryColor,
} from './Promotion'

export const MAX_ACTIVE = 3

export const categories: { id: PromotionCategory; label: string }[] = [
  { id: 'bank', label: 'بانک، اعتبار و پرداخت' },
  { id: 'insurance', label: 'بیمه و مدیریت ریسک' },
  { id: 'capital', label: 'بازار سرمایه و سرمایه‌گذاری' },
  { id: 'infra', label: 'زیرساخت، فناوری و نهادهای پشتیبان' },
]

export type Status = 'draft' | 'scheduled' | 'active' | 'expired'

const statusInfo: Record<Status, { label: string; bg: string; text: string }> = {
  draft: { label: '○ پیش‌نویس', bg: 'rgba(155,155,175,0.15)', text: '#9b9baf' },
  scheduled: { label: 'زمان‌بندی شده', bg: '#dbe8f7', text: '#3d5a80' },
  active: { label: '● فعال', bg: '#e3f0e0', text: '#3f6b4d' },
  expired: { label: 'منقضی شده', bg: 'rgba(217,83,79,0.12)', text: '#c76b5f' },
}

export type PromotionRequestStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface ExhibitorPromotion {
  id: string
  companyName: string
  title: string
  desc: string
  category: PromotionCategory
  backgroundImage: string | null
  startAt: string
  endAt: string
  published: boolean
  createdAt: number
  requestStatus: PromotionRequestStatus
  rejectionReason?: string
  paymentConfirmed?: boolean
}

const emptyPromotion: Omit<ExhibitorPromotion, 'id' | 'createdAt' | 'companyName' | 'requestStatus' | 'rejectionReason' | 'paymentConfirmed'> = {
  title: '',
  desc: '',
  category: 'bank',
  backgroundImage: null,
  startAt: '',
  endAt: '',
  published: false,
}

const toFa = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

export function computeStatus(p: Pick<ExhibitorPromotion, 'published' | 'startAt' | 'endAt'>): Status {
  if (!p.published) return 'draft'
  const now = Date.now()
  const start = p.startAt ? new Date(p.startAt).getTime() : null
  const end = p.endAt ? new Date(p.endAt).getTime() : null
  if (end !== null && now > end) return 'expired'
  if (start !== null && now < start) return 'scheduled'
  return 'active'
}

function urgencyText(p: Pick<ExhibitorPromotion, 'endAt'>): string | null {
  if (!p.endAt) return null
  const end = new Date(p.endAt).getTime()
  const now = Date.now()
  const diffDays = Math.ceil((end - now) / (24 * 60 * 60 * 1000))
  if (diffDays <= 0) return null
  if (diffDays <= 1) return '⏱ تا پایان امروز'
  return `⏱ ${toFa(diffDays)} روز مانده`
}

function formatDateTime(value: string) {
  if (!value) return ''
  const d = new Date(value)
  const date = d.toLocaleDateString('fa-IR')
  const time = d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
  return `${date} ساعت ${time}`
}

export default function ExhibitorPromotions({
  companyName,
  promotions,
  setPromotions,
  onSendNotification,
  onBack,
}: {
  companyName: string
  promotions: ExhibitorPromotion[]
  setPromotions: React.Dispatch<React.SetStateAction<ExhibitorPromotion[]>>
  onSendNotification: (message: string) => void
  onBack: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<ExhibitorPromotion, 'id' | 'createdAt' | 'companyName' | 'requestStatus' | 'rejectionReason' | 'paymentConfirmed'>>(emptyPromotion)
  const [capWarning, setCapWarning] = useState(false)

  const fieldClass = 'flex items-center gap-2 bg-white rounded-xl px-3.5 py-3'
  const inputClass = 'flex-1 border-none outline-none text-xs bg-transparent'

  const openNewForm = () => {
    setForm(emptyPromotion)
    setEditingId(null)
    setCapWarning(false)
    setShowForm(true)
  }

  const openEditForm = (p: ExhibitorPromotion) => {
    setForm({
      title: p.title,
      desc: p.desc,
      category: p.category,
      backgroundImage: p.backgroundImage,
      startAt: p.startAt,
      endAt: p.endAt,
      published: p.published,
    })
    setEditingId(p.id)
    setCapWarning(false)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyPromotion)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm((prev) => ({ ...prev, backgroundImage: url }))
  }

  const isValid = form.title.trim() !== '' && form.endAt.trim() !== ''

  const savePromotion = () => {
    if (!isValid) return
    if (editingId) {
      setPromotions((prev) =>
        prev.map((p) => {
          if (p.id !== editingId) return p
          const wasRejected = p.requestStatus === 'rejected'
          return {
            ...p,
            ...form,
            requestStatus: wasRejected ? 'pending' : p.requestStatus,
            rejectionReason: wasRejected ? undefined : p.rejectionReason,
          }
        })
      )
    } else {
      setPromotions((prev) => [
        ...prev,
        { id: Date.now().toString(), createdAt: Date.now(), companyName, requestStatus: 'draft', ...form, published: false },
      ])
    }
    closeForm()
  }

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id))
  }

  const submitRequest = (id: string) => {
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, requestStatus: 'pending' } : p)))
  }

  const cancelRequest = (id: string) => {
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, requestStatus: 'draft' } : p)))
  }

  const sendPromotionNotification = (p: ExhibitorPromotion) => {
    const message = p.desc
      ? `پروموشن «${p.title}» رو از دست ندید! ${p.desc}`
      : `پروموشن «${p.title}» در غرفه‌ی ما فعال شد، حتماً سر بزنید`
    onSendNotification(message)
  }

  const previewUrgency = urgencyText(form)
  const previewGradient = form.backgroundImage
    ? undefined
    : categoryGradient[form.category]

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
        <PageTitle>پروموشن غرفه</PageTitle>

        {!showForm && (
          <>
            {promotions.length === 0 && (
              <p className="text-[11px] text-center mb-4" style={{ color: '#9b9baf' }}>
                هنوز پروموشنی اضافه نکرده‌اید
              </p>
            )}

            <div className="flex flex-col gap-2.5 mb-4">
              {promotions.map((p) => {
                const status = computeStatus(p)
                const st = statusInfo[status]
                const urgency = status === 'active' ? urgencyText(p) : null
                const isPending = p.requestStatus === 'pending'
                const isRejected = p.requestStatus === 'rejected'
                return (
                  <div key={p.id} className="bg-white rounded-2xl p-3.5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold" style={{ color: '#1b2134' }}>
                        {p.title}
                      </span>
                      {isPending ? (
                        <span className="text-[8px] font-bold px-2 py-1 rounded-md flex-shrink-0" style={{ background: 'rgba(190,156,119,0.18)', color: '#8a6d4d' }}>
                          در انتظار تایید ادمین
                        </span>
                      ) : isRejected ? (
                        <span className="text-[8px] font-bold px-2 py-1 rounded-md flex-shrink-0" style={{ background: 'rgba(155,155,175,0.15)', color: '#9b9baf' }}>
                          رد شده
                        </span>
                      ) : (
                        <span className="text-[8px] font-bold px-2 py-1 rounded-md flex-shrink-0" style={{ background: st.bg, color: st.text }}>
                          {st.label}
                        </span>
                      )}
                    </div>

                    {p.desc && (
                      <div className="text-[9.5px] leading-relaxed" style={{ color: '#9b9baf' }}>
                        {p.desc}
                      </div>
                    )}

                    <div className="text-[9px] mt-2" style={{ color: '#8a6d4d' }}>
                      {p.endAt && `تا ${formatDateTime(p.endAt)}`}
                      {urgency && ` · ${urgency}`}
                    </div>

                    {isRejected && (
                      <div className="rounded-lg px-2.5 py-2 mt-2" style={{ background: 'rgba(217,83,79,0.08)' }}>
                        <div className="text-[8.5px] font-bold" style={{ color: '#c76b5f' }}>
                          دلیل رد: {p.rejectionReason || 'مشخص نشده'}
                        </div>
                      </div>
                    )}

                    {isPending && (
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[8.5px]" style={{ color: '#9b9baf' }}>درخواست انتشار ارسال شد</span>
                        <button
                          onClick={() => cancelRequest(p.id)}
                          className="text-[9px] underline"
                          style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          لغو درخواست
                        </button>
                      </div>
                    )}

                    {isRejected && (
                      <button
                        onClick={() => openEditForm(p)}
                        className="w-full mt-2.5 rounded-full py-2 font-bold text-[9.5px]"
                        style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
                      >
                        ویرایش و ارسال مجدد
                      </button>
                    )}

                    {!isPending && !isRejected && (
                      <div className="flex items-center justify-between mt-2.5">
                        {p.requestStatus === 'draft' ? (
                          <button
                            onClick={() => submitRequest(p.id)}
                            className="text-[8.5px] font-bold px-2 py-1 rounded-md"
                            style={{ background: 'rgba(190,156,119,0.18)', color: '#8a6d4d', border: 'none', cursor: 'pointer' }}
                          >
                            ارسال درخواست انتشار
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8px] font-bold px-2 py-1 rounded-md" style={{ background: '#e3f0e0', color: '#3f6b4d' }}>
                              تایید و منتشر شده
                            </span>
                            <button
                              onClick={() => sendPromotionNotification(p)}
                              className="text-[8px] font-bold px-2 py-1 rounded-md"
                              style={{ background: 'rgba(190,156,119,0.18)', color: '#8a6d4d', border: 'none', cursor: 'pointer' }}
                            >
                              ارسال اعلان
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => openEditForm(p)}
                            className="text-[9.5px] underline"
                            style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => deletePromotion(p.id)}
                            className="text-[9.5px] underline"
                            style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <button
              onClick={openNewForm}
              className="w-full rounded-xl py-3 text-[11px] font-bold"
              style={{ border: '1.5px dashed rgba(190,156,119,0.5)', color: '#be9c77', background: 'transparent', cursor: 'pointer' }}
            >
              + افزودن پروموشن جدید (حداکثر {toFa(MAX_ACTIVE)} فعال هم‌زمان)
            </button>
          </>
        )}

        {showForm && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[11px] font-bold mb-1" style={{ color: '#e8cfa8' }}>
              {editingId ? 'ویرایش پروموشن' : 'افزودن پروموشن جدید'}
            </div>

            <div className="text-[9.5px] font-bold mb-1" style={{ color: '#9b9baf' }}>
              پیش‌نمایش زنده
            </div>
            <div
              className="rounded-2xl p-3.5 relative overflow-hidden mb-1"
              style={{ background: previewGradient }}
            >
              {form.backgroundImage && (
                <>
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${form.backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'blur(2px) brightness(0.95)',
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: categoryColor[form.category], opacity: 0.82 }}
                  />
                </>
              )}
              <div className="relative">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold" style={{ color: categoryAccent[form.category] }}>
                    {companyName || 'نام غرفه'}
                  </span>
                  {previewUrgency && (
                    <span
                      className="text-[7.5px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: 'rgba(217,83,79,0.15)', color: '#c76b5f' }}
                    >
                      {previewUrgency}
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-bold mt-1.5" style={{ color: categoryAccent[form.category] }}>
                  {form.title || 'عنوان پروموشن'}
                </div>
                <div className="text-[9px] mt-0.5" style={{ color: categoryAccent[form.category] }}>
                  {form.desc || 'توضیحات کوتاه'}
                </div>
              </div>
            </div>

            <div className={fieldClass}>
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="عنوان پروموشن"
                className={inputClass}
                style={{ color: '#1b2134' }}
              />
            </div>

            <div className={fieldClass}>
              <input
                value={form.desc}
                onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))}
                placeholder="توضیحات کوتاه"
                className={inputClass}
                style={{ color: '#1b2134' }}
              />
            </div>

            <div className={fieldClass}>
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as PromotionCategory }))}
                className={inputClass}
                style={{ color: '#1b2134' }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2.5">
              <div className={fieldClass + ' flex-1'}>
                <input
                  type="datetime-local"
                  value={form.startAt}
                  onChange={(e) => setForm((prev) => ({ ...prev, startAt: e.target.value }))}
                  className={inputClass}
                  style={{ color: '#1b2134', fontSize: '10px' }}
                />
              </div>
              <div className={fieldClass + ' flex-1'}>
                <input
                  type="datetime-local"
                  value={form.endAt}
                  onChange={(e) => setForm((prev) => ({ ...prev, endAt: e.target.value }))}
                  className={inputClass}
                  style={{ color: '#1b2134', fontSize: '10px' }}
                />
              </div>
            </div>
            <div className="text-[9px] px-1 -mt-1.5" style={{ color: '#9b9baf' }}>
              شروع اختیاری (خالی = همین الان) · پایان الزامی
            </div>

            <label className="bg-white rounded-xl px-3.5 py-3 flex items-center gap-2" style={{ cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="11" r="2" />
                <path d="M21 15l-5-5-9 9" />
              </svg>
              <span className="text-xs flex-1" style={{ color: form.backgroundImage ? '#1b2134' : '#9b9baf' }}>
                {form.backgroundImage ? 'تصویر پس‌زمینه انتخاب شد' : 'تصویر پس‌زمینه (اختیاری)'}
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {capWarning && (
              <div
                className="text-[9.5px] px-3 py-2 rounded-lg"
                style={{ background: 'rgba(217,83,79,0.1)', color: '#d9534f', border: '1px solid rgba(217,83,79,0.3)' }}
              >
                در حال حاضر {toFa(MAX_ACTIVE)} پروموشن فعال دارید. برای انتشار این یکی، اول یکی از فعال‌ها رو لغو انتشار کنید.
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
                onClick={savePromotion}
                disabled={!isValid}
                className="flex-[2] rounded-full py-2.5 font-bold text-xs"
                style={{
                  background: isValid ? '#be9c77' : '#6b6375',
                  color: '#1b2134',
                  border: 'none',
                  cursor: isValid ? 'pointer' : 'not-allowed',
                }}
              >
                ذخیره به‌عنوان پیش‌نویس
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}