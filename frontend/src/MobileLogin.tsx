import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'

function MobileLogin({
  onSubmit,
  onBack,
}: {
  onSubmit: (name: string, mobile: string) => void
  onBack: () => void
}) {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [mobileTouched, setMobileTouched] = useState(false)
  const [hovered, setHovered] = useState(false)

  const glowShadow =
    '0 0 8px 2px rgba(190,156,119,0.5), 0 0 22px 6px rgba(190,156,119,0.35)'

  const isMobileValid = /^9\d{9}$/.test(mobile)
  const isValid = name.trim() !== '' && isMobileValid

  const handleMobileChange = (raw: string) => {
    let digits = raw.replace(/\D/g, '')
    if (digits.startsWith('0')) {
      digits = digits.slice(1)
    }
    digits = digits.slice(0, 10)
    setMobile(digits)
  }

  const showMobileError = mobileTouched && mobile.length > 0 && !isMobileValid

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
        <PageTitle>ورود به نمایشگاه</PageTitle>
        <div className="text-xs" style={{ color: '#9b9baf' }}>
          مشخصات خود را وارد کنید
        </div>
      </div>

      <div className="w-full max-w-sm z-10">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام و نام خانوادگی"
          className="w-full bg-white rounded-xl py-3.5 px-4 mb-4 text-sm outline-none"
          style={{ color: '#1b2134' }}
        />

        <div
          className="bg-white rounded-xl flex items-center gap-2 px-4"
          dir="ltr"
          style={{
            boxShadow: showMobileError ? '0 0 0 1.5px #d9534f' : 'none',
          }}
        >
          <span className="text-sm" style={{ color: '#9b9baf' }}>+98</span>
          <div className="w-px h-5" style={{ background: '#e0e0e0' }}></div>
          <input
            type="tel"
            inputMode="numeric"
            value={mobile}
            onChange={(e) => handleMobileChange(e.target.value)}
            onBlur={() => setMobileTouched(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isValid) onSubmit(name, mobile)
            }}
            placeholder="912 345 6789"
            maxLength={10}
            className="flex-1 py-3.5 px-1 text-sm outline-none border-none"
            style={{ color: '#1b2134' }}
          />
        </div>

        <div className="mb-5 mt-1.5 px-1" style={{ minHeight: '16px' }}>
          {showMobileError && (
            <span className="text-xs" style={{ color: '#e17a76' }}>
              شماره موبایل معتبر نیست (باید ۱۰ رقم و با ۹ شروع شود)
            </span>
          )}
        </div>

        <button
          onClick={() => {
            setMobileTouched(true)
            if (!isValid) return
            onSubmit(name, mobile)
          }}
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
          دریافت کد تایید
        </button>
      </div>
    </div>
  )
}

export default MobileLogin