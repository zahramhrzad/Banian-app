import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { DAYS } from './ExhibitorPanels'
import { type Agreement, statusInfo as agreementStatusInfo } from './ExhibitorAgreements'
import { type MeetingRequest } from './ExhibitorAppointments'

const toFa = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

// داده‌ی نمونه — بعد از راه‌اندازی اسکنر QR واقعی، با آمار واقعی جایگزین می‌شود
const mockDailyVisits = [
  { dayId: 1, count: 98 },
  { dayId: 2, count: 142 },
  { dayId: 3, count: 156 },
  { dayId: 4, count: 116 },
]
const mockCategoryBreakdown = [
  { label: 'بانک', color: '#be9c77', percent: 45 },
  { label: 'بیمه', color: '#7d9a86', percent: 28 },
  { label: 'بازار سرمایه', color: '#c9a15e', percent: 17 },
  { label: 'زیرساخت', color: '#8d7aa3', percent: 10 },
]
const mockGenderSplit = { male: 58, female: 42 }
const mockAgeSplit = [
  { label: 'زیر ۲۵ سال', percent: 18 },
  { label: '۲۵ تا ۳۵ سال', percent: 39 },
  { label: '۳۵ تا ۴۵ سال', percent: 29 },
  { label: 'بالای ۴۵ سال', percent: 14 },
]

function exhibitionStatus() {
  const start = DAYS[0].realDate.getTime()
  const end = DAYS[DAYS.length - 1].realDate.getTime() + 24 * 60 * 60 * 1000
  const now = Date.now()
  if (now < start) return { label: 'قبل از شروع نمایشگاه', color: '#8a6d4d', bg: '#f3e8dc' }
  if (now <= end) return { label: 'در حال برگزاری', color: '#3f6b4d', bg: '#e3f0e0' }
  return { label: 'نمایشگاه پایان یافته', color: '#3d5a80', bg: '#dbe8f7' }
}

function mockVisitorCode(id: string) {
  const digits = id.replace(/\D/g, '').slice(-4).padStart(4, '0')
  return `VIS-${digits}`
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('fa-IR')
}

