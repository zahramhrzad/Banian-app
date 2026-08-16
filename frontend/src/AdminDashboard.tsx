import PageTitle from './PageTitle'
import type { AdminRole } from './AdminLogin'

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
  scannedManually: 350,
}
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

const navSections = [
  { key: 'registrants', label: 'ثبت‌نامی‌ها' },
  { key: 'dataEntry', label: 'پیشخوان Data Entry' },
  { key: 'promotions', label: 'پروموشن‌ها' },
  { key: 'notifications', label: 'اعلان هدفمند' },
  { key: 'scans', label: 'افراد و قرارهای اسکن‌شده' },
]

function points(values: number[]) {
  const step = 300 / (values.length - 1)
  return values.map((v, i) => `${i * step},${60 - (v / trendMax) * 55}`).join(' ')
}

export default function AdminDashboard({
  displayName,
  role,
  activityLog,
  notificationCreditRate,
  setNotificationCreditRate,
  onOpenRegistrants,
  onOpenDataEntry,
  onOpenPromotions,
  onOpenNotifications,
  onOpenScans,
  onLogout,
}: {
  displayName: string
  role: AdminRole
  activityLog: ActivityLogEntry[]
  notificationCreditRate: number
  setNotificationCreditRate: React.Dispatch<React.SetStateAction<number>>
  onOpenRegistrants: () => void
  onOpenDataEntry: () => void
  onOpenPromotions: () => void
  onOpenNotifications: () => void
  onOpenScans: () => void
  onLogout: () => void
}) {
  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }

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

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="rounded-xl p-3" style={cardStyle}>
            <div className="text-[8px]" style={{ color: '#8b8a95' }}>ورود با اسکن QR</div>
            <div className="text-lg font-extrabold" style={{ color: '#be9c77' }}>{toFa(mockStats.scannedByCamera)}</div>
          </div>
          <div className="rounded-xl p-3" style={cardStyle}>
            <div className="text-[8px]" style={{ color: '#8b8a95' }}>ورود با ثبت دستی</div>
            <div className="text-lg font-extrabold" style={{ color: '#9b9baf' }}>{toFa(mockStats.scannedManually)}</div>
          </div>
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

        <div className="rounded-2xl p-4 mb-3" style={cardStyle}>
          <div className="text-[9.5px] font-bold mb-2.5" style={{ color: '#be9c77' }}>روند بازدید به تفکیک حوزه</div>
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
            داده‌ی نمونه — بعد از اتصال دیتابیس واقعی محاسبه می‌شود
          </div>
        </div>

        <div
          className="rounded-2xl px-3 py-2.5 mb-3"
          style={{ background: 'rgba(217,83,79,0.08)', border: '1px solid rgba(217,83,79,0.2)' }}
        >
          <div className="text-[8.5px] font-bold mb-1.5" style={{ color: '#d9534f' }}>هشدارهای مدیریتی</div>
          <div className="flex flex-col gap-1">
            {mockWarnings.map((w, i) => (
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
              className="w-full rounded-xl py-3.5 font-bold text-[10.5px] flex items-center justify-center gap-1.5"
              style={{ background: 'rgba(190,156,119,0.15)', color: '#e8cfa8', border: '1.5px solid rgba(190,156,119,0.4)', cursor: 'pointer' }}
              onClick={() => {
                if (s.key === 'registrants') onOpenRegistrants()
                else if (s.key === 'dataEntry') onOpenDataEntry()
                else if (s.key === 'promotions') onOpenPromotions()
                else if (s.key === 'notifications') onOpenNotifications()
                else if (s.key === 'scans') onOpenScans()
                else alert(`صفحه‌ی «${s.label}» در گام بعدی ساخته می‌شود`)
              }}
            >
              {s.label}
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
