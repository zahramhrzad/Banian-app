import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { categoryGradient, categoryAccent } from './Promotion'
import { type ExhibitorPromotion, MAX_ACTIVE, computeStatus, categories } from './ExhibitorPromotions'

const toFa = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

const rejectionPresets = [
  'تصویر پروموشن نامناسب است',
  'اطلاعات پروموشن ناقص است',
  'پرداخت هزینه‌ی پروموشن انجام نشده',
  'سایر',
]

function categoryLabel(id: ExhibitorPromotion['category']) {
  return categories.find((c) => c.id === id)?.label || id
}

function formatDateTime(value: string) {
  if (!value) return ''
  const d = new Date(value)
  return `${d.toLocaleDateString('fa-IR')} ساعت ${d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`
}

export default function AdminPromotionRequests({
  requests,
  setRequests,
  onLogActivity,
  onBack,
}: {
  requests: ExhibitorPromotion[]
  setRequests: React.Dispatch<React.SetStateAction<ExhibitorPromotion[]>>
  onLogActivity: (text: string) => void
  onBack: () => void
}) {
  const [paymentChecks, setPaymentChecks] = useState<Record<string, boolean>>({})
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [reasonPreset, setReasonPreset] = useState(rejectionPresets[0])
  const [reasonText, setReasonText] = useState('')
  const [capWarning, setCapWarning] = useState<string | null>(null)

  const pending = requests.filter((r) => r.requestStatus === 'pending')
  const reviewed = requests
    .filter((r) => r.requestStatus === 'approved' || r.requestStatus === 'rejected')
    .sort((a, b) => b.createdAt - a.createdAt)

  const approve = (id: string) => {
    setCapWarning(null)
    const target = requests.find((r) => r.id === id)
    if (!target) return
    const activeCount = requests.filter((r) => r.id !== id && r.published && computeStatus(r) === 'active').length
    if (activeCount >= MAX_ACTIVE) {
      setCapWarning('در حال حاضر حداکثر تعداد پروموشن فعال هم‌زمان (' + toFa(MAX_ACTIVE) + ' مورد) پر شده. اول یکی از پروموشن‌های فعال را لغو انتشار کنید.')
      return
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, published: true, requestStatus: 'approved', paymentConfirmed: true } : r))
    )
    onLogActivity(`پرداخت «${target.companyName}» را تایید و پروموشن «${target.title}» را منتشر کرد`)
  }

  const startReject = (id: string) => {
    setRejectingId(id)
    setReasonPreset(rejectionPresets[0])
    setReasonText('')
  }

  const confirmReject = (id: string) => {
    const target = requests.find((r) => r.id === id)
    if (!target) return
    const reason = reasonPreset === 'سایر' ? reasonText.trim() : reasonPreset
    if (!reason) return
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, requestStatus: 'rejected', rejectionReason: reason, published: false } : r))
    )
    onLogActivity(`درخواست پروموشن «${target.title}» از غرفه‌ی «${target.companyName}» را رد کرد`)
    setRejectingId(null)
  }

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
        <PageTitle>درخواست‌های پروموشن غرفه‌داران</PageTitle>

        {pending.length === 0 && (
          <p className="text-[11px] text-center mb-4" style={{ color: '#9b9baf' }}>
            در حال حاضر درخواست در انتظار بررسی وجود ندارد
          </p>
        )}

        <div className="flex flex-col gap-3 mb-5">
          {pending.map((p) => {
            const paid = !!paymentChecks[p.id]
            const isRejecting = rejectingId === p.id
            return (
              <div key={p.id} className="rounded-2xl overflow-hidden" style={{ background: categoryGradient[p.category] }}>
                <div className="p-3.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold" style={{ color: categoryAccent[p.category] }}>{p.companyName}</span>
                    <span className="text-[7.5px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(217,83,79,0.15)', color: '#c76b5f' }}>در انتظار</span>
                  </div>
                  <div className="text-[11px] font-bold mt-1.5" style={{ color: categoryAccent[p.category] }}>{p.title}</div>
                  {p.desc && <div className="text-[9px] mt-0.5" style={{ color: categoryAccent[p.category] }}>{p.desc}</div>}
                  <div className="text-[8px] mt-1.5" style={{ color: categoryAccent[p.category] }}>
                    {categoryLabel(p.category)}{p.endAt && ` · تا ${formatDateTime(p.endAt)}`}
                  </div>
                </div>

                <div className="bg-white p-3">
                  {!isRejecting ? (
                    <>
                      <label className="flex items-center gap-2 rounded-lg px-2.5 py-2 mb-2.5" style={{ background: 'rgba(190,156,119,0.1)' }}>
                        <input
                          type="checkbox"
                          checked={paid}
                          onChange={(e) => setPaymentChecks((prev) => ({ ...prev, [p.id]: e.target.checked }))}
                          style={{ width: '14px', height: '14px' }}
                        />
                        <span className="text-[9px] font-bold" style={{ color: '#8a6d4d' }}>پرداخت این غرفه‌دار دریافت شد</span>
                      </label>
                      {capWarning && (
                        <div className="text-[8.5px] mb-2 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(217,83,79,0.1)', color: '#d9534f' }}>
                          {capWarning}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => approve(p.id)}
                          disabled={!paid}
                          className="flex-[2] rounded-full py-2 font-bold text-[10px]"
                          style={{ background: paid ? '#be9c77' : '#6b6375', color: paid ? '#1b2134' : '#fff', border: 'none', cursor: paid ? 'pointer' : 'not-allowed' }}
                        >
                          تایید پرداخت و انتشار
                        </button>
                        <button
                          onClick={() => startReject(p.id)}
                          className="flex-1 rounded-full py-2 font-bold text-[10px]"
                          style={{ background: 'rgba(217,83,79,0.1)', color: '#c76b5f', border: 'none', cursor: 'pointer' }}
                        >
                          رد درخواست
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[9px] font-bold mb-1.5" style={{ color: '#1b2134' }}>دلیل رد درخواست</div>
                      <select
                        value={reasonPreset}
                        onChange={(e) => setReasonPreset(e.target.value)}
                        className="w-full bg-white rounded-lg px-2.5 py-2 text-[10px] mb-2"
                        style={{ color: '#1b2134', border: '1px solid rgba(0,0,0,0.1)' }}
                      >
                        {rejectionPresets.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      {reasonPreset === 'سایر' && (
                        <textarea
                          value={reasonText}
                          onChange={(e) => setReasonText(e.target.value)}
                          placeholder="دلیل رد را بنویسید"
                          className="w-full bg-white rounded-lg px-2.5 py-2 text-[10px] mb-2 outline-none"
                          style={{ color: '#1b2134', border: '1px solid rgba(0,0,0,0.1)', minHeight: '50px' }}
                        />
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRejectingId(null)}
                          className="flex-1 rounded-full py-2 font-bold text-[10px]"
                          style={{ background: 'rgba(0,0,0,0.06)', color: '#1b2134', border: 'none', cursor: 'pointer' }}
                        >
                          انصراف
                        </button>
                        <button
                          onClick={() => confirmReject(p.id)}
                          disabled={reasonPreset === 'سایر' && !reasonText.trim()}
                          className="flex-[2] rounded-full py-2 font-bold text-[10px]"
                          style={{ background: '#c76b5f', color: '#fff', border: 'none', cursor: 'pointer' }}
                        >
                          ثبت رد درخواست
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {reviewed.length > 0 && (
          <>
            <div className="text-[9.5px] font-bold mb-2 px-0.5" style={{ color: '#e8cfa8' }}>تاریخچه‌ی بررسی‌شده‌ها</div>
            <div className="flex flex-col gap-2">
              {reviewed.map((r) => (
                <div key={r.id} className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-bold" style={{ color: '#fff' }}>{r.title}</span>
                    <span
                      className="text-[7.5px] font-bold px-2 py-0.5 rounded-md"
                      style={{
                        background: r.requestStatus === 'approved' ? '#e3f0e0' : 'rgba(155,155,175,0.15)',
                        color: r.requestStatus === 'approved' ? '#3f6b4d' : '#9b9baf',
                      }}
                    >
                      {r.requestStatus === 'approved' ? 'تایید و منتشر شد' : 'رد شد'}
                    </span>
                  </div>
                  <div className="text-[8px] mt-1" style={{ color: '#9b9baf' }}>{r.companyName}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
