import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { categories, type CategoryId } from './ExhibitorProducts'

type RecipientType = 'visitor' | 'exhibitor'
type ScheduleMode = 'now' | 'draft' | 'scheduled'
type NotificationStatus = 'sent' | 'draft' | 'scheduled'

export interface AdminNotificationEntry {
  id: string
  message: string
  recipientType: RecipientType
  categoryIds: CategoryId[]
  status: NotificationStatus
  scheduledAt: string
  createdAt: number
  audienceEstimate: number
  // موتور واقعی ارسال در App.tsx این را true می‌کند وقتی پیام واقعاً به اینباکس گیرنده‌ها تحویل داده شد
  // (برای «فوری» بلافاصله، برای «زمان‌بندی‌شده» دقیقاً وقتی scheduledAt فرا برسد).
  delivered?: boolean
}

const toFa = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

function estimateAudience(recipientType: RecipientType, categoryIds: CategoryId[]) {
  const base = recipientType === 'visitor' ? 1240 : 38
  if (categoryIds.length === 0) return base
  const perCategory = Math.round(base / categories.length)
  return perCategory * categoryIds.length
}

function statusLabel(status: NotificationStatus) {
  if (status === 'sent') return { label: 'ارسال شد', bg: '#e3f0e0', text: '#3f6b4d' }
  if (status === 'scheduled') return { label: 'زمان‌بندی شده', bg: '#dbe8f7', text: '#3d5a80' }
  return { label: '○ پیش‌نویس', bg: 'rgba(155,155,175,0.15)', text: '#9b9baf' }
}

function formatDateTime(ts: number) {
  const d = new Date(ts)
  return `${d.toLocaleDateString('fa-IR')} ساعت ${d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`
}

