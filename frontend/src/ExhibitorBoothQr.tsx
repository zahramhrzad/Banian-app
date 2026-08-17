import BackButton from './BackButton'
import PageTitle from './PageTitle'

export default function ExhibitorBoothQr({
  companyName,
  onBack,
}: {
  companyName: string
  onBack: () => void
}) {
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(companyName)}`

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

      <div className="relative z-10 mt-6 flex flex-col items-center">
        <PageTitle>QR غرفه</PageTitle>
        <p className="text-[10px] text-center mb-5 px-4" style={{ color: '#9b9baf' }}>
          این کد را چاپ کنید و توی غرفه‌ی خود نصب کنید. بازدیدکننده‌ها با اسکن این کد می‌توانند درخواست ملاقات ثبت کنند.
        </p>

        <div className="bg-white rounded-2xl p-4 flex items-center justify-center" style={{ width: '250px', height: '250px' }}>
          <img
            src={qrImageUrl}
            alt={`کد QR غرفه‌ی ${companyName}`}
            width={220}
            height={220}
            style={{ display: 'block' }}
          />
        </div>

        <div className="text-xs font-bold mt-4" style={{ color: '#be9c77' }}>{companyName}</div>

        <a
          href={qrImageUrl}
          download={`qr-${companyName}.png`}
          target="_blank"
          rel="noreferrer"
          className="w-full max-w-[250px] mt-5 rounded-full py-3 text-center text-xs font-bold"
          style={{ background: '#be9c77', color: '#1b2134', textDecoration: 'none' }}
        >
          دانلود تصویر QR
        </a>

        <div
          className="w-full max-w-[250px] mt-6 rounded-xl px-3.5 py-3"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="text-[9px] mb-1" style={{ color: '#9b9baf' }}>اگه چاپ کد QR ممکن نبود</div>
          <div className="text-[10px]" style={{ color: '#e8cfa8' }}>
            بازدیدکننده می‌تونه به‌جای اسکن، اسم غرفه («{companyName}») رو دستی توی صفحه‌ی اسکن خودش وارد کنه
          </div>
        </div>
      </div>
    </div>
  )
}
