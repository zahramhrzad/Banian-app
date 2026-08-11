import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { type CategoryId, categoryInfo, categories } from './ExhibitorProducts'
import { type Agreement } from './ExhibitorAgreements'

export type AgreementStatus = 'negotiating' | 'signed' | 'cancelled'

const agreementStatusInfo: Record<AgreementStatus, { label: string; bg: string; text: string }> = {
  negotiating: { label: 'در حال مذاکره', bg: 'rgba(190,156,119,0.18)', text: '#8a6d4d' },
  signed: { label: 'امضا شده', bg: '#e3f0e0', text: '#3f6b4d' },
  cancelled: { label: 'لغو شده', bg: 'rgba(217,83,79,0.12)', text: '#c76b5f' },
}

export interface MeetingRequest {
  id: string
  visitorName: string
  visitorCategory: CategoryId | ''
  description: string
  visitorPhone: string
  status: 'pending' | 'approved' | 'declined'
  agreementNotes: string
  approvedByStaffName: string
  approvedAt: number | null
  agreementTopic?: string
  agreementLocation?: string
  agreementCategory?: CategoryId | ''
  agreementStatus?: AgreementStatus
  agreementFileUrl?: string | null
  agreementFileName?: string | null
  agreementFileIsImage?: boolean
}

function initials(name: string) {
  return name.trim().slice(0, 2)
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('fa-IR')
}

function linkedAgreementId(requestId: string) {
  return `linked-${requestId}`
}

