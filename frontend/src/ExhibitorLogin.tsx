import { useState, useEffect } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'

// این لیست فقط برای تست فاز فعلیه؛ در فاز اتصال Supabase با کوئری واقعی از جدول companies جایگزین می‌شود
export const demoExhibitorCodes: Record<string, string> = {
  'EXH-1000': 'بانک آینده',
  'EXH-2000': 'کارگزاری آگاه',
  'EXH-3000': 'بیمه‌ی البرز',
  '12345': 'غرفه‌ی نمونه',
}

const NAME_STORAGE_KEY = 'banian_exhibitor_name'

function ExhibitorLogin({
  onSubmit,
  onBack,
}: {
  onSubmit: (name: string, mobile: string, trackingCode: string, companyName: string) => void
  onBack: () => void
}) {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    const savedName = localStorage.getItem(NAME_STORAGE_KEY)
    if (savedName) setName(savedName)
  }, [])

  const glowShadow =
    '0 0 8px 2px rgba(190,156,119,0.5), 0 0 22px 6px rgba(190,156,119,0.35)'

  const isValid = name.trim() !== '' && mobile.trim() !== '' && password.trim() !== ''

  const handleSubmit = () => {
    if (!isValid || status === 'success') return

    const code = password.trim().toUpperCase()
    const matchedCompany = demoExhibitorCodes[code]

    if (!matchedCompany) {
      setStatus('error')
      return
    }

    setCompanyName(matchedCompany)
    setStatus('success')
    localStorage.setItem(NAME_STORAGE_KEY, name)

    setTimeout(() => {
      onSubmit(name, mobile, code, matchedCompany)
    }, 1600)
  }

  if (status === 'success') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6"
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

        <div className="z-10 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#be9c77' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1b2134" strokeWidth="3">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-sm font-bold" style={{ color: '#fff' }}>
            خوش‌آمدید {name}
          </div>
          <div className="text-xs mt-1" style={{ color: '#be9c77' }}>
            غرفه‌ی {companyName}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={onBack} />

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

      <div className="z-10 text-center mb-5">
        <PageTitle>ورود غرفه‌داران</PageTitle>
        <div className="text-xs" style={{ color: '#9b9baf' }}>
          مشخصات خود را وارد کنید
        </div>
      </div>

      <div className="w-full max-w-sm z-10">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="نام و نام خانوادگی"
          className="w-full bg-white rounded-xl py-3.5 px-4 mb-4 text-sm outline-none"
          style={{ color: '#1b2134' }}
        />

        <div className="bg-white rounded-xl flex items-center gap-2 px-4 mb-4" dir="ltr">
          <span className="text-sm" style={{ color: '#9b9baf' }}>+98</span>
          <div className="w-px h-5" style={{ background: '#e0e0e0' }}></div>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            placeholder="912 345 6789"
            className="flex-1 py-3.5 px-1 text-sm outline-none border-none"
            style={{ color: '#1b2134' }}
          />
        </div>

        <div
          className="bg-white rounded-xl flex items-center gap-2 px-4 mb-1"
          style={{ border: status === 'error' ? '1.5px solid #d9534f' : '1.5px solid transparent' }}
        >
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
            placeholder="پسورد (کد رهگیری غرفه)"
            className="flex-1 py-3.5 px-1 text-sm outline-none border-none"
            style={{ color: '#1b2134' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="flex-shrink-0"
            style={{ color: '#9b9baf' }}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.5 21.5 0 0 1 5.06-6.06M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.5 21.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                <path d="M1 1l22 22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {status === 'error' && (
          <div className="text-xs mb-4 px-1" style={{ color: '#d9534f' }}>
            نام و نام خانوادگی، شماره تلفن یا پسورد نادرست است
          </div>
        )}
        {status !== 'error' && <div className="mb-4" />}

        <button
          onClick={handleSubmit}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          disabled={!isValid}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-shadow"
          style={{
            background: !isValid ? '#6b6375' : '#be9c77',
            color: '#1b2134',
            border: 'none',
            cursor: !isValid ? 'not-allowed' : 'pointer',
            boxShadow: hovered && isValid ? glowShadow : 'none',
          }}
        >
          ورود به پنل
        </button>
      </div>
    </div>
  )
}

export default ExhibitorLogin