export default function AdminNotifications({
  history,
  setHistory,
  onLogActivity,
  onBack,
}: {
  history: AdminNotificationEntry[]
  setHistory: React.Dispatch<React.SetStateAction<AdminNotificationEntry[]>>
  onLogActivity: (text: string) => void
  onBack: () => void
}) {
  const [message, setMessage] = useState('')
  const [recipientType, setRecipientType] = useState<RecipientType>('visitor')
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([])
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('now')
  const [scheduledAt, setScheduledAt] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const toggleCategory = (id: CategoryId) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const audienceEstimate = estimateAudience(recipientType, selectedCategories)
  const isValid = message.trim() !== '' && (scheduleMode !== 'scheduled' || scheduledAt.trim() !== '')

  const proceedToConfirm = () => {
    if (!isValid) return
    setShowConfirm(true)
  }

  const finalize = () => {
    const status: NotificationStatus = scheduleMode === 'now' ? 'sent' : scheduleMode === 'draft' ? 'draft' : 'scheduled'
    setHistory((prev) => [
      {
        id: Date.now().toString(),
        message: message.trim(),
        recipientType,
        categoryIds: selectedCategories,
        status,
        scheduledAt,
        createdAt: Date.now(),
        audienceEstimate,
      },
      ...prev,
    ])
    onLogActivity(
      status === 'sent'
        ? `اعلانی برای ${recipientType === 'visitor' ? 'بازدیدکنندگان' : 'غرفه‌داران'} ارسال کرد`
        : status === 'scheduled'
        ? `اعلانی را برای زمان بعد زمان‌بندی کرد`
        : `یک پیش‌نویس اعلان ذخیره کرد`
    )
    setMessage('')
    setSelectedCategories([])
    setScheduleMode('now')
    setScheduledAt('')
    setShowConfirm(false)
  }

  const fieldBoxClass = 'flex items-center gap-2 bg-white rounded-xl px-3.5 py-3'
  const fieldClass = 'flex-1 border-none outline-none text-xs bg-transparent'

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden px-6 py-8"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={showConfirm ? () => setShowConfirm(false) : onBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="relative z-10 mt-6">
        <PageTitle>ارسال اعلان هدفمند</PageTitle>

        {!showConfirm && (
          <>
            <div className={fieldBoxClass} style={{ alignItems: 'flex-start' }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="متن اعلان"
                className={fieldClass + ' resize-none'}
                style={{ color: '#1b2134', minHeight: '64px' }}
              />
            </div>

            <div className="flex gap-2 my-3">
              <button
                onClick={() => {
                  setRecipientType('visitor')
                  setSelectedCategories([])
                }}
                className="flex-1 text-[10px] font-bold py-2 rounded-lg"
                style={{ background: recipientType === 'visitor' ? '#be9c77' : 'rgba(255,255,255,0.06)', color: recipientType === 'visitor' ? '#1b2134' : '#9b9baf', border: 'none', cursor: 'pointer' }}
              >
                بازدیدکنندگان
              </button>
              <button
                onClick={() => {
                  setRecipientType('exhibitor')
                  setSelectedCategories([])
                }}
                className="flex-1 text-[10px] font-bold py-2 rounded-lg"
                style={{ background: recipientType === 'exhibitor' ? '#be9c77' : 'rgba(255,255,255,0.06)', color: recipientType === 'exhibitor' ? '#1b2134' : '#9b9baf', border: 'none', cursor: 'pointer' }}
              >
                غرفه‌داران
              </button>
            </div>

            <div className="text-[9px] font-bold mb-1.5" style={{ color: '#9b9baf' }}>
              {recipientType === 'visitor' ? 'فیلتر حوزه‌ی مورد علاقه (اختیاری)' : 'فیلتر گروه کالایی (اختیاری)'}
            </div>
            <div className="flex gap-1.5 flex-wrap mb-3">
              {categories.map((c) => {
                const active = selectedCategories.includes(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCategory(c.id)}
                    className="text-[9px] font-bold px-2.5 py-1.5 rounded-lg"
                    style={{
                      background: active ? c.color : 'rgba(255,255,255,0.06)',
                      color: active ? c.text : '#9b9baf',
                      border: active ? `1px solid ${c.text}` : '1px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>

            <div className="text-[9px] font-bold mb-1.5" style={{ color: '#9b9baf' }}>زمان ارسال</div>
            <div className="flex gap-2 mb-3">
              <button onClick={() => setScheduleMode('now')} className="flex-1 text-[10px] font-bold py-2 rounded-lg" style={{ background: scheduleMode === 'now' ? '#be9c77' : 'rgba(255,255,255,0.06)', color: scheduleMode === 'now' ? '#1b2134' : '#9b9baf', border: 'none', cursor: 'pointer' }}>
                فوری
              </button>
              <button onClick={() => setScheduleMode('draft')} className="flex-1 text-[10px] font-bold py-2 rounded-lg" style={{ background: scheduleMode === 'draft' ? '#be9c77' : 'rgba(255,255,255,0.06)', color: scheduleMode === 'draft' ? '#1b2134' : '#9b9baf', border: 'none', cursor: 'pointer' }}>
                پیش‌نویس
              </button>
              <button onClick={() => setScheduleMode('scheduled')} className="flex-1 text-[10px] font-bold py-2 rounded-lg" style={{ background: scheduleMode === 'scheduled' ? '#be9c77' : 'rgba(255,255,255,0.06)', color: scheduleMode === 'scheduled' ? '#1b2134' : '#9b9baf', border: 'none', cursor: 'pointer' }}>
                زمان‌بندی‌شده
              </button>
            </div>

            {scheduleMode === 'scheduled' && (
              <div className={fieldBoxClass + ' mb-3'}>
                <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className={fieldClass} style={{ color: '#1b2134' }} />
              </div>
            )}

            <div className="rounded-xl px-3.5 py-2.5 mb-4" style={{ background: 'rgba(190,156,119,0.1)', border: '1px solid rgba(190,156,119,0.25)' }}>
              <span className="text-[9.5px]" style={{ color: '#e8cfa8' }}>تخمین مخاطب: {toFa(audienceEstimate)} نفر</span>
            </div>

            <button
              onClick={proceedToConfirm}
              disabled={!isValid}
              className="w-full rounded-full py-3 font-bold text-xs mb-5"
              style={{ background: isValid ? '#be9c77' : '#6b6375', color: '#1b2134', border: 'none', cursor: isValid ? 'pointer' : 'not-allowed' }}
            >
              بررسی و ادامه
            </button>

            <div className="text-[10px] font-bold mb-2" style={{ color: '#e8cfa8' }}>تاریخچه‌ی اعلان‌ها</div>
            {history.length === 0 && <p className="text-[10.5px] text-center py-4" style={{ color: '#9b9baf' }}>هنوز اعلانی ثبت نشده</p>}
            <div className="flex flex-col gap-2">
              {history.map((h) => {
                const st = statusLabel(h.status)
                return (
                  <div key={h.id} className="bg-white rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[9.5px] flex-1" style={{ color: '#1b2134' }}>{h.message}</span>
                      <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ background: st.bg, color: st.text }}>{st.label}</span>
                    </div>
                    <div className="text-[8px] mt-1.5" style={{ color: '#9b9baf' }}>
                      {h.recipientType === 'visitor' ? 'بازدیدکنندگان' : 'غرفه‌داران'} · {toFa(h.audienceEstimate)} نفر · {formatDateTime(h.createdAt)}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {showConfirm && (
          <div>
            <div className="text-[10px] font-bold mb-2" style={{ color: '#9b9baf' }}>پیش‌نمایش زنده</div>
            <div className="bg-white rounded-2xl p-3.5 mb-4">
              <div className="text-[9px] font-bold mb-1.5" style={{ color: '#8a6d4d' }}>اعلان جدید</div>
              <div className="text-[10.5px]" style={{ color: '#1b2134' }}>{message}</div>
            </div>

            <div className="rounded-xl p-3.5 mb-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex justify-between text-[9.5px] mb-1.5"><span style={{ color: '#9b9baf' }}>مخاطب</span><span style={{ color: '#fff', fontWeight: 700 }}>{recipientType === 'visitor' ? 'بازدیدکنندگان' : 'غرفه‌داران'}</span></div>
              <div className="flex justify-between text-[9.5px] mb-1.5"><span style={{ color: '#9b9baf' }}>حوزه</span><span style={{ color: '#fff', fontWeight: 700 }}>{selectedCategories.length === 0 ? 'همه' : selectedCategories.length + ' مورد انتخاب‌شده'}</span></div>
              <div className="flex justify-between text-[9.5px] mb-1.5"><span style={{ color: '#9b9baf' }}>تخمین مخاطب</span><span style={{ color: '#be9c77', fontWeight: 700 }}>{toFa(audienceEstimate)} نفر</span></div>
              <div className="flex justify-between text-[9.5px]"><span style={{ color: '#9b9baf' }}>زمان ارسال</span><span style={{ color: '#fff', fontWeight: 700 }}>{scheduleMode === 'now' ? 'فوری' : scheduleMode === 'draft' ? 'پیش‌نویس (بدون ارسال)' : 'زمان‌بندی‌شده'}</span></div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)} className="flex-1 rounded-full py-2.5 font-bold text-[11.5px]" style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}>
                بازگشت و ویرایش
              </button>
              <button onClick={finalize} className="flex-[2] rounded-full py-2.5 font-bold text-xs" style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}>
                تایید نهایی و {scheduleMode === 'now' ? 'ارسال' : scheduleMode === 'draft' ? 'ذخیره' : 'زمان‌بندی'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}