import { useEffect, useRef, useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
const CORRECT_CODE = '12345'

function OtpVerify({
  mobile,
  onVerify,
  onBack,
}: {
  mobile: string
  onVerify: (code: string) => void
  onBack: () => void
}) {
  const [values, setValues] = useState(['', '', '', '', ''])
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const filledCount = values.filter((v) => v !== '').length
  const code = values.join('')

  useEffect(() => {
    if (filledCount === 5 && status === 'idle') {
      if (code === CORRECT_CODE) {
        setStatus('success')
        setTimeout(() => onVerify(code), 900)
      } else {
        setStatus('error')
        setTimeout(() => {
          setStatus('idle')
          setValues(['', '', '', '', ''])
          inputsRef.current[0]?.focus()
        }, 1200)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filledCount])

  const handleChange = (index: number, val: string) => {
    if (status !== 'idle') return
    const digit = val.replace(/[^0-9]/g, '').slice(-1)
    const next = [...values]
    next[index] = digit
    setValues(next)
    if (digit && index < 4) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const segments = [0, 1, 2, 3, 4]
  const buttonLabel =
    status === 'success' ? 'تایید شد' : status === 'error' ? 'عدم تایید' : 'تایید'

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
        <PageTitle>کد تایید را وارد کنید</PageTitle>
        <div className="text-xs" style={{ color: '#9b9baf' }}>
          کد ۵ رقمی به شماره {mobile || '۰۹۱۲۳۴۵۶۷۸۹'} ارسال شد
        </div>
      </div>

      <div className="flex gap-2.5 z-10 mb-8" dir="ltr">
        {values.map((val, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el }}
            value={val}
            maxLength={1}
            inputMode="numeric"
            disabled={status !== 'idle'}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="text-center rounded-lg font-bold outline-none"
            style={{
              width: '44px',
              height: '52px',
              fontSize: '20px',
              color: '#1b2134',
              background: '#ffffff',
              border: val ? '2px solid #be9c77' : '2px solid transparent',
              boxShadow: val ? '0 0 8px 2px rgba(190,156,119,0.5)' : 'none',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mb-4" style={{ width: '100%', maxWidth: '300px' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 52"
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          <rect x="1.5" y="1.5" width="297" height="49" rx="12" fill="none" stroke="rgba(190,156,119,0.15)" strokeWidth="2" />
          {segments.map((i) => (
            <rect
              key={i}
              x="1.5" y="1.5" width="297" height="49" rx="12"
              fill="none"
              stroke={i < filledCount || status === 'success' ? '#be9c77' : 'transparent'}
              strokeWidth="3"
              pathLength={100}
              strokeDasharray="18 82"
              strokeDashoffset={-(i * 20)}
              style={{
                transition: 'stroke 0.3s ease',
                filter: i < filledCount || status === 'success' ? 'drop-shadow(0 0 4px rgba(190,156,119,0.9))' : 'none',
              }}
            />
          ))}
        </svg>

        <button
          disabled={status !== 'idle'}
          className="w-full rounded-xl font-bold text-sm py-3.5 relative"
          style={{
            background: status === 'success' ? '#8fd19e' : status === 'error' ? '#e08b8b' : '#be9c77',
            color: '#1b2134',
            border: 'none',
            cursor: status === 'idle' ? 'pointer' : 'default',
            transition: 'background 0.3s ease',
          }}
        >
          {buttonLabel}
        </button>
      </div>

      <div className="text-xs z-10" style={{ color: '#9b9baf' }}>
        ارسال مجدد کد تا ۰۰:۴۵
      </div>
    </div>
  )
}

export default OtpVerify