export default function ExhibitorAppointments({
  requests,
  setRequests,
  staffName,
  staffPhone,
  agreements,
  setAgreements,
  onOpenAgreements,
  onBack,
}: {
  requests: MeetingRequest[]
  setRequests: React.Dispatch<React.SetStateAction<MeetingRequest[]>>
  staffName: string
  staffPhone: string
  agreements: Agreement[]
  setAgreements: React.Dispatch<React.SetStateAction<Agreement[]>>
  onOpenAgreements: () => void
  onBack: () => void
}) {
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
const [savedFeedback, setSavedFeedback] = useState<Record<string, boolean>>({})
  const syncLinkedAgreement = (updated: MeetingRequest) => {
    const linkedId = linkedAgreementId(updated.id)
    setAgreements((prev) => {
      const existing = prev.find((a) => a.id === linkedId)
      const synced: Agreement = {
        id: linkedId,
        partnerName: updated.visitorName,
        topic: updated.agreementTopic || '',
        date: updated.approvedAt ? new Date(updated.approvedAt).toISOString().slice(0, 10) : '',
        location: updated.agreementLocation || '',
        category: updated.agreementCategory || '',
        status: updated.agreementStatus || 'negotiating',
        privateNote: updated.agreementNotes || '',
        fileUrl: updated.agreementFileUrl || null,
        fileName: updated.agreementFileName || null,
        fileIsImage: updated.agreementFileIsImage || false,
        createdAt: existing ? existing.createdAt : Date.now(),
      }
      if (existing) {
        return prev.map((a) => (a.id === linkedId ? synced : a))
      }
      return [...prev, synced]
    })
  }

  const approve = (id: string) => {
    setRequests((prev) => {
      const next = prev.map((r) =>
        r.id === id
          ? { ...r, status: 'approved' as const, approvedByStaffName: staffName, approvedAt: Date.now(), agreementStatus: 'negotiating' as AgreementStatus }
          : r
      )
      const updated = next.find((r) => r.id === id)
      if (updated) syncLinkedAgreement(updated)
      return next
    })
  }

  const decline = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r)))
  }

  const updateField = (id: string, patch: Partial<MeetingRequest>) => {
    setRequests((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
      const updated = next.find((r) => r.id === id)
      if (updated) syncLinkedAgreement(updated)
      return next
    })
  }

  const updateNote = (id: string, note: string) => {
    setNoteDrafts((prev) => ({ ...prev, [id]: note }))
    updateField(id, { agreementNotes: note })
  }

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    updateField(id, {
      agreementFileUrl: url,
      agreementFileName: file.name,
      agreementFileIsImage: file.type.startsWith('image/'),
    })
  }

  const removeFile = (id: string) => {
    updateField(id, { agreementFileUrl: null, agreementFileName: null, agreementFileIsImage: false })
  }

  void agreements

  const pending = requests.filter((r) => r.status === 'pending')
  const approved = requests.filter((r) => r.status === 'approved')
  const declined = requests.filter((r) => r.status === 'declined')

  const fieldClass = 'w-full rounded-lg px-2.5 py-2 text-[9.5px] outline-none'
  const fieldStyle = { border: '1px solid #eee', color: '#1b2134' }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden px-6 py-8"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={onBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="relative z-10 mt-6">
        <PageTitle>قرارهای من</PageTitle>

        <button
          onClick={onOpenAgreements}
          className="w-full rounded-xl px-3.5 py-2.5 mb-4 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(190,156,119,0.25)', cursor: 'pointer' }}
        >
          <span className="text-[10px] font-bold" style={{ color: '#be9c77' }}>مشاهده‌ی همه‌ی قراردادها و تفاهم‌نامه‌ها</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {requests.length === 0 && (
          <p className="text-[11px] text-center mb-4" style={{ color: '#9b9baf' }}>
            هنوز درخواستی دریافت نکرده‌اید
          </p>
        )}

        {pending.length > 0 && (
          <>
            <div className="text-[10px] font-bold mb-2" style={{ color: '#e8cfa8' }}>
              در انتظار بررسی ({pending.length.toLocaleString('fa-IR')})
            </div>
            <div className="flex flex-col gap-2.5 mb-5">
              {pending.map((r) => {
                const cat = categoryInfo(r.visitorCategory)
                return (
                  <div key={r.id} className="bg-white rounded-2xl p-3.5">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: cat?.color || '#f3e8dc', color: cat?.text || '#8a6d4d' }}
                      >
                        {initials(r.visitorName)}
                      </div>
                      <div className="flex-1">
                        <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>{r.visitorName}</div>
                        {cat && (
                          <span
                            className="inline-block text-[7.5px] font-bold px-1.5 py-0.5 rounded-md mt-0.5"
                            style={{ background: cat.color, color: cat.text }}
                          >
                            {cat.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className="text-[9px] leading-relaxed rounded-lg px-2.5 py-2"
                      style={{ background: '#f7f5ef', color: '#8a8a8a' }}
                    >
                      {r.description}
                    </div>
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={() => approve(r.id)}
                        className="flex-1 rounded-lg py-2 text-[10px] font-bold"
                        style={{ background: '#3f6b4d', color: '#fff', border: 'none', cursor: 'pointer' }}
                      >
                        تایید درخواست
                      </button>
                      <button
                        onClick={() => decline(r.id)}
                        className="flex-1 rounded-lg py-2 text-[10px] font-bold"
                        style={{ background: '#f7f5ef', color: '#c76b5f', border: 'none', cursor: 'pointer' }}
                      >
                        رد
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {approved.length > 0 && (
          <>
            <div className="text-[10px] font-bold mb-2" style={{ color: '#e8cfa8' }}>
              تاییدشده ({approved.length.toLocaleString('fa-IR')})
            </div>
            <div className="flex flex-col gap-2.5 mb-5">
              {approved.map((r) => {
                const agrStatus = r.agreementStatus || 'negotiating'
                const st = agreementStatusInfo[agrStatus]
                const agrCat = categoryInfo(r.agreementCategory || '')
                return (
                  <div key={r.id} className="bg-white rounded-2xl p-3.5">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-bold" style={{ color: '#1b2134' }}>{r.visitorName}</span>
                      <span
                        className="text-[8px] font-bold px-2 py-1 rounded-full"
                        style={{ background: st.bg, color: st.text }}
                      >
                        {st.label}
                      </span>
                    </div>

                    <div className="rounded-xl p-2.5" style={{ background: '#f7f5ef' }}>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[8.5px] font-bold" style={{ color: '#8a6d4d' }}>
                          توافق حین نمایشگاه
                        </span>
                        <span className="text-[7px]" style={{ color: '#9b9baf' }}>
                          هم‌زمان در «قراردادها» ثبت می‌شود
                        </span>
                      </div>

                      <div className="flex justify-between mb-1">
                        <span className="text-[8.5px]" style={{ color: '#9b9baf' }}>تلفن بازدیدکننده</span>
                        <span className="text-[8.5px] font-bold" dir="ltr" style={{ color: '#1b2134' }}>{r.visitorPhone}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[8.5px]" style={{ color: '#9b9baf' }}>تاییدشده توسط (غرفه)</span>
                        <span className="text-[8.5px] font-bold" style={{ color: '#1b2134' }}>{r.approvedByStaffName}</span>
                      </div>
                      <div className="flex justify-between mb-2.5">
                        <span className="text-[8.5px]" style={{ color: '#9b9baf' }}>تلفن غرفه‌دار</span>
                        <span className="text-[8.5px] font-bold" dir="ltr" style={{ color: '#1b2134' }}>{staffPhone}</span>
                      </div>

                      <div className="flex flex-col gap-1.5 mb-2">
                        <input
                          value={r.agreementTopic || ''}
                          onChange={(e) => updateField(r.id, { agreementTopic: e.target.value })}
                          placeholder="موضوع توافق"
                          className={fieldClass}
                          style={fieldStyle}
                        />
                        <div className="flex gap-1.5">
                          <input
                            value={r.agreementLocation || ''}
                            onChange={(e) => updateField(r.id, { agreementLocation: e.target.value })}
                            placeholder="مکان"
                            className={fieldClass + ' flex-1'}
                            style={fieldStyle}
                          />
                          <select
                            value={agrStatus}
                            onChange={(e) => updateField(r.id, { agreementStatus: e.target.value as AgreementStatus })}
                            className={fieldClass + ' flex-1'}
                            style={fieldStyle}
                          >
                            <option value="negotiating">در حال مذاکره</option>
                            <option value="signed">امضا شده</option>
                            <option value="cancelled">لغو شده</option>
                          </select>
                        </div>
                        <select
                          value={r.agreementCategory || ''}
                          onChange={(e) => updateField(r.id, { agreementCategory: e.target.value as CategoryId })}
                          className={fieldClass}
                          style={fieldStyle}
                        >
                          <option value="">بدون دسته‌بندی</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                        {agrCat && (
                          <span
                            className="inline-block self-start text-[7.5px] font-bold px-1.5 py-0.5 rounded-md"
                            style={{ background: agrCat.color, color: agrCat.text }}
                          >
                            {agrCat.label}
                          </span>
                        )}
                      </div>

                      {!r.agreementFileUrl ? (
                        <label
                          className="w-full rounded-lg px-2.5 py-2 flex items-center gap-1.5 mb-2"
                          style={{ ...fieldStyle, cursor: 'pointer' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                          </svg>
                          <span className="text-[9px]" style={{ color: '#9b9baf' }}>پیوست فایل (اختیاری)</span>
                          <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(r.id, e)} className="hidden" />
                        </label>
                      ) : (
                        <div className="w-full rounded-lg px-2.5 py-2 flex items-center justify-between mb-2" style={fieldStyle}>
                          <span className="text-[9px] truncate" style={{ color: '#1b2134' }}>{r.agreementFileName}</span>
                          <button
                            onClick={() => removeFile(r.id)}
                            className="text-[8.5px] underline flex-shrink-0"
                            style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            حذف
                          </button>
                        </div>
                      )}

                      <textarea
                        value={noteDrafts[r.id] ?? r.agreementNotes}
                        onChange={(e) => updateNote(r.id, e.target.value)}
                        placeholder="یادداشت توافق را اینجا بنویسید..."
                        className="w-full rounded-lg px-2.5 py-2 text-[9px] outline-none resize-none"
                        style={{ border: '1px solid #eee', color: '#1b2134', minHeight: '44px' }}
                      />

                      <button
                        onClick={() => {
                          setSavedFeedback((prev) => ({ ...prev, [r.id]: true }))
                          setTimeout(() => {
                            setSavedFeedback((prev) => ({ ...prev, [r.id]: false }))
                          }, 2000)
                        }}
                        className="w-full rounded-lg py-2 mt-2 text-[10px] font-bold"
                        style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
                      >
                        {savedFeedback[r.id] ? '✓ ذخیره شد' : 'ذخیره اطلاعات توافق'}
                      </button>

                      {r.approvedAt && (
                        <div className="text-[7.5px] mt-1.5" style={{ color: '#9b9baf' }}>
                          تاریخ تایید: {formatDate(r.approvedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {declined.length > 0 && (
          <>
            <div className="text-[10px] font-bold mb-2" style={{ color: '#9b9baf' }}>
              رد شده ({declined.length.toLocaleString('fa-IR')})
            </div>
            <div className="flex flex-col gap-2 mb-2">
              {declined.map((r) => (
                <div key={r.id} className="bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-between" style={{ opacity: 0.6 }}>
                  <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>{r.visitorName}</span>
                  <span className="text-[8px] font-bold" style={{ color: '#c76b5f' }}>رد شده</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}