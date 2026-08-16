import { useState, useMemo } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { categoryInfo, type CategoryId } from './ExhibitorProducts'

type Tab = 'scans' | 'agreements'
type AgreementStatus = 'negotiating' | 'signed' | 'cancelled'
type DateRangeFilter = 'all' | 'today' | 'week' | 'custom'

interface AdminScanEntry {
  id: string
  ticketCode: string
  exhibitorCompany: string
  staffName: string
  scannedAt: number
  method: 'manual' | 'camera'
}

interface AdminAgreementEntry {
  id: string
  exhibitorCompany: string
  exhibitorCategory: CategoryId
  partnerName: string
  topic: string
  location: string
  status: AgreementStatus
  approvedByStaffName: string
  date: number
}

const mockScans: AdminScanEntry[] = [
  { id: 's1', ticketCode: '#BN-00218', exhibitorCompany: 'بانک آینده', staffName: 'زهرا', scannedAt: Date.now() - 3600000 * 2, method: 'camera' },
  { id: 's2', ticketCode: '#BN-00219', exhibitorCompany: 'کارگزاری آگاه', staffName: 'رضا', scannedAt: Date.now() - 3600000 * 3, method: 'manual' },
  { id: 's3', ticketCode: '#BN-00220', exhibitorCompany: 'بیمه‌ی البرز', staffName: 'سمیه', scannedAt: Date.now() - 3600000 * 5, method: 'camera' },
  { id: 's4', ticketCode: '#BN-00221', exhibitorCompany: 'بانک آینده', staffName: 'زهرا', scannedAt: Date.now() - 3600000 * 6, method: 'camera' },
  { id: 's5', ticketCode: '#BN-00218', exhibitorCompany: 'کارگزاری آگاه', staffName: 'رضا', scannedAt: Date.now() - 3600000 * 2 + 5 * 60000, method: 'manual' },
  { id: 's6', ticketCode: '#BN-00218', exhibitorCompany: 'بیمه‌ی البرز', staffName: 'سمیه', scannedAt: Date.now() - 3600000 * 2 + 9 * 60000, method: 'camera' },
  { id: 's7', ticketCode: '#BN-00222', exhibitorCompany: 'بانک آینده', staffName: 'زهرا', scannedAt: Date.now() - 86400000 * 2, method: 'camera' },
]

const mockAgreements: AdminAgreementEntry[] = [
  { id: 'a1', exhibitorCompany: 'بانک آینده', exhibitorCategory: 'bank', partnerName: 'سارا احمدی', topic: 'همکاری در حوزه‌ی بیمه‌های دیجیتال', location: 'غرفه‌ی بانک آینده', status: 'negotiating', approvedByStaffName: 'زهرا', date: Date.now() - 86400000 },
  { id: 'a2', exhibitorCompany: 'کارگزاری آگاه', exhibitorCategory: 'capital', partnerName: 'علی رضایی', topic: 'فرصت سرمایه‌گذاری مشترک', location: 'غرفه‌ی کارگزاری آگاه', status: 'signed', approvedByStaffName: 'رضا', date: Date.now() - 3600000 * 20 },
]

const statusInfo: Record<AgreementStatus, { label: string; bg: string; text: string }> = {
  negotiating: { label: 'در حال مذاکره', bg: 'rgba(190,156,119,0.18)', text: '#8a6d4d' },
  signed: { label: 'امضا شده', bg: '#e3f0e0', text: '#3f6b4d' },
  cancelled: { label: 'لغو شده', bg: 'rgba(217,83,79,0.12)', text: '#c76b5f' },
}

const toFa = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

function formatDateTime(ts: number) {
  const d = new Date(ts)
  return `${d.toLocaleDateString('fa-IR')} ساعت ${d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`
}

