import BackButton from './BackButton'

function AccessInfo({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={onBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="px-5 pt-6 z-10 flex-1 overflow-y-auto pb-6">
        <div className="text-sm font-bold mb-4 text-center" style={{ color: '#be9c77' }}>
          دسترسی‌ها
        </div>

        <div className="mb-3.5">
          <div className="text-xs font-bold mb-2" style={{ color: '#be9c77' }}>مترو</div>
          <div className="bg-white rounded-xl px-3.5 py-2.5 mb-2">
            <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>ایستگاه تجریش</div>
            <div className="text-[9.5px]" style={{ color: '#9b9baf' }}>خط ۱ - ایستگاه پایانه</div>
          </div>
          <div className="bg-white rounded-xl px-3.5 py-2.5">
            <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>ایستگاه شهید حقانی</div>
            <div className="text-[9.5px]" style={{ color: '#9b9baf' }}>خط ۱</div>
          </div>
        </div>

        <div className="mb-3.5">
          <div className="text-xs font-bold mb-2" style={{ color: '#be9c77' }}>اتوبوس تندرو (BRT)</div>
          <div className="bg-white rounded-xl px-3.5 py-2.5">
            <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>ایستگاه نمایشگاه بین‌المللی تهران</div>
            <div className="text-[9.5px]" style={{ color: '#9b9baf' }}>مقابل درب اصلی نمایشگاه</div>
          </div>
        </div>

        <div className="mb-3.5">
          <div className="text-xs font-bold mb-2" style={{ color: '#be9c77' }}>پارکینگ‌ها</div>
          <div className="bg-white rounded-xl px-3.5 py-2.5 mb-2 flex justify-between">
            <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>پارکینگ غربی</span>
            <span className="text-[9.5px]" style={{ color: '#9b9baf' }}>نزدیک هتل آزادی</span>
          </div>
          <div className="bg-white rounded-xl px-3.5 py-2.5 flex justify-between">
            <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>پارکینگ جنوبی</span>
            <span className="text-[9.5px]" style={{ color: '#9b9baf' }}>نزدیک درب جنوبی</span>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold mb-2" style={{ color: '#be9c77' }}>رستوران و بوفه</div>
          <div className="bg-white rounded-xl px-3.5 py-2.5">
            <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>رستوران بزرگ نمایشگاه</div>
            <div className="text-[9.5px]" style={{ color: '#9b9baf' }}>مجاور سالن‌های ۳۸ و ۴۰</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessInfo