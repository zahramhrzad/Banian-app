import { useState } from 'react'
import logo from './assets/logo.png'
import BackButton from './BackButton'

function EntryCard({
  name,
  mobile,
  onContinue,
  onBack,
}: {
  name: string
  mobile: string
  onContinue: () => void
  onBack: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const glowShadow =
    '0 0 8px 2px rgba(190,156,119,0.5), 0 0 22px 6px rgba(190,156,119,0.35)'

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

      <div className="relative w-full max-w-xs z-10">
        <div
          className="absolute rounded-3xl"
          style={{ inset: '-14px', background: '#be9c77', opacity: 0.35, filter: 'blur(20px)' }}
        ></div>
        <div
          className="absolute rounded-[22px]"
          style={{ inset: '-2px', background: 'linear-gradient(135deg, #e8cfa8, #be9c77, #8a6d4d)' }}
        ></div>

        <div className="relative bg-white rounded-[20px] px-6 py-7 text-center overflow-hidden">
          <img
            src={logo}
            alt=""
            className="absolute opacity-5"
            style={{ width: '140px', top: '-20px', left: '50%', transform: 'translateX(-50%)' }}
          />

          <div className="relative z-10">
            <img src={logo} alt="لوگوی بانیان" className="w-10 h-10 object-contain mx-auto mb-2" />

            <div className="text-sm font-bold mb-0.5" style={{ color: '#1b2134' }}>
              کارت ورود نمایشگاه
            </div>
           <div className="text-[10px] mb-4 leading-relaxed" style={{ color: '#9b9baf' }}>
              هجدهمین نمایشگاه بین‌المللی نظام‌های مالی، سرمایه‌گذاری
              <br />
              و زیرساخت‌های دیجیتال (بورس، بانک و بیمه)
            </div>

            <div className="w-36 h-36 mx-auto mb-4 border rounded-xl flex items-center justify-center bg-white" style={{ borderColor: '#eee' }}>
              <svg width="120" height="120" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#fff" />
                <rect x="5" y="5" width="25" height="25" fill="#1b2134" />
                <rect x="70" y="5" width="25" height="25" fill="#1b2134" />
                <rect x="5" y="70" width="25" height="25" fill="#1b2134" />
                <rect x="40" y="10" width="8" height="8" fill="#1b2134" />
                <rect x="55" y="20" width="8" height="8" fill="#1b2134" />
                <rect x="40" y="40" width="8" height="8" fill="#1b2134" />
                <rect x="55" y="45" width="8" height="8" fill="#1b2134" />
                <rect x="70" y="45" width="8" height="8" fill="#1b2134" />
                <rect x="40" y="60" width="8" height="8" fill="#1b2134" />
                <rect x="60" y="65" width="8" height="8" fill="#1b2134" />
                <rect x="75" y="75" width="8" height="8" fill="#1b2134" />
                <rect x="45" y="80" width="8" height="8" fill="#1b2134" />
                <rect x="60" y="85" width="8" height="8" fill="#1b2134" />
              </svg>
            </div>

            <div className="text-base font-bold mb-0.5" style={{ color: '#1b2134' }}>
              {name || 'بازدیدکننده'}
            </div>
            <div className="text-xs mb-4" style={{ color: '#9b9baf', direction: 'ltr' }}>
              {mobile}
            </div>

            <div className="pt-3" style={{ borderTop: '1px dashed #ddd' }}>
              <div
                className="text-xs font-bold mb-0.5 flex justify-center gap-1"
                dir="rtl"
                style={{ color: '#be9c77' }}
              >
                <span>۲۶</span>
                <span>الی</span>
                <span>۲۹</span>
                <span>آبان ماه</span>
                <span>۱۴۰۵</span>
              </div>
              <div className="text-[10px]" style={{ color: '#9b9baf' }}>
                محل دائمی نمایشگاه‌های بین‌المللی ایران
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-full max-w-xs mt-6 rounded-xl font-bold text-sm py-3.5 z-10 transition-shadow"
        style={{
          background: '#be9c77',
          color: '#1b2134',
          border: 'none',
          cursor: 'pointer',
          boxShadow: hovered ? glowShadow : 'none',
        }}
      >
        ورود به پنل کاربری
      </button>
    </div>
  )
}

export default EntryCard