function isSameDay(ts: number, ref: number) {
  const a = new Date(ts)
  const b = new Date(ref)
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminScans({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('scans')
  const [search, setSearch] = useState('')
  const [exhibitorFilter, setExhibitorFilter] = useState('')
  const [dateRange, setDateRange] = useState<DateRangeFilter>('all')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const exhibitorOptions = useMemo(() => {
    const names = new Set([...mockScans.map((s) => s.exhibitorCompany), ...mockAgreements.map((a) => a.exhibitorCompany)])
    return Array.from(names)
  }, [])

  const inDateRange = (ts: number) => {
    if (dateRange === 'all') return true
    const now = Date.now()
    if (dateRange === 'today') return isSameDay(ts, now)
    if (dateRange === 'week') return now - ts <= 7 * 86400000
    if (dateRange === 'custom') {
      const startOk = !customStart || ts >= new Date(customStart).getTime()
      const endOk = !customEnd || ts <= new Date(customEnd).getTime() + 86400000
      return startOk && endOk
    }
    return true
  }

  // تشخیص الگوی مشکوک: یه کد بلیط که توسط چند غرفه‌ی مختلف در فاصله‌ی کمتر از ۱۵ دقیقه اسکن شده
  const suspiciousTicketCodes = useMemo(() => {
    const byTicket: Record<string, AdminScanEntry[]> = {}
    mockScans.forEach((s) => {
      byTicket[s.ticketCode] = byTicket[s.ticketCode] || []
      byTicket[s.ticketCode].push(s)
    })
    const flagged = new Set<string>()
    Object.entries(byTicket).forEach(([code, entries]) => {
      const companies = new Set(entries.map((e) => e.exhibitorCompany))
      if (companies.size < 2) return
      const sorted = [...entries].sort((a, b) => a.scannedAt - b.scannedAt)
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].scannedAt - sorted[i - 1].scannedAt <= 15 * 60000) {
          flagged.add(code)
          break
        }
      }
    })
    return flagged
  }, [])

  const filteredScans = mockScans.filter(
    (s) =>
      (search.trim() === '' || s.ticketCode.toLowerCase().includes(search.trim().toLowerCase()) || s.exhibitorCompany.includes(search.trim()) || s.staffName.includes(search.trim())) &&
      (exhibitorFilter === '' || s.exhibitorCompany === exhibitorFilter) &&
      inDateRange(s.scannedAt)
  )

  const filteredAgreements = mockAgreements.filter(
    (a) =>
      (search.trim() === '' || a.partnerName.includes(search.trim()) || a.exhibitorCompany.includes(search.trim())) &&
      (exhibitorFilter === '' || a.exhibitorCompany === exhibitorFilter) &&
      inDateRange(a.date)
  )

  const scansByExhibitor = useMemo(() => {
    const counts: Record<string, number> = {}
    filteredScans.forEach((s) => {
      counts[s.exhibitorCompany] = (counts[s.exhibitorCompany] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [filteredScans])
  const maxScanCount = Math.max(...scansByExhibitor.map(([, c]) => c), 1)

  const exportCsv = () => {
    if (tab === 'scans') {
      downloadCsv('scans.csv', [
        ['کد بلیط', 'غرفه', 'اسکن‌کننده', 'روش', 'زمان'],
        ...filteredScans.map((s) => [s.ticketCode, s.exhibitorCompany, s.staffName, s.method === 'camera' ? 'دوربین' : 'دستی', formatDateTime(s.scannedAt)]),
      ])
    } else {
      downloadCsv('agreements.csv', [
        ['طرف قرارداد', 'غرفه', 'موضوع', 'مکان', 'وضعیت', 'تاییدکننده', 'تاریخ'],
        ...filteredAgreements.map((a) => [a.partnerName, a.exhibitorCompany, a.topic, a.location, statusInfo[a.status].label, a.approvedByStaffName, formatDateTime(a.date)]),
      ])
    }
  }

  const chipStyle = { background: 'rgba(190,156,119,0.15)', color: '#e8cfa8', border: '1px solid rgba(190,156,119,0.3)' }

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
        <PageTitle>افراد و قرارهای اسکن‌شده</PageTitle>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => { setTab('scans'); setSearch('') }}
            className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
            style={{ background: tab === 'scans' ? '#be9c77' : 'rgba(255,255,255,0.06)', color: tab === 'scans' ? '#1b2134' : '#9b9baf', border: 'none', cursor: 'pointer' }}
          >
            دفتر اسکن‌ها ({toFa(mockScans.length)})
          </button>
          <button
            onClick={() => { setTab('agreements'); setSearch('') }}
            className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
            style={{ background: tab === 'agreements' ? '#be9c77' : 'rgba(255,255,255,0.06)', color: tab === 'agreements' ? '#1b2134' : '#9b9baf', border: 'none', cursor: 'pointer' }}
          >
            توافقات نمایشگاه ({toFa(mockAgreements.length)})
          </button>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tab === 'scans' ? 'جست‌وجوی کد بلیط، غرفه یا عضو تیم' : 'جست‌وجوی نام طرف قرارداد یا غرفه'}
          className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none mb-2.5"
          style={{ color: '#1b2134' }}
        />

        <div className="flex gap-1.5 flex-wrap mb-3">
          <select value={exhibitorFilter} onChange={(e) => setExhibitorFilter(e.target.value)} className="text-[9px] rounded-lg px-2 py-1.5 outline-none" style={chipStyle}>
            <option value="">همه‌ی غرفه‌ها</option>
            {exhibitorOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <select value={dateRange} onChange={(e) => setDateRange(e.target.value as DateRangeFilter)} className="text-[9px] rounded-lg px-2 py-1.5 outline-none" style={chipStyle}>
            <option value="all">کل بازه</option>
            <option value="today">امروز</option>
            <option value="week">۷ روز اخیر</option>
            <option value="custom">بازه‌ی دلخواه</option>
          </select>

          <button onClick={exportCsv} className="text-[9px] font-bold rounded-lg px-2.5 py-1.5" style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}>
            خروجی CSV
          </button>
        </div>

        {dateRange === 'custom' && (
          <div className="flex gap-2 mb-3">
            <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="flex-1 bg-white rounded-lg px-2.5 py-2 text-[10px] outline-none" style={{ color: '#1b2134' }} />
            <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="flex-1 bg-white rounded-lg px-2.5 py-2 text-[10px] outline-none" style={{ color: '#1b2134' }} />
          </div>
        )}

        {tab === 'scans' && scansByExhibitor.length > 0 && (
          <div className="rounded-2xl p-3.5 mb-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-[9.5px] font-bold mb-2.5" style={{ color: '#be9c77' }}>تعداد اسکن به تفکیک غرفه</div>
            <div className="flex flex-col gap-2">
              {scansByExhibitor.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between text-[8.5px] mb-0.5" style={{ color: '#c9c7d0' }}>
                    <span>{name}</span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{toFa(count)}</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: '5px', background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / maxScanCount) * 100}%`, background: '#be9c77' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'scans' && (
          <div className="flex flex-col gap-2">
            {filteredScans.length === 0 && <p className="text-[11px] text-center py-6" style={{ color: '#9b9baf' }}>موردی پیدا نشد</p>}
            {filteredScans.map((s) => {
              const suspicious = suspiciousTicketCodes.has(s.ticketCode)
              return (
                <div key={s.id} className="bg-white rounded-xl px-3.5 py-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold" dir="ltr" style={{ color: '#1b2134', textAlign: 'right' }}>{s.ticketCode}</div>
                      <div className="text-[8.5px] mt-0.5" style={{ color: '#9b9baf' }}>
                        {s.exhibitorCompany} · اسکن‌شده توسط {s.staffName}
                      </div>
                    </div>
                    <div className="text-left">
                      <span
                        className="inline-block text-[7px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{ background: s.method === 'camera' ? '#e3f0e0' : 'rgba(190,156,119,0.15)', color: s.method === 'camera' ? '#3f6b4d' : '#8a6d4d' }}
                      >
                        {s.method === 'camera' ? 'دوربین' : 'دستی'}
                      </span>
                      <div className="text-[8px] mt-1" style={{ color: '#9b9baf' }}>{formatDateTime(s.scannedAt)}</div>
                    </div>
                  </div>
                  {suspicious && (
                    <div className="mt-2 pt-2 text-[8px]" style={{ borderTop: '1px solid #f0ede6', color: '#d9534f' }}>
                      ⚠ الگوی غیرعادی: این بلیط توسط چند غرفه‌ی مختلف در بازه‌ی زمانی کوتاه اسکن شده — بررسی شود
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {tab === 'agreements' && (
          <div className="flex flex-col gap-2.5">
            {filteredAgreements.length === 0 && <p className="text-[11px] text-center py-6" style={{ color: '#9b9baf' }}>موردی پیدا نشد</p>}
            {filteredAgreements.map((a) => {
              const st = statusInfo[a.status]
              const cat = categoryInfo(a.exhibitorCategory)
              return (
                <div key={a.id} className="bg-white rounded-2xl p-3.5">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>{a.partnerName}</span>
                    <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: st.bg, color: st.text }}>{st.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[8px]" style={{ color: '#9b9baf' }}>{a.exhibitorCompany}</span>
                    {cat && <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: cat.color, color: cat.text }}>{cat.label}</span>}
                  </div>
                  <div className="text-[9px]" style={{ color: '#9b9baf' }}>{a.topic}</div>
                  <div className="flex gap-2.5 mt-2 text-[8px]" style={{ color: '#8a6d4d' }}>
                    <span>{a.location}</span>
                    <span>تاییدکننده: {a.approvedByStaffName}</span>
                    <span>{formatDateTime(a.date)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="text-[8px] text-center mt-4" style={{ color: '#6f6e78' }}>
          داده‌ی نمونه — بعد از اتصال دیتابیس واقعی، اطلاعات همه‌ی غرفه‌ها به‌صورت زنده نمایش داده می‌شود
        </div>
      </div>
    </div>
  )
}
