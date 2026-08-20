import { useState, useRef } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'

export interface SentInvite {
  id: string
  phone: string
  code: string
  sentAt: number
}

const toFa = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

function generateCode() {
  const random = Math.floor(1000 + Math.random() * 9000)
  return `INV-${random}`
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('fa-IR')
}

function downloadTemplate() {
  const csv = 'شماره موبایل\n0912xxxxxxx\n0935xxxxxxx\n'
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'نمونه-فایل-کدهای-دعوت.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function ExhibitorInvites({
  quota,
  setQuota,
  sentInvites,
  setSentInvites,
  onBack,
}: {
  quota: number
  setQuota: React.Dispatch<React.SetStateAction<number>>
  sentInvites: SentInvite[]
  setSentInvites: React.Dispatch<React.SetStateAction<SentInvite[]>>
  onBack: () => void
}) {
  const [phone, setPhone] = useState('')
  const [editingQuota, setEditingQuota] = useState(false)
  const [quotaInput, setQuotaInput] = useState(String(quota))
  const [justSentPhone, setJustSentPhone] = useState<string | null>(null)
  const [historySearch, setHistorySearch] = useState('')

  const [previewPhones, setPreviewPhones] = useState<string[] | null>(null)
  const [bulkResult, setBulkResult] = useState<{ success: number; duplicate: number; overQuota: number } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const remaining = quota - sentInvites.length
  const isPhoneValid = /^9\d{9}$/.test(phone)
  const canSend = isPhoneValid && remaining > 0

  const handlePhoneChange = (raw: string) => {
    let digits = raw.replace(/\D/g, '')
    if (digits.startsWith('0')) {
      digits = digits.slice(1)
    }
    digits = digits.slice(0, 10)
    setPhone(digits)
  }

  const handleSend = () => {
    if (!canSend) return
    const code = generateCode()
    setSentInvites((prev) => [{ id: Date.now().toString(), phone: phone.trim(), code, sentAt: Date.now() }, ...prev])
    setJustSentPhone(phone.trim())
    setPhone('')
    setTimeout(() => setJustSentPhone(null), 3500)
  }

  const saveQuota = () => {
    const n = Number(quotaInput)
    if (!isNaN(n) && n >= sentInvites.length) {
      setQuota(n)
    } else {
      setQuotaInput(String(quota))
    }
    setEditingQuota(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .filter((l) => l !== 'شماره موبایل' && l.length >= 9)
      setPreviewPhones(lines)
      setBulkResult(null)
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFromPreview = (idx: number) => {
    setPreviewPhones((prev) => (prev ? prev.filter((_, i) => i !== idx) : prev))
  }

  const cancelPreview = () => {
    setPreviewPhones(null)
    setBulkResult(null)
  }

  const confirmBulkSend = () => {
    if (!previewPhones) return
    const existingPhones = new Set(sentInvites.map((s) => s.phone))
    let success = 0
    let duplicate = 0
    let overQuota = 0
    const newEntries: SentInvite[] = []
    let currentCount = sentInvites.length

    previewPhones.forEach((p) => {
      if (existingPhones.has(p)) {
        duplicate++
        return
      }
      if (currentCount >= quota) {
        overQuota++
        return
      }
      newEntries.push({ id: Date.now().toString() + Math.random(), phone: p, code: generateCode(), sentAt: Date.now() })
      existingPhones.add(p)
      currentCount++
      success++
    })

    setSentInvites((prev) => [...newEntries, ...prev])
    setBulkResult({ success, duplicate, overQuota })
    setPreviewPhones(null)
  }

  const filteredHistory = sentInvites.filter(
    (inv) => historySearch.trim() === '' || inv.phone.includes(historySearch.trim()) || inv.code.toLowerCase().includes(historySearch.trim().toLowerCase())
  )

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden px-6 py-8"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={previewPhones ? cancelPreview : onBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="relative z-10 mt-6">
        <PageTitle>ارسال کد دعوت</PageTitle>
        <p className="text-[10px] text-center mb-4" style={{ color: '#9b9baf' }}>
          افرادی که کد معتبر داشته باشند، ورودشان به نمایشگاه رایگان خواهد بود
        </p>

        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px]" style={{ color: '#9b9baf' }}>باقی‌مانده از سقف کل</span>
            {!editingQuota && (
              <button
                onClick={() => {
                  setQuotaInput(String(quota))
                  setEditingQuota(true)
                }}
                className="text-[9px] underline"
                style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ویرایش سقف
              </button>
            )}
          </div>

          {editingQuota ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                value={quotaInput}
                onChange={(e) => setQuotaInput(e.target.value)}
                className="flex-1 rounded-lg px-3 py-2 text-xs outline-none"
                style={{ color: '#1b2134' }}
              />
              <button
                onClick={saveQuota}
                className="text-[10px] font-bold px-3 py-2 rounded-lg"
                style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
              >
                ذخیره
              </button>
            </div>
          ) : (
            <>
              <div className="text-lg font-extrabold" style={{ color: '#fff' }}>
                {toFa(Math.max(remaining, 0))}{' '}
                <span className="text-[10px] font-normal" style={{ color: '#9b9baf' }}>از {toFa(quota)}</span>
              </div>
              <div className="rounded-full mt-2 overflow-hidden" style={{ height: '6px', background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min((sentInvites.length / quota) * 100, 100)}%`, background: '#be9c77' }}
                />
              </div>
            </>
          )}
        </div>

        {!previewPhones && (
          <>
            <div className="flex gap-2 mb-2">
              <div className="flex-1 bg-white rounded-xl flex items-center gap-2 px-3.5 py-3" dir="ltr">
                <span className="text-sm" style={{ color: '#9b9baf' }}>+98</span>
                <div className="w-px h-5" style={{ background: '#e0e0e0' }}></div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend()
                  }}
                  placeholder="912 345 6789"
                  maxLength={10}
                  className="flex-1 text-sm outline-none border-none"
                  style={{ color: '#1b2134' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="rounded-xl px-5 text-xs font-bold"
                style={{
                  background: canSend ? '#be9c77' : '#6b6375',
                  color: '#1b2134',
                  border: 'none',
                  cursor: canSend ? 'pointer' : 'not-allowed',
                }}
              >
                ارسال کد
              </button>
            </div>

            {remaining <= 0 && (
              <div className="text-[9.5px] mb-2" style={{ color: '#d9534f' }}>
                سقف کد دعوت شما تمام شده است
              </div>
            )}

            {justSentPhone && (
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#7d9a86' }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[9.5px]" style={{ color: '#7d9a86' }}>
                  کد به {justSentPhone} ارسال شد
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 my-3">
              <div className="flex-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <span className="text-[9px]" style={{ color: '#9b9baf' }}>یا ارسال گروهی</span>
              <div className="flex-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            </div>

            <label
              className="w-full rounded-xl py-3 mb-2 flex items-center justify-center gap-1.5"
              style={{ background: 'rgba(190,156,119,0.12)', border: '1.5px dashed rgba(190,156,119,0.5)', cursor: 'pointer' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span className="text-[11px] font-bold" style={{ color: '#be9c77' }}>آپلود فایل CSV/Excel شماره‌ها</span>
              <input ref={fileInputRef} type="file" accept=".csv,.txt" onChange={handleFileChange} className="hidden" />
            </label>

            <button
              onClick={downloadTemplate}
              className="w-full text-[9.5px] underline mb-4"
              style={{ color: '#9b9baf', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              دانلود نمونه‌فایل برای فرمت درست
            </button>

            {bulkResult && (
              <div
                className="rounded-xl px-3 py-2.5 mb-4"
                style={{ background: 'rgba(125,154,134,0.1)', border: '1px solid rgba(125,154,134,0.3)' }}
              >
                <div className="text-[9.5px] font-bold mb-1" style={{ color: '#7d9a86' }}>نتیجه‌ی ارسال گروهی</div>
                <div className="text-[9px]" style={{ color: '#c9c7d0' }}>
                  {toFa(bulkResult.success)} شماره با موفقیت ارسال شد
                  {bulkResult.duplicate > 0 && ` · ${toFa(bulkResult.duplicate)} تکراری بود`}
                  {bulkResult.overQuota > 0 && ` · ${toFa(bulkResult.overQuota)} به‌خاطر تمام‌شدن سقف رد شد`}
                </div>
              </div>
            )}
          </>
        )}

        {previewPhones && (
          <div className="mb-4">
            <div className="text-[10px] font-bold mb-2" style={{ color: '#e8cfa8' }}>
              پیش‌نمایش ({toFa(previewPhones.length)} شماره پیدا شد)
            </div>
            <div className="flex flex-col gap-1.5 mb-3" style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {previewPhones.map((p, i) => (
                <div key={i} className="bg-white rounded-lg px-3 py-2 flex items-center justify-between">
                  <span className="text-xs" dir="ltr" style={{ color: '#1b2134' }}>{p}</span>
                  <button
                    onClick={() => removeFromPreview(i)}
                    className="text-[9px] underline"
                    style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    حذف
                  </button>
                </div>
              ))}
              {previewPhones.length === 0 && (
                <p className="text-[10px] text-center py-3" style={{ color: '#9b9baf' }}>لیست خالی شد</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={cancelPreview}
                className="flex-1 rounded-full py-2.5 font-bold text-[11.5px]"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}
              >
                انصراف
              </button>
              <button
                onClick={confirmBulkSend}
                disabled={previewPhones.length === 0}
                className="flex-[2] rounded-full py-2.5 font-bold text-xs"
                style={{
                  background: previewPhones.length === 0 ? '#6b6375' : '#be9c77',
                  color: '#1b2134',
                  border: 'none',
                  cursor: previewPhones.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                تایید و ارسال گروهی
              </button>
            </div>
          </div>
        )}

        {!previewPhones && (
          <>
            <div className="text-[10px] font-bold mb-2 mt-4" style={{ color: '#e8cfa8' }}>
              تاریخچه‌ی کدهای ارسالی
            </div>

            {sentInvites.length > 3 && (
              <input
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="جست‌وجوی شماره یا کد..."
                className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none mb-2.5"
                style={{ color: '#1b2134' }}
                dir="ltr"
              />
            )}

            {filteredHistory.length === 0 && (
              <p className="text-[10.5px] text-center py-4" style={{ color: '#9b9baf' }}>
                {sentInvites.length === 0 ? 'هنوز کدی ارسال نکرده‌اید' : 'موردی پیدا نشد'}
              </p>
            )}

            <div className="flex flex-col gap-2">
              {filteredHistory.map((inv) => (
                <div key={inv.id} className="bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-bold" dir="ltr" style={{ color: '#1b2134' }}>{inv.phone}</span>
                  <div className="text-left">
                    <div className="text-[10px] font-bold" dir="ltr" style={{ color: '#8a6d4d' }}>{inv.code}</div>
                    <div className="text-[8.5px]" style={{ color: '#9b9baf' }}>{formatDate(inv.sentAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}