import { useState } from 'react'
import BackButton from './BackButton'

const categories = [
  { id: 'bank', label: 'بانک، اعتبار و پرداخت' },
  { id: 'capital', label: 'بازار سرمایه و سرمایه‌گذاری' },
  { id: 'insurance', label: 'بیمه و مدیریت ریسک' },
  { id: 'infra', label: 'زیرساخت، فناوری و نهادهای پشتیبان' },
]

function VisitPriority({
  userType,
  onContinue,
  onBack,
}: {
  userType: 'visitor' | 'exhibitor'
  onContinue: (selectedCategories: string[]) => void
  onBack: () => void
}) {
  const isExhibitor = userType === 'exhibitor'
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
        ضمن عرض خیر مقدم
        <br />
        {isExhibitor
          ? 'لطفاً بفرمایید در کدام حوزه فعالیت دارید؟'
          : 'لطفاً بفرمایید کدام حوزه‌ی فعالیت برای شما در اولویت است؟'}
      </div>

      <p className="text-xs mb-4 text-center z-10" style={{ color: '#9b9baf' }}>
        می‌توانید چند گزینه را انتخاب کنید
      </p>

      <div className="flex flex-col gap-3 w-full max-w-md z-10">
        {categories.map((c) => {
          const isSelected = selected.includes(c.id)
          const isHovered = hovered === c.id
          const active = isSelected || isHovered
          return (
            <div
              key={c.id}
              onClick={() => toggle(c.id)}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              className="bg-white rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all"
              style={{
                border: `1.5px solid ${active ? '#be9c77' : 'transparent'}`,
                boxShadow: isHovered ? glowShadow : isSelected ? selectShadow : 'none',
              }}
            >
              <span className="text-sm font-semibold" style={{ color: '#1b2134' }}>{c.label}</span>
              <span
                className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                style={{
                  borderRadius: '6px',
                  border: '2px solid #be9c77',
                  background: isSelected ? '#be9c77' : 'transparent',
                }}
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

export default VisitPriority
