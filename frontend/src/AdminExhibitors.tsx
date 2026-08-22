import { useState } from 'react'
import * as XLSX from 'xlsx'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { categoryLabel } from './Participants'

export interface ExhibitorAccount {
  code: string
  companyName: string
  category: string
  hall: string
  exhibitionName: string
  nationalId: string
  registeredPhone: string
  boothNumber: string
  area: string
  cardCount: string
  ceoName: string
  createdAt?: number
}

const financialCategories: { id: string; label: string }[] = [
  { id: 'bank', label: categoryLabel.bank },
  { id: 'insurance', label: categoryLabel.insurance },
  { id: 'capital', label: categoryLabel.capital },
  { id: 'infra', label: categoryLabel.infra },
]

const EXHIBITION_PAINT_RESIN = 'نمایشگاه صنعت رنگ و رزین'
const EXHIBITION_FINANCIAL = 'نمایشگاه صنعت مالی'
const EXHIBITION_MINING = 'نمایشگاه صنعت معدن و تجهیزات'

const exhibitions = [EXHIBITION_PAINT_RESIN, EXHIBITION_FINANCIAL, EXHIBITION_MINING]

const paintResinCategories = [
  'پوشش‌های صنعتی',
  'انواع رنگ',
  'انواع رزین',
  'صنعت آبکاری (آبکاری نیکل، کروم، فلزات، پلاستیک، تصفیه آب و پساب‌های آبکاری، آنودایزینگ، تست محلول‌های آبکاری، سیاهکاری صنعتی و تزئینی، فانتاکروم)',
  'تولیدکنندگان انواع رنگ‌ها و پوشش‌های با کاربری (ساختمانی، صنعتی، خودرویی، دریایی، تزئینی و دکورال، کف پوش‌های صنعتی، خطوط لوله و عایق‌بندی سطوح)',
  'کامپوزیت‌ها',
  'درزگیر ماشین',
  'تولیدکنندگان مواد و پوشش‌های کامپوزیتی',
  'سازندگان قطعات کامپوزیتی',
  'تجهیزات و ماشین‌آلات تولید و اجرای رنگ و انواع پوشش‌ها',
  'تجهیزات آزمایشگاهی و بازرسی پوشش و رنگ',
  'صنایع بسته‌بندی رنگ و مواد شیمیایی و تولیدکنندگان ظروف مربوطه',
  'تجهیزات ایمنی و بازیافت',
  'نانو پوشش‌ها، فرایندها و پوشش‌های نوین',
  'انواع چسب‌های صنعتی و عمومی',
  'شرکت‌های مشاور فنی مهندسی و پیمانکاران',
  'مواد شیمیایی و مواد خام (انواع رزین‌ها، رنگدانه‌ها، تینر و انواع حلال‌ها، مواد افزودنی، انواع نمک‌ها و مواد شیمیایی آبکاری، ممانعت‌کننده و مواد شیمیایی ضد خوردگی)',
  'مراکز علمی تحقیقاتی و انجمن‌های صنفی مرتبط با صنایع پوشش',
  'نشریات تخصصی',
  'صنعت آبکاری',
  'رنگ‌های پودری',
  'پوشش‌های پتینه',
  'رنگ‌های پایه آب',
  'گالوانیزه',
  'عملیات حرارتی',
  'خوردگی',
  'رنگ ماشین',
  'رنگ‌های ضدحریق',
  'استارت‌آپ‌ها',
]

