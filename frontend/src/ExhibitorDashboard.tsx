import { type Product, categoryInfo as productCategoryInfo, type CategoryId } from './ExhibitorProducts'
import { type PanelSession, DAYS, isPast } from './ExhibitorPanels'
import { type Agreement } from './ExhibitorAgreements'
import { type ExhibitorPromotion, computeStatus } from './ExhibitorPromotions'
import { type SentInvite } from './ExhibitorInvites'
import { type MeetingRequest } from './ExhibitorAppointments'

const toFa = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

const mockVisitBreakdown = [
  { label: 'بانک', color: '#be9c77', percent: 45 },
  { label: 'بیمه', color: '#7d9a86', percent: 28 },
  { label: 'بازار سرمایه', color: '#c9a15e', percent: 17 },
  { label: 'زیرساخت', color: '#8d7aa3', percent: 10 },
]
const mockTotalVisitors = 142
const CIRCUMFERENCE = 2 * Math.PI * 46

interface ExhibitorDashboardProps {
  companyName: string
  activityCategory: string
  products: Product[]
  panels: PanelSession[]
  agreements: Agreement[]
  promotions: ExhibitorPromotion[]
  inviteQuota: number
  sentInvites: SentInvite[]
  meetingRequests: MeetingRequest[]
  onOpenProducts: () => void
  onOpenPanels: () => void
  onOpenPromotions: () => void
  onOpenInvites: () => void
  onOpenAppointments: () => void
  onOpenReport: () => void
  onLogout: () => void
}

