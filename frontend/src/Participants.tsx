import { useState } from 'react'
import BackButton from './BackButton'

export type Company = {
  id: string
  name: string
  hall: string
  category: 'bank' | 'capital' | 'insurance' | 'infra'
  popularity: number
}

export const categoryLabel: Record<string, string> = {
  bank: 'بانک، اعتبار و پرداخت',
  capital: 'بازار سرمایه و سرمایه‌گذاری',
  insurance: 'بیمه و مدیریت ریسک',
  infra: 'زیرساخت، فناوری و نهادهای پشتیبان',
}

export const companiesDirectory: Company[] = [
  { id: 'c1', name: 'بانک ملت', hall: '۵', category: 'bank', popularity: 12 },
  { id: 'c2', name: 'بانک آینده', hall: '۱۵', category: 'bank', popularity: 30 },
  { id: 'c3', name: 'بانک صادرات', hall: '۵', category: 'bank', popularity: 8 },
  { id: 'c4', name: 'بانک پاسارگاد', hall: '۴۰', category: 'bank', popularity: 22 },
  { id: 'c5', name: 'بیمه ایران', hall: '۶', category: 'insurance', popularity: 15 },
  { id: 'c6', name: 'بیمه دانا', hall: '۶', category: 'insurance', popularity: 6 },
  { id: 'c7', name: 'بیمه پارسیان', hall: '۱۱-۱۲', category: 'insurance', popularity: 10 },
  { id: 'c8', name: 'کارگزاری مفید', hall: '۸-۹', category: 'capital', popularity: 25 },
  { id: 'c9', name: 'کارگزاری آگاه', hall: '۸-۹', category: 'capital', popularity: 18 },
  { id: 'c10', name: 'بورس کالای ایران', hall: '۳۵', category: 'capital', popularity: 14 },
  { id: 'c11', name: 'فینوتک', hall: '۱۳-۱۴', category: 'infra', popularity: 9 },
  { id: 'c12', name: 'شاپرک', hall: '۱۳-۱۴', category: 'infra', popularity: 20 },
  { id: 'c13', name: 'شرکت پرداخت الکترونیک', hall: '۱۰', category: 'infra', popularity: 5 },
  { id: 'c14', name: 'بیمه‌ی البرز', hall: '۷', category: 'insurance', popularity: 11 },
  { id: 'c15', name: 'غرفه‌ی نمونه', hall: '۱', category: 'infra', popularity: 3 },
]

const categories: { id: 'bank' | 'capital' | 'insurance' | 'infra'; label: string }[] = [
  { id: 'bank', label: categoryLabel.bank },
  { id: 'insurance', label: categoryLabel.insurance },
  { id: 'capital', label: 'بازار سرمایه' },
  { id: 'infra', label: 'زیرساخت و فناوری' },
]

const glowShadow = '0 0 6px 1px rgba(190,156,119,0.5), 0 0 16px 4px rgba(190,156,119,0.3)'

interface ParticipantsProps {
  onBack: () => void
  onOpenProfile: (companyName: string) => void
  savedCompanyNames: Set<string>
  onToggleSave: (companyName: string) => void
}

