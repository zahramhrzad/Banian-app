import { useRef, useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
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

interface AdminHallPinsProps {
  halls: Hall[]
  boothPinsByHall: Record<string, BoothPin[]>
  setBoothPinsByHall: React.Dispatch<React.SetStateAction<Record<string, BoothPin[]>>>
  companyNames: string[]
  onBack: () => void
}

const MIN_ZOOM = 1
const MAX_ZOOM = 3.5
const DRAG_THRESHOLD = 4

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

let pinIdCounter = 2000
function generatePinId() {
  pinIdCounter += 1
  return `bp-${pinIdCounter}`
}

export default function AdminHallPins({ halls, boothPinsByHall, setBoothPinsByHall, companyNames, onBack }: AdminHallPinsProps) {
  const [selectedHallId, setSelectedHallId] = useState(halls[0]?.id || '')
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 })
  const [isInteracting, setIsInteracting] = useState(false)
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null)
  const [companyQuery, setCompanyQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [formError, setFormError] = useState('')

  const wrapRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startY: 0, startPan: { x: 0, y: 0 } as Pan, moved: false })
  const pinch = useRef({ active: false, startDist: 0, startZoom: MIN_ZOOM })

  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }
  const pins = boothPinsByHall[selectedHallId] || []
  const filteredSuggestions = companyQuery.trim()
    ? companyNames.filter((n) => n.includes(companyQuery.trim())).slice(0, 8)
    : companyNames.slice(0, 8)

  const changeHall = (hallId: string) => {
    setSelectedHallId(hallId)
    setPendingPos(null)
    setCompanyQuery('')
    setShowSuggestions(false)
    setFormError('')
    setZoom(MIN_ZOOM)
    setPan({ x: 0, y: 0 })
  }

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
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, startPan: pan, moved: false }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.startX
    const dy = e.clientY - drag.current.startY
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) drag.current.moved = true
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
      drag.current = { active: true, startX: e.touches[0].clientX, startY: e.touches[0].clientY, startPan: pan, moved: false }
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
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) drag.current.moved = true
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

  const onMapClick = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      drag.current.moved = false
      return
    }
    if (pendingPos) return

    const wrapEl = wrapRef.current
    if (!wrapEl) return
    const rect = wrapEl.getBoundingClientRect()
    const originX = rect.width / 2
    const originY = rect.height / 2
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const px = originX + (mx - originX - pan.x) / zoom
    const py = originY + (my - originY - pan.y) / zoom
    const xPercent = Math.min(100, Math.max(0, (px / rect.width) * 100))
    const yPercent = Math.min(100, Math.max(0, (py / rect.height) * 100))

    setPendingPos({ x: xPercent, y: yPercent })
    setCompanyQuery('')
    setShowSuggestions(false)
    setFormError('')
  }

  const cancelPending = () => {
    setPendingPos(null)
    setCompanyQuery('')
    setShowSuggestions(false)
    setFormError('')
  }

  const savePending = () => {
    const company = companyQuery.trim()
    if (!company) {
      setFormError('اول یه اسم شرکت بنویس یا از لیست انتخاب کن')
      return
    }
    if (!pendingPos) return
    const newPin: BoothPin = { id: generatePinId(), hallId: selectedHallId, x: pendingPos.x, y: pendingPos.y, companyName: company }
    setBoothPinsByHall((prev) => ({ ...prev, [selectedHallId]: [...(prev[selectedHallId] || []), newPin] }))
    setPendingPos(null)
    setCompanyQuery('')
    setShowSuggestions(false)
    setFormError('')
  }

  const deletePin = (id: string) => {
    setBoothPinsByHall((prev) => ({ ...prev, [selectedHallId]: (prev[selectedHallId] || []).filter((p) => p.id !== id) }))
  }

  const selectedHall = halls.find((h) => h.id === selectedHallId)

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

      <div className="relative z-10 mt-6 flex-1 overflow-y-auto pb-4">
        <PageTitle>مدیریت نقشه و غرفه‌ها</PageTitle>

        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {halls.map((h) => (
            <button
              key={h.id}
              onClick={() => changeHall(h.id)}
              className="flex-shrink-0 text-[9.5px] font-bold px-3 py-1.5 rounded-lg"
              style={{
                background: selectedHallId === h.id ? '#be9c77' : 'rgba(255,255,255,0.06)',
                color: selectedHallId === h.id ? '#1b2134' : '#9b9baf',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {h.label}
            </button>
          ))}
        </div>

        <div className="text-[9px] mb-3 text-center leading-relaxed" style={{ color: '#9b9baf' }}>
          روی نقشه‌ی {selectedHall?.label} کلیک کن تا پین اضافه بشه
        </div>

        <div className="rounded-2xl p-3 mb-4" style={cardStyle}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[8px]" style={{ color: '#6f6e78' }}>زوم: اسکرول/پینچ · جابه‌جایی: درگ · ریست: دابل‌کلیک</span>
            <div className="flex gap-2">
              <button
                onClick={() => applyZoom(zoom + 0.4)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold"
                style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
              >
                +
              </button>
              <button
                onClick={() => applyZoom(zoom - 0.4)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold"
                style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
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
            onClick={onMapClick}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 10',
              overflow: 'hidden',
              borderRadius: '10px',
              background: '#fafafa',
              cursor: zoom > MIN_ZOOM ? 'grab' : 'crosshair',
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
                src={hallImages[selectedHallId]}
                alt={selectedHall?.label || ''}
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
              />

              {pins.map((p) => (
                <div
                  key={p.id}
                  style={{
                    position: 'absolute',
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: `translate(-50%, -100%) scale(${1 / zoom})`,
                    transformOrigin: 'bottom center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'none',
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
                    {p.companyName}
                  </span>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#be9c77', border: '2px solid #fff' }}></span>
                </div>
              ))}

              {pendingPos && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${pendingPos.x}%`,
                    top: `${pendingPos.y}%`,
                    transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: '#e08b8b',
                    border: '2px solid #fff',
                    pointerEvents: 'none',
                  }}
                ></div>
              )}
            </div>
          </div>

          {pendingPos && (
            <div className="flex flex-col gap-2 mt-3">
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={companyQuery}
                  onChange={(e) => {
                    setCompanyQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="اسم شرکت را بنویس یا از لیست انتخاب کن..."
                  className="w-full rounded-lg px-2.5 py-2 text-[10px] outline-none"
                  style={{ color: '#1b2134' }}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      left: 0,
                      marginTop: 4,
                      background: '#fff',
                      borderRadius: 8,
                      overflow: 'hidden',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                      zIndex: 10,
                      maxHeight: 160,
                      overflowY: 'auto',
                    }}
                  >
                    {filteredSuggestions.map((name) => (
                      <div
                        key={name}
                        onMouseDown={() => {
                          setCompanyQuery(name)
                          setShowSuggestions(false)
                        }}
                        className="px-3 py-2 text-[10px]"
                        style={{ color: '#1b2134', cursor: 'pointer', borderBottom: '1px solid #f3e8dc' }}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-[8px] leading-relaxed" style={{ color: '#6f6e78' }}>
                اگه شرکت توی لیست نبود، همون اسمی که تایپ کردی به‌عنوان اسم غرفه ثبت می‌شه
              </div>
              {formError && <div className="text-[8.5px]" style={{ color: '#e08b8b' }}>{formError}</div>}
              <div className="flex gap-2">
                <button
                  onClick={cancelPending}
                  className="flex-1 rounded-lg py-2 text-[9px] font-bold"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#c9c7d0', border: 'none', cursor: 'pointer' }}
                >
                  لغو
                </button>
                <button
                  onClick={savePending}
                  className="flex-[2] rounded-lg py-2 text-[9px] font-bold"
                  style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
                >
                  ثبت پین
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl p-3 mb-4" style={cardStyle}>
          <div className="text-[9px] font-bold mb-2" style={{ color: '#e8cfa8' }}>
            غرفه‌های ثبت‌شده در {selectedHall?.label} ({pins.length})
          </div>
          {pins.length === 0 ? (
            <div className="text-[8.5px] text-center py-3" style={{ color: '#6f6e78' }}>هنوز پینی ثبت نشده</div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {pins.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg px-2.5 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-[9.5px]" style={{ color: '#fff' }}>{p.companyName}</span>
                  <button
                    onClick={() => deletePin(p.id)}
                    className="text-[8px] font-bold rounded-md px-2 py-1"
                    style={{ background: 'rgba(217,83,79,0.15)', color: '#e08b8b', border: 'none', cursor: 'pointer' }}
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
