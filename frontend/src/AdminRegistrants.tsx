import { useState, useMemo } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { categories, categoryInfo, type CategoryId } from './ExhibitorProducts'

type Tab = 'visitors' | 'exhibitors'
type SortMode = 'newest' | 'alphabetical' | 'category'

interface ScanDetail {
  exhibitorCompany: string
  staffName: string
  scannedAt: number
}

interface MockVisitor {
  id: string
  fullName: string
  age: number
  gender: 'مرد' | 'زن'
  jobTitle: string
  company: string
  category: CategoryId
  wantsJob: boolean
  scanned: boolean
  scanDetails: ScanDetail[]
  registeredAt: number
}

interface MockExhibitor {
  id: string
  companyName: string
  code: string
  category: CategoryId
  contactPhone: string
  staffName: string
  approvalStatus: 'active' | 'pending'
  productsCount: number
  panelsCount: number
  agreementsCount: number
  registeredAt: number
}

const mockVisitors: MockVisitor[] = [
  {
    id: 'v1', fullName: 'سارا احمدی', age: 28, gender: 'زن', jobTitle: 'کارشناس ارشد بیمه', company: 'بیمه‌ی آسیا', category: 'insurance', wantsJob: true, scanned: true,
    scanDetails: [
      { exhibitorCompany: 'بانک آینده', staffName: 'زهرا', scannedAt: Date.now() - 3600000 * 3 },
      { exhibitorCompany: 'بیمه‌ی البرز', staffName: 'سمیه', scannedAt: Date.now() - 3600000 * 1 },
    ],
    registeredAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'v2', fullName: 'علی رضایی', age: 35, gender: 'مرد', jobTitle: 'تحلیل‌گر مالی', company: 'کارگزاری مفید', category: 'capital', wantsJob: false, scanned: true,
    scanDetails: [{ exhibitorCompany: 'کارگزاری آگاه', staffName: 'رضا', scannedAt: Date.now() - 3600000 * 4 }],
    registeredAt: Date.now() - 86400000,
  },
  {
    id: 'v3', fullName: 'مریم کریمی', age: 24, gender: 'زن', jobTitle: 'دانشجو', company: '—', category: 'bank', wantsJob: true, scanned: false,
    scanDetails: [],
    registeredAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'v4', fullName: 'حسین نوری', age: 41, gender: 'مرد', jobTitle: 'مدیر فناوری', company: 'شرکت فناوران داده', category: 'infra', wantsJob: false, scanned: false,
    scanDetails: [],
    registeredAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'v5', fullName: 'زهرا مرادی', age: 30, gender: 'زن', jobTitle: 'کارشناس بانکی', company: 'بانک ملت', category: 'bank', wantsJob: false, scanned: true,
    scanDetails: [{ exhibitorCompany: 'بانک آینده', staffName: 'زهرا', scannedAt: Date.now() - 86400000 }],
    registeredAt: Date.now() - 86400000 * 3,
  },
]

const mockExhibitors: MockExhibitor[] = [
  { id: 'e1', companyName: 'بانک آینده', code: 'EXH-1000', category: 'bank', contactPhone: '09121110000', staffName: 'زهرا', approvalStatus: 'active', productsCount: 5, panelsCount: 2, agreementsCount: 3, registeredAt: Date.now() - 86400000 * 10 },
  { id: 'e2', companyName: 'کارگزاری آگاه', code: 'EXH-2000', category: 'capital', contactPhone: '09122220000', staffName: 'رضا', approvalStatus: 'active', productsCount: 2, panelsCount: 1, agreementsCount: 0, registeredAt: Date.now() - 86400000 * 8 },
  { id: 'e3', companyName: 'بیمه‌ی البرز', code: 'EXH-3000', category: 'insurance', contactPhone: '09123330000', staffName: 'سمیه', approvalStatus: 'pending', productsCount: 0, panelsCount: 0, agreementsCount: 0, registeredAt: Date.now() - 3600000 * 6 },
]