export default function ExhibitorDashboard({
  companyName,
  activityCategory,
  products,
  panels,
  agreements,
  promotions,
  inviteQuota,
  sentInvites,
  meetingRequests,
  onOpenProducts,
  onOpenPanels,
  onOpenPromotions,
  onOpenInvites,
  onOpenAppointments,
  onOpenReport,
  onLogout,
}: ExhibitorDashboardProps) {
  const cat = productCategoryInfo(activityCategory as CategoryId)

  const upcomingPanelsCount = panels.filter((p) => !isPast(p.dayId)).length
  const activePromotionsCount = promotions.filter((p) => computeStatus(p) === 'active').length

  const nearestPanel = [...panels]
    .filter((p) => !isPast(p.dayId))
    .sort((a, b) => a.dayId - b.dayId || a.time.localeCompare(b.time))[0]
  const nearestPanelDay = nearestPanel ? DAYS.find((d) => d.id === nearestPanel.dayId) : null

  const draftProductsCount = products.filter((p) => !p.published).length
  const negotiatingAgreementsCount = agreements.filter((a) => a.status === 'negotiating').length
  const draftPromotionsCount = promotions.filter((p) => computeStatus(p) === 'draft').length
  const draftPanelsCount = panels.filter((p) => !p.published).length

  const reminders: string[] = []
  if (draftProductsCount > 0) reminders.push(`${toFa(draftProductsCount)} محصول در حالت پیش‌نویس مونده`)
  if (draftPanelsCount > 0) reminders.push(`${toFa(draftPanelsCount)} پنل هنوز منتشر نشده`)
  if (negotiatingAgreementsCount > 0) reminders.push(`${toFa(negotiatingAgreementsCount)} قرارداد در حال مذاکره‌ست`)
  if (draftPromotionsCount > 0) reminders.push(`${toFa(draftPromotionsCount)} پروموشن هنوز منتشر نشده`)

  const inviteRemaining = Math.max(inviteQuota - sentInvites.length, 0)
  const pendingRequestsCount = meetingRequests.filter((r) => r.status === 'pending').length

  const groupCardStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.05)',
  }

  let cumulativeOffset = 0
  const donutSegments = mockVisitBreakdown.map((seg) => {
    const len = (seg.percent / 100) * CIRCUMFERENCE
    const offset = -cumulativeOffset
    cumulativeOffset += len
    return { ...seg, len, offset }
  })

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden px-6 py-8"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="relative z-10 mt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-sm font-bold" style={{ color: '#fff' }}>
              غرفه‌ی {companyName}
            </div>
            {cat && (
              <span
                className="inline-block mt-1.5 text-[8.5px] font-bold px-2 py-1 rounded-md"
                style={{ background: cat.color, color: cat.text }}
              >
                {cat.label}
              </span>
            )}
          </div>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(190,156,119,0.18)' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6">
              <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
            </svg>
          </div>
        </div>

        <div className="rounded-2xl p-4 mb-3" style={groupCardStyle}>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[9.5px] font-bold" style={{ color: '#be9c77' }}>بازدید امروز غرفه</span>
            <span
              className="text-[8px] font-bold px-2 py-0.5 rounded-full mr-auto"
              style={{ background: 'rgba(125,154,134,0.15)', color: '#7d9a86' }}
            >
              نمونه/تستی
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="relative flex-shrink-0" style={{ width: '92px', height: '92px' }}>
              <svg width="92" height="92" viewBox="0 0 118 118">
                <circle cx="59" cy="59" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
                {donutSegments.map((seg) => (
                  <circle
                    key={seg.label}
                    cx="59"
                    cy="59"
                    r="46"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="14"
                    strokeDasharray={`${seg.len} ${CIRCUMFERENCE - seg.len}`}
                    strokeDashoffset={seg.offset}
                    strokeLinecap="round"
                    transform="rotate(-90 59 59)"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-extrabold" style={{ color: '#fff' }}>{toFa(mockTotalVisitors)}</span>
                <span className="text-[7px]" style={{ color: '#8b8a95' }}>نفر</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              {mockVisitBreakdown.map((seg) => (
                <div key={seg.label} className="flex items-center gap-1.5">
                  <span className="rounded-sm flex-shrink-0" style={{ width: '7px', height: '7px', background: seg.color }}></span>
                  <span className="text-[8px] flex-1" style={{ color: '#c9c7d0' }}>{seg.label}</span>
                  <span className="text-[8.5px] font-bold" style={{ color: '#fff' }}>{toFa(seg.percent)}٪</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[7.5px] mt-2.5" style={{ color: '#6f6e78' }}>
            داده‌ی نمونه — بعد از اتصال اسکنر QR خودکار محاسبه می‌شود
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-xl p-2.5" style={groupCardStyle}>
            <div className="text-[8px]" style={{ color: '#8b8a95' }}>محصول</div>
            <div className="text-base font-extrabold" style={{ color: '#fff' }}>{toFa(products.length)}</div>
          </div>
          <div className="rounded-xl p-2.5" style={groupCardStyle}>
            <div className="text-[8px]" style={{ color: '#8b8a95' }}>پنل پیش‌رو</div>
            <div className="text-base font-extrabold" style={{ color: '#fff' }}>{toFa(upcomingPanelsCount)}</div>
          </div>
          <div className="rounded-xl p-2.5" style={groupCardStyle}>
            <div className="text-[8px]" style={{ color: '#8b8a95' }}>قرارداد</div>
            <div className="text-base font-extrabold" style={{ color: '#fff' }}>{toFa(agreements.length)}</div>
          </div>
          <div className="rounded-xl p-2.5" style={groupCardStyle}>
            <div className="text-[8px]" style={{ color: '#8b8a95' }}>پروموشن فعال</div>
            <div className="text-base font-extrabold" style={{ color: '#fff' }}>{toFa(activePromotionsCount)}</div>
          </div>
        </div>

        {nearestPanel && nearestPanelDay && (
          <div className="bg-white rounded-2xl p-3 mb-3">
            <div className="text-[9px] font-bold mb-1" style={{ color: '#8a6d4d' }}>نزدیک‌ترین پنل پیش رو</div>
            <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>{nearestPanel.title}</div>
            <div className="text-[8.5px] mt-1" style={{ color: '#9b9baf' }}>
              {nearestPanelDay.label} ({nearestPanelDay.date}) · {nearestPanel.time} · {nearestPanel.location}
            </div>
          </div>
        )}

        {reminders.length > 0 && (
          <div
            className="rounded-xl px-3 py-2.5 mb-3"
            style={{ background: 'rgba(217,83,79,0.08)', border: '1px solid rgba(217,83,79,0.2)' }}
          >
            <div className="text-[8.5px] font-bold mb-1" style={{ color: '#d9534f' }}>یادآوری‌ها</div>
            <div className="flex flex-col gap-1">
              {reminders.map((r, i) => (
                <div key={i} className="text-[8px]" style={{ color: '#e0908c' }}>{r}</div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onOpenInvites}
          className="w-full rounded-2xl p-3 mb-3 text-right"
          style={{ ...groupCardStyle, cursor: 'pointer' }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold" style={{ color: '#be9c77' }}>ارسال کد دعوت</span>
            <span className="text-[7.5px] mr-auto" style={{ color: '#8b8a95' }}>
              {toFa(inviteRemaining)} / {toFa(inviteQuota)} باقی‌مانده
            </span>
          </div>
        </button>

        <button
          onClick={onOpenAppointments}
          className="w-full rounded-2xl p-3 mb-3 flex items-center justify-between"
          style={{ ...groupCardStyle, cursor: 'pointer' }}
        >
          <span className="text-[9px] font-bold" style={{ color: '#be9c77' }}>قرارهای من</span>
          {pendingRequestsCount > 0 ? (
            <span
              className="text-[8px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: '#c76b5f', color: '#fff' }}
            >
              {toFa(pendingRequestsCount)} در انتظار
            </span>
          ) : (
            <span className="text-[8px]" style={{ color: '#8b8a95' }}>مشاهده</span>
          )}
        </button>

        <button
          onClick={onOpenReport}
          className="w-full rounded-2xl p-3 mb-4 text-right"
          style={{ ...groupCardStyle, cursor: 'pointer' }}
        >
          <span className="text-[9px] font-bold" style={{ color: '#be9c77' }}>گزارش نهایی غرفه</span>
        </button>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={onOpenProducts}
            className="w-full rounded-xl py-3.5 font-bold text-[10.5px] flex flex-col items-center justify-center gap-1"
            style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1b2134" strokeWidth="1.8">
              <path d="M21 8L12 3 3 8l9 5 9-5z" />
              <path d="M3 8v8l9 5 9-5V8" />
              <path d="M12 13v8" />
            </svg>
            محصولات
          </button>
          <button
            onClick={onOpenPanels}
            className="w-full rounded-xl py-3.5 font-bold text-[10.5px] flex flex-col items-center justify-center gap-1"
            style={{ background: 'rgba(190,156,119,0.15)', color: '#e8cfa8', border: '1.5px solid rgba(190,156,119,0.4)', cursor: 'pointer' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e8cfa8" strokeWidth="1.8">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v1a7 7 0 0014 0v-1M12 18v4M9 22h6" />
            </svg>
            پنل‌ها
          </button>
          <button
            onClick={onOpenPromotions}
            className="w-full rounded-xl py-3.5 font-bold text-[10.5px] flex flex-col items-center justify-center gap-1"
            style={{ background: 'rgba(190,156,119,0.15)', color: '#e8cfa8', border: '1.5px solid rgba(190,156,119,0.4)', cursor: 'pointer' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e8cfa8" strokeWidth="1.8">
              <rect x="3" y="8" width="18" height="4" rx="1" />
              <path d="M12 8v13M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              <path d="M12 8c-1.5-3-5-4-5-1.5S9.5 8 12 8zM12 8c1.5-3 5-4 5-1.5S14.5 8 12 8z" />
            </svg>
            پروموشن
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={onLogout}
            className="text-[9.5px] underline"
            style={{ color: '#9b9baf', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            خروج از حساب
          </button>
        </div>
      </div>
    </div>
  )
}