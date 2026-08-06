import ticketLogo from './assets/logo.png'

export type TicketStatus = 'active' | 'used' | 'expired'

export interface Ticket {
  id: string
  ownerName: string
  date: string
  status: TicketStatus
}

const statusConfig: Record<TicketStatus, { text: string; color: string; dot: string; stampText: string }> = {
  active: { text: 'فعال و آماده‌ی ورود', color: '#5c7d68', dot: '#7d9a86', stampText: '' },
  used: { text: 'استفاده شد و وارد شدید', color: '#8a6d4d', dot: '#be9c77', stampText: 'استفاده‌شد' },
  expired: { text: 'منقضی شده', color: '#a89a7d', dot: '#a89a7d', stampText: 'منقضی' },
}

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const cfg = statusConfig[ticket.status]
  const ticketNumber = ticket.id.replace('#', '')

  return (
    <div className="relative" style={{ filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.35))' }}>
      {/* هاله‌ی نئونی طلایی */}
      <div
        className="absolute rounded-3xl"
        style={{
          inset: '-3px',
          background: 'linear-gradient(135deg, rgba(232,207,168,0.5), rgba(190,156,119,0.15), rgba(232,207,168,0.5))',
          filter: 'blur(8px)',
          opacity: 0.9,
        }}
      />

      <div
        className="relative rounded-[20px] overflow-hidden"
        style={{
          background: 'linear-gradient(155deg, #fffdf9, #fbf5e9 55%, #f7ecd9)',
          border: '1px solid rgba(190,156,119,0.35)',
          filter: ticket.status === 'expired' ? 'grayscale(0.35) opacity(0.8)' : undefined,
        }}
      >
        {/* الگوی گیوشه در پس‌زمینه */}
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.05 }}
          preserveAspectRatio="none"
        >
          <pattern id="guilloche-pattern" width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M0 13 Q6.5 0 13 13 T26 13" stroke="#8a6d4d" strokeWidth="0.8" fill="none" />
            <path d="M0 5 Q6.5 -8 13 5 T26 5" stroke="#8a6d4d" strokeWidth="0.6" fill="none" />
            <path d="M0 21 Q6.5 8 13 21 T26 21" stroke="#8a6d4d" strokeWidth="0.6" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#guilloche-pattern)" />
        </svg>

        {/* نوار هولوگرافیک بالا */}
        <div
          style={{
            height: '6px',
            background: 'linear-gradient(90deg, #8a6d4d, #f0d9b5, #be9c77, #f0d9b5, #8a6d4d)',
          }}
        />

        {/* تزئین گوشه‌ها */}
        <svg width="26" height="26" className="absolute" style={{ top: '12px', right: '12px', opacity: 0.5 }} viewBox="0 0 26 26">
          <path d="M2 2 L24 2 L24 8 L8 8 L8 24 L2 24 Z" fill="none" stroke="#be9c77" strokeWidth="1" />
        </svg>
        <svg width="26" height="26" className="absolute" style={{ top: '12px', left: '12px', opacity: 0.5 }} viewBox="0 0 26 26">
          <path d="M24 2 L2 2 L2 8 L18 8 L18 24 L24 24 Z" fill="none" stroke="#be9c77" strokeWidth="1" />
        </svg>

        {/* لوگوی محو بزرگ در مرکز */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{ top: '44%', left: '50%', transform: 'translate(-50%, -50%)', width: '210px', height: '210px', opacity: 0.06, zIndex: 0 }}
        >
          <img src={ticketLogo} alt="" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
        </div>

        {/* لوگوی بزرگ وسط بالا */}
        <div className="relative flex justify-center pt-5 px-4">
          <img src={ticketLogo} alt="بانیان" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
        </div>

        {/* عنوان + نام کامل نمایشگاه */}
        <div className="relative text-center pt-3 px-5">
          <div className="text-[16px] font-extrabold" style={{ color: '#2b2418' }}>بلیط ورود نمایشگاه</div>
          <div className="text-[8.5px] mt-1 leading-loose" style={{ color: '#9c8f74' }}>
            هجدهمین نمایشگاه بین‌المللی نظام‌های مالی
            <br />
            سرمایه‌گذاری و زیرساخت‌های دیجیتال
            <br />
            (بورس، بانک و بیمه)
          </div>
        </div>

        {/* شماره‌ی بلیط به سبک اسکناس */}
        <div className="relative flex justify-center mt-3">
          <div
            className="rounded-lg px-3.5 py-1"
            style={{ border: '1px solid rgba(190,156,119,0.5)', background: 'rgba(255,255,255,0.5)' }}
          >
            <span className="text-[12px] font-extrabold" style={{ color: '#8a6d4d', letterSpacing: '3px' }} dir="ltr">
              {ticketNumber}
            </span>
          </div>
        </div>

        {/* اطلاعات */}
        <div className="relative pt-4 px-5.5 flex flex-col gap-2.5">
          <div
            className="flex justify-between items-center pb-2"
            style={{ borderBottom: '1px solid rgba(190,156,119,0.15)' }}
          >
            <span className="text-[9px]" style={{ color: '#b3a583' }}>صاحب بلیط</span>
            <span className="text-[12px] font-bold" style={{ color: '#2b2418' }}>{ticket.ownerName}</span>
          </div>
          <div
            className="flex justify-between items-center pb-2"
            style={{ borderBottom: '1px solid rgba(190,156,119,0.15)' }}
          >
            <span className="text-[9px]" style={{ color: '#b3a583' }}>تاریخ اعتبار</span>
            <span className="text-[12px] font-bold" style={{ color: '#2b2418' }}>{ticket.date}</span>
          </div>
        </div>

        {/* خط جداکننده با دایره‌های برش */}
        <div className="relative mt-4.5">
          <div
            className="absolute rounded-full"
            style={{
              top: '-11px', right: '-1px', width: '22px', height: '22px', background: '#1b2134',
              borderTop: '1px solid rgba(190,156,119,0.35)', borderRight: '1px solid rgba(190,156,119,0.35)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: '-11px', left: '-1px', width: '22px', height: '22px', background: '#1b2134',
              borderTop: '1px solid rgba(190,156,119,0.35)', borderLeft: '1px solid rgba(190,156,119,0.35)',
            }}
          />
          <div className="mx-4" style={{ borderTop: '1.5px dashed rgba(190,156,119,0.45)' }} />
        </div>

        {/* QR وسط، بزرگ */}
        <div className="relative flex flex-col items-center pt-4.5 px-4 pb-1.5">
          <div
            className="rounded-2xl p-3 relative"
            style={{ background: '#fff', boxShadow: '0 0 0 1px rgba(190,156,119,0.3), 0 4px 14px rgba(138,109,77,0.12)' }}
          >
            <svg width="110" height="110" viewBox="0 0 100 100">
              <rect width="100" height="100" fill="#fff" />
              <rect x="5" y="5" width="25" height="25" fill="#2b2418" />
              <rect x="70" y="5" width="25" height="25" fill="#2b2418" />
              <rect x="5" y="70" width="25" height="25" fill="#2b2418" />
              <rect x="40" y="10" width="8" height="8" fill="#2b2418" />
              <rect x="55" y="20" width="8" height="8" fill="#2b2418" />
              <rect x="40" y="40" width="8" height="8" fill="#2b2418" />
              <rect x="55" y="45" width="8" height="8" fill="#2b2418" />
              <rect x="70" y="45" width="8" height="8" fill="#2b2418" />
              <rect x="40" y="60" width="8" height="8" fill="#2b2418" />
              <rect x="60" y="65" width="8" height="8" fill="#2b2418" />
              <rect x="75" y="75" width="8" height="8" fill="#2b2418" />
              <rect x="45" y="80" width="8" height="8" fill="#2b2418" />
              <rect x="60" y="85" width="8" height="8" fill="#2b2418" />
            </svg>
            {ticket.status !== 'active' && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.6)' }}
              >
                <span
                  className="text-[10px] font-extrabold rounded"
                  style={{ color: cfg.color, transform: 'rotate(-15deg)', border: `2px solid ${cfg.color}`, padding: '3px 7px' }}
                >
                  {cfg.stampText}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span
              className="rounded-full inline-block"
              style={{ width: '6px', height: '6px', background: cfg.dot, boxShadow: `0 0 6px 1px ${cfg.dot}99` }}
            />
            <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{cfg.text}</span>
          </div>
        </div>

        {/* متن ریز شرایط */}
        <div className="relative text-center pt-2.5 px-6 pb-4.5">
          <div className="text-[7px] leading-loose" style={{ color: '#c4b89a' }}>
            این بلیط غیرقابل انتقال و یک‌بار مصرف است. کد QR فقط یک‌بار در ورودی نمایشگاه قابل اسکن است.
          </div>
        </div>
      </div>
    </div>
  )
}