export default function ExhibitorReport({
  companyName,
  exhibitorCode,
  staffPhone,
  agreements,
  meetingRequests,
  onBack,
}: {
  companyName: string
  exhibitorCode: string
  staffPhone: string
  agreements: Agreement[]
  meetingRequests: MeetingRequest[]
  onBack: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const status = exhibitionStatus()
  const totalVisits = mockDailyVisits.reduce((sum, d) => sum + d.count, 0)
  const maxDaily = Math.max(...mockDailyVisits.map((d) => d.count))

  const approvedRequests = meetingRequests.filter((r) => r.status === 'approved')

  const agreementCounts = {
    signed: agreements.filter((a) => a.status === 'signed').length,
    negotiating: agreements.filter((a) => a.status === 'negotiating').length,
    cancelled: agreements.filter((a) => a.status === 'cancelled').length,
  }

  const reportDateRange = `${DAYS[0].date} تا ${DAYS[DAYS.length - 1].date} ۱۴۰۵`

  const buildTextSummary = () => {
    const lines = [
      `گزارش نهایی غرفه‌ی ${companyName}`,
      `کد غرفه: ${exhibitorCode}`,
      `بازه: ${reportDateRange} — ${status.label}`,
      ``,
      `کل بازدید نمایشگاه: ${totalVisits} نفر`,
      `توافقات نهایی‌شده حین نمایشگاه: ${approvedRequests.length}`,
      `قراردادها: ${agreementCounts.signed} امضا شده / ${agreementCounts.negotiating} در حال مذاکره / ${agreementCounts.cancelled} لغو شده`,
      ``,
      `فهرست توافقات حین نمایشگاه:`,
      ...approvedRequests.map(
        (r) =>
          `- ${r.visitorName} | کد بازدیدکننده: ${mockVisitorCode(r.id)} | تلفن: ${r.visitorPhone} | تاییدکننده: ${r.approvedByStaffName}`
      ),
    ]
    return lines.join('\n')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildTextSummary())
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  const handleDownloadPdf = async () => {
    const el = reportRef.current
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
      pdf.save(`banian-report-${exhibitorCode || 'exhibitor'}.pdf`)
    } catch (err) {
      console.error('PDF generation failed', err)
    } finally {
      setDownloadingPdf(false)
    }
  }

  const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.05)',
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden px-6 py-8"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={onBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="relative z-10 mt-6">
        <div ref={reportRef}>
        <PageTitle>گزارش نهایی غرفه</PageTitle>

        <div className="rounded-2xl p-4 mb-3" style={cardStyle}>
          <div className="flex justify-between items-start mb-1">
            <div>
              <div className="text-[11px] font-bold" style={{ color: '#fff' }}>{companyName}</div>
              <div className="text-[8.5px] mt-0.5" style={{ color: '#8b8a95' }}>
                کد غرفه: {exhibitorCode} · تلفن: {staffPhone}
              </div>
            </div>
            <span
              className="text-[8px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>
          <div className="text-[8.5px] mt-1" style={{ color: '#8b8a95' }}>
            بازه‌ی گزارش: {reportDateRange}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-2xl p-3" style={cardStyle}>
            <div className="text-[8px]" style={{ color: '#8b8a95' }}>کل بازدید نمایشگاه</div>
            <div className="text-lg font-extrabold" style={{ color: '#fff' }}>{toFa(totalVisits)} <span className="text-[9px] font-normal" style={{ color: '#9b9baf' }}>نفر</span></div>
          </div>
          <div className="rounded-2xl p-3" style={cardStyle}>
            <div className="text-[8px]" style={{ color: '#8b8a95' }}>توافقات نهایی‌شده</div>
            <div className="text-lg font-extrabold" style={{ color: '#fff' }}>{toFa(approvedRequests.length)}</div>
          </div>
        </div>

        <div className="rounded-2xl p-4 mb-3" style={cardStyle}>
          <div className="text-[9.5px] font-bold mb-2.5" style={{ color: '#e8cfa8' }}>روند بازدید روزانه به تفکیک حوزه‌ی فعالیت</div>
          <div className="flex items-end gap-2.5" style={{ height: '90px' }}>
            {mockDailyVisits.map((d) => {
              const day = DAYS.find((dd) => dd.id === d.dayId)
              const heightPercent = (d.count / maxDaily) * 100
              return (
                <div key={d.dayId} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-[8px] font-bold mb-1" style={{ color: '#fff' }}>{toFa(d.count)}</span>
                  <div
                    className="w-full rounded-t-md overflow-hidden flex flex-col-reverse"
                    style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                  >
                    {mockCategoryBreakdown.map((seg) => (
                      <div key={seg.label} style={{ height: `${seg.percent}%`, background: seg.color }}></div>
                    ))}
                  </div>
                  <span className="text-[7px] mt-1.5" style={{ color: '#8b8a95' }}>{day?.label}</span>
                </div>
              )
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {mockCategoryBreakdown.map((seg) => (
              <span key={seg.label} className="flex items-center gap-1 text-[7.5px]" style={{ color: '#9b9baf' }}>
                <span className="rounded-sm inline-block" style={{ width: '7px', height: '7px', background: seg.color }}></span>
                {seg.label}
              </span>
            ))}
          </div>
          <div className="text-[7.5px] mt-2.5" style={{ color: '#6f6e78' }}>
            داده‌ی نمونه — بعد از اتصال اسکنر QR واقعی، روند واقعی روزانه به تفکیک حوزه‌ی فعالیت بازدیدکنندگان محاسبه می‌شود
          </div>
        </div>

        <div className="rounded-2xl p-4 mb-3" style={cardStyle}>
          <div className="text-[9.5px] font-bold mb-2.5" style={{ color: '#e8cfa8' }}>تفکیک جنسیت و سن بازدیدکنندگان</div>
          <div className="flex gap-3 mb-3">
            <div className="flex-1 text-center">
              <div className="text-base font-extrabold" style={{ color: '#be9c77' }}>{toFa(mockGenderSplit.male)}٪</div>
              <div className="text-[8px]" style={{ color: '#9b9baf' }}>مرد</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-base font-extrabold" style={{ color: '#7d9a86' }}>{toFa(mockGenderSplit.female)}٪</div>
              <div className="text-[8px]" style={{ color: '#9b9baf' }}>زن</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {mockAgeSplit.map((a) => (
              <div key={a.label}>
                <div className="flex justify-between text-[8px] mb-0.5" style={{ color: '#9b9baf' }}>
                  <span>{a.label}</span>
                  <span>{toFa(a.percent)}٪</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: '5px', background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${a.percent}%`, background: '#be9c77' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="text-[7.5px] mt-3" style={{ color: '#6f6e78' }}>
            داده‌ی نمونه — بعد از اتصال اسکنر QR واقعی محاسبه می‌شود
          </div>
        </div>

        <div className="rounded-2xl p-4 mb-3" style={cardStyle}>
          <div className="text-[9.5px] font-bold mb-2.5" style={{ color: '#e8cfa8' }}>خلاصه‌ی قراردادها</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="text-base font-extrabold" style={{ color: agreementStatusInfo.signed.text }}>
                {toFa(agreementCounts.signed)}
              </div>
              <div className="text-[7.5px] mt-0.5" style={{ color: '#9b9baf' }}>امضا شده</div>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="text-base font-extrabold" style={{ color: agreementStatusInfo.negotiating.text }}>
                {toFa(agreementCounts.negotiating)}
              </div>
              <div className="text-[7.5px] mt-0.5" style={{ color: '#9b9baf' }}>در حال مذاکره</div>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="text-base font-extrabold" style={{ color: agreementStatusInfo.cancelled.text }}>
                {toFa(agreementCounts.cancelled)}
              </div>
              <div className="text-[7.5px] mt-0.5" style={{ color: '#9b9baf' }}>لغو شده</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-4 mb-4" style={cardStyle}>
          <div className="text-[9.5px] font-bold mb-2.5" style={{ color: '#e8cfa8' }}>
            توافقات حین نمایشگاه ({toFa(approvedRequests.length)})
          </div>

          {approvedRequests.length === 0 && (
            <p className="text-[10px] text-center py-3" style={{ color: '#9b9baf' }}>
              هنوز توافق تاییدشده‌ای ثبت نشده
            </p>
          )}

          <div className="flex flex-col gap-2">
            {approvedRequests.map((r) => (
              <div key={r.id} className="bg-white rounded-xl p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold" style={{ color: '#1b2134' }}>{r.visitorName}</span>
                  {r.approvedAt && (
                    <span className="text-[7.5px]" style={{ color: '#9b9baf' }}>{formatDate(r.approvedAt)}</span>
                  )}
                </div>
                <div className="text-[8px] leading-relaxed" style={{ color: '#9b9baf' }}>
                  کد غرفه: {exhibitorCode} · کد بازدیدکننده: {mockVisitorCode(r.id)}
                </div>
                <div className="text-[8px] leading-relaxed" dir="ltr" style={{ color: '#9b9baf', textAlign: 'right' }}>
                  تلفن بازدیدکننده: {r.visitorPhone} · تاییدکننده: {r.approvedByStaffName}
                </div>
                {r.agreementNotes && (
                  <div className="text-[8px] mt-1.5 pt-1.5" style={{ borderTop: '1px solid #f0ede6', color: '#8a8a8a' }}>
                    {r.agreementNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="flex-1 rounded-full py-3 font-bold text-xs flex items-center justify-center gap-1.5"
            style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: downloadingPdf ? 'default' : 'pointer' }}
          >
            {!downloadingPdf && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1b2134" strokeWidth="2">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
              </svg>
            )}
            {downloadingPdf ? 'در حال آماده‌سازی...' : 'دانلود PDF گزارش'}
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 rounded-full py-3 font-bold text-xs"
            style={{ background: 'rgba(190,156,119,0.15)', color: '#e8cfa8', border: '1.5px solid rgba(190,156,119,0.4)', cursor: 'pointer' }}
          >
            {copied ? '✓ کپی شد' : 'کپی خلاصه‌ی متنی'}
          </button>
        </div>
      </div>
    </div>
  )
}