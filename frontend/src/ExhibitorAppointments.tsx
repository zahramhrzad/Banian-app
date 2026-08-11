import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { type CategoryId, categoryInfo } from './ExhibitorProducts'

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
}

function initials(name: string) {
  return name.trim().slice(0, 2)
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('fa-IR')
}

export default function ExhibitorAppointments({
  requests,
  setRequests,
  staffName,
  staffPhone,
  onBack,
}: {
  requests: MeetingRequest[]
  setRequests: React.Dispatch<React.SetStateAction<MeetingRequest[]>>
  staffName: string
  staffPhone: string
  onBack: () => void
}) {
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})

  const approve = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'approved', approvedByStaffName: staffName, approvedAt: Date.now() }
          : r
      )
    )
  }

  const decline = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r)))
  }

  const updateNote = (id: string, note: string) => {
    setNoteDrafts((prev) => ({ ...prev, [id]: note }))
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, agreementNotes: note } : r)))
  }

  const pending = requests.filter((r) => r.status === 'pending')
  const approved = requests.filter((r) => r.status === 'approved')
  const declined = requests.filter((r) => r.status === 'declined')

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
        <PageTitle>درخواست‌های ملاقات</PageTitle>

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
              {approved.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold" style={{ color: '#1b2134' }}>{r.visitorName}</span>
                    <span
                      className="text-[8px] font-bold px-2 py-1 rounded-full"
                      style={{ background: '#e3f0e0', color: '#3f6b4d' }}
                    >
                      ● تایید شده
                    </span>
                  </div>
                  <div className="rounded-xl p-2.5" style={{ background: '#f7f5ef' }}>
                    <div className="text-[8.5px] font-bold mb-2" style={{ color: '#8a6d4d' }}>
                      توافق حین نمایشگاه
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[8.5px]" style={{ color: '#9b9baf' }}>تلفن بازدیدکننده</span>
                      <span className="text-[8.5px] font-bold" dir="ltr" style={{ color: '#1b2134' }}>{r.visitorPhone}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[8.5px]" style={{ color: '#9b9baf' }}>تاییدشده توسط (غرفه)</span>
                      <span className="text-[8.5px] font-bold" style={{ color: '#1b2134' }}>{r.approvedByStaffName}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-[8.5px]" style={{ color: '#9b9baf' }}>تلفن غرفه‌دار</span>
                      <span className="text-[8.5px] font-bold" dir="ltr" style={{ color: '#1b2134' }}>{staffPhone}</span>
                    </div>
                    <textarea
                      value={noteDrafts[r.id] ?? r.agreementNotes}
                      onChange={(e) => updateNote(r.id, e.target.value)}
                      placeholder="یادداشت توافق را اینجا بنویسید..."
                      className="w-full rounded-lg px-2.5 py-2 text-[9px] outline-none resize-none"
                      style={{ border: '1px solid #eee', color: '#1b2134', minHeight: '44px' }}
                    />
                    {r.approvedAt && (
                      <div className="text-[7.5px] mt-1.5" style={{ color: '#9b9baf' }}>
                        تاریخ تایید: {formatDate(r.approvedAt)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
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