const miningCategories = [
  'معادن زیرزمینی و روباز',
  'ماشین‌آلات معدنی و متعلقات',
  'دستگاه‌ها، تجهیزات و ماشین‌آلات خاکبرداری و متعلقات',
  'ماشین‌آلات راه و جاده‌سازی و متعلقات',
  'ماشین‌آلات ساختمانی، تجهیزات و متعلقات',
  'دستگاه‌ها، تجهیزات و ماشین‌آلات حفر و نگهداری تونل',
  'انواع ماشین‌آلات و تجهیزات حفاری',
  'دستگاه‌ها و تجهیزات مرتبط به کانه‌آرایی و فرآوری معدنی',
  'تجهیزات مربوط به انتقال و جابجایی مواد معدنی',
  'ماشین‌آلات و تجهیزات اکتشاف معادن',
  'تجهیزات وابسته به ذوب و استحصال فلزات',
  'سنگ‌های قیمتی و گرانبها',
  'معدن و محیط زیست',
  'بخش بیمه در صنعت معدن',
  'مراکز و سازمان‌های تحقیقاتی و توسعه',
  'سنگ‌های ساختمانی و تزئین، ماشین‌آلات، تجهیزات و ابزار برش و فرآوری سنگ تزئینی',
  'سیستم‌های تهویه معادن',
  'نرم‌افزارها و سیستم‌های پردازش داده‌های معدنی',
  'تکنولوژی‌های نوین در صنعت معدن',
  'مواد منفجره و تجهیزات انفجار',
  'تجهیزات تامین برق و روشنایی معادن',
  'تجهیزات، تخلیه و آبرسانی معادن زیرزمینی',
  'انواع کمپرسور و پمپ',
  'دستگاه‌ها و تجهیزات آزمایشگاهی و آنالیز مواد معدنی',
  'تجهیزات ایمنی و بهداشتی معادن',
  'تجهیزات نگهداری معادن',
  'تجهیزات، قطعات و لوازم یدکی',
  'شرکت‌ها و پیمانکاران معدنی',
  'پیمانکاری راه و جاده‌سازی، پیمانکاری ساختمانی',
  'مهندسین مشاور، سرویس‌های تاسیساتی و ساختمان',
  'طراحی معادن، خدمات، توسعه و پژوهش و فناوری روز در بخش معدن',
  'فرصت‌های سرمایه‌گذاری در بخش معدن',
  'بنادر و کشتیرانی و حمل‌ونقل در بخش معدن',
]

function categoryOptionsFor(exhibitionName: string): { id: string; label: string }[] {
  if (exhibitionName === EXHIBITION_PAINT_RESIN) {
    return paintResinCategories.map((c) => ({ id: c, label: c }))
  }
  if (exhibitionName === EXHIBITION_MINING) {
    return miningCategories.map((c) => ({ id: c, label: c }))
  }
  return financialCategories
}

const emptyForm: Omit<ExhibitorAccount, 'code'> = {
  companyName: '',
  category: 'bank',
  hall: '',
  exhibitionName: EXHIBITION_FINANCIAL,
  nationalId: '',
  registeredPhone: '',
  boothNumber: '',
  area: '',
  cardCount: '',
  ceoName: '',
}

function suggestNextCode(allCodes: string[]) {
  const nums = allCodes
    .map((c) => {
      const match = c.match(/(\d+)/)
      return match ? Number(match[1]) : 0
    })
    .filter((n) => !isNaN(n))
  const max = nums.length > 0 ? Math.max(...nums) : 3000
  const next = Math.ceil((max + 1) / 1000) * 1000
  return `EXH-${next}`
}

// --- ورود گروهی از فایل اکسل ---

const IMPORT_COLUMNS: { field: string; aliases: string[]; sample: string }[] = [
  { field: 'companyName', aliases: ['اسم شرکت', 'نام شرکت', 'شرکت'], sample: 'بانک آینده' },
  { field: 'exhibitionName', aliases: ['اسم نمایشگاه', 'نمایشگاه'], sample: EXHIBITION_FINANCIAL },
  { field: 'ceoName', aliases: ['نام مدیرعامل', 'مدیرعامل'], sample: 'علی محمدی' },
  { field: 'nationalId', aliases: ['شناسه ملی'], sample: '10861234567' },
  {
    field: 'registeredPhone',
    aliases: ['شماره تلفن ثبت نام در سانامه بانیان', 'شماره تلفن ثبت‌نام', 'شماره تلفن', 'تلفن', 'شماره موبایل', 'موبایل'],
    sample: '09121234567',
  },
  { field: 'code', aliases: ['کد رهگیری', 'کد'], sample: 'EXH-4000' },
  { field: 'boothNumber', aliases: ['شماره غرفه'], sample: '۱۲' },
  { field: 'hall', aliases: ['شماره سالن'], sample: '۵' },
  { field: 'area', aliases: ['متراژ'], sample: '۲۴' },
  { field: 'cardCount', aliases: ['تعداد کارت غرفه دار (یوزر)', 'تعداد کارت غرفه‌دار', 'تعداد کارت'], sample: '۳' },
  { field: 'category', aliases: ['گروه کالایی', 'دسته بندی', 'دسته‌بندی', 'دسته'], sample: categoryLabel.bank },
]

interface ImportRow {
  companyName: string
  exhibitionName: string
  category: string
  hall: string
  boothNumber: string
  nationalId: string
  registeredPhone: string
  area: string
  cardCount: string
  ceoName: string
  code: string
  status: 'ok' | 'warning' | 'error'
  message: string
}