function Participants({ onBack, onOpenProfile, savedCompanyNames, onToggleSave }: ParticipantsProps) {
  const [search, setSearch] = useState('')
  const [activeCategories, setActiveCategories] = useState<string[]>([])
  const [onlySaved, setOnlySaved] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'popularity'>('name')

  const toggleCategory = (id: string) => {
    setActiveCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const toggleSave = (c: Company) => {
    const wasSaved = savedCompanyNames.has(c.name)
    onToggleSave(c.name)
    if (!wasSaved) {
      alert('«' + c.name + '» به لیست ذخیره‌شده‌های شما اضافه شد')
    }
  }

  const shareCompany = (c: Company) => {
    alert('اطلاعات «' + c.name + '» برای اشتراک‌گذاری آماده شد (پیامک / واتس‌اپ)')
  }

  let filtered = companiesDirectory.filter((c) => {
    const matchesCategory = activeCategories.length === 0 || activeCategories.includes(c.category)
    const matchesSearch = c.name.includes(search.trim())
    const matchesSaved = !onlySaved || savedCompanyNames.has(c.name)
    return matchesCategory && matchesSearch && matchesSaved
  })

  filtered = [...filtered].sort((a, b) =>
    sortBy === 'name' ? a.name.localeCompare(b.name, 'fa') : b.popularity - a.popularity
  )

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
        <div className="text-sm font-bold mb-4 text-center" style={{ color: '#be9c77' }}>
          مشارکت‌کنندگان
        </div>

        <div className="bg-white rounded-xl flex items-center gap-2 px-3 py-2.5 mb-3">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جست‌وجوی نام شرکت..."
            className="flex-1 text-xs outline-none border-none"
            style={{ color: '#1b2134' }}
          />
        </div>

        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => {
            const active = activeCategories.includes(cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className="flex-shrink-0 rounded-full px-3.5 py-1.5 text-[10px] font-bold whitespace-nowrap"
                style={{
                  background: active ? '#be9c77' : '#ffffff18',
                  color: active ? '#1b2134' : '#e8cfa8',
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="text-[10px]" style={{ color: '#9b9baf' }}>{filtered.length} شرکت یافت شد</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOnlySaved((v) => !v)}
              className="flex items-center gap-1.5"
            >
              <span className="text-[9.5px]" style={{ color: '#e8cfa8' }}>فقط ذخیره‌شده‌ها</span>
              <span
                className="relative rounded-full"
                style={{ width: '28px', height: '16px', background: onlySaved ? '#be9c77' : '#ffffff30', transition: 'background .2s' }}
              >
                <span
                  className="absolute rounded-full bg-white"
                  style={{ width: '12px', height: '12px', top: '2px', right: onlySaved ? '14px' : '2px', transition: 'right .2s' }}
                ></span>
              </span>
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'popularity')}
              className="text-[9.5px] bg-transparent outline-none"
              style={{ color: '#e8cfa8' }}
            >
              <option value="name" style={{ color: '#000' }}>مرتب‌سازی: الفبا</option>
              <option value="popularity" style={{ color: '#000' }}>محبوب‌ترین‌ها</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <div className="text-center py-8 text-xs" style={{ color: '#9b9baf' }}>
              نتیجه‌ای یافت نشد
            </div>
          )}
          {filtered.map((c) => {
            const isSaved = savedCompanyNames.has(c.name)
            return (
              <button
                key={c.id}
                onClick={() => onOpenProfile(c.name)}
                className="bg-white rounded-2xl px-3.5 py-3 flex items-center gap-2.5 text-right cursor-pointer"
              >
                <div
                  className="rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ width: '34px', height: '34px', background: '#f3e8dc' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6">
                    <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
                  </svg>
                </div>

                <div className="flex-1">
                  <div className="text-xs font-bold" style={{ color: '#1b2134' }}>{c.name}</div>
                  <div className="text-[9.5px] mt-0.5" style={{ color: '#9b9baf' }}>
                    سالن {c.hall} · {categoryLabel[c.category]}
                  </div>
                </div>

                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    shareCompany(c)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.stopPropagation()
                      shareCompany(c)
                    }
                  }}
                  className="rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ width: '30px', height: '30px', background: '#f3e8dc', cursor: 'pointer' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.8">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <path d="M8.6 10.6l6.8-3.8M8.6 13.4l6.8 3.8" />
                  </svg>
                </span>

                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSave(c)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.stopPropagation()
                      toggleSave(c)
                    }
                  }}
                  className="rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '34px',
                    height: '34px',
                    background: isSaved ? '#be9c77' : '#f3e8dc',
                    boxShadow: isSaved ? glowShadow : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill={isSaved ? '#1b2134' : 'none'}
                    stroke="#be9c77"
                    strokeWidth="1.8"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                  </svg>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Participants
