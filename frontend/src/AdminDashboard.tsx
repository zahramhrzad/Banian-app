import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import PageTitle from './PageTitle'
import type { AdminRole } from './AdminLogin'
import { DAYS } from './ExhibitorPanels'

const toFa = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

export interface ActivityLogEntry {
  admin: string
  action: string
  time: string
}

// داده‌ی نمونه — تا وصل‌شدن به دیتابیس واقعی
const mockStats = {
  totalVisitors: 1240,
  totalExhibitors: 38,
  withCode: 460,
  withoutCode: 780,
  scannedByCamera: 890,
}
// هر عدد در آرایه مربوط به یک روز نمایشگاه است (روز ۱ تا ۴)
const mockTrend: Record<string, number[]> = {
  'بانک': [40, 65, 90, 120],
  'بیمه': [25, 45, 60, 75],
  'بازار سرمایه': [15, 28, 38, 48],
  'زیرساخت': [8, 15, 22, 30],
}
const trendColors: Record<string, string> = { 'بانک': '#be9c77', 'بیمه': '#7d9a86', 'بازار سرمایه': '#c9a15e', 'زیرساخت': '#8d7aa3' }
const trendMax = Math.max(...Object.values(mockTrend).flat())

const mockWarnings = [
  '۵ غرفه هنوز هیچ محصولی ثبت نکرده‌اند',
  'پنل «بانکداری دیجیتال» و «آینده‌ی بیمه» هر دو در سالن B و ساعت ۱۵:۰۰ برنامه‌ریزی شده‌اند',
  '۳ درخواست ملاقات بیش از ۲۴ ساعت بدون پاسخ مانده',
]

function points(values: number[]) {
  const step = 300 / (values.length - 1)
  return values.map((v, i) => `${i * step},${60 - (v / trendMax) * 55}`).join(' ')
}

const navSections = [
  { key: 'exhibitors', label: 'مدیریت غرفه‌داران' },
  { key: 'registrants', label: 'ثبت‌نامی‌ها' },
  { key: 'dataEntry', label: 'پیشخوان Data Entry' },
  { key: 'promotions', label: 'پروموشن‌ها' },
  { key: 'promotionRequests', label: 'درخواست‌های پروموشن غرفه‌داران' },
  { key: 'notifications', label: 'اعلان هدفمند' },
  { key: 'scans', label: 'افراد و قرارهای اسکن‌شده' },
  { key: 'qualityForm', label: 'گزارش کیفیت مشارکت' },
  { key: 'mapPins', label: 'مدیریت نقشه و غرفه‌ها' },
  { key: 'users', label: 'مدیریت کاربران' },
]

