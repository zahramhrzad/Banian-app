import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import TicketCard, { type Ticket } from './TicketCard'

interface MyTicketsProps {
  tickets: Ticket[]
  onBack: () => void
  onBuyNew: () => void
}

const statusLabel: Record<Ticket['status'], { text: string; color: string; bg: string }> = {
  active: { text: 'فعال', color: '#7d9a86', bg: 'rgba(125,154,134,0.12)' },
  used: { text: 'استفاده‌شده', color: '#be9c77', bg: 'rgba(190,156,119,0.12)' },
  expired: { text: 'منقضی', color: '#9b9baf', bg: 'rgba(155,155,175,0.12)' },
}

export default function MyTickets({ tickets, onBack, onBuyNew }: MyTicketsProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const goBack = () => {
    if (selected !== null) setSelected(null)
    else onBack()
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={goBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="px-5 pt-6 z-10 flex-1 overflow-y-auto pb-6">
        {selected === null ? (
          <>
            <PageTitle>بلیط‌های من</PageTitle>
            <p className="text-[10px] text-center mb-4" style={{ color: '#9b9baf' }}>
              {tickets.length} بلیط خریداری‌شده
            </p>

            {tickets.length === 0 ? (
              <div className="text-center py-10 text-xs" style={{ color: '#9b9baf' }}>
                هنوز بلیطی خریداری نکرده‌اید
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {tickets.map((t, i) => {
                  const cfg = statusLabel[t.status]
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelected(i)}
                      className="w-full bg-white rounded-2xl px-3.5 py-3 flex items-center gap-2.5 text-right"
                    >
                      <div
                        className="rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ width: '36px', height: '36px', background: '#f3e8dc' }}
                      >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-[11.5px] font-bold" style={{ color: '#1b2134' }}>بلیط ورود نمایشگاه</div>
                        <div className="text-[9.5px] mt-0.5" style={{ color: '#9b9baf' }}>
                          {t.date} · {t.id}
                        </div>
                      </div>
                      <span
                        className="text-[9px] font-bold rounded-full px-2.5 py-1"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        {cfg.text}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            <button
              onClick={onBuyNew}
              className="w-full rounded-xl py-2.5 mt-4 text-[11px] font-bold"
              style={{ border: '1.5px dashed rgba(190,156,119,0.5)', color: '#be9c77', background: 'transparent', cursor: 'pointer' }}
            >
              + خرید بلیط جدید
            </button>
          </>
        ) : (
          <TicketCard ticket={tickets[selected]} />
        )}
      </div>
    </div>
  )
}