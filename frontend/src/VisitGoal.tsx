import { useState } from 'react'
import BackButton from './BackButton'

const goals = [
  { id: 'booths', label: 'بازدید از غرفه‌ها و خدمات' },
  { id: 'tools', label: 'آشنایی با ابزارهای مالی جدید' },
  { id: 'investment', label: 'آشنایی با فرصت‌های سرمایه‌گذاری' },
  { id: 'business', label: 'ایجاد تعاملات جدید تجاری' },
  { id: 'reunions', label: 'تجدید دیدارها' },
  { id: 'panels', label: 'شرکت در پنل‌های تخصصی' },
  { id: 'industry', label: 'کسب اطلاعات از صنعت' },
]

function VisitGoal({
  onContinue,
  onBack,
}: {
  onContinue: (selected: string[]) => void
  onBack: () => void
}) {
  const [selected, setSelected] = useState<string[]>([])
  const [hovered, setHovered] = useState<string | null>(null)

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const glowShadow =
    '0 0 8px 2px rgba(190,156,119,0.5), 0 0 22px 6px rgba(190,156,119,0.35)'
  const selectShadow = '0 0 6px 1px rgba(190,156,119,0.4)'

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start relative overflow-hidden px-6 py-16"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={onBack} />

      <div
        className="absolute rounded-full"
        style={{
          width: '400px',
          height: '400px',
          top: '-100px',
          left: '-100px',
          background: '#be9c77',
          opacity: 0.08,
          filter: 'blur(80px)',
        }}
      ></div>

      <div className="text-sm font-bold mb-4 text-center z-10" style={{ color: '#be9c77' }}>
        هدف شما از حضور در نمایشگاه چیست؟
      </div>
      <p className="text-xs mb-4 text-center z-10" style={{ color: '#9b9baf' }}>
        می‌توانید بیش از یک گزینه را انتخاب کنید
      </p>

      <div className="flex flex-col gap-3 w-full max-w-md z-10">
        {goals.map((g) => {
          const isSelected = selected.includes(g.id)
          const isHovered = hovered === g.id
          const active = isSelected || isHovered
          return (
            <div
              key={g.id}
              onClick={() => toggle(g.id)}
              onMouseEnter={() => setHovered(g.id)}
              onMouseLeave={() => setHovered(null)}
              className="bg-white rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all"
              style={{
                border: `1.5px solid ${active ? '#be9c77' : 'transparent'}`,
                boxShadow: isHovered ? glowShadow : isSelected ? selectShadow : 'none',
              }}
            >
              <span className="text-sm font-semibold" style={{ color: '#1b2134' }}>{g.label}</span>
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ border: '2px solid #be9c77', background: isSelected ? '#be9c77' : 'transparent' }}
              >
                {isSelected && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1b2134" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => {
          if (selected.length === 0) return
          onContinue(selected)
        }}
        disabled={selected.length === 0}
        className="mt-8 rounded-full px-10 py-3 font-bold text-sm z-10"
        style={{
          background: selected.length === 0 ? '#6b6375' : '#be9c77',
          color: '#1b2134',
          border: 'none',
          cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        ادامه
      </button>
    </div>
  )
}

export default VisitGoal