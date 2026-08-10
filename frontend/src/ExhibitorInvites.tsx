import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'

export interface SentInvite {
  id: string
  phone: string
  code: string
  sentAt: number
}

const toFa = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

function generateCode() {
  const random = Math.floor(1000 + Math.random() * 9000)
  return `INV-${random}`
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('fa-IR')
}

export default function ExhibitorInvites({
  quota,
  setQuota,
  sentInvites,
  setSentInvites,
  onBack,
}: {
  quota: number
  setQuota: React.Dispatch<React.SetStateAction<number>>
  sentInvites: SentInvite[]
  setSentInvites: React.Dispatch<React.SetStateAction<SentInvite[]>>
  onBack: () => void
}) {
  const [phone, setPhone] = useState('')
  const [editingQuota, setEditingQuota] = useState(false)
  const [quotaInput, setQuotaInput] = useState(String(quota))
  const [justSentPhone, setJustSentPhone] = useState<string | null>(null)

  const remaining = quota - sentInvites.length
  const canSend = phone.trim().length >= 9 && remaining > 0

  const handleSend = () => {
    if (!canSend) return
    const code = generateCode()
    setSentInvites((prev) => [{ id: Date.now().toString(), phone: phone.trim(), code, sentAt: Date.now() }, ...prev])
    setJustSentPhone(phone.trim())
    setPhone('')
    setTimeout(() => setJustSentPhone(null), 3500)
  }

  const saveQuota = () => {
    const n = Number(quotaInput)
    if (!isNaN(n) && n >= sentInvites.length) {
      setQuota(n)
    } else {
      setQuotaInput(String(quota))
    }
    setEditingQuota(false)
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
        <PageTitle>ارسال کد دعوت</PageTitle>
        <p className="text-[10px] text-center mb-4" style={{ color: '#9b9baf' }}>
          افرادی که کد معتبر داشته باشند، ورودشان به نمایشگاه رایگان خواهد بود
        </p>

        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px]" style={{ color: '#9b9baf' }}>باقی‌مانده از سقف کل</span>
            {!editingQuota && (
              <button
                onClick={() => {
                  setQuotaInput(String(quota))
                  setEditingQuota(true)
                }}
                className="text-[9px] underline"
                style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ویرایش سقف
              </button>
            )}
          </div>

          {editingQuota ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                value={quotaInput}
                onChange={(e) => setQuotaInput(e.target.value)}
                className="flex-1 rounded-lg px-3 py-2 text-xs outline-none"
                style={{ color: '#1b2134' }}
              />
              <button
                onClick={saveQuota}
                className="text-[10px] font-bold px-3 py-2 rounded-lg"
                style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
              >
                ذخیره
              </button>
            </div>
          ) : (
            <>
              <div className="text-lg font-extrabold" style={{ color: '#fff' }}>
                {toFa(Math.max(remaining, 0))}{' '}
                <span className="text-[10px] font-normal" style={{ color: '#9b9baf' }}>از {toFa(quota)}</span>
              </div>
              <div className="rounded-full mt-2 overflow-hidden" style={{ height: '6px', background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min((sentInvites.length / quota) * 100, 100)}%`, background: '#be9c77' }}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 mb-2">
          <div className="flex-1 bg-white rounded-xl flex items-center gap-2 px-3.5 py-3" dir="ltr">
            <span className="text-sm" style={{ color: '#9b9baf' }}>+98</span>
            <div className="w-px h-5" style={{ background: '#e0e0e0' }}></div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend()
              }}
              placeholder="912 345 6789"
              className="flex-1 text-sm outline-none border-none"
              style={{ color: '#1b2134' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="rounded-xl px-5 text-xs font-bold"
            style={{
              background: canSend ? '#be9c77' : '#6b6375',
              color: '#1b2134',
              border: 'none',
              cursor: canSend ? 'pointer' : 'not-allowed',
            }}
          >
            ارسال کد
          </button>
        </div>

        {remaining <= 0 && (
          <div className="text-[9.5px] mb-2" style={{ color: '#d9534f' }}>
            سقف کد دعوت شما تمام شده است
          </div>
        )}

        {justSentPhone && (
          <div className="flex items-center gap-1.5 mb-4">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#7d9a86' }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[9.5px]" style={{ color: '#7d9a86' }}>
              کد به {justSentPhone} ارسال شد
            </span>
          </div>
        )}

        <div className="text-[10px] font-bold mb-2 mt-4" style={{ color: '#e8cfa8' }}>
          تاریخچه‌ی کدهای ارسالی
        </div>

        {sentInvites.length === 0 && (
          <p className="text-[10.5px] text-center py-4" style={{ color: '#9b9baf' }}>
            هنوز کدی ارسال نکرده‌اید
          </p>
        )}

        <div className="flex flex-col gap-2">
          {sentInvites.map((inv) => (
            <div key={inv.id} className="bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-between">
              <span className="text-xs font-bold" dir="ltr" style={{ color: '#1b2134' }}>{inv.phone}</span>
              <div className="text-left">
                <div className="text-[10px] font-bold" dir="ltr" style={{ color: '#8a6d4d' }}>{inv.code}</div>
                <div className="text-[8.5px]" style={{ color: '#9b9baf' }}>{formatDate(inv.sentAt)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}