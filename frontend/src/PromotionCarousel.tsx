import { useEffect, useRef, useState } from 'react'
import { type Promotion, categoryGradient, categoryAccent } from './Promotion'

interface PromotionCarouselProps {
  promotions: Promotion[]
  savedIds: Set<string>
  onToggleSave: (id: string) => void
  onOpenCompany: (company: string) => void
  onViewAll: () => void
}

export default function PromotionCarousel({
  promotions,
  savedIds,
  onToggleSave,
  onOpenCompany,
  onViewAll,
}: PromotionCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (promotions.length <= 1 || isPaused) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % promotions.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [promotions.length, isPaused])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[activeIndex] as HTMLElement | undefined
    if (card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' })
    }
  }, [activeIndex])

  if (promotions.length === 0) return null

  return (
    <div className="mb-4.5">
      <div dir="rtl" className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-bold" style={{ color: '#e8cfa8' }}>پیشنهادهای ویژه</span>
        <button onClick={onViewAll} className="text-[9px]" style={{ color: '#8a91b0', background: 'none', border: 'none', cursor: 'pointer' }}>
          مشاهده همه ›
        </button>
      </div>

      <div
        ref={trackRef}
        dir="rtl"
        className="flex gap-2.5 overflow-x-auto pb-1.5"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        onTouchStart={() => setIsPaused(true)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {promotions.map((p) => {
          const isSaved = savedIds.has(p.id)
          const accent = categoryAccent[p.category]
          return (
            <div
              key={p.id}
              onClick={() => onOpenCompany(p.company)}
              className="rounded-2xl cursor-pointer flex-shrink-0 relative overflow-hidden"
              style={{
                width: '84%',
                scrollSnapAlign: 'start',
                boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
              }}
            >
              {p.backgroundImage && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${p.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(2px) brightness(0.95)',
                  }}
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background: categoryGradient[p.category],
                  opacity: p.backgroundImage ? 0.82 : 1,
                }}
              />

              <div className="relative px-4.5 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[9.5px] font-bold" style={{ color: accent }}>{p.company}</span>
                      {p.urgencyLabel && (
                        <span
                          className="text-[7.5px] font-bold rounded-full flex items-center gap-1"
                          style={{
                            background: '#c76b5f',
                            color: '#fff',
                            padding: '3px 7px 3px 6px',
                            boxShadow: '0 3px 8px rgba(199,107,95,0.4)',
                          }}
                        >
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 3" />
                          </svg>
                          {p.urgencyLabel.replace('⏱', '').trim()}
                        </span>
                      )}
                    </div>
                    <div className="text-[14px] font-extrabold mb-1 leading-snug" style={{ color: '#1b2134' }}>{p.title}</div>
                    <div className="text-[9.5px]" style={{ color: '#5b5347' }}>{p.desc}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleSave(p.id)
                    }}
                    className="mt-0.5 flex-shrink-0"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-label={isSaved ? 'حذف از ذخیره‌شده‌ها' : 'ذخیره‌ی پروموشن'}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill={isSaved ? accent : 'none'} stroke={accent} strokeWidth="1.8">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {promotions.length > 1 && (
        <div dir="rtl" className="flex justify-center gap-1.5 mt-2">
          {promotions.map((p, i) => (
            <div
              key={p.id}
              className="rounded-full"
              style={{ width: '5px', height: '5px', background: i === activeIndex ? '#be9c77' : 'rgba(255,255,255,0.25)', transition: 'background 0.3s' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}