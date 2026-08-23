import { useState } from 'react'
import BackButton from './BackButton'
import type { MapPin } from './MapPin'

interface MapAccessProps {
  onBack: () => void
  pins: MapPin[]
  onOpenProfile: (company: string) => void
}

function MapAccess({ onBack, pins, onOpenProfile }: MapAccessProps) {
  const [search, setSearch] = useState('')
  const [zoom, setZoom] = useState(1)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  const query = search.trim()
  const matchingPinId = query ? pins.find((p) => p.companyName.includes(query))?.id || null : null
  const filteredListPins = query ? pins.filter((p) => p.companyName.includes(query)) : pins

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

        <div className="bg-white rounded-xl flex items-center gap-2 px-3 py-2.5 mb-3">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جست‌وجوی نام شرکت..."
            className="flex-1 text-xs outline-none border-none"
            style={{ color: '#1b2134' }}
          />
        </div>

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
            <div className="flex justify-end gap-2 mb-2">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold"
                style={{ background: '#f3e8dc', color: '#1b2134' }}
              >
                +
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.7))}
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold"
                style={{ background: '#f3e8dc', color: '#1b2134' }}
              >
                −
              </button>
            </div>

            <div style={{ overflow: 'hidden', borderRadius: '10px' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center',
                  transition: 'transform .2s',
                }}
              >
                {/* TODO: replace this placeholder block with the real exhibition map <img> once the photo is added to src/assets */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#fafafa',
                    border: '1px dashed #d8d0c4',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '1rem',
                  }}
                >
                  <span style={{ fontSize: 10, color: '#9b9baf' }}>
                    تصویر واقعی نقشه‌ی نمایشگاه اینجا قرار می‌گیرد
                  </span>
                </div>

                {pins.map((p) => {
                  const isMatch = matchingPinId === p.id
                  return (
                    <div
                      key={p.id}
                      onClick={() => onOpenProfile(p.companyName)}
                      style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        transform: 'translate(-50%, -100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          background: '#fff',
                          border: `1px solid ${isMatch ? '#e08b8b' : '#be9c77'}`,
                          borderRadius: 6,
                          padding: '1px 6px',
                          fontSize: 8,
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
                          background: isMatch ? '#e08b8b' : '#be9c77',
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
        ) : (
          <div className="mb-4 flex flex-col gap-2">
            {filteredListPins.length === 0 ? (
              <div className="text-center py-6" style={{ fontSize: 10.5, color: '#9b9baf' }}>
                غرفه‌ای با این نام پیدا نشد
              </div>
            ) : (
              filteredListPins.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onOpenProfile(p.companyName)}
                  className="w-full bg-white rounded-xl px-3 py-2.5 flex items-center justify-between text-right"
                >
                  <span className="text-xs font-bold" style={{ color: '#1b2134' }}>{p.companyName}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="2">
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MapAccess
