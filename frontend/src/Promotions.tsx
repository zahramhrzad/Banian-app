import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { type Promotion, categoryColor } from './Promotion'

interface PromotionsProps {
  promotions: Promotion[]
  savedIds: Set<string>
  onToggleSave: (id: string) => void
  onOpenCompany: (company: string) => void
  onBack: () => void
}

function CategoryIcon({ category }: { category: Promotion['category'] }) {
  if (category === 'bank') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a6d4d" strokeWidth="1.6">
        <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
      </svg>
    )
  }
  if (category === 'insurance') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a6d4d" strokeWidth="1.6">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a6d4d" strokeWidth="1.6">
      <path d="M3 3v18h18M7 14l4-4 3 3 5-6" />
    </svg>
  )
}

export default function Promotions({ promotions, savedIds, onToggleSave, onOpenCompany, onBack }: PromotionsProps) {
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
        <PageTitle>پروموشن‌های نمایشگاه</PageTitle>

        {promotions.length === 0 ? (
          <div className="text-center py-10 text-xs" style={{ color: '#9b9baf' }}>
            در حال حاضر پروموشنی فعال نیست
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {promotions.map((p) => {
              const isSaved = savedIds.has(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => onOpenCompany(p.company)}
                  className="w-full bg-white rounded-2xl px-3.5 py-3 flex items-center gap-2.5 text-right"
                >
                  <div
                    className="rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ width: '38px', height: '38px', background: categoryColor[p.category] }}
                  >
                    <CategoryIcon category={p.category} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px]" style={{ color: '#9b9baf' }}>{p.company}</div>
                    <div className="text-[11.5px] font-bold" style={{ color: '#1b2134' }}>{p.title}</div>
                    <div className="text-[9px] mt-0.5" style={{ color: '#6b6375' }}>{p.desc}</div>
                  </div>
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleSave(p.id)
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={isSaved ? '#8a6d4d' : 'none'}
                      stroke="#c9c3b8"
                      strokeWidth="1.8"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}