function normalizeHeader(h: string) {
  return h.replace(/[\s‌‏‎]+/g, '').trim()
}

function getField(row: Record<string, unknown>, aliases: string[]): string {
  const rowKeys = Object.keys(row).map((k) => ({ key: k, norm: normalizeHeader(k) }))
  for (const alias of aliases) {
    const aliasNorm = normalizeHeader(alias)
    const match = rowKeys.find((k) => k.norm === aliasNorm)
    if (match) {
      const v = row[match.key]
      return v === undefined || v === null ? '' : String(v).trim()
    }
  }
  return ''
}

function buildImportRow(row: Record<string, unknown>, usedCodes: Set<string>, usedNames: Set<string>): ImportRow {
  const get = (field: string) => getField(row, IMPORT_COLUMNS.find((c) => c.field === field)?.aliases ?? [])

  const companyName = get('companyName')
  if (!companyName) {
    return {
      companyName: '', exhibitionName: '', category: '', hall: '', boothNumber: '',
      nationalId: '', registeredPhone: '', area: '', cardCount: '', ceoName: '', code: '',
      status: 'error', message: 'نام شرکت خالی است — این ردیف نادیده گرفته شد',
    }
  }

  const messages: string[] = []
  let status: ImportRow['status'] = 'ok'

  const exhibitionNameRaw = get('exhibitionName')
  let exhibitionName = exhibitions.find((ex) => ex === exhibitionNameRaw)
  if (!exhibitionName) {
    if (exhibitionNameRaw.includes('رنگ') || exhibitionNameRaw.includes('رزین')) exhibitionName = EXHIBITION_PAINT_RESIN
    else if (exhibitionNameRaw.includes('معدن')) exhibitionName = EXHIBITION_MINING
    else if (exhibitionNameRaw.includes('مالی') || !exhibitionNameRaw) exhibitionName = EXHIBITION_FINANCIAL
    else {
      exhibitionName = EXHIBITION_FINANCIAL
      messages.push(`نمایشگاه «${exhibitionNameRaw}» شناخته نشد — «${EXHIBITION_FINANCIAL}» در نظر گرفته شد`)
      status = 'warning'
    }
  }

  const options = categoryOptionsFor(exhibitionName)
  const categoryRaw = get('category')
  let category = categoryRaw
  if (!category) {
    category = options[0]?.id ?? ''
  } else {
    const found = options.find((o) => o.id === category || o.label === category)
    if (found) category = found.id
  }

  const nationalId = get('nationalId').replace(/\D/g, '')

  let registeredPhone = get('registeredPhone').replace(/\D/g, '')
  if (registeredPhone.startsWith('0')) registeredPhone = registeredPhone.slice(1)
  registeredPhone = registeredPhone.slice(0, 10)

  const boothNumber = get('boothNumber')
  const hall = get('hall')
  const area = get('area')
  const cardCount = get('cardCount')
  const ceoName = get('ceoName')

  let code = get('code').toUpperCase()
  if (!code) {
    code = suggestNextCode(Array.from(usedCodes))
  } else if (usedCodes.has(code)) {
    const original = code
    code = suggestNextCode(Array.from(usedCodes))
    messages.push(`کد «${original}» تکراری بود — کد «${code}» جایگزین شد`)
    status = 'warning'
  }
  usedCodes.add(code)

  const normalizedName = normalizeHeader(companyName)
  if (usedNames.has(normalizedName)) {
    messages.push('شرکتی با همین اسم از قبل تو لیست هست — لطفاً چک کنید تکراری نباشه')
    status = 'warning'
  }
  usedNames.add(normalizedName)

  return {
    companyName, exhibitionName, category, hall, boothNumber, nationalId,
    registeredPhone, area, cardCount, ceoName, code, status, message: messages.join(' · '),
  }
}

const toFaCount = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

function downloadImportTemplate() {
  const headers = IMPORT_COLUMNS.map((c) => c.aliases[0])
  const sample = IMPORT_COLUMNS.map((c) => c.sample)
  const ws = XLSX.utils.aoa_to_sheet([headers, sample])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'غرفه‌داران')
  XLSX.writeFile(wb, 'نمونه-غرفه-داران.xlsx')
}