export default function AdminDashboard({
  displayName,
  role,
  activityLog,
  notificationCreditRate,
  setNotificationCreditRate,
  incompleteQualityFormCount,
  pendingPromotionRequestsCount,
  onOpenRegistrants,
  onOpenDataEntry,
  onOpenPromotions,
  onOpenPromotionRequests,
  onOpenNotifications,
  onOpenScans,
  onOpenQualityForm,
  onOpenUsers,
  onOpenExhibitors,
  onOpenMapPins,
  onLogout,
}: {
  displayName: string
  role: AdminRole
  activityLog: ActivityLogEntry[]
  notificationCreditRate: number
  setNotificationCreditRate: React.Dispatch<React.SetStateAction<number>>
  incompleteQualityFormCount: number
  pendingPromotionRequestsCount: number
  onOpenRegistrants: () => void
  onOpenDataEntry: () => void
  onOpenPromotions: () => void
  onOpenPromotionRequests: () => void
  onOpenNotifications: () => void
  onOpenScans: () => void
  onOpenQualityForm: () => void
  onOpenUsers: () => void
  onOpenExhibitors: () => void
  onOpenMapPins: () => void
  onLogout: () => void
}) {
  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }
  const warnings =
    incompleteQualityFormCount > 0
      ? [`${toFa(incompleteQualityFormCount)} غرفه هنوز فرم کیفیت مشارکت را تکمیل نکرده‌اند`, ...mockWarnings]
      : mockWarnings

  const [trendMode, setTrendMode] = useState<'daily' | 'overall'>('daily')
  const [selectedDay, setSelectedDay] = useState(DAYS[0].id)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const trendRef = useRef<HTMLDivElement>(null)

  const dayIndex = DAYS.findIndex((d) => d.id === selectedDay)
  const dayValues = Object.entries(mockTrend).map(([label, values]) => ({
    label,
    value: values[dayIndex] ?? 0,
    color: trendColors[label],
  }))
  const dayTotal = dayValues.reduce((sum, v) => sum + v.value, 0)

  const handleDownloadPdf = async () => {
    const el = trendRef.current
    if (!el) return
    setDownloadingPdf(true)
    try {
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#1b2134' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save('banian-admin-visit-trend.pdf')
    } catch (err) {
      console.error('PDF generation failed', err)
    } finally {
      setDownloadingPdf(false)
    }
  }

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
            <PageTitle>داشبورد مدیریت نمایشگاه</PageTitle>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 -mt-2">
          <span className="text-[10px]" style={{ color: '#9b9baf' }}>
            خوش‌آمدید، {displayName}
          </span>
          <span
            className="text-[8px] font-bold px-2 py-1 rounded-md"
            style={{ background: role === 'super' ? 'rgba(190,156,119,0.18)' : 'rgba(125,154,134,0.15)', color: role === 'super' ? '#be9c77' : '#7d9a86' }}
          >
            {role === 'super' ? 'مدیر کل' : 'اپراتور دیتا'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="rounded-xl p-3" style={cardStyle}>
            <div className="text-[8px]" style={{ color: '#8b8a95' }}>کل بازدیدکننده</div>
            <div className="text-lg font-extrabold" style={{ color: '#fff' }}>{toFa(mockStats.totalVisitors)}</div>
          </div>
          <div className="rounded-xl p-3" style={cardStyle}>
            <div className="text-[8px]" style={{ color: '#8b8a95' }}>کل غرفه‌دار</div>
            <div className="text-lg font-extrabold" style={{ color: '#fff' }}>{toFa(mockStats.totalExhibitors)}</div>
          </div>
        </div>

        <div className="rounded-xl p-3 mb-2" style={cardStyle}>
          <div className="text-[8px]" style={{ color: '#8b8a95' }}>ورود با اسکن QR</div>
          <div className="text-lg font-extrabold" style={{ color: '#be9c77' }}>{toFa(mockStats.scannedByCamera)}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-xl p-3" style={cardStyle}>
            <div className="text-[8px]" style={{ color: '#8b8a95' }}>ورود با کد دعوت</div>
            <div className="text-lg font-extrabold" style={{ color: '#7d9a86' }}>{toFa(mockStats.withCode)}</div>
          </div>
          <div className="rounded-xl p-3" style={cardStyle}>
            <div className="text-[8px]" style={{ color: '#8b8a95' }}>ورود بدون کد</div>
            <div className="text-lg font-extrabold" style={{ color: '#c9a15e' }}>{toFa(mockStats.withoutCode)}</div>
          </div>
        </div>

        <div className="rounded-2xl p-4 mb-3" style={cardStyle} ref={trendRef}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[9.5px] font-bold" style={{ color: '#be9c77' }}>روند بازدید</span>
            <div className="flex gap-1">
              <button
                onClick={() => setTrendMode('daily')}
                className="text-[8px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: trendMode === 'daily' ? '#be9c77' : 'rgba(255,255,255,0.08)', color: trendMode === 'daily' ? '#1b2134' : '#c9c7d0', border: 'none', cursor: 'pointer' }}
              >
                روزانه
              </button>
              <button
                onClick={() => setTrendMode('overall')}
                className="text-[8px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: trendMode === 'overall' ? '#be9c77' : 'rgba(255,255,255,0.08)', color: trendMode === 'overall' ? '#1b2134' : '#c9c7d0', border: 'none', cursor: 'pointer' }}
              >
                کلی
              </button>
            </div>
          </div>

          {trendMode === 'daily' ? (
            <>
              <div className="flex gap-1.5 mb-2.5">
                {DAYS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDay(d.id)}
                    className="flex-1 text-[8px] font-bold py-1.5 rounded-lg"
                    style={{ background: selectedDay === d.id ? '#be9c77' : 'rgba(255,255,255,0.06)', color: selectedDay === d.id ? '#1b2134' : '#9b9baf', border: 'none', cursor: 'pointer' }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                {dayValues.map((v) => (
                  <div key={v.label} className="flex items-center gap-2">
                    <span className="text-[7.5px] flex-shrink-0" style={{ color: '#c9c7d0', width: '52px' }}>{v.label}</span>
                    <div className="flex-1 rounded overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', height: '8px' }}>
                      <div style={{ width: `${trendMax > 0 ? (v.value / trendMax) * 100 : 0}%`, height: '100%', background: v.color }}></div>
                    </div>
                    <span className="text-[8px] font-bold flex-shrink-0" style={{ color: '#fff', width: '24px', textAlign: 'left' }}>{toFa(v.value)}</span>
                  </div>
                ))}
              </div>
              <div className="text-[7.5px] mt-2.5" style={{ color: '#6f6e78' }}>
                جمع بازدید همان روز: <span style={{ color: '#e8cfa8' }}>{toFa(dayTotal)}</span> نفر
              </div>
            </>
          ) : (
            <>
              <svg width="100%" height="70" viewBox="0 0 300 70">
                {Object.entries(mockTrend).map(([label, values]) => (
                  <polyline key={label} points={points(values)} fill="none" stroke={trendColors[label]} strokeWidth="2" />
                ))}
              </svg>
              <div className="flex flex-wrap gap-3 mt-2">
                {Object.keys(mockTrend).map((label) => (
                  <span key={label} className="flex items-center gap-1 text-[7.5px]" style={{ color: '#9b9baf' }}>
                    <span className="rounded-sm inline-block" style={{ width: '7px', height: '7px', background: trendColors[label] }}></span>
                    {label}
                  </span>
                ))}
              </div>
              <div className="text-[7.5px] mt-2.5" style={{ color: '#6f6e78' }}>
                مجموع تمام روزهای نمایشگاه، به تفکیک حوزه — داده‌ی نمونه
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={downloadingPdf}
          className="w-full mb-3 rounded-lg py-2 text-[8.5px] font-bold"
          style={{ background: 'rgba(190,156,119,0.15)', color: '#be9c77', border: '1px solid rgba(190,156,119,0.3)', cursor: downloadingPdf ? 'wait' : 'pointer' }}
        >
          {downloadingPdf ? 'در حال آماده‌سازی...' : 'دانلود PDF روند بازدید'}
        </button>

        <div
          className="rounded-2xl px-3 py-2.5 mb-3"
          style={{ background: 'rgba(217,83,79,0.08)', border: '1px solid rgba(217,83,79,0.2)' }}
        >
          <div className="text-[8.5px] font-bold mb-1.5" style={{ color: '#d9534f' }}>هشدارهای مدیریتی</div>
          <div className="flex flex-col gap-1">
            {warnings.map((w, i) => (
              <div key={i} className="text-[8px]" style={{ color: '#e0908c' }}>{w}</div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-3 mb-4" style={cardStyle}>
          <div className="text-[9px] font-bold mb-2" style={{ color: '#e8cfa8' }}>لاگ فعالیت مدیران</div>
          <div className="flex flex-col gap-2">
            {activityLog.map((log, i) => (
              <div key={i} className="text-[8px] leading-relaxed" style={{ color: '#9b9baf' }}>
                <span style={{ color: '#e8cfa8', fontWeight: 700 }}>{log.admin}</span> {log.action}
                <span style={{ color: '#6f6e78' }}> · {log.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {navSections.map((s) => (
            <button
              key={s.key}
              className="w-full rounded-xl py-3.5 font-bold text-[10.5px] flex items-center justify-center gap-1.5 relative"
              style={{ background: 'rgba(190,156,119,0.15)', color: '#e8cfa8', border: '1.5px solid rgba(190,156,119,0.4)', cursor: 'pointer' }}
              onClick={() => {
                if (s.key === 'registrants') onOpenRegistrants()
                else if (s.key === 'dataEntry') onOpenDataEntry()
                else if (s.key === 'promotions') onOpenPromotions()
                else if (s.key === 'promotionRequests') onOpenPromotionRequests()
                else if (s.key === 'notifications') onOpenNotifications()
                else if (s.key === 'scans') onOpenScans()
                else if (s.key === 'qualityForm') onOpenQualityForm()
                else if (s.key === 'users') onOpenUsers()
                else if (s.key === 'exhibitors') onOpenExhibitors()
                else if (s.key === 'mapPins') onOpenMapPins()
                else alert(`صفحه‌ی «${s.label}» در گام بعدی ساخته می‌شود`)
              }}
            >
              {s.label}
              {s.key === 'promotionRequests' && pendingPromotionRequestsCount > 0 && (
                <span
                  className="absolute flex items-center justify-center rounded-full"
                  style={{ top: '-6px', left: '-6px', minWidth: '17px', height: '17px', padding: '0 3px', background: '#c76b5f', color: '#fff', fontSize: '8.5px', fontWeight: 700 }}
                >
                  {toFa(pendingPromotionRequestsCount)}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="rounded-2xl p-3 mb-4" style={cardStyle}>
          <div className="text-[9px] font-bold mb-1.5" style={{ color: '#e8cfa8' }}>نرخ اعتبار اعلان غرفه‌داران</div>
          <div className="flex items-center gap-2">
            <span className="text-[9px]" style={{ color: '#9b9baf' }}>هر</span>
            <input
              type="number"
              value={notificationCreditRate}
              onChange={(e) => setNotificationCreditRate(Number(e.target.value) || 1)}
              className="rounded-lg px-2 py-1 text-[10px] outline-none w-16 text-center"
              style={{ color: '#1b2134' }}
            />
            <span className="text-[9px]" style={{ color: '#9b9baf' }}>مخاطب = ۱ اعتبار</span>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onLogout}
            className="text-[9.5px] underline"
            style={{ color: '#9b9baf', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            خروج از حساب مدیریت
          </button>
        </div>
      </div>
    </div>
  )
}
