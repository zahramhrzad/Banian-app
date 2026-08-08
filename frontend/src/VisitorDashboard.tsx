import { useState } from 'react'
import logo from './assets/logo.png'
import PromotionCarousel from './PromotionCarousel'
import type { Promotion } from './Promotion'

const glowShadow = '0 0 6px 1px rgba(190,156,119,0.4), 0 0 16px 4px rgba(190,156,119,0.25)'

function VisitorDashboard({
  name,
  onOpenCard,
  onOpenMap,
  onOpenParticipants,
  onOpenPanels,
  onOpenMyAppointments,
  onOpenNotifications,
  promotions,
  savedPromotionIds,
  onTogglePromotionSave,
  onOpenPromotionCompany,
  onOpenPromotions,
}: {
  name: string
  onOpenCard: () => void
  onOpenMap: () => void
  onOpenParticipants: () => void
  onOpenPanels: () => void
  onOpenMyAppointments: () => void
  onOpenNotifications: () => void
  promotions: Promotion[]
  savedPromotionIds: Set<string>
  onTogglePromotionSave: (id: string) => void
  onOpenPromotionCompany: (company: string) => void
  onOpenPromotions: () => void
}) {
  const [glowId, setGlowId] = useState<string | null>(null)

  const appointments = [
    { id: 'appt1', title: 'بانک آینده', sub: 'سالن B - غرفه ۱۲', status: 'درخواست‌شده', type: 'booth' },
    { id: 'appt2', title: 'آینده فین‌تک در ایران', sub: '۲۷ آبان - ساعت ۱۱:۰۰', status: 'ذخیره‌شده', type: 'panel' },
  ]

  const goTo = (page: string) => {
    alert('رفتن به صفحه: ' + page + ' (این صفحه هنوز ساخته نشده)')
  }

  const glowStyle = (id: string) => ({
    border: '1.5px solid ' + (glowId === id ? '#be9c77' : 'transparent'),
    boxShadow: glowId === id ? glowShadow : 'none',
    transition: 'box-shadow .2s, border-color .2s',
  })

  const glowHandlers = (id: string) => ({
    onMouseEnter: () => setGlowId(id),
    onMouseLeave: () => setGlowId(null),
  })

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
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

      <div className="px-5 pt-6 z-10 flex-1 overflow-y-auto pb-4">
        <img src={logo} alt="لوگوی بانیان" className="w-9 h-9 object-contain mx-auto mb-4" />

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-full flex items-center justify-center relative cursor-pointer"
            style={{ background: 'rgba(190,156,119,0.15)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.8">
              <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            </svg>
            <div
              className="absolute rounded-full"
              style={{ width: '6px', height: '6px', top: '5px', right: '5px', background: '#e08b8b' }}
            ></div>
          </button>
          <div>
            <div className="text-xs" style={{ color: '#9b9baf' }}>بازدیدکننده گرامی</div>
            <div className="text-base font-bold" style={{ color: '#be9c77' }}>{name || 'بازدیدکننده'}</div>
          </div>
        </div>

        <PromotionCarousel
          promotions={promotions}
          savedIds={savedPromotionIds}
          onToggleSave={onTogglePromotionSave}
          onOpenCompany={onOpenPromotionCompany}
          onViewAll={onOpenPromotions}
        />

        <button
          onClick={onOpenCard}
          {...glowHandlers('card')}
          className="w-full bg-white rounded-2xl px-3.5 py-3 flex items-center gap-2.5 mb-3.5 cursor-pointer text-right"
          style={glowStyle('card')}
        >
          <div className="w-11 h-11 rounded-lg border flex items-center justify-center flex-shrink-0" style={{ borderColor: '#eee' }}>
            <svg width="34" height="34" viewBox="0 0 100 100">
              <rect width="100" height="100" fill="#fff" />
              <rect x="5" y="5" width="25" height="25" fill="#1b2134" />
              <rect x="70" y="5" width="25" height="25" fill="#1b2134" />
              <rect x="5" y="70" width="25" height="25" fill="#1b2134" />
              <rect x="40" y="40" width="8" height="8" fill="#1b2134" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold" style={{ color: '#1b2134' }}>کارت ورود نمایشگاه</div>
            <div className="text-[9.5px]" style={{ color: '#9b9baf' }}>برای نمایش کامل کلیک کنید</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={onOpenMap}
          {...glowHandlers('map')}
          className="w-full bg-white rounded-2xl p-3 mb-3.5 text-right cursor-pointer"
          style={glowStyle('map')}
        >
          <svg width="100%" height="80" viewBox="0 0 280 80">
            <rect x="5" y="5" width="80" height="32" rx="4" fill="#f3e8dc" stroke="#be9c77" strokeWidth="1" />
            <rect x="95" y="5" width="80" height="32" rx="4" fill="#f3e8dc" stroke="#be9c77" strokeWidth="1" />
            <rect x="185" y="5" width="90" height="32" rx="4" fill="#f3e8dc" stroke="#be9c77" strokeWidth="1" />
            <rect x="5" y="43" width="80" height="32" rx="4" fill="#f3e8dc" stroke="#be9c77" strokeWidth="1" />
            <rect x="95" y="43" width="80" height="32" rx="4" fill="#be9c77" opacity="0.55" />
            <rect x="185" y="43" width="90" height="32" rx="4" fill="#f3e8dc" stroke="#be9c77" strokeWidth="1" />
            <text x="45" y="24" fontSize="9" fill="#1b2134" textAnchor="middle">سالن A</text>
            <text x="135" y="24" fontSize="9" fill="#1b2134" textAnchor="middle">سالن B</text>
            <text x="230" y="24" fontSize="9" fill="#1b2134" textAnchor="middle">سالن C</text>
            <text x="45" y="63" fontSize="9" fill="#1b2134" textAnchor="middle">سالن D</text>
            <text x="135" y="63" fontSize="9" fill="#fff" textAnchor="middle">شما اینجایید</text>
            <text x="230" y="63" fontSize="9" fill="#1b2134" textAnchor="middle">سالن F</text>
          </svg>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[9.5px]" style={{ color: '#9b9baf' }}>نقشه کوچک سالن‌ها</span>
            <span className="text-[9.5px] font-bold" style={{ color: '#be9c77' }}>مشاهده نقشه کامل ›</span>
          </div>
        </button>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={onOpenParticipants}
            {...glowHandlers('exhibitors')}
            className="bg-white rounded-xl py-2.5 px-1 text-center cursor-pointer"
            style={glowStyle('exhibitors')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6" className="mx-auto mb-1.5">
              <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
            </svg>
            <div className="text-[9px] font-bold" style={{ color: '#1b2134' }}>مشارکت‌کنندگان</div>
          </button>
          <button
            onClick={onOpenPanels}
            {...glowHandlers('panels')}
            className="bg-white rounded-xl py-2.5 px-1 text-center cursor-pointer"
            style={glowStyle('panels')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6" className="mx-auto mb-1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M3 10h18M8 2v4M16 2v4" />
            </svg>
            <div className="text-[9px] font-bold" style={{ color: '#1b2134' }}>برنامه پنل‌ها</div>
          </button>
          <button
            onClick={onOpenMap}
            {...glowHandlers('access')}
            className="bg-white rounded-xl py-2.5 px-1 text-center cursor-pointer"
            style={glowStyle('access')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6" className="mx-auto mb-1.5">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z" />
            </svg>
            <div className="text-[9px] font-bold" style={{ color: '#1b2134' }}>نقشه دسترسی</div>
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold" style={{ color: '#be9c77' }}>قرارهای من</div>
            <button
              onClick={onOpenMyAppointments}
              {...glowHandlers('all-appts')}
              className="text-[9.5px] cursor-pointer rounded-md px-1.5 py-0.5"
              style={{ color: '#9b9baf', ...glowStyle('all-appts') }}
            >
              مشاهده همه
            </button>
          </div>

          {appointments.map((a) => (
            <button
              key={a.id}
              onClick={onOpenMyAppointments}
              {...glowHandlers(a.id)}
              className="w-full bg-white rounded-xl px-3 py-2.5 flex items-center gap-2.5 mb-2 text-right cursor-pointer"
              style={glowStyle(a.id)}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#f3e8dc' }}>
                {a.type === 'booth' ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6">
                    <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>{a.title}</div>
                <div className="text-[9px]" style={{ color: '#9b9baf' }}>{a.sub}</div>
              </div>
              <div
                className="text-[8.5px] font-bold"
                style={{ color: a.status === 'درخواست‌شده' ? '#be9c77' : '#9b9baf' }}
              >
                {a.status}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white flex justify-around py-3 border-t z-10" style={{ borderColor: '#eee' }}>
        <button onClick={() => goTo('خانه')} className="text-center cursor-pointer">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="2" className="mx-auto">
            <path d="M3 12l9-9 9 9M5 10v10h14V10" />
          </svg>
          <div className="text-[8.5px] mt-0.5" style={{ color: '#be9c77' }}>خانه</div>
        </button>
        <button onClick={onOpenMyAppointments} className="text-center cursor-pointer">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="2" className="mx-auto">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 10h18" />
          </svg>
          <div className="text-[8.5px] mt-0.5" style={{ color: '#9b9baf' }}>قرارهای من</div>
        </button>
        <button onClick={onOpenCard} className="text-center cursor-pointer">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="2" className="mx-auto">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <div className="text-[8.5px] mt-0.5" style={{ color: '#9b9baf' }}>QR</div>
        </button>
        <button onClick={onOpenNotifications} className="text-center cursor-pointer">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="2" className="mx-auto">
            <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          </svg>
          <div className="text-[8.5px] mt-0.5" style={{ color: '#9b9baf' }}>اعلان‌ها</div>
        </button>
        <button onClick={() => goTo('حساب من')} className="text-center cursor-pointer">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="2" className="mx-auto">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
          <div className="text-[8.5px] mt-0.5" style={{ color: '#9b9baf' }}>حساب من</div>
        </button>
      </div>
    </div>
  )
}

export default VisitorDashboard