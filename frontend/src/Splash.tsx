import { useEffect, useState } from 'react'
import logo from './assets/logo.png'

// تاریخ شروع نمایشگاه: ۲۶ آبان ۱۴۰۵ (تقریباً معادل ۱۷ نوامبر ۲۰۲۶ ساعت 8:30 صبح)
const EVENT_DATE = new Date('2026-11-17T09:00:00')

const toFa = (n: number) =>
  String(n).padStart(2, '0').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

const CHART_POINTS = '0,70 50,45 90,60 140,20 190,50 240,15 290,40 320,25'

function Splash({ onNext }: { onNext: () => void }) {
  const [visible, setVisible] = useState(false)
  const [countdown, setCountdown] = useState({ days: '۰۰', hours: '۰۰', mins: '۰۰', secs: '۰۰' })

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, EVENT_DATE.getTime() - Date.now())
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const mins = Math.floor((diff / (1000 * 60)) % 60)
      const secs = Math.floor((diff / 1000) % 60)
      setCountdown({ days: toFa(days), hours: toFa(hours), mins: toFa(mins), secs: toFa(secs) })
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between relative overflow-hidden py-10 px-6"
      style={{ backgroundColor: '#1b2134' }}
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

      <div
        className={`flex flex-col items-center transition-opacity duration-1000 z-10 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src={logo}
          alt="لوگوی بانیان"
          className="w-24 h-24 md:w-32 md:h-32 object-contain mb-6"
        />

        <h1
          className="font-bold tracking-wide text-center"
          style={{ color: '#be9c77', fontFamily: 'var(--font-fa)' }}
        >
          <span className="block mb-2 text-xs sm:text-sm md:text-base whitespace-nowrap">
            هجدهمین نمایشگاه بین‌المللی نظام‌های مالی
          </span>
          <span className="block mb-4 text-xs sm:text-sm md:text-base whitespace-nowrap">
            سرمایه‌گذاری و زیرساخت‌های دیجیتال
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-bold">
            (بورس، بانک و بیمه)
          </span>
        </h1>
      </div>

     {/* شمارش معکوس */}
      <div dir="ltr" className="flex gap-4 z-10 mt-2">
        <div className="text-center">
          <div className="font-extrabold leading-none" style={{ fontSize: '22px', color: '#e8cfa8' }}>
            {countdown.days}
          </div>
          <div style={{ fontSize: '9px', color: '#9b9baf' }}>روز</div>
        </div>
        <div className="text-center">
          <div className="font-extrabold leading-none" style={{ fontSize: '22px', color: '#e8cfa8' }}>
            {countdown.hours}
          </div>
          <div style={{ fontSize: '9px', color: '#9b9baf' }}>ساعت</div>
        </div>
        <div className="text-center">
          <div className="font-extrabold leading-none" style={{ fontSize: '22px', color: '#e8cfa8' }}>
            {countdown.mins}
          </div>
          <div style={{ fontSize: '9px', color: '#9b9baf' }}>دقیقه</div>
        </div>
        <div className="text-center">
          <div className="font-extrabold leading-none" style={{ fontSize: '22px', color: '#e8cfa8' }}>
            {countdown.secs}
          </div>
          <div style={{ fontSize: '9px', color: '#9b9baf' }}>ثانیه</div>
        </div>
      </div>

      {/* نمودار متحرک محو */}
      <div className="relative w-full max-w-sm z-10 my-6">
        <svg
          width="100%"
          height="90"
          viewBox="0 0 320 90"
          className="absolute top-0 left-0"
          style={{ filter: 'blur(6px)', opacity: 0.35 }}
        >
          <polyline
            points={CHART_POINTS}
            fill="none"
            stroke="#be9c77"
            strokeWidth="3"
            strokeDasharray="500"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="500;500;0;0"
              keyTimes="0;0.05;0.6;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </polyline>
        </svg>
        <svg width="100%" height="90" viewBox="0 0 320 90" className="relative" style={{ opacity: 0.35 }}>
          <polyline
            points={CHART_POINTS}
            fill="none"
            stroke="#f0d9b5"
            strokeWidth="1.3"
            strokeDasharray="500"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="500;500;0;0"
              keyTimes="0;0.05;0.6;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </polyline>
          <circle r="3.5" fill="#f0d9b5">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              keyPoints="0;0;1;1"
              keyTimes="0;0.05;0.6;1"
              calcMode="linear"
              path={`M${CHART_POINTS.split(' ').join(' L')}`}
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0;0"
              keyTimes="0;0.05;0.6;0.65;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      <div
        className="text-center z-10"
        style={{ fontFamily: 'var(--font-fa)' }}
      >
        <div dir="rtl" className="text-sm font-bold mb-1" style={{ color: '#e8cfa8' }}>
          ۲۶ الی ۲۹ آبان ۱۴۰۵
        </div>
        <div className="text-xs" style={{ color: '#9b9baf' }}>
          محل دائمی نمایشگاه‌های بین‌المللی ایران
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <div
          className="absolute rounded-full"
          style={{
            inset: '-10px',
            background: '#be9c77',
            opacity: 0.35,
            filter: 'blur(14px)',
          }}
        ></div>
        <button
          onClick={onNext}
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: '56px',
            height: '56px',
            background: '#be9c77',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1b2134"
            strokeWidth="2.2"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Splash