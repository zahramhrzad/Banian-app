import { useState } from 'react'
import BackButton from './BackButton'

type Gender = 'مرد' | 'زن' | ''

interface RegistrationData {
  fullName: string
  age: string
  gender: Gender
  jobTitle: string
  company: string
  wantsJob: boolean | null
  experience: string
  education: string
  achievement: string
  skills: string
}

const emptyData: RegistrationData = {
  fullName: '',
  age: '',
  gender: '',
  jobTitle: '',
  company: '',
  wantsJob: null,
  experience: '',
  education: '',
  achievement: '',
  skills: '',
}

const STEP_LABELS = ['مشخصات', 'فرصت شغلی', 'تایید نهایی']

interface RegistrationProps {
  onComplete: (data: RegistrationData) => void
  onBack: () => void
}

export default function Registration({ onComplete, onBack }: RegistrationProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<RegistrationData>(emptyData)
  const [agreed, setAgreed] = useState(false)

  const update = (patch: Partial<RegistrationData>) => setData((prev) => ({ ...prev, ...patch }))

  const basicInfoValid = data.fullName.trim() !== '' && data.age.trim() !== '' && data.gender !== ''
  const canComplete = agreed

  const goBackFromFirstStep = () => {
    if (step === 1) {
      onBack()
    } else {
      setStep((s) => s - 1)
    }
  }

  const glowShadow = '0 0 6px 1px rgba(190,156,119,0.4)'

  const fieldClass = 'flex items-center gap-2 bg-white rounded-xl px-3.5 py-3'
  const inputClass = 'flex-1 border-none outline-none text-xs bg-transparent'

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden px-6 py-8"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={goBackFromFirstStep} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div dir="rtl" className="relative flex items-start justify-between mb-6 mt-6 z-10">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1
          const isDone = num < step
          const isActive = num === step
          return (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className="rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{
                    width: '26px',
                    height: '26px',
                    background: isDone ? '#7d9a86' : isActive ? '#be9c77' : 'rgba(255,255,255,0.1)',
                    color: isDone ? '#fff' : isActive ? '#1b2134' : '#9b9baf',
                  }}
                >
                  {isDone ? '✓' : num}
                </div>
                <span
                  className="text-[8.5px] text-center"
                  style={{ color: isDone ? '#7d9a86' : isActive ? '#be9c77' : '#9b9baf' }}
                >
                  {label}
                </span>
              </div>
              {num < STEP_LABELS.length && (
                <div className="flex-1 mt-3" style={{ height: '1px', background: 'rgba(255,255,255,0.12)' }} />
              )}
            </div>
          )
        })}
      </div>

      {step === 1 && (
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="text-sm font-bold mb-4 text-center" style={{ color: '#be9c77' }}>
            مشخصات پایه
          </div>

          <div className="flex flex-col gap-2.5">
            <div className={fieldClass}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
              <input
                value={data.fullName}
                onChange={(e) => update({ fullName: e.target.value })}
                placeholder="نام و نام خانوادگی"
                className={inputClass}
                style={{ color: '#1b2134' }}
              />
            </div>

            <div className="flex gap-2.5">
              <div className={fieldClass + ' flex-1'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
                <input
                  value={data.age}
                  onChange={(e) => update({ age: e.target.value.replace(/[^0-9]/g, '') })}
                  placeholder="سن"
                  inputMode="numeric"
                  className={inputClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
              <div className={fieldClass + ' flex-1'}>
                <select
                  value={data.gender}
                  onChange={(e) => update({ gender: e.target.value as Gender })}
                  className={inputClass}
                  style={{ color: '#1b2134' }}
                >
                  <option value="">جنسیت</option>
                  <option value="مرد">مرد</option>
                  <option value="زن">زن</option>
                </select>
              </div>
            </div>

            <div className={fieldClass}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8">
                <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
              </svg>
              <input
                value={data.jobTitle}
                onChange={(e) => update({ jobTitle: e.target.value })}
                placeholder="شغل فعلی / پوزیشن"
                className={inputClass}
                style={{ color: '#1b2134' }}
              />
            </div>

            <div className={fieldClass}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 10h18" />
              </svg>
              <input
                value={data.company}
                onChange={(e) => update({ company: e.target.value })}
                placeholder="نام شرکت"
                className={inputClass}
                style={{ color: '#1b2134' }}
              />
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={() => basicInfoValid && setStep(2)}
              disabled={!basicInfoValid}
              className="w-full rounded-full py-3 font-bold text-xs active:shadow-[0_0_10px_2px_rgba(190,156,119,0.6),0_0_26px_8px_rgba(190,156,119,0.35)]"
              style={{
                background: basicInfoValid ? '#be9c77' : '#6b6375',
                color: '#1b2134',
                border: 'none',
                cursor: basicInfoValid ? 'pointer' : 'not-allowed',
              }}
            >
              ادامه
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="text-sm font-bold mb-1.5 text-center" style={{ color: '#be9c77' }}>
            فرصت‌های شغلی حوزه‌ی مالی
          </div>

          <div
            className="flex items-start gap-1.5 rounded-lg px-3 py-2.5 mb-4"
            style={{ background: 'rgba(190,156,119,0.1)', border: '1px solid rgba(190,156,119,0.3)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.8" className="flex-shrink-0 mt-0.5">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 018 0v3" />
            </svg>
            <span className="text-[9.5px] leading-relaxed" style={{ color: '#e8cfa8' }}>
              این بخش صرفاً برای خود شما قابل مشاهده است
            </span>
          </div>

          <div className="text-[11.5px] font-semibold text-center mb-3 text-white">
            آیا تمایل به استخدام در حوزه‌ی مالی دارید؟
          </div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => update({ wantsJob: true })}
              className="flex-1 rounded-xl py-2.5 text-xs font-bold"
              style={{
                background: '#fff',
                color: '#1b2134',
                border: `1.5px solid ${data.wantsJob === true ? '#be9c77' : 'transparent'}`,
                boxShadow: data.wantsJob === true ? glowShadow : 'none',
                cursor: 'pointer',
              }}
            >
              بله، مایلم
            </button>
            <button
              onClick={() => {
                update({ wantsJob: false })
                setStep(3)
              }}
              className="flex-1 rounded-xl py-2.5 text-xs font-bold"
              style={{
                background: '#fff',
                color: '#1b2134',
                border: `1.5px solid ${data.wantsJob === false ? '#be9c77' : 'transparent'}`,
                boxShadow: data.wantsJob === false ? glowShadow : 'none',
                cursor: 'pointer',
              }}
            >
              خیر
            </button>
          </div>

          {data.wantsJob === true && (
            <div className="flex flex-col gap-2.5 mb-2">
              <div className={fieldClass} style={{ alignItems: 'flex-start' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8" className="mt-0.5 flex-shrink-0">
                  <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
                </svg>
                <textarea
                  value={data.experience}
                  onChange={(e) => update({ experience: e.target.value })}
                  placeholder="سابقه‌ی کاری"
                  className={inputClass + ' resize-none'}
                  style={{ color: '#1b2134', minHeight: '40px' }}
                />
              </div>
              <div className={fieldClass}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8">
                  <path d="M22 10l-10-5-10 5 10 5 10-5zM6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
                </svg>
                <input
                  value={data.education}
                  onChange={(e) => update({ education: e.target.value })}
                  placeholder="مدرک تحصیلی"
                  className={inputClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
              <div className={fieldClass}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8">
                  <path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z" />
                </svg>
                <input
                  value={data.achievement}
                  onChange={(e) => update({ achievement: e.target.value })}
                  placeholder="دستاورد مهم"
                  className={inputClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
              <div className={fieldClass}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8">
                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
                <input
                  value={data.skills}
                  onChange={(e) => update({ skills: e.target.value })}
                  placeholder="مهارت‌ها"
                  className={inputClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded-full py-2.5 font-bold text-[11.5px]"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}
            >
              بازگشت
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-[2] rounded-full py-2.5 font-bold text-xs active:shadow-[0_0_10px_2px_rgba(190,156,119,0.6),0_0_26px_8px_rgba(190,156,119,0.35)]"
              style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
            >
              ادامه
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="text-sm font-bold mb-1.5 text-center" style={{ color: '#be9c77' }}>
            مرور اطلاعات
          </div>
          <p className="text-[10px] mb-4 text-center" style={{ color: '#9b9baf' }}>
            قبل از ثبت نهایی، اطلاعات را بررسی کنید
          </p>

          <div className="bg-white rounded-2xl overflow-hidden mb-4">
            <ReviewRow label="نام" value={data.fullName || '—'} />
            <ReviewRow label="سن / جنسیت" value={`${data.age || '—'} / ${data.gender || '—'}`} />
            <ReviewRow label="شغل" value={`${data.jobTitle || '—'}${data.company ? ' - ' + data.company : ''}`} />
            <ReviewRow
              label="تمایل به استخدام"
              value={data.wantsJob === true ? 'بله' : data.wantsJob === false ? 'خیر' : '—'}
              last
            />
          </div>

          <label className="flex items-center gap-2 mb-5 px-0.5" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ accentColor: '#be9c77', width: '15px', height: '15px' }}
            />
            <span className="text-[9.5px]" style={{ color: '#9b9baf' }}>
              صحت اطلاعات فوق را تایید می‌کنم
            </span>
          </label>

          <div className="mt-auto flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 rounded-full py-3 font-bold text-[11.5px]"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}
            >
              بازگشت
            </button>
            <button
              onClick={() => canComplete && onComplete(data)}
              disabled={!canComplete}
              className="flex-[2] rounded-full py-3 font-bold text-xs"
              style={{
                background: canComplete ? '#be9c77' : '#6b6375',
                color: '#1b2134',
                border: 'none',
                cursor: canComplete ? 'pointer' : 'not-allowed',
              }}
            >
              تکمیل ثبت‌نام
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
function ReviewRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex justify-between items-center px-3.5 py-2.5"
      style={{ borderBottom: last ? 'none' : '1px solid #f0ede6' }}
    >
      <span className="text-[10.5px]" style={{ color: '#9b9baf' }}>{label}</span>
      <span className="text-[11px] font-bold" style={{ color: '#1b2134' }}>{value}</span>
    </div>
  )
}