import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import TicketCard, { type Ticket } from './TicketCard'

interface TicketsIssuedProps {
  tickets: Ticket[]
  onContinue: () => void
  onBack: () => void
}

export default function TicketsIssued({ tickets, onContinue, onBack }: TicketsIssuedProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null)

  const handleDownload = async (index: number) => {
    const el = cardRefs.current[index]
    if (!el) return

    setDownloadingIndex(index)
    try {
      const canvas = await html2canvas(el, { scale: 3, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(`banian-ticket-${tickets[index].id.replace('#', '')}.pdf`)
    } catch (err) {
      console.error('PDF generation failed', err)
      // TODO فاز ۳: نمایش پیام خطا به کاربر
    } finally {
      setDownloadingIndex(null)
    }
  }

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
        <div className="flex justify-center mb-3">
          <div
            className="rounded-full flex items-center justify-center"
            style={{ width: '52px', height: '52px', background: '#7d9a86' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>
        <PageTitle>خرید با موفقیت انجام شد</PageTitle>
        <p className="text-[10.5px] text-center mb-6" style={{ color: '#9b9baf' }}>
          {tickets.length} بلیط صادر شد — برای هرکدام می‌توانید نسخه‌ی PDF دریافت کنید
        </p>

        <div className="flex flex-col gap-5">
          {tickets.map((ticket, i) => (
            <div key={ticket.id}>
              <div ref={(el) => { cardRefs.current[i] = el }}>
                <TicketCard ticket={ticket} />
              </div>
              <button
                onClick={() => handleDownload(i)}
                disabled={downloadingIndex === i}
                className="w-full mt-2 rounded-xl py-2.5 text-[11px] font-bold flex items-center justify-center gap-1.5"
                style={{
                  background: 'rgba(190,156,119,0.12)',
                  color: '#be9c77',
                  border: '1px solid rgba(190,156,119,0.3)',
                  cursor: downloadingIndex === i ? 'default' : 'pointer',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="2">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
                </svg>
                {downloadingIndex === i ? 'در حال آماده‌سازی...' : 'دانلود PDF این بلیط'}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onContinue}
          className="w-full rounded-full py-3.5 mt-8 font-bold text-xs"
          style={{
            background: '#be9c77',
            color: '#1b2134',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 10px 2px rgba(190,156,119,0.6), 0 0 26px 8px rgba(190,156,119,0.35)',
          }}
        >
          ورود به پنل کاربری
        </button>
      </div>
    </div>
  )
}