const PAGE_SIZE = 4

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('fa-IR')
}

function formatDateTime(ts: number) {
  const d = new Date(ts)
  return `${d.toLocaleDateString('fa-IR')} ساعت ${d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`
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

export default function AdminRegistrants({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('visitors')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | ''>('')
  const [genderFilter, setGenderFilter] = useState<'مرد' | 'زن' | ''>('')
  const [sortMode, setSortMode] = useState<SortMode>('newest')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [exhibitors, setExhibitors] = useState(mockExhibitors)

  const filteredVisitors = useMemo(() => {
    let list = mockVisitors.filter(
      (v) =>
        (search.trim() === '' || v.fullName.includes(search.trim())) &&
        (categoryFilter === '' || v.category === categoryFilter) &&
        (genderFilter === '' || v.gender === genderFilter)
    )
    if (sortMode === 'alphabetical') list = [...list].sort((a, b) => a.fullName.localeCompare(b.fullName, 'fa'))
    else if (sortMode === 'category') list = [...list].sort((a, b) => a.category.localeCompare(b.category))
    else list = [...list].sort((a, b) => b.registeredAt - a.registeredAt)
    return list
  }, [search, categoryFilter, genderFilter, sortMode])

  const filteredExhibitors = useMemo(() => {
    let list = exhibitors.filter(
      (e) =>
        (search.trim() === '' || e.companyName.includes(search.trim())) &&
        (categoryFilter === '' || e.category === categoryFilter)
    )
    if (sortMode === 'alphabetical') list = [...list].sort((a, b) => a.companyName.localeCompare(b.companyName, 'fa'))
    else if (sortMode === 'category') list = [...list].sort((a, b) => a.category.localeCompare(b.category))
    else list = [...list].sort((a, b) => b.registeredAt - a.registeredAt)
    return list
  }, [search, categoryFilter, sortMode, exhibitors])

  const activeList = tab === 'visitors' ? filteredVisitors : filteredExhibitors
  const totalPages = Math.max(Math.ceil(activeList.length / PAGE_SIZE), 1)
  const pageItems = activeList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const switchTab = (t: Tab) => {
    setTab(t)
    setPage(1)
    setExpandedId(null)
    setCategoryFilter('')
    setGenderFilter('')
  }

  const toggleApproval = (id: string) => {
    setExhibitors((prev) =>
      prev.map((e) => (e.id === id ? { ...e, approvalStatus: e.approvalStatus === 'active' ? 'pending' : 'active' } : e))
    )
  }

  const exportCsv = () => {
    if (tab === 'visitors') {
      downloadCsv('visitors.csv', [
        ['نام', 'سن', 'جنسیت', 'شغل', 'شرکت', 'حوزه', 'تمایل به استخدام', 'وضعیت اسکن', 'تاریخ ثبت‌نام'],
        ...filteredVisitors.map((v) => [
          v.fullName, String(v.age), v.gender, v.jobTitle, v.company,
          categoryInfo(v.category)?.label || '', v.wantsJob ? 'بله' : 'خیر',
          v.scanned ? 'وارد شده' : 'وارد نشده', formatDate(v.registeredAt),
        ]),
      ])
    } else {
      downloadCsv('exhibitors.csv', [
        ['نام غرفه', 'کد', 'حوزه', 'تلفن', 'نام تماس', 'وضعیت', 'محصول', 'پنل', 'قرارداد', 'تاریخ ثبت‌نام'],
        ...filteredExhibitors.map((e) => [
          e.companyName, e.code, categoryInfo(e.category)?.label || '', e.contactPhone, e.staffName,
          e.approvalStatus === 'active' ? 'فعال' : 'در انتظار تایید',
          String(e.productsCount), String(e.panelsCount), String(e.agreementsCount), formatDate(e.registeredAt),
        ]),
      ])
    }
  }

  const chipStyle = {
    background: 'rgba(190,156,119,0.15)',
    color: '#e8cfa8',
    border: '1px solid rgba(190,156,119,0.3)',
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
        <PageTitle>مدیریت ثبت‌نامی‌ها</PageTitle>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => switchTab('visitors')}
            className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
            style={{
              background: tab === 'visitors' ? '#be9c77' : 'rgba(255,255,255,0.06)',
              color: tab === 'visitors' ? '#1b2134' : '#9b9baf',
              border: 'none', cursor: 'pointer',
            }}
          >
            بازدیدکنندگان ({mockVisitors.length.toLocaleString('fa-IR')})
          </button>
          <button
            onClick={() => switchTab('exhibitors')}
            className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
            style={{
              background: tab === 'exhibitors' ? '#be9c77' : 'rgba(255,255,255,0.06)',
              color: tab === 'exhibitors' ? '#1b2134' : '#9b9baf',
              border: 'none', cursor: 'pointer',
            }}
          >
            غرفه‌داران ({exhibitors.length.toLocaleString('fa-IR')})
          </button>
        </div>

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder={tab === 'visitors' ? 'جست‌وجوی نام بازدیدکننده' : 'جست‌وجوی نام غرفه'}
          className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none mb-2.5"
          style={{ color: '#1b2134' }}
        />

        <div className="flex gap-1.5 flex-wrap mb-4">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value as CategoryId)
              setPage(1)
            }}
            className="text-[9px] rounded-lg px-2 py-1.5 outline-none"
            style={chipStyle}
          >
            <option value="">همه‌ی حوزه‌ها</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          {tab === 'visitors' && (
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value as 'مرد' | 'زن' | '')
                setPage(1)
              }}
              className="text-[9px] rounded-lg px-2 py-1.5 outline-none"
              style={chipStyle}
            >
              <option value="">همه‌ی جنسیت‌ها</option>
              <option value="مرد">مرد</option>
              <option value="زن">زن</option>
            </select>
          )}

          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="text-[9px] rounded-lg px-2 py-1.5 outline-none"
            style={chipStyle}
          >
            <option value="newest">جدیدترین</option>
            <option value="alphabetical">الفبایی</option>
            <option value="category">بر اساس حوزه</option>
          </select>

          <button
            onClick={exportCsv}
            className="text-[9px] font-bold rounded-lg px-2.5 py-1.5"
            style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
          >
            خروجی CSV
          </button>
        </div>

        {pageItems.length === 0 && (
          <p className="text-[11px] text-center py-6" style={{ color: '#9b9baf' }}>موردی پیدا نشد</p>
        )}

        <div className="flex flex-col gap-2 mb-3">
          {tab === 'visitors' &&
            (pageItems as MockVisitor[]).map((v) => {
              const cat = categoryInfo(v.category)
              const isOpen = expandedId === v.id
              return (
                <div key={v.id} className="bg-white rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isOpen ? null : v.id)}
                    className="w-full text-right p-3"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold" style={{ color: '#1b2134' }}>{v.fullName}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[7px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ background: v.scanned ? '#e3f0e0' : 'rgba(155,155,175,0.15)', color: v.scanned ? '#3f6b4d' : '#9b9baf' }}
                        >
                          {v.scanned ? '● وارد شده' : '○ وارد نشده'}
                        </span>
                        {cat && (
                          <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: cat.color, color: cat.text }}>
                            {cat.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-[9px] mt-1" style={{ color: '#9b9baf' }}>
                      {v.age} سال · {v.gender} · {v.jobTitle}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 text-[9px]" style={{ borderTop: '1px solid #f0ede6', color: '#5a5a5a' }}>
                      <div className="pt-2.5 flex justify-between"><span>شرکت</span><span style={{ fontWeight: 700 }}>{v.company}</span></div>
                      <div className="flex justify-between mt-1"><span>تمایل به استخدام</span><span style={{ fontWeight: 700 }}>{v.wantsJob ? 'بله' : 'خیر'}</span></div>
                      <div className="flex justify-between mt-1"><span>تاریخ ثبت‌نام</span><span style={{ fontWeight: 700 }}>{formatDate(v.registeredAt)}</span></div>

                      <div className="mt-2.5 pt-2.5" style={{ borderTop: '1px solid #f0ede6' }}>
                        <div className="font-bold mb-1.5" style={{ color: '#8a6d4d' }}>جزئیات اسکن‌ها</div>
                        {v.scanDetails.length === 0 ? (
                          <div style={{ color: '#9b9baf' }}>هنوز توسط هیچ غرفه‌ای اسکن نشده</div>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            {v.scanDetails.map((s, i) => (
                              <div key={i} className="rounded-lg px-2 py-1.5" style={{ background: '#f7f5ef' }}>
                                <div className="flex justify-between">
                                  <span style={{ fontWeight: 700 }}>{s.exhibitorCompany}</span>
                                  <span style={{ color: '#9b9baf' }}>{s.staffName}</span>
                                </div>
                                <div className="mt-0.5" style={{ color: '#9b9baf' }}>{formatDateTime(s.scannedAt)}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

          {tab === 'exhibitors' &&
            (pageItems as MockExhibitor[]).map((e) => {
              const cat = categoryInfo(e.category)
              const isOpen = expandedId === e.id
              return (
                <div key={e.id} className="bg-white rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isOpen ? null : e.id)}
                    className="w-full text-right p-3"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold" style={{ color: '#1b2134' }}>{e.companyName}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[7px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ background: e.approvalStatus === 'active' ? '#e3f0e0' : 'rgba(217,83,79,0.12)', color: e.approvalStatus === 'active' ? '#3f6b4d' : '#c76b5f' }}
                        >
                          {e.approvalStatus === 'active' ? '● فعال' : '○ در انتظار تایید'}
                        </span>
                        {cat && (
                          <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: cat.color, color: cat.text }}>
                            {cat.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-[9px] mt-1" dir="ltr" style={{ color: '#9b9baf', textAlign: 'right' }}>
                      {e.code} · {e.contactPhone}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 text-[9px]" style={{ borderTop: '1px solid #f0ede6', color: '#5a5a5a' }}>
                      <div className="pt-2.5 flex justify-between"><span>مسئول تماس</span><span style={{ fontWeight: 700 }}>{e.staffName}</span></div>
                      <div className="flex justify-between mt-1"><span>محصول / پنل / قرارداد</span><span style={{ fontWeight: 700 }}>{e.productsCount} / {e.panelsCount} / {e.agreementsCount}</span></div>
                      <div className="flex justify-between mt-1"><span>تاریخ ثبت‌نام</span><span style={{ fontWeight: 700 }}>{formatDate(e.registeredAt)}</span></div>
                      <button
                        onClick={() => toggleApproval(e.id)}
                        className="w-full mt-2.5 rounded-lg py-2 text-[9.5px] font-bold"
                        style={{
                          background: e.approvalStatus === 'active' ? '#f7f5ef' : '#3f6b4d',
                          color: e.approvalStatus === 'active' ? '#c76b5f' : '#fff',
                          border: 'none', cursor: 'pointer',
                        }}
                      >
                        {e.approvalStatus === 'active' ? 'لغو فعال‌سازی غرفه' : 'تایید و فعال‌سازی غرفه'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.06)', color: page === 1 ? '#5a5a68' : '#e8cfa8', border: 'none', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
            >
              بعدی
            </button>
            <span className="text-[10px]" style={{ color: '#9b9baf' }}>
              صفحه‌ی {page.toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="text-[10px] font-bold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.06)', color: page === totalPages ? '#5a5a68' : '#e8cfa8', border: 'none', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
            >
              قبلی
            </button>
          </div>
        )}
      </div>
    </div>
  )
}