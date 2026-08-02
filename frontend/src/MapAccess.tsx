import { useState } from 'react'
import BackButton from './BackButton'

type Hall = {
  id: string
  x: number
  y: number
  w: number
  h: number
  category: 'bank' | 'insurance' | 'capital' | 'infra' | 'you'
  label: string
}

const categoryColor: Record<string, string> = {
  bank: '#f3e8dc',
  insurance: '#dbe8f7',
  capital: '#e3f0e0',
  infra: '#eee2f2',
  you: '#be9c77',
}

const categoryLabel: Record<string, string> = {
  bank: 'بانک، اعتبار و پرداخت',
  insurance: 'بیمه و مدیریت ریسک',
  capital: 'بازار سرمایه و سرمایه‌گذاری',
  infra: 'زیرساخت، فناوری و نهادهای پشتیبان',
  you: 'موقعیت شما',
}

const halls: Hall[] = [
  { id: '5', x: 45, y: 20, w: 35, h: 26, category: 'bank', label: '۵' },
  { id: '6', x: 85, y: 20, w: 35, h: 26, category: 'insurance', label: '۶' },
  { id: '7', x: 125, y: 20, w: 35, h: 26, category: 'capital', label: '۷' },
  { id: '8-9', x: 165, y: 20, w: 45, h: 26, category: 'infra', label: '۸-۹' },
  { id: '10', x: 215, y: 20, w: 35, h: 26, category: 'bank', label: '۱۰' },
  { id: '11-12', x: 245, y: 60, w: 45, h: 26, category: 'insurance', label: '۱۲-۱۱' },
  { id: '13-14', x: 245, y: 100, w: 45, h: 26, category: 'capital', label: '۱۴-۱۳' },
  { id: '15', x: 245, y: 140, w: 45, h: 26, category: 'bank', label: '۱۵' },
  { id: '38', x: 45, y: 150, w: 45, h: 30, category: 'you', label: '۳۸' },
  { id: '40', x: 95, y: 150, w: 45, h: 30, category: 'bank', label: '۴۰' },
  { id: '41', x: 145, y: 150, w: 45, h: 30, category: 'insurance', label: '۴۱' },
  { id: '35', x: 200, y: 150, w: 45, h: 30, category: 'capital', label: '۳۵' },
]

const boothData: Record<string, string[]> = {
  '5': ['بانک ملت', 'بانک صادرات'],
  '6': ['بیمه ایران', 'بیمه دانا'],
  '7': ['شرکت فناوران داده', 'هلدینگ سرمایه‌گذاری آینده'],
  '8-9': ['کارگزاری مفید', 'کارگزاری آگاه'],
  '10': ['شرکت پرداخت الکترونیک'],
  '11-12': ['صندوق بازنشستگی کشوری', 'بیمه پارسیان'],
  '13-14': ['فینوتک', 'شاپرک'],
  '15': ['بانک آینده'],
  '38': ['شرکت بانیان (شما اینجایید)'],
  '40': ['بانک پاسارگاد', 'بیمه البرز'],
  '41': ['گروه مالی سامان'],
  '35': ['بورس کالای ایران'],
}

const savedBooths = ['بانک آینده', 'بانک پاسارگاد']

