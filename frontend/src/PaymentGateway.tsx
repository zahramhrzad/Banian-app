import BackButton from './BackButton'
import PageTitle from './PageTitle'

interface PaymentGatewayProps {
  totalPrice: number
  onSuccess: () => void
  onBack: () => void
}

const formatPrice = (n: number) =>
  n.toLocaleString('en-US').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

export default function PaymentGateway({ totalPrice, onSuccess, onBack }: PaymentGatewayProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={onBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="z-10 w-full max-w-sm text-center">
        <PageTitle>اتصال به درگاه پرداخت</PageTitle>

        <div className="bg-white rounded-2xl px-5 py-6 mb-5">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6" className="mx-auto mb-3">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
          </svg>
          <div className="text-xs font-bold mb-2" style={{ color: '#1b2134' }}>
            این بخش هنوز به درگاه واقعی زرین‌پال وصل نشده
          </div>
          <p className="text-[10.5px] leading-relaxed" style={{ color: '#6b6375' }}>
            وقتی سرور و Merchant ID زرین‌پال متصل شود، با فشردن دکمه‌ی پرداخت،
            کاربر دقیقاً همین‌جا به صفحه‌ی واقعی پرداخت زرین‌پال منتقل می‌شود و
            بعد از تراکنش موفق، به‌طور خودکار به اپ بازمی‌گردد.
          </p>
        </div>

        <div className="text-[11px] mb-6" style={{ color: '#9b9baf' }}>
          مبلغ قابل پرداخت: <span style={{ color: '#be9c77', fontWeight: 700 }}>{formatPrice(totalPrice)} تومان</span>
        </div>

        <button
          onClick={onSuccess}
          className="w-full rounded-full py-3.5 font-bold text-xs"
          style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
        >
          شبیه‌سازی پرداخت موفق (فقط برای تست)
        </button>
      </div>
    </div>
  )
}