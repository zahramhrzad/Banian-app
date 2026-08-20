import BackButton from './BackButton'
import PageTitle from './PageTitle'

interface ExhibitorScanChoiceProps {
  onOpenNetworking: () => void
  onOpenVisitorScan: () => void
  onBack: () => void
}

export default function ExhibitorScanChoice({
  onOpenNetworking,
  onOpenVisitorScan,
  onBack,
}: ExhibitorScanChoiceProps) {
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
        <PageTitle>اسکن QR</PageTitle>
        <p className="text-[10px] text-center mb-5" style={{ color: '#9b9baf' }}>
          می‌خواهید چه چیزی را اسکن کنید؟
        </p>

        <button
          onClick={onOpenNetworking}
          className="w-full bg-white rounded-2xl p-4 mb-3 flex items-center gap-3 text-right"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <div
            className="rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ width: '38px', height: '38px', background: '#eee2f2' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b4d8a" strokeWidth="1.8">
              <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>قرار ملاقات با غرفه‌های دیگر</div>
            <div className="text-[9px] mt-0.5" style={{ color: '#9b9baf' }}>
              اسکن QR یک غرفه‌ی دیگر برای ثبت درخواست ملاقات
            </div>
          </div>
        </button>

        <button
          onClick={onOpenVisitorScan}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 text-right"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <div
            className="rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ width: '38px', height: '38px', background: '#f3e8dc' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a6d4d" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>ثبت اسکن بازدیدکننده</div>
            <div className="text-[9px] mt-0.5" style={{ color: '#9b9baf' }}>
              اسکن بلیط یا کد بازدیدکننده‌ای که از غرفه‌ی شما بازدید کرد
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
