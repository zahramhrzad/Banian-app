import { useRef, useState, useEffect } from 'react'
import BackButton from './BackButton'
import type { Hall, BoothPin } from './Hall'
import hall5Img from './assets/hall-5.png'
import hall67Img from './assets/hall-6-7.png'
import hall89Img from './assets/hall-8-9.png'
import hall1011Img from './assets/hall-10-11.png'
import hall27Img from './assets/hall-27.png'

const hallImages: Record<string, string> = {
  'hall-5': hall5Img,
  'hall-6-7': hall67Img,
  'hall-8-9': hall89Img,
  'hall-10-11': hall1011Img,
  'hall-27': hall27Img,
}

interface HallMapProps {
  hall: Hall
  pins: BoothPin[]
  highlightPinId?: string
  onOpenProfile: (company: string) => void
  onBack: () => void
}

const MIN_ZOOM = 1
const MAX_ZOOM = 3.5

type Pan = { x: number; y: number }

function clampPan(pan: Pan, zoom: number, wrapEl: HTMLDivElement | null): Pan {
  if (!wrapEl) return pan
  const rect = wrapEl.getBoundingClientRect()
  const maxX = (rect.width * (zoom - 1)) / 2
  const maxY = (rect.height * (zoom - 1)) / 2
  return {
    x: Math.min(maxX, Math.max(-maxX, pan.x)),
    y: Math.min(maxY, Math.max(-maxY, pan.y)),
  }
}

function touchDistance(t: React.TouchList) {
  const dx = t[0].clientX - t[1].clientX
  const dy = t[0].clientY - t[1].clientY
  return Math.sqrt(dx * dx + dy * dy)
}

export default function HallMap({ hall, pins, highlightPinId, onOpenProfile, onBack }: HallMapProps) {
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 })
  const [isInteracting, setIsInteracting] = useState(false)

  const wrapRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startY: 0, startPan: { x: 0, y: 0 } as Pan })
  const pinch = useRef({ active: false, startDist: 0, startZoom: MIN_ZOOM })

  useEffect(() => {
    setZoom(MIN_ZOOM)
    setPan({ x: 0, y: 0 })
  }, [hall.id])

  const applyZoom = (nextZoom: number) => {
    const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom))
    setZoom(z)
    setPan((prev) => (z === MIN_ZOOM ? { x: 0, y: 0 } : clampPan(prev, z, wrapRef.current)))
  }

  const resetView = () => {
    setZoom(MIN_ZOOM)
    setPan({ x: 0, y: 0 })
  }

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom === MIN_ZOOM) return
    setIsInteracting(true)
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, startPan: pan }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.startX
    const dy = e.clientY - drag.current.startY
    setPan(clampPan({ x: drag.current.startPan.x + dx, y: drag.current.startPan.y + dy }, zoom, wrapRef.current))
  }
  const endMouseDrag = () => {
    drag.current.active = false
    setIsInteracting(false)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinch.current = { active: true, startDist: touchDistance(e.touches), startZoom: zoom }
      drag.current.active = false
      setIsInteracting(true)
    } else if (e.touches.length === 1 && zoom > MIN_ZOOM) {
      drag.current = { active: true, startX: e.touches[0].clientX, startY: e.touches[0].clientY, startPan: pan }
      setIsInteracting(true)
    }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (pinch.current.active && e.touches.length === 2) {
      const dist = touchDistance(e.touches)
      applyZoom(pinch.current.startZoom * (dist / pinch.current.startDist))
    } else if (drag.current.active && e.touches.length === 1) {
      const dx = e.touches[0].clientX - drag.current.startX
      const dy = e.touches[0].clientY - drag.current.startY
      setPan(clampPan({ x: drag.current.startPan.x + dx, y: drag.current.startPan.y + dy }, zoom, wrapRef.current))
    }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) pinch.current.active = false
    if (e.touches.length === 0) {
      drag.current.active = false
      setIsInteracting(false)
    }
  }

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    applyZoom(zoom - e.deltaY * 0.0015 * zoom)
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
        <div className="text-sm font-bold mb-1 text-center" style={{ color: '#be9c77' }}>
          {hall.label}
        </div>
        <div className="text-[9px] text-center mb-4" style={{ color: '#9b9baf' }}>
          نقشه‌ی کلی نمایشگاه ‹ {hall.label}
        </div>

        <div className="bg-white rounded-2xl p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span style={{ fontSize: 8, color: '#9b9baf' }}>زوم: اسکرول/پینچ · جابه‌جایی: درگ</span>
            <div className="flex gap-2">
              <button
                onClick={() => applyZoom(zoom + 0.4)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold"
                style={{ background: '#f3e8dc', color: '#1b2134' }}
              >
                +
              </button>
              <button
                onClick={() => applyZoom(zoom - 0.4)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold"
                style={{ background: '#f3e8dc', color: '#1b2134' }}
              >
                −
              </button>
            </div>
          </div>

          <div
            ref={wrapRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={endMouseDrag}
            onMouseLeave={endMouseDrag}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onWheel={onWheel}
            onDoubleClick={resetView}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 10',
              overflow: 'hidden',
              borderRadius: '10px',
              background: '#fafafa',
              cursor: zoom > MIN_ZOOM ? 'grab' : 'default',
              touchAction: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isInteracting ? 'none' : 'transform .15s',
              }}
            >
              <img
                src={hallImages[hall.id]}
                alt={hall.label}
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
              />

              {pins.map((p) => {
                const isHighlight = highlightPinId === p.id
                return (
                  <div
                    key={p.id}
                    onClick={() => onOpenProfile(p.companyName)}
                    style={{
                      position: 'absolute',
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      transform: `translate(-50%, -100%) scale(${1 / zoom})`,
                      transformOrigin: 'bottom center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        background: '#fff',
                        border: `1px solid ${isHighlight ? '#e08b8b' : '#be9c77'}`,
                        borderRadius: 6,
                        padding: '1px 6px',
                        fontSize: 9,
                        fontWeight: 700,
                        color: '#1b2134',
                        whiteSpace: 'nowrap',
                        marginBottom: 2,
                      }}
                    >
                      {p.companyName}
                    </span>
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: isHighlight ? '#e08b8b' : '#be9c77',
                        border: '2px solid #fff',
                      }}
                    ></span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-1 mt-2 pt-2" style={{ borderTop: '1px solid #eee' }}>
            <span style={{ width: 9, height: 9, background: '#be9c77', borderRadius: '50%', display: 'inline-block' }}></span>
            <span style={{ fontSize: 8, color: '#666' }}>موقعیت غرفه — با کلیک، پروفایل غرفه باز می‌شود</span>
          </div>
        </div>

        {pins.length === 0 && (
          <div className="text-center text-[10px] py-3" style={{ color: '#9b9baf' }}>
            هنوز غرفه‌ای برای این سالن ثبت نشده
          </div>
        )}
      </div>
    </div>
  )
}
