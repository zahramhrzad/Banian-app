import BackButton from './BackButton'
import PageTitle from './PageTitle'

function UserTypeSelect({
  onSelect,
  onBack,
}: {
  onSelect: (type: 'visitor' | 'exhibitor') => void
  onBack: () => void
}) {
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

      <PageTitle>نوع کاربری خود را انتخاب کنید</PageTitle>

      <div className="flex flex-col md:flex-row gap-5 w-full max-w-md md:max-w-2xl z-10 mt-4">
        <button
          onClick={() => onSelect('visitor')}
          className="flex-1 py-8 px-6 rounded-xl border flex flex-col items-center gap-3 bg-white transition-shadow duration-200"
          style={{ borderColor: 'transparent', fontFamily: 'var(--font-fa)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#be9c77'
            e.currentTarget.style.boxShadow =
              '0 0 8px 2px rgba(190,156,119,0.5), 0 0 22px 6px rgba(190,156,119,0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#f3e8dc' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </div>
          <span className="text-base md:text-lg font-bold" style={{ color: '#1b2134' }}>بازدیدکننده</span>
        </button>

        <button
          onClick={() => onSelect('exhibitor')}
          className="flex-1 py-8 px-6 rounded-xl border flex flex-col items-center gap-3 bg-white transition-shadow duration-200"
          style={{ borderColor: 'transparent', fontFamily: 'var(--font-fa)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#be9c77'
            e.currentTarget.style.boxShadow =
              '0 0 8px 2px rgba(190,156,119,0.5), 0 0 22px 6px rgba(190,156,119,0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#f3e8dc' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6">
              <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
            </svg>
          </div>
          <span className="text-base md:text-lg font-bold" style={{ color: '#1b2134' }}>غرفه‌دار</span>
        </button>
      </div>
    </div>
  )
}

export default UserTypeSelect