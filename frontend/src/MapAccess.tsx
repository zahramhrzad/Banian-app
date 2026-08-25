import { useRef, useState } from 'react'
import BackButton from './BackButton'
import type { Hall, BoothPin } from './Hall'
import mapImage from './assets/exhibition-map.jpg'

interface MapAccessProps {
  onBack: () => void
  halls: Hall[]
  boothPinsByHall: Record<string, BoothPin[]>
  onOpenHall: (hallId: string, highlightPinId?: string) => void
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

function MapAccess({ onBack, halls, boothPinsByHall, onOpenHall }: MapAccessProps) {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 })
  const [isInteracting, setIsInteracting] = useState(false)

  const wrapRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startY: 0, startPan: { x: 0, y: 0 } as Pan })
  const pinch = useRef({ active: false, startDist: 0, startZoom: MIN_ZOOM })

  const query = search.trim()

  // جست‌وجوی سراسری: تمام پین‌های همه‌ی سالن‌ها رو می‌گرده
  const searchResults = query
    ? Object.entries(boothPinsByHall).flatMap(([hallId, pins]) =>
        pins
          .filter((p) => p.companyName.includes(query))
          .map((p) => ({ pin: p, hall: halls.find((h) => h.id === hallId) }))
      )
    : []

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
        <div className="text-sm font-bold mb-4 text-center" style={{ color: '#be9c77' }}>
          نقشه‌ها
        </div>

        <div className="bg-white rounded-xl flex items-center gap-2 px-3 py-2.5 mb-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جست‌وجوی نام شرکت در تمام سالن‌ها..."
            className="flex-1 text-xs outline-none border-none"
            style={{ color: '#1b2134' }}
          />
        </div>

        {query && (
          <div className="bg-white rounded-xl mb-3 overflow-hidden">
            {searchResults.length === 0 ? (
              <div className="text-center py-3 text-[10px]" style={{ color: '#9b9baf' }}>
                نتیجه‌ای پیدا نشد
              </div>
            ) : (
              searchResults.map(({ pin, hall }) => (
                <button
                  key={pin.id}
                  onClick={() => onOpenHall(pin.hallId, pin.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-right"
                  style={{ borderBottom: '1px solid #f3e8dc' }}
                >
                  <span className="text-xs font-bold" style={{ color: '#1b2134' }}>{pin.companyName}</span>
                  <span className="text-[9px]" style={{ color: '#9b9baf' }}>{hall?.label || ''}</span>
                </button>
              ))
            )}
          </div>
        )}

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setViewMode('map')}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: viewMode === 'map' ? '#be9c77' : '#ffffff22', color: viewMode === 'map' ? '#1b2134' : '#9b9baf' }}
          >
            نمای نقشه
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: viewMode === 'list' ? '#be9c77' : '#ffffff22', color: viewMode === 'list' ? '#1b2134' : '#9b9baf' }}
          >
            نمای لیستی
          </button>
        </div>

        {viewMode === 'map' ? (
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
                  src={mapImage}
                  alt="نقشه‌ی نمایشگاه"
                  draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
                />

                {halls.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => onOpenHall(h.id)}
                    style={{
                      position: 'absolute',
                      left: `${h.x}%`,
                      top: `${h.y}%`,
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
                        border: '1px solid #be9c77',
                        borderRadius: 6,
                        padding: '1px 6px',
                        fontSize: 9,
                        fontWeight: 700,
                        color: '#1b2134',
                        whiteSpace: 'nowrap',
                        marginBottom: 2,
                      }}
                    >
                      {h.label}
                    </span>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#be9c77', border: '2px solid #fff' }}></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1 mt-2 pt-2" style={{ borderTop: '1px solid #eee' }}>
              <span style={{ width: 9, height: 9, background: '#be9c77', borderRadius: '50%', display: 'inline-block' }}></span>
              <span style={{ fontSize: 8, color: '#666' }}>هر پین یک سالن است — با کلیک، وارد نقشه‌ی همان سالن می‌شوید</span>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex flex-col gap-2">
            {halls.map((h) => (
              <button
                key={h.id}
                onClick={() => onOpenHall(h.id)}
                className="w-full bg-white rounded-xl px-3 py-2.5 flex items-center justify-between text-right"
              >
                <span className="text-xs font-bold" style={{ color: '#1b2134' }}>{h.label}</span>
                <span style={{ fontSize: 9, color: '#9b9baf' }}>
                  {(boothPinsByHall[h.id] || []).length} غرفه ثبت‌شده
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MapAccess