function MapAccess({ onBack }: { onBack: () => void }) {
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null)
  const [search, setSearch] = useState('')
  const [zoom, setZoom] = useState(1)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  const matchingHallId = (() => {
    if (!search.trim()) return null
    const q = search.trim()
    for (const hallId in boothData) {
      if (boothData[hallId].some((b) => b.includes(q))) return hallId
    }
    return null
  })()

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
          نقشه و دسترسی
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

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setViewMode('map')}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: viewMode === 'map' ? '#be9c77' : '#ffffff22', color: viewMode === 'map' ? '#1b2134' : '#9b9baf' }}
          >
            نمای نقشه
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: viewMode === 'list' ? '#be9c77' : '#ffffff22', color: viewMode === 'list' ? '#1b2134' : '#9b9baf' }}
          >
            نمای لیستی
          </button>
        </div>

        {viewMode === 'map' ? (
          <div className="bg-white rounded-2xl p-3 mb-4">
            <div className="flex justify-end gap-2 mb-2">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold"
                style={{ background: '#f3e8dc', color: '#1b2134' }}
              >
                +
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.7))}
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold"
                style={{ background: '#f3e8dc', color: '#1b2134' }}
              >
                −
              </button>
            </div>

            <div style={{ overflow: 'hidden' }}>
              <svg
                width="100%"
                height="220"
                viewBox="0 0 300 200"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform .2s' }}
              >
                <rect x="6" y="6" width="288" height="175" rx="10" fill="#fafafa" stroke="#ddd" strokeWidth="1" />
                <circle cx="150" cy="95" r="24" fill="#f3e8dc" stroke="#be9c77" strokeWidth="1" />
                <text x="150" y="98" fontSize="7" fill="#be9c77" textAnchor="middle">میدان مرکزی</text>

                {halls.map((h) => {
                  const isSaved = boothData[h.id]?.some((b) => savedBooths.includes(b))
                  const isMatch = matchingHallId === h.id
                  return (
                    <g key={h.id} onClick={() => setSelectedHall(h)} style={{ cursor: 'pointer' }}>
                      <rect
                        x={h.x}
                        y={h.y}
                        width={h.w}
                        height={h.h}
                        rx="3"
                        fill={categoryColor[h.category]}
                        stroke={isMatch ? '#e08b8b' : '#be9c77'}
                        strokeWidth={isMatch ? 2.5 : 1}
                      />
                      <text x={h.x + h.w / 2} y={h.y + h.h / 2 + 3} fontSize="8" fill={h.category === 'you' ? '#fff' : '#1b2134'} textAnchor="middle" style={{ pointerEvents: 'none' }}>
                        {h.label}
                      </text>
                      {isSaved && (
                        <text x={h.x + h.w - 6} y={h.y + 8} fontSize="9" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                          ★
                        </text>
                      )}
                    </g>
                  )
                })}

                <text x="150" y="192" fontSize="7" fill="#9b9baf" textAnchor="middle">درب شمالی (ورودی اصلی) ↑</text>
              </svg>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 pt-2" style={{ borderTop: '1px solid #eee' }}>
              {(['bank', 'insurance', 'capital', 'infra'] as const).map((c) => (
                <div key={c} className="flex items-center gap-1">
                  <span style={{ width: 9, height: 9, background: categoryColor[c], border: '1px solid #be9c77', borderRadius: 2, display: 'inline-block' }}></span>
                  <span style={{ fontSize: 8, color: '#666' }}>{categoryLabel[c]}</span>
                </div>
              ))}
              <div className="flex items-center gap-1">
                <span style={{ fontSize: 9 }}>★</span>
                <span style={{ fontSize: 8, color: '#666' }}>در قرارهای من</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex flex-col gap-2">
            {halls.map((h) => (
              <button
                key={h.id}
                onClick={() => setSelectedHall(h)}
                className="w-full bg-white rounded-xl px-3 py-2.5 flex items-center justify-between text-right"
              >
                <span className="text-xs font-bold" style={{ color: '#1b2134' }}>سالن {h.label}</span>
                <span style={{ fontSize: 9, color: '#9b9baf' }}>{categoryLabel[h.category]}</span>
              </button>
            ))}
          </div>
        )}

        {selectedHall && (
          <div className="bg-white rounded-2xl p-3.5 mb-4">
            <div className="text-xs font-bold mb-2" style={{ color: '#1b2134' }}>
              غرفه‌های سالن {selectedHall.label}
            </div>
            <div className="flex flex-col gap-2">
              {(boothData[selectedHall.id] || []).map((b) => (
                <div key={b} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: '#f3e8dc' }}>
                  <span style={{ fontSize: 10.5, color: '#1b2134' }}>
                    {savedBooths.includes(b) ? '★ ' : ''}
                    {b}
                  </span>
                  <button
                    onClick={() => alert('مسیر پیشنهادی تا «' + b + '» روی نقشه نمایش داده می‌شود')}
                    className="text-[9px] font-bold rounded-md px-2 py-1"
                    style={{ background: '#be9c77', color: '#1b2134' }}
                  >
                    مسیریابی
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-3.5">
          <div className="text-xs font-bold mb-2" style={{ color: '#be9c77' }}>مترو</div>
          <div className="bg-white rounded-xl px-3.5 py-2.5 mb-2">
            <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>ایستگاه تجریش</div>
            <div className="text-[9.5px]" style={{ color: '#9b9baf' }}>خط ۱ - ایستگاه پایانه</div>
          </div>
          <div className="bg-white rounded-xl px-3.5 py-2.5">
            <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>ایستگاه شهید حقانی</div>
            <div className="text-[9.5px]" style={{ color: '#9b9baf' }}>خط ۱</div>
          </div>
        </div>

        <div className="mb-3.5">
          <div className="text-xs font-bold mb-2" style={{ color: '#be9c77' }}>اتوبوس تندرو (BRT)</div>
          <div className="bg-white rounded-xl px-3.5 py-2.5">
            <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>ایستگاه نمایشگاه بین‌المللی تهران</div>
            <div className="text-[9.5px]" style={{ color: '#9b9baf' }}>مقابل درب اصلی نمایشگاه</div>
          </div>
        </div>

        <div className="mb-3.5">
          <div className="text-xs font-bold mb-2" style={{ color: '#be9c77' }}>پارکینگ‌ها</div>
          <div className="bg-white rounded-xl px-3.5 py-2.5 mb-2 flex justify-between">
            <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>پارکینگ غربی</span>
            <span className="text-[9.5px]" style={{ color: '#9b9baf' }}>نزدیک هتل آزادی</span>
          </div>
          <div className="bg-white rounded-xl px-3.5 py-2.5 flex justify-between">
            <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>پارکینگ جنوبی</span>
            <span className="text-[9.5px]" style={{ color: '#9b9baf' }}>نزدیک درب جنوبی</span>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold mb-2" style={{ color: '#be9c77' }}>رستوران و بوفه</div>
          <div className="bg-white rounded-xl px-3.5 py-2.5">
            <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>رستوران بزرگ نمایشگاه</div>
            <div className="text-[9.5px]" style={{ color: '#9b9baf' }}>مجاور سالن‌های ۳۸ و ۴۰</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapAccess