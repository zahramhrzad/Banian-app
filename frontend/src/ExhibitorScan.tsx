import { useState, useRef, useEffect } from 'react'
import jsQR from 'jsqr'
import BackButton from './BackButton'
import PageTitle from './PageTitle'

export interface ScanLog {
  id: string
  ticketCode: string
  scannedByStaffName: string
  scannedAt: number
  method: 'manual' | 'camera'
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return `${d.toLocaleDateString('fa-IR')} ساعت ${d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`
}

export default function ExhibitorScan({
  scanLogs,
  setScanLogs,
  staffName,
  onBack,
}: {
  scanLogs: ScanLog[]
  setScanLogs: React.Dispatch<React.SetStateAction<ScanLog[]>>
  staffName: string
  onBack: () => void
}) {
  const [manualCode, setManualCode] = useState('')
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null)
  const [justScanned, setJustScanned] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const recordScan = (code: string, method: 'manual' | 'camera') => {
    const trimmed = code.trim()
    if (!trimmed) return

    const alreadyScanned = scanLogs.some((s) => s.ticketCode.toUpperCase() === trimmed.toUpperCase())
    if (alreadyScanned) {
      setDuplicateWarning(trimmed)
      setTimeout(() => setDuplicateWarning(null), 3500)
      return
    }

    setScanLogs((prev) => [
      { id: Date.now().toString(), ticketCode: trimmed, scannedByStaffName: staffName, scannedAt: Date.now(), method },
      ...prev,
    ])
    setJustScanned(trimmed)
    setTimeout(() => setJustScanned(null), 3000)
  }

  const handleManualSubmit = () => {
    recordScan(manualCode, 'manual')
    setManualCode('')
  }

  const startCamera = async () => {
    setCameraError(null)
    setVideoReady(false)
    setCameraActive(true)

    await new Promise((resolve) => requestAnimationFrame(resolve))

    if (!videoRef.current) {
      setCameraError('خطای داخلی: المنت دوربین آماده نشد. لطفاً دوباره تلاش کنید.')
      setCameraActive(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream

      const videoEl = videoRef.current
      videoEl.srcObject = stream
      videoEl.muted = true
      videoEl.setAttribute('playsinline', 'true')
      videoEl.setAttribute('autoplay', 'true')

      const markReady = () => setVideoReady(true)
      videoEl.onloadedmetadata = markReady
      videoEl.oncanplay = markReady
      videoEl.onplaying = markReady

      try {
        await videoEl.play()
      } catch {
        // برخی مرورگرها ممکنه play() رو بلافاصله رد کنن؛ رویدادهای بالا در صورت پخش واقعی فعال می‌شن
      }

      setTimeout(markReady, 2500)
      scanLoop()
    } catch {
      setCameraError('دسترسی به دوربین امکان‌پذیر نشد. لطفاً اجازه‌ی دسترسی به دوربین را بدهید یا از ورود دستی استفاده کنید.')
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
    setVideoReady(false)
  }

  const scanLoop = () => {
    const tick = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const result = jsQR(imageData.data, imageData.width, imageData.height)

      if (result && result.data) {
        recordScan(result.data, 'camera')
        stopCamera()
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const fieldClass = 'flex-1 border-none outline-none text-sm bg-transparent'

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden px-6 py-8"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton
        onClick={() => {
          stopCamera()
          onBack()
        }}
      />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="relative z-10 mt-6">
        <PageTitle>ثبت اسکن بازدیدکننده</PageTitle>
        <p className="text-[10px] text-center mb-4" style={{ color: '#9b9baf' }}>
          مشخص می‌کند کدام عضو تیم، کدام بازدیدکننده را کِی اسکن کرده است
        </p>

        {/* این کادر همیشه توی صفحه وجود داره (هیچ‌وقت hidden نمی‌شه) تا سافاری آیفون تصویر دوربین رو گم نکنه؛
            وقتی دوربین خاموشه فقط ارتفاعش صفر می‌شه */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{ background: '#000', height: cameraActive ? '260px' : '0px', transition: 'height 0.2s' }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full"
            style={{ objectFit: 'cover', display: 'block' }}
          />
          <canvas ref={canvasRef} className="hidden" />

          {cameraActive && !videoReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px]" style={{ color: '#9b9baf' }}>در حال باز شدن دوربین...</span>
            </div>
          )}

          {cameraActive && videoReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div style={{ position: 'relative', width: '170px', height: '170px' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '26px', height: '26px', borderTop: '3px solid #e8cfa8', borderRight: '3px solid #e8cfa8', borderRadius: '4px 8px 0 0' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '26px', height: '26px', borderTop: '3px solid #e8cfa8', borderLeft: '3px solid #e8cfa8', borderRadius: '8px 4px 0 0' }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '26px', height: '26px', borderBottom: '3px solid #e8cfa8', borderRight: '3px solid #e8cfa8', borderRadius: '0 0 8px 4px' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '26px', height: '26px', borderBottom: '3px solid #e8cfa8', borderLeft: '3px solid #e8cfa8', borderRadius: '0 0 4px 8px' }} />
                <div
                  style={{
                    position: 'absolute',
                    right: '6px',
                    left: '6px',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #e8cfa8, transparent)',
                    animation: 'banianScanLine 2s ease-in-out infinite',
                  }}
                />
              </div>
              <span className="text-[9.5px] mt-4" style={{ color: '#e8cfa8' }}>
                QR کد بلیط را داخل قاب قرار دهید
              </span>
              <style>{`
                @keyframes banianScanLine {
                  0% { top: 4px; opacity: 0.3; }
                  50% { top: calc(100% - 6px); opacity: 1; }
                  100% { top: 4px; opacity: 0.3; }
                }
              `}</style>
            </div>
          )}

          {cameraActive && (
            <button
              onClick={stopCamera}
              className="absolute top-2 left-2 text-[10px] font-bold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              توقف دوربین
            </button>
          )}
        </div>

        {!cameraActive && (
          <button
            onClick={startCamera}
            className="w-full py-4 mt-3 mb-3 flex flex-col items-center gap-2 rounded-2xl"
            style={{ background: 'rgba(190,156,119,0.12)', border: '1.5px dashed rgba(190,156,119,0.5)', cursor: 'pointer' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6">
              <path d="M3 7V5a2 2 0 012-2h2M3 17v2a2 2 0 002 2h2M21 7V5a2 2 0 00-2-2h-2M21 17v2a2 2 0 01-2 2h-2" />
              <rect x="8" y="8" width="8" height="8" rx="1" />
            </svg>
            <span className="text-[11px] font-bold" style={{ color: '#be9c77' }}>شروع اسکن با دوربین</span>
          </button>
        )}

        {cameraActive && <div className="mb-3" />}

        {cameraError && (
          <div
            className="text-[9.5px] px-3 py-2 rounded-lg mb-3"
            style={{ background: 'rgba(217,83,79,0.1)', color: '#d9534f', border: '1px solid rgba(217,83,79,0.3)' }}
          >
            {cameraError}
          </div>
        )}

        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span className="text-[9px]" style={{ color: '#9b9baf' }}>یا ورود دستی</span>
          <div className="flex-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <div className="flex gap-2 mb-2 mt-2">
          <div className="flex-1 bg-white rounded-xl flex items-center px-3.5 py-3">
            <input
              dir="ltr"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleManualSubmit()
              }}
              placeholder="مثال: #BN-00218"
              className={fieldClass}
              style={{ color: '#1b2134' }}
            />
          </div>
          <button
            onClick={handleManualSubmit}
            disabled={manualCode.trim() === ''}
            className="rounded-xl px-5 text-xs font-bold"
            style={{
              background: manualCode.trim() === '' ? '#6b6375' : '#be9c77',
              color: '#1b2134',
              border: 'none',
              cursor: manualCode.trim() === '' ? 'not-allowed' : 'pointer',
            }}
          >
            ثبت
          </button>
        </div>

        {duplicateWarning && (
          <div className="text-[9.5px] mb-3" style={{ color: '#d9534f' }}>
            کد «{duplicateWarning}» قبلاً ثبت شده — این بلیط تکراری اسکن شد
          </div>
        )}

        {justScanned && (
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#7d9a86' }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[9.5px]" style={{ color: '#7d9a86' }}>
              بلیط «{justScanned}» با موفقیت ثبت شد
            </span>
          </div>
        )}

        <div className="text-[10px] font-bold mb-2 mt-4" style={{ color: '#e8cfa8' }}>
          دفتر اسکن‌ها ({scanLogs.length.toLocaleString('fa-IR')})
        </div>

        {scanLogs.length === 0 && (
          <p className="text-[10.5px] text-center py-4" style={{ color: '#9b9baf' }}>
            هنوز اسکنی ثبت نشده
          </p>
        )}

        <div className="flex flex-col gap-2">
          {scanLogs.map((s) => (
            <div key={s.id} className="bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold" dir="ltr" style={{ color: '#1b2134' }}>{s.ticketCode}</div>
                <div className="text-[8.5px] mt-0.5" style={{ color: '#9b9baf' }}>
                  اسکن‌شده توسط: {s.scannedByStaffName}
                </div>
              </div>
              <div className="text-left">
                <span
                  className="inline-block text-[7px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{ background: s.method === 'camera' ? '#e3f0e0' : 'rgba(190,156,119,0.15)', color: s.method === 'camera' ? '#3f6b4d' : '#8a6d4d' }}
                >
                  {s.method === 'camera' ? 'دوربین' : 'دستی'}
                </span>
                <div className="text-[8px] mt-1" style={{ color: '#9b9baf' }}>{formatTime(s.scannedAt)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}