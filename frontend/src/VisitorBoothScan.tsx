import { useState, useRef, useEffect } from 'react'
import jsQR from 'jsqr'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import type { MeetingRequest } from './ExhibitorAppointments'

export default function VisitorBoothScan({
  visitorName,
  visitorPhone,
  meetingRequests,
  onCreateRequest,
  onBack,
}: {
  visitorName: string
  visitorPhone: string
  meetingRequests: MeetingRequest[]
  onCreateRequest: (boothCompany: string) => void
  onBack: () => void
}) {
  void visitorName

  const [manualCode, setManualCode] = useState('')
  const [manualError, setManualError] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [phase, setPhase] = useState<'idle' | 'loading' | 'success' | 'duplicate'>('idle')
  const [resultCompany, setResultCompany] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const alreadyPendingFor = (company: string) =>
    meetingRequests.some((r) => r.visitorPhone === visitorPhone && r.boothCompany === company && r.status === 'pending')

  const handleScanResult = (raw: string) => {
    const company = raw.trim()
    if (!company) return
    stopCamera()

    if (alreadyPendingFor(company)) {
      setResultCompany(company)
      setPhase('duplicate')
      return
    }

    setResultCompany(company)
    setPhase('loading')
    setTimeout(() => {
      onCreateRequest(company)
      setPhase('success')
    }, 900)
  }

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      setManualError('کد یا نام غرفه را وارد کنید')
      return
    }
    setManualError(null)
    const code = manualCode
    setManualCode('')
    handleScanResult(code)
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
        handleScanResult(result.data)
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const resetToIdle = () => {
    setPhase('idle')
    setResultCompany('')
    setManualError(null)
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
        <PageTitle>اسکن QR Code غرفه</PageTitle>
        <p className="text-[10px] text-center mb-4" style={{ color: '#9b9baf' }}>
          با اسکن QR غرفه، درخواست ملاقات برای شما و غرفه‌دار ثبت می‌شود
        </p>

        {phase === 'idle' && (
          <>
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
                        animation: 'banianVisitorScanLine 2s ease-in-out infinite',
                      }}
                    />
                  </div>
                  <span className="text-[9.5px] mt-4" style={{ color: '#e8cfa8' }}>
                    QR غرفه را داخل قاب قرار دهید
                  </span>
                  <style>{`
                    @keyframes banianVisitorScanLine {
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
              <span className="text-[9px]" style={{ color: '#9b9baf' }}>یا ورود دستی کد غرفه</span>
              <div className="flex-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            </div>

            <div className="flex gap-2 mb-1.5 mt-2">
              <div className="flex-1 bg-white rounded-xl flex items-center px-3.5 py-3">
                <input
                  dir="rtl"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleManualSubmit()
                  }}
                  placeholder="مثلاً: بانک آینده"
                  className={fieldClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
              <button
                onClick={handleManualSubmit}
                className="rounded-xl px-5 text-xs font-bold"
                style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
              >
                ثبت
              </button>
            </div>
            {manualError && (
              <div className="text-[9.5px] mb-2" style={{ color: '#d9534f' }}>{manualError}</div>
            )}
          </>
        )}

        {phase === 'loading' && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                border: '3px solid rgba(190,156,119,0.25)',
                borderTopColor: '#be9c77',
                animation: 'banianVisitorSpin 0.8s linear infinite',
              }}
            />
            <span className="text-[11px]" style={{ color: '#9b9baf' }}>در حال ثبت درخواست...</span>
            <style>{`@keyframes banianVisitorSpin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {phase === 'success' && (
          <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(190,156,119,0.15)' }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[13px] font-bold mt-2" style={{ color: '#fff' }}>
              درخواست شما برای «{resultCompany}» ارسال شد
            </p>
            <p className="text-[10.5px]" style={{ color: '#9b9baf' }}>منتظر تایید غرفه‌دار باشید</p>
            <p
              className="text-[9.5px] mt-2 rounded-lg px-3 py-2"
              style={{ background: 'rgba(190,156,119,0.1)', border: '1px solid rgba(190,156,119,0.3)', color: '#e8cfa8' }}
            >
              این درخواست به «قرارهای من» شما هم اضافه شد
            </p>
            <button
              onClick={resetToIdle}
              className="mt-5 rounded-full px-5 py-2 text-[10px]"
              style={{ background: 'transparent', color: '#9b9baf', border: '1px solid #3a3f52', cursor: 'pointer' }}
            >
              اسکن غرفه‌ی دیگر
            </button>
          </div>
        )}

        {phase === 'duplicate' && (
          <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(190,156,119,0.15)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16h.01" />
              </svg>
            </div>
            <p className="text-[12.5px] font-bold mt-2" style={{ color: '#fff' }}>
              قبلاً برای «{resultCompany}» درخواست دادی
            </p>
            <p className="text-[10.5px]" style={{ color: '#9b9baf' }}>منتظر تایید غرفه‌دار باش — نیازی به اسکن دوباره نیست</p>
            <button
              onClick={resetToIdle}
              className="mt-5 rounded-full px-5 py-2 text-[10px]"
              style={{ background: 'transparent', color: '#9b9baf', border: '1px solid #3a3f52', cursor: 'pointer' }}
            >
              بازگشت
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
