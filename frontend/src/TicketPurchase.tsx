import { useState } from 'react'
import BackButton from './BackButton'

const TICKET_PRICE = 450000

const DAYS = [
  { id: 1, label: 'روز اول', date: '۱۲ آذر' },
  { id: 2, label: 'روز دوم', date: '۱۳ آذر' },
  { id: 3, label: 'روز سوم', date: '۱۴ آذر' },
  { id: 4, label: 'روز چهارم', date: '۱۵ آذر' },
]

interface TicketDraft {
  id: number
  name: string
  dayId: number
}

export interface TicketPurchaseResult {
  name: string
  date: string
}

interface TicketPurchaseProps {
  buyerName: string
  onPaymentInitiate: (tickets: TicketPurchaseResult[], totalPrice: number) => void
  onBack: () => void
}

export default function TicketPurchase({ buyerName, onPaymentInitiate, onBack }: TicketPurchaseProps) {
  const [drafts, setDrafts] = useState<TicketDraft[]>([{ id: 1, name: '', dayId: 1 }])
  const [nextId, setNextId] = useState(2)

  const addTicket = () => {
    if (drafts.length >= 8) return
    setDrafts((prev) => [...prev, { id: nextId, name: '', dayId: 1 }])
    setNextId((n) => n + 1)
  }

  const removeTicket = (id: number) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id))
  }

  const setDay = (id: number, dayId: number) => {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, dayId } : d)))
  }

  const setName = (id: number, name: string) => {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)))
  }

  const totalPrice = TICKET_PRICE * drafts.length
  const allValid = drafts.every((d, i) => i === 0 || d.name.trim() !== '')

  const toFa = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
  const formatPrice = (n: number) =>
    n.toLocaleString('en-US').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

  const handlePay = () => {
    if (!allValid) return
    const results: TicketPurchaseResult[] = drafts.map((d, i) => {
      const day = DAYS.find((dd) => dd.id === d.dayId)!
      return {
        name: i === 0 ? buyerName || 'خریدار' : d.name,
        date: `${day.date} ۱۴۰۵`,
      }
    })
    onPaymentInitiate(results, totalPrice)
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={onBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="px-5 pt-6 z-10 flex-1 overflow-y-auto pb-6">
        <div className="text-sm font-bold mb-1 text-center" style={{ color: '#be9c77' }}>
          خرید بلیط نمایشگاه
        </div>
        <p className="text-[10px] text-center mb-4" style={{ color: '#9b9baf' }}>
          هر بلیط فقط برای یک روز و یک‌بار ورود معتبر است
        </p>

        <div className="flex flex-col gap-2.5 mb-2">
          {drafts.map((d, idx) => (
            <div key={d.id} className="bg-white rounded-2xl px-3.5 py-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>
                  بلیط {toFa(idx + 1)}
                </span>
                {drafts.length > 1 && (
                  <button
                    onClick={() => removeTicket(d.id)}
                    className="text-[9px]"
                    style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    حذف
                  </button>
                )}
              </div>
              {idx > 0 && (
                <input
                  value={d.name}
                  onChange={(e) => setName(d.id, e.target.value)}
                  placeholder="نام و نام خانوادگی"
                  className="w-full rounded-lg px-2.5 py-2 text-[11px] mb-2 outline-none"
                  style={{ border: '1px solid #eee', color: '#1b2134' }}
                />
              )}
              <div className="flex gap-1.5 flex-wrap">
                {DAYS.map((day) => {
                  const active = d.dayId === day.id
                  return (
                    <button
                      key={day.id}
                      onClick={() => setDay(d.id, day.id)}
                      className="text-center rounded-lg py-1.5 px-2"
                      style={{
                        flex: '1 1 60px',
                        background: active ? '#be9c77' : '#f3e8dc',
                        color: active ? '#1b2134' : '#8a6d4d',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <div className="text-[9px] font-bold">{day.label}</div>
                      <div className="text-[8px]">{day.date}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addTicket}
          className="w-full rounded-xl py-2.5 mb-4 text-[11px] font-bold"
          style={{ border: '1.5px dashed rgba(190,156,119,0.5)', color: '#be9c77', background: 'transparent', cursor: 'pointer' }}
        >
          + افزودن بلیط دیگر
        </button>

        <div
          className="flex justify-between items-center mb-4 pt-3.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <span className="text-[11px]" style={{ color: '#9b9baf' }}>
            مبلغ قابل پرداخت ({toFa(drafts.length)} بلیط)
          </span>
          <span className="text-[15px] font-extrabold" style={{ color: '#be9c77' }}>
            {formatPrice(totalPrice)} تومان
          </span>
        </div>

        <button
          onClick={handlePay}
          disabled={!allValid}
          className="w-full rounded-full py-3.5 font-bold text-xs flex items-center justify-center gap-1.5"
          style={{
            background: allValid ? '#be9c77' : '#6b6375',
            color: '#1b2134',
            border: 'none',
            cursor: allValid ? 'pointer' : 'not-allowed',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1b2134" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
          </svg>
          پرداخت با زرین‌پال
        </button>
      </div>
    </div>
  )
}