function exportAccountsToExcel(list: ExhibitorAccount[]) {
  const headers = IMPORT_COLUMNS.map((c) => c.aliases[0])
  const rows = list.map((a) =>
    IMPORT_COLUMNS.map((c) => {
      switch (c.field) {
        case 'companyName': return a.companyName
        case 'exhibitionName': return a.exhibitionName
        case 'ceoName': return a.ceoName
        case 'nationalId': return a.nationalId
        case 'registeredPhone': return a.registeredPhone ? '0' + a.registeredPhone : ''
        case 'code': return a.code
        case 'boothNumber': return a.boothNumber
        case 'hall': return a.hall
        case 'area': return a.area
        case 'cardCount': return a.cardCount
        case 'category': return categoryLabel[a.category] || a.category
        default: return ''
      }
    })
  )
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'غرفه‌داران')
  XLSX.writeFile(wb, `غرفه-داران.xlsx`)
}

export default function AdminExhibitors({
  accounts,
  setAccounts,
  existingCodes,
  onLogActivity,
  onBack,
}: {
  accounts: ExhibitorAccount[]
  setAccounts: React.Dispatch<React.SetStateAction<ExhibitorAccount[]>>
  existingCodes: Record<string, string>
  onLogActivity: (text: string) => void
  onBack: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [codeInput, setCodeInput] = useState('')
  const [formError, setFormError] = useState('')

  const [showImport, setShowImport] = useState(false)
  const [importFileName, setImportFileName] = useState('')
  const [importRows, setImportRows] = useState<ImportRow[]>([])
  const [importParseError, setImportParseError] = useState('')

  const [listSearch, setListSearch] = useState('')
  const [listExhibitionFilter, setListExhibitionFilter] = useState('')

  const fieldBoxClass = 'flex items-center gap-2 bg-white rounded-xl px-3.5 py-3'
  const fieldClass = 'flex-1 border-none outline-none text-xs bg-transparent'

  const allKnownCodes = [...Object.keys(existingCodes), ...accounts.map((a) => a.code)]

  const filteredAccounts = accounts.filter((a) => {
    const matchesSearch = listSearch.trim() === '' || a.companyName.includes(listSearch.trim())
    const matchesExhibition = listExhibitionFilter === '' || a.exhibitionName === listExhibitionFilter
    return matchesSearch && matchesExhibition
  })

  const duplicateNameMatch = (() => {
    const trimmed = form.companyName.trim()
    if (!trimmed) return undefined
    return accounts.find((a) => a.companyName.trim() === trimmed && a.code !== editingCode)
  })()

  const openNewForm = () => {
    setForm(emptyForm)
    setCodeInput(suggestNextCode(allKnownCodes))
    setEditingCode(null)
    setFormError('')
    setShowForm(true)
  }

  const openEditForm = (a: ExhibitorAccount) => {
    setForm({
      companyName: a.companyName,
      category: a.category,
      hall: a.hall,
      exhibitionName: a.exhibitionName,
      nationalId: a.nationalId,
      registeredPhone: a.registeredPhone,
      boothNumber: a.boothNumber,
      area: a.area,
      cardCount: a.cardCount,
      ceoName: a.ceoName,
    })
    setCodeInput(a.code)
    setEditingCode(a.code)
    setFormError('')
    setShowForm(true)
  }

  const handleRegisteredPhoneChange = (raw: string) => {
    let digits = raw.replace(/\D/g, '')
    if (digits.startsWith('0')) {
      digits = digits.slice(1)
    }
    digits = digits.slice(0, 10)
    setForm((p) => ({ ...p, registeredPhone: digits }))
  }

  const closeForm = () => {
    setShowForm(false)
    setFormError('')
  }

  const save = () => {
    const companyName = form.companyName.trim()
    const code = codeInput.trim().toUpperCase()
    const hall = form.hall.trim()
    if (!companyName || !code) {
      setFormError('نام شرکت و کد رهگیری الزامی است')
      return
    }
    const codeTakenByOther =
      (existingCodes[code] && (!editingCode || code !== editingCode)) ||
      accounts.some((a) => a.code === code && a.code !== editingCode)
    if (codeTakenByOther) {
      setFormError('این کد رهگیری قبلاً برای یک غرفه‌دار دیگر استفاده شده است')
      return
    }

    const existingAccount = editingCode ? accounts.find((a) => a.code === editingCode) : undefined

    const record: ExhibitorAccount = {
      code,
      companyName,
      category: form.category,
      hall,
      exhibitionName: form.exhibitionName.trim(),
      nationalId: form.nationalId.trim(),
      registeredPhone: form.registeredPhone.trim(),
      boothNumber: form.boothNumber.trim(),
      area: form.area.trim(),
      cardCount: form.cardCount.trim(),
      ceoName: form.ceoName.trim(),
      createdAt: existingAccount?.createdAt ?? Date.now(),
    }

    if (editingCode) {
      setAccounts((prev) => prev.map((a) => (a.code === editingCode ? record : a)))
      onLogActivity(`اطلاعات غرفه‌دار «${companyName}» را ویرایش کرد`)
    } else {
      setAccounts((prev) => [...prev, record])
      onLogActivity(`غرفه‌دار جدید «${companyName}» را با کد ${code} اضافه کرد`)
    }
    setShowForm(false)
    setFormError('')
  }

  const removeAccount = (code: string) => {
    const target = accounts.find((a) => a.code === code)
    if (!target) return
    setAccounts((prev) => prev.filter((a) => a.code !== code))
    onLogActivity(`غرفه‌دار «${target.companyName}» را حذف کرد`)
  }

  const openImport = () => {
    setShowImport(true)
    setImportFileName('')
    setImportRows([])
    setImportParseError('')
  }

  const closeImport = () => {
    setShowImport(false)
    setImportFileName('')
    setImportRows([])
    setImportParseError('')
  }

  const handleImportFile = async (file: File) => {
    setImportParseError('')
    setImportFileName(file.name)
    try {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array' })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
      if (rows.length === 0) {
        setImportParseError('این فایل هیچ ردیفی نداشت')
        setImportRows([])
        return
      }
      const usedCodes = new Set(allKnownCodes)
      const usedNames = new Set(accounts.map((a) => normalizeHeader(a.companyName)))
      const parsed = rows.map((row) => buildImportRow(row, usedCodes, usedNames))
      setImportRows(parsed)
    } catch {
      setImportParseError('خواندن فایل با خطا مواجه شد — مطمئن شوید فایل، اکسل (xlsx) یا CSV معتبر است')
      setImportRows([])
    }
  }

  const validImportRows = importRows.filter((r) => r.status !== 'error')

  const commitImport = () => {
    if (validImportRows.length === 0) return
    const newRecords: ExhibitorAccount[] = validImportRows.map((r) => ({
      code: r.code,
      companyName: r.companyName,
      category: r.category,
      hall: r.hall,
      exhibitionName: r.exhibitionName,
      nationalId: r.nationalId,
      registeredPhone: r.registeredPhone,
      boothNumber: r.boothNumber,
      area: r.area,
      cardCount: r.cardCount,
      ceoName: r.ceoName,
      createdAt: Date.now(),
    }))
    setAccounts((prev) => [...prev, ...newRecords])
    onLogActivity(`${newRecords.length} غرفه‌دار را از فایل اکسل «${importFileName}» اضافه کرد`)
    closeImport()
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden px-6 py-8"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={showForm ? closeForm : showImport ? closeImport : onBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="relative z-10 mt-6">
        <PageTitle>مدیریت غرفه‌داران</PageTitle>

        {!showForm && !showImport && (
          <>
            <p className="text-[9px] text-center mb-4 leading-relaxed" style={{ color: '#9b9baf' }}>
              فقط شرکت‌هایی که این‌جا با کد رهگیری تعریف می‌شوند، می‌توانند به‌عنوان غرفه‌دار وارد پنل شوند
            </p>

            {accounts.length === 0 && (
              <p className="text-[11px] text-center mb-4" style={{ color: '#9b9baf' }}>
                هنوز غرفه‌داری اضافه نکرده‌اید
              </p>
            )}

            {accounts.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                <input
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  placeholder="جست‌وجوی نام شرکت..."
                  className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none"
                  style={{ color: '#1b2134' }}
                />
                <div className="flex gap-1.5 items-center">
                  <select
                    value={listExhibitionFilter}
                    onChange={(e) => setListExhibitionFilter(e.target.value)}
                    className="flex-1 text-[9.5px] rounded-lg px-2 py-1.5 outline-none"
                    style={{ background: 'rgba(190,156,119,0.15)', color: '#e8cfa8', border: '1px solid rgba(190,156,119,0.3)' }}
                  >
                    <option value="" style={{ color: '#000' }}>همه‌ی نمایشگاه‌ها</option>
                    {exhibitions.map((ex) => (
                      <option key={ex} value={ex} style={{ color: '#000' }}>{ex}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => exportAccountsToExcel(filteredAccounts)}
                    className="text-[9px] font-bold rounded-lg px-2.5 py-1.5 flex-shrink-0"
                    style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
                  >
                    خروجی اکسل
                  </button>
                </div>
                <div className="text-[8.5px] px-1" style={{ color: '#9b9baf' }}>
                  {toFaCount(filteredAccounts.length)} از {toFaCount(accounts.length)} غرفه‌دار
                </div>
              </div>
            )}

            {accounts.length > 0 && filteredAccounts.length === 0 && (
              <p className="text-[11px] text-center mb-4" style={{ color: '#9b9baf' }}>
                با این جست‌وجو/فیلتر چیزی پیدا نشد
              </p>
            )}

            <div className="flex flex-col gap-2.5 mb-4">
              {filteredAccounts.map((a) => {
                const incomplete = !a.registeredPhone || !a.nationalId
                return (
                <div key={a.code} className="bg-white rounded-2xl p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <div className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>{a.companyName}</div>
                        {incomplete && (
                          <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(217,83,79,0.12)', color: '#c76b5f' }}>
                            اطلاعات ناقص
                          </span>
                        )}
                      </div>
                      {a.exhibitionName && (
                        <div className="text-[8px] mt-0.5" style={{ color: '#be9c77' }}>{a.exhibitionName}</div>
                      )}
                      <div className="text-[8.5px] mt-1" style={{ color: '#9b9baf' }}>
                        سالن {a.hall || '—'} · غرفه {a.boothNumber || '—'} · {categoryLabel[a.category] || a.category}
                      </div>
                      {(a.ceoName || a.area || a.cardCount) && (
                        <div className="text-[8px] mt-0.5" style={{ color: '#b7b7c7' }}>
                          {a.ceoName && <>مدیرعامل: {a.ceoName}</>}
                          {a.area && <> · متراژ: {a.area}</>}
                          {a.cardCount && <> · تعداد کارت: {a.cardCount}</>}
                        </div>
                      )}
                      {a.createdAt && (
                        <div className="text-[7.5px] mt-0.5" style={{ color: '#c9c9d6' }}>
                          افزوده‌شده: {new Date(a.createdAt).toLocaleDateString('fa-IR')}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-bold px-2 py-1 rounded-md flex-shrink-0" dir="ltr" style={{ background: 'rgba(190,156,119,0.15)', color: '#8a6d4d' }}>
                      {a.code}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-3 mt-2.5">
                    <button
                      onClick={() => openEditForm(a)}
                      className="text-[9px] underline"
                      style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => removeAccount(a.code)}
                      className="text-[9px] underline"
                      style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      حذف
                    </button>
                  </div>
                </div>
                )
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={openNewForm}
                className="flex-1 rounded-xl py-3 text-[11px] font-bold"
                style={{ border: '1.5px dashed rgba(190,156,119,0.5)', color: '#be9c77', background: 'transparent', cursor: 'pointer' }}
              >
                + افزودن غرفه‌دار جدید
              </button>
              <button
                onClick={openImport}
                className="flex-1 rounded-xl py-3 text-[11px] font-bold"
                style={{ border: 'none', color: '#1b2134', background: '#be9c77', cursor: 'pointer' }}
              >
                وارد کردن گروهی از اکسل
              </button>
            </div>
          </>
        )}

        {showImport && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[11px] font-bold mb-1" style={{ color: '#e8cfa8' }}>
              وارد کردن گروهی غرفه‌داران از اکسل
            </div>

            <p className="text-[9px] leading-relaxed" style={{ color: '#9b9baf' }}>
              یک فایل اکسل (xlsx) یا CSV با ستون‌هایی مثل «اسم شرکت»، «اسم نمایشگاه»، «نام مدیرعامل»، «شناسه ملی»، «شماره تلفن»، «کد رهگیری»، «شماره غرفه»، «شماره سالن»، «متراژ»، «تعداد کارت غرفه‌دار» و «گروه کالایی» انتخاب کنید. ترتیب ستون‌ها مهم نیست و اگه کد رهگیری رو خالی بذارید، خودکار براش یه کد می‌سازیم.
            </p>

            <button
              type="button"
              onClick={downloadImportTemplate}
              className="text-[9.5px] font-bold underline self-start"
              style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              دانلود نمونه فایل اکسل
            </button>

            <label
              className="w-full rounded-xl py-4 text-[10.5px] font-bold text-center mt-1"
              style={{ border: '1.5px dashed rgba(190,156,119,0.5)', color: '#be9c77', background: 'transparent', cursor: 'pointer' }}
            >
              {importFileName ? `فایل انتخاب‌شده: ${importFileName}` : 'انتخاب فایل اکسل یا CSV'}
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImportFile(file)
                }}
              />
            </label>

            {importParseError && (
              <div className="text-[9.5px] px-3 py-2 rounded-lg" style={{ background: 'rgba(217,83,79,0.1)', color: '#d9534f', border: '1px solid rgba(217,83,79,0.3)' }}>
                {importParseError}
              </div>
            )}

            {importRows.length > 0 && (
              <>
                <div className="text-[9.5px] px-1 mt-1" style={{ color: '#e8cfa8' }}>
                  از {toFaCount(importRows.length)} ردیف — {toFaCount(validImportRows.length)} مورد آماده‌ی افزودن،{' '}
                  {toFaCount(importRows.length - validImportRows.length)} مورد ناقص و نادیده گرفته می‌شه
                </div>

                <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-0.5">
                  {importRows.map((r, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-2.5"
                      style={{
                        border:
                          r.status === 'error'
                            ? '1px solid rgba(217,83,79,0.4)'
                            : r.status === 'warning'
                              ? '1px solid rgba(190,156,119,0.5)'
                              : '1px solid transparent',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold" style={{ color: '#1b2134' }}>
                          {r.companyName || `ردیف ${toFaCount(i + 1)}`}
                        </span>
                        <span
                          className="text-[8px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
                          style={{
                            background: r.status === 'error' ? 'rgba(217,83,79,0.12)' : r.status === 'warning' ? 'rgba(190,156,119,0.18)' : '#e3f0e0',
                            color: r.status === 'error' ? '#c76b5f' : r.status === 'warning' ? '#8a6d4d' : '#3f6b4d',
                          }}
                        >
                          {r.status === 'error' ? 'نادیده گرفته شد' : r.status === 'warning' ? 'با اخطار' : 'آماده'}
                        </span>
                      </div>
                      {r.status !== 'error' && (
                        <div className="text-[8px] mt-1" style={{ color: '#9b9baf' }} dir="ltr">
                          {r.code} · {r.exhibitionName}
                        </div>
                      )}
                      {r.message && (
                        <div className="text-[8px] mt-1" style={{ color: r.status === 'error' ? '#c76b5f' : '#8a6d4d' }}>
                          {r.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-3 flex gap-2">
              <button onClick={closeImport} className="flex-1 rounded-full py-2.5 font-bold text-[11.5px]" style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}>
                انصراف
              </button>
              <button
                onClick={commitImport}
                disabled={validImportRows.length === 0}
                className="flex-[2] rounded-full py-2.5 font-bold text-xs"
                style={{
                  background: validImportRows.length === 0 ? '#6b6375' : '#be9c77',
                  color: '#1b2134',
                  border: 'none',
                  cursor: validImportRows.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                افزودن {toFaCount(validImportRows.length)} غرفه‌دار
              </button>
            </div>
          </div>
        )}

        {showForm && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[11px] font-bold mb-1" style={{ color: '#e8cfa8' }}>
              {editingCode ? 'ویرایش غرفه‌دار' : 'افزودن غرفه‌دار جدید'}
            </div>

            <div className={fieldBoxClass}>
              <input
                value={form.companyName}
                onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                placeholder="نام شرکت (دقیقاً همان‌طور که در بانیان آنلاین ثبت شده)"
                className={fieldClass}
                style={{ color: '#1b2134' }}
              />
            </div>
            {duplicateNameMatch && (
              <div className="text-[8.5px] px-2 py-1.5 rounded-lg -mt-1" style={{ background: 'rgba(190,156,119,0.15)', color: '#8a6d4d' }}>
                شرکتی با همین اسم قبلاً با کد «{duplicateNameMatch.code}» ثبت شده — اگه تکراری نیست ادامه بدید
              </div>
            )}

            <div className={fieldBoxClass}>
              <select
                value={form.exhibitionName}
                onChange={(e) => {
                  const exhibitionName = e.target.value
                  const nextOptions = categoryOptionsFor(exhibitionName)
                  setForm((p) => ({ ...p, exhibitionName, category: nextOptions[0]?.id ?? '' }))
                }}
                className={fieldClass}
                style={{ color: form.exhibitionName ? '#1b2134' : '#9b9baf' }}
              >
                <option value="" disabled>انتخاب نمایشگاه</option>
                {exhibitions.map((ex) => (
                  <option key={ex} value={ex} style={{ color: '#1b2134' }}>{ex}</option>
                ))}
              </select>
            </div>

            <div className={fieldBoxClass}>
              <input
                value={form.ceoName}
                onChange={(e) => setForm((p) => ({ ...p, ceoName: e.target.value }))}
                placeholder="نام مدیرعامل"
                className={fieldClass}
                style={{ color: '#1b2134' }}
              />
            </div>

            <div className={fieldBoxClass} dir="ltr">
              <input
                value={form.nationalId}
                onChange={(e) => setForm((p) => ({ ...p, nationalId: e.target.value.replace(/\D/g, '') }))}
                placeholder="شناسه ملی"
                className={fieldClass}
                style={{ color: '#1b2134', textAlign: 'right' }}
              />
            </div>

            <div className={fieldBoxClass} dir="ltr">
              <span className="text-sm" style={{ color: '#9b9baf' }}>+98</span>
              <div className="w-px h-5" style={{ background: '#e0e0e0' }}></div>
              <input
                type="tel"
                inputMode="numeric"
                value={form.registeredPhone}
                onChange={(e) => handleRegisteredPhoneChange(e.target.value)}
                placeholder="912 345 6789"
                maxLength={10}
                className={fieldClass}
                style={{ color: '#1b2134' }}
              />
            </div>
            <div className="text-[8px] px-1 -mt-1.5" style={{ color: '#9b9baf' }}>
              شماره تلفن ثبت‌نام‌شده در سامانه‌ی بانیان آنلاین
            </div>

            <div className={fieldBoxClass}>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className={fieldClass}
                style={{ color: '#1b2134' }}
              >
                {categoryOptionsFor(form.exhibitionName).map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="text-[8px] px-1 -mt-1.5" style={{ color: '#9b9baf' }}>
              گروه کالایی — فهرست بسته به نمایشگاه انتخاب‌شده در بالا تغییر می‌کند
            </div>

            <div className="flex gap-2.5">
              <div className={fieldBoxClass + ' flex-1'}>
                <input
                  value={form.boothNumber}
                  onChange={(e) => setForm((p) => ({ ...p, boothNumber: e.target.value }))}
                  placeholder="شماره غرفه"
                  className={fieldClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
              <div className={fieldBoxClass + ' flex-1'}>
                <input
                  value={form.hall}
                  onChange={(e) => setForm((p) => ({ ...p, hall: e.target.value }))}
                  placeholder="شماره سالن"
                  className={fieldClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className={fieldBoxClass + ' flex-1'}>
                <input
                  value={form.area}
                  onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
                  placeholder="متراژ (متر مربع)"
                  className={fieldClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
              <div className={fieldBoxClass + ' flex-1'}>
                <input
                  value={form.cardCount}
                  onChange={(e) => setForm((p) => ({ ...p, cardCount: e.target.value }))}
                  placeholder="تعداد کارت غرفه‌دار"
                  className={fieldClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
            </div>

            <div className={fieldBoxClass} dir="ltr">
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="EXH-4000"
                className={fieldClass}
                style={{ color: '#1b2134' }}
              />
              <button
                type="button"
                onClick={() => setCodeInput(suggestNextCode(allKnownCodes))}
                className="text-[8.5px] font-bold flex-shrink-0"
                style={{ color: '#8a6d4d', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                پیشنهاد کد
              </button>
            </div>
            <div className="text-[8px] px-1 -mt-1.5" style={{ color: '#9b9baf' }}>
              همون کدیه که غرفه‌دار به‌عنوان پسورد ورود استفاده می‌کنه — می‌تونی کد دلخواه خودت رو هم بنویسی
            </div>

            {formError && (
              <div className="text-[9.5px] px-3 py-2 rounded-lg" style={{ background: 'rgba(217,83,79,0.1)', color: '#d9534f', border: '1px solid rgba(217,83,79,0.3)' }}>
                {formError}
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <button onClick={closeForm} className="flex-1 rounded-full py-2.5 font-bold text-[11.5px]" style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}>انصراف</button>
              <button onClick={save} className="flex-[2] rounded-full py-2.5 font-bold text-xs" style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}>
                {editingCode ? 'ذخیره‌ی تغییرات' : 'افزودن غرفه‌دار'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
