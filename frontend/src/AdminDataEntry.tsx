import { useState, useRef } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { categories, categoryInfo, type CategoryId } from './ExhibitorProducts'

type Tab = 'map' | 'panels' | 'participants'

interface Booth {
  id: string
  name: string
  hall: string
  category: CategoryId | ''
  published: boolean
}

interface SitewidePanel {
  id: string
  title: string
  day: string
  time: string
  hall: string
  speaker: string
  category: CategoryId | ''
  published: boolean
}

interface ParticipantEntry {
  id: string
  name: string
  role: string
  company: string
  category: CategoryId | ''
  published: boolean
}

const initialBooths: Booth[] = [
  { id: 'b1', name: 'غرفه A12 — بانک آینده', hall: 'سالن A · ردیف ۲', category: 'bank', published: true },
  { id: 'b2', name: 'غرفه B04 — کارگزاری آگاه', hall: 'سالن B · ردیف ۱', category: 'capital', published: true },
]

const initialPanels: SitewidePanel[] = [
  { id: 'p1', title: 'آینده‌ی بانکداری دیجیتال', day: 'روز دوم', time: '۱۵:۰۰', hall: 'سالن B', speaker: 'علی محمدی', category: 'bank', published: true },
]

const initialParticipants: ParticipantEntry[] = [
  { id: 'pt1', name: 'دکتر رضا کریمی', role: 'سخنران کلیدی', company: 'دانشگاه تهران', category: 'infra', published: false },
]

function emptyBooth(): Omit<Booth, 'id'> {
  return { name: '', hall: '', category: '', published: false }
}
function emptyPanel(): Omit<SitewidePanel, 'id'> {
  return { title: '', day: '', time: '', hall: '', speaker: '', category: '', published: false }
}
function emptyParticipant(): Omit<ParticipantEntry, 'id'> {
  return { name: '', role: '', company: '', category: '', published: false }
}

export default function AdminDataEntry({
  onLogActivity,
  onBack,
}: {
  onLogActivity: (text: string) => void
  onBack: () => void
}) {
  const [tab, setTab] = useState<Tab>('map')
  const [search, setSearch] = useState('')

  const [booths, setBooths] = useState<Booth[]>(initialBooths)
  const [panels, setPanels] = useState<SitewidePanel[]>(initialPanels)
  const [participants, setParticipants] = useState<ParticipantEntry[]>(initialParticipants)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [boothForm, setBoothForm] = useState<Omit<Booth, 'id'>>(emptyBooth())
  const [panelForm, setPanelForm] = useState<Omit<SitewidePanel, 'id'>>(emptyPanel())
  const [participantForm, setParticipantForm] = useState<Omit<ParticipantEntry, 'id'>>(emptyParticipant())

  const fileInputRef = useRef<HTMLInputElement>(null)

  const fieldClass = 'flex-1 border-none outline-none text-xs bg-transparent'
  const fieldBoxClass = 'flex items-center gap-2 bg-white rounded-xl px-3.5 py-3'

  const switchTab = (t: Tab) => {
    setTab(t)
    setSearch('')
    setShowForm(false)
    setEditingId(null)
  }

  const openNewForm = () => {
    setEditingId(null)
    if (tab === 'map') setBoothForm(emptyBooth())
    if (tab === 'panels') setPanelForm(emptyPanel())
    if (tab === 'participants') setParticipantForm(emptyParticipant())
    setShowForm(true)
  }

  const closeForm = () => setShowForm(false)

  const save = () => {
    if (tab === 'map') {
      if (!boothForm.name.trim()) return
      if (editingId) {
        setBooths((prev) => prev.map((b) => (b.id === editingId ? { ...b, ...boothForm } : b)))
        onLogActivity(`غرفه‌ی «${boothForm.name}» را ویرایش کرد`)
      } else {
        setBooths((prev) => [...prev, { id: Date.now().toString(), ...boothForm }])
        onLogActivity(`غرفه‌ی «${boothForm.name}» را اضافه کرد`)
      }
    } else if (tab === 'panels') {
      if (!panelForm.title.trim()) return
      if (editingId) {
        setPanels((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...panelForm } : p)))
        onLogActivity(`همایش «${panelForm.title}» را ویرایش کرد`)
      } else {
        setPanels((prev) => [...prev, { id: Date.now().toString(), ...panelForm }])
        onLogActivity(`همایش «${panelForm.title}» را اضافه کرد`)
      }
    } else {
      if (!participantForm.name.trim()) return
      if (editingId) {
        setParticipants((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...participantForm } : p)))
        onLogActivity(`فرد «${participantForm.name}» را ویرایش کرد`)
      } else {
        setParticipants((prev) => [...prev, { id: Date.now().toString(), ...participantForm }])
        onLogActivity(`فرد «${participantForm.name}» را اضافه کرد`)
      }
    }
    setShowForm(false)
  }

  const remove = (id: string) => {
    if (tab === 'map') {
      const item = booths.find((b) => b.id === id)
      setBooths((prev) => prev.filter((b) => b.id !== id))
      if (item) onLogActivity(`غرفه‌ی «${item.name}» را حذف کرد`)
    } else if (tab === 'panels') {
      const item = panels.find((p) => p.id === id)
      setPanels((prev) => prev.filter((p) => p.id !== id))
      if (item) onLogActivity(`همایش «${item.title}» را حذف کرد`)
    } else {
      const item = participants.find((p) => p.id === id)
      setParticipants((prev) => prev.filter((p) => p.id !== id))
      if (item) onLogActivity(`فرد «${item.name}» را حذف کرد`)
    }
  }

  const togglePublished = (id: string) => {
    if (tab === 'map') setBooths((prev) => prev.map((b) => (b.id === id ? { ...b, published: !b.published } : b)))
    else if (tab === 'panels') setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p)))
    else setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p)))
  }

  const startEdit = (item: Booth | SitewidePanel | ParticipantEntry) => {
    setEditingId(item.id)
    if (tab === 'map') setBoothForm(item as Booth)
    else if (tab === 'panels') setPanelForm(item as SitewidePanel)
    else setParticipantForm(item as ParticipantEntry)
    setShowForm(true)
  }

  const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
      let importedCount = 0

      lines.forEach((line) => {
        const cols = line.split(',').map((c) => c.trim())
        if (tab === 'map' && cols[0] && cols[0] !== 'نام') {
          setBooths((prev) => [...prev, { id: Date.now().toString() + Math.random(), name: cols[0], hall: cols[1] || '', category: (cols[2] as CategoryId) || '', published: false }])
          importedCount++
        } else if (tab === 'panels' && cols[0] && cols[0] !== 'عنوان') {
          setPanels((prev) => [...prev, { id: Date.now().toString() + Math.random(), title: cols[0], day: cols[1] || '', time: cols[2] || '', hall: cols[3] || '', speaker: cols[4] || '', category: (cols[5] as CategoryId) || '', published: false }])
          importedCount++
        } else if (tab === 'participants' && cols[0] && cols[0] !== 'نام') {
          setParticipants((prev) => [...prev, { id: Date.now().toString() + Math.random(), name: cols[0], role: cols[1] || '', company: cols[2] || '', category: (cols[3] as CategoryId) || '', published: false }])
          importedCount++
        }
      })

      onLogActivity(`${importedCount} مورد را از فایل CSV وارد کرد`)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  const filteredBooths = booths.filter((b) => search.trim() === '' || b.name.includes(search.trim()))
  const filteredPanels = panels.filter((p) => search.trim() === '' || p.title.includes(search.trim()))
  const filteredParticipants = participants.filter((p) => search.trim() === '' || p.name.includes(search.trim()))

  const csvHint =
    tab === 'map' ? 'ستون‌ها: نام, سالن, دسته‌بندی' : tab === 'panels' ? 'ستون‌ها: عنوان, روز, ساعت, سالن, سخنران, دسته‌بندی' : 'ستون‌ها: نام, سمت, شرکت, دسته‌بندی'

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden px-6 py-8"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={showForm ? closeForm : onBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="relative z-10 mt-6">
        <PageTitle>پیشخوان Data Entry</PageTitle>

        <div className="flex gap-2 mb-3 flex-wrap">
          <button onClick={() => switchTab('map')} className="text-[9.5px] font-bold px-3 py-1.5 rounded-lg" style={{ background: tab === 'map' ? '#be9c77' : 'rgba(255,255,255,0.06)', color: tab === 'map' ? '#1b2134' : '#9b9baf', border: 'none', cursor: 'pointer' }}>
            نقشه و غرفه‌ها
          </button>
          <button onClick={() => switchTab('panels')} className="text-[9.5px] font-bold px-3 py-1.5 rounded-lg" style={{ background: tab === 'panels' ? '#be9c77' : 'rgba(255,255,255,0.06)', color: tab === 'panels' ? '#1b2134' : '#9b9baf', border: 'none', cursor: 'pointer' }}>
            همایش‌های سراسری
          </button>
          <button onClick={() => switchTab('participants')} className="text-[9.5px] font-bold px-3 py-1.5 rounded-lg" style={{ background: tab === 'participants' ? '#be9c77' : 'rgba(255,255,255,0.06)', color: tab === 'participants' ? '#1b2134' : '#9b9baf', border: 'none', cursor: 'pointer' }}>
            اسامی شرکت‌کنندگان
          </button>
        </div>

        {!showForm && (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جست‌وجو..."
              className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs outline-none mb-3"
              style={{ color: '#1b2134' }}
            />

            <div className="flex flex-col gap-2 mb-3">
              {tab === 'map' &&
                filteredBooths.map((b) => {
                  const cat = categoryInfo(b.category)
                  return (
                    <div key={b.id} className="bg-white rounded-2xl p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>{b.name}</span>
                        {cat && <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: cat.color, color: cat.text }}>{cat.label}</span>}
                      </div>
                      <div className="text-[9px] mt-1" style={{ color: '#9b9baf' }}>{b.hall}</div>
                      <div className="flex justify-between items-center mt-2">
                        <button onClick={() => togglePublished(b.id)} className="text-[8px] font-bold px-2 py-1 rounded-md" style={{ background: b.published ? '#e3f0e0' : 'rgba(155,155,175,0.15)', color: b.published ? '#3f6b4d' : '#9b9baf', border: 'none', cursor: 'pointer' }}>
                          {b.published ? '● منتشر شده' : '○ پیش‌نویس'}
                        </button>
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(b)} className="text-[9px] underline" style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}>ویرایش</button>
                          <button onClick={() => remove(b.id)} className="text-[9px] underline" style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}>حذف</button>
                        </div>
                      </div>
                    </div>
                  )
                })}

              {tab === 'panels' &&
                filteredPanels.map((p) => {
                  const cat = categoryInfo(p.category)
                  return (
                    <div key={p.id} className="bg-white rounded-2xl p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>{p.title}</span>
                        {cat && <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: cat.color, color: cat.text }}>{cat.label}</span>}
                      </div>
                      <div className="text-[9px] mt-1" style={{ color: '#9b9baf' }}>{p.speaker} · {p.day} {p.time} · {p.hall}</div>
                      <div className="flex justify-between items-center mt-2">
                        <button onClick={() => togglePublished(p.id)} className="text-[8px] font-bold px-2 py-1 rounded-md" style={{ background: p.published ? '#e3f0e0' : 'rgba(155,155,175,0.15)', color: p.published ? '#3f6b4d' : '#9b9baf', border: 'none', cursor: 'pointer' }}>
                          {p.published ? '● منتشر شده' : '○ پیش‌نویس'}
                        </button>
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(p)} className="text-[9px] underline" style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}>ویرایش</button>
                          <button onClick={() => remove(p.id)} className="text-[9px] underline" style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}>حذف</button>
                        </div>
                      </div>
                    </div>
                  )
                })}

              {tab === 'participants' &&
                filteredParticipants.map((p) => {
                  const cat = categoryInfo(p.category)
                  return (
                    <div key={p.id} className="bg-white rounded-2xl p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>{p.name}</span>
                        {cat && <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: cat.color, color: cat.text }}>{cat.label}</span>}
                      </div>
                      <div className="text-[9px] mt-1" style={{ color: '#9b9baf' }}>{p.role} · {p.company}</div>
                      <div className="flex justify-between items-center mt-2">
                        <button onClick={() => togglePublished(p.id)} className="text-[8px] font-bold px-2 py-1 rounded-md" style={{ background: p.published ? '#e3f0e0' : 'rgba(155,155,175,0.15)', color: p.published ? '#3f6b4d' : '#9b9baf', border: 'none', cursor: 'pointer' }}>
                          {p.published ? '● منتشر شده' : '○ پیش‌نویس'}
                        </button>
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(p)} className="text-[9px] underline" style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}>ویرایش</button>
                          <button onClick={() => remove(p.id)} className="text-[9px] underline" style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}>حذف</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>

            <button onClick={openNewForm} className="w-full rounded-xl py-3 text-[11px] font-bold mb-2" style={{ border: '1.5px dashed rgba(190,156,119,0.5)', color: '#be9c77', background: 'transparent', cursor: 'pointer' }}>
              + افزودن مورد جدید
            </button>

            <label className="w-full rounded-xl py-2.5 text-[10px] font-bold flex items-center justify-center gap-1.5 mb-1" style={{ background: 'rgba(190,156,119,0.12)', border: '1px solid rgba(190,156,119,0.3)', color: '#e8cfa8', cursor: 'pointer' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e8cfa8" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              Import گروهی از CSV
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCsvFile} className="hidden" />
            </label>
            <div className="text-[8px] text-center mb-4" style={{ color: '#6f6e78' }}>{csvHint}</div>
          </>
        )}

        {showForm && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[11px] font-bold mb-1" style={{ color: '#e8cfa8' }}>
              {editingId ? 'ویرایش مورد' : 'افزودن مورد جدید'}
            </div>

            <div className="text-[9.5px] font-bold mb-1" style={{ color: '#9b9baf' }}>پیش‌نمایش زنده</div>
            <div className="bg-white rounded-2xl p-3 mb-1">
              {tab === 'map' && (
                <>
                  <div className="flex justify-between items-start">
                    <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>{boothForm.name || 'نام غرفه'}</span>
                    {categoryInfo(boothForm.category) && (
                      <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: categoryInfo(boothForm.category)!.color, color: categoryInfo(boothForm.category)!.text }}>
                        {categoryInfo(boothForm.category)!.label}
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] mt-1" style={{ color: '#9b9baf' }}>{boothForm.hall || 'محل غرفه'}</div>
                </>
              )}
              {tab === 'panels' && (
                <>
                  <div className="flex justify-between items-start">
                    <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>{panelForm.title || 'عنوان همایش'}</span>
                    {categoryInfo(panelForm.category) && (
                      <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: categoryInfo(panelForm.category)!.color, color: categoryInfo(panelForm.category)!.text }}>
                        {categoryInfo(panelForm.category)!.label}
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] mt-1" style={{ color: '#9b9baf' }}>{panelForm.speaker || 'سخنران'} · {panelForm.day || 'روز'} {panelForm.time || 'ساعت'} · {panelForm.hall || 'سالن'}</div>
                </>
              )}
              {tab === 'participants' && (
                <>
                  <div className="flex justify-between items-start">
                    <span className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>{participantForm.name || 'نام فرد'}</span>
                    {categoryInfo(participantForm.category) && (
                      <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: categoryInfo(participantForm.category)!.color, color: categoryInfo(participantForm.category)!.text }}>
                        {categoryInfo(participantForm.category)!.label}
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] mt-1" style={{ color: '#9b9baf' }}>{participantForm.role || 'سمت'} · {participantForm.company || 'شرکت/سازمان'}</div>
                </>
              )}
            </div>

            {tab === 'map' && (
              <>
                <div className={fieldBoxClass}>
                  <input value={boothForm.name} onChange={(e) => setBoothForm((p) => ({ ...p, name: e.target.value }))} placeholder="نام غرفه" className={fieldClass} style={{ color: '#1b2134' }} />
                </div>
                <div className={fieldBoxClass}>
                  <input value={boothForm.hall} onChange={(e) => setBoothForm((p) => ({ ...p, hall: e.target.value }))} placeholder="سالن / موقعیت" className={fieldClass} style={{ color: '#1b2134' }} />
                </div>
                <div className={fieldBoxClass}>
                  <select value={boothForm.category} onChange={(e) => setBoothForm((p) => ({ ...p, category: e.target.value as CategoryId }))} className={fieldClass} style={{ color: '#1b2134' }}>
                    <option value="">بدون دسته‌بندی</option>
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
                  </select>
                </div>
              </>
            )}

            {tab === 'panels' && (
              <>
                <div className={fieldBoxClass}>
                  <input value={panelForm.title} onChange={(e) => setPanelForm((p) => ({ ...p, title: e.target.value }))} placeholder="عنوان همایش" className={fieldClass} style={{ color: '#1b2134' }} />
                </div>
                <div className={fieldBoxClass}>
                  <input value={panelForm.speaker} onChange={(e) => setPanelForm((p) => ({ ...p, speaker: e.target.value }))} placeholder="سخنران" className={fieldClass} style={{ color: '#1b2134' }} />
                </div>
                <div className="flex gap-2.5">
                  <div className={fieldBoxClass + ' flex-1'}>
                    <input value={panelForm.day} onChange={(e) => setPanelForm((p) => ({ ...p, day: e.target.value }))} placeholder="روز" className={fieldClass} style={{ color: '#1b2134' }} />
                  </div>
                  <div className={fieldBoxClass + ' flex-1'}>
                    <input value={panelForm.time} onChange={(e) => setPanelForm((p) => ({ ...p, time: e.target.value }))} placeholder="ساعت" className={fieldClass} style={{ color: '#1b2134' }} />
                  </div>
                </div>
                <div className={fieldBoxClass}>
                  <input value={panelForm.hall} onChange={(e) => setPanelForm((p) => ({ ...p, hall: e.target.value }))} placeholder="سالن" className={fieldClass} style={{ color: '#1b2134' }} />
                </div>
                <div className={fieldBoxClass}>
                  <select value={panelForm.category} onChange={(e) => setPanelForm((p) => ({ ...p, category: e.target.value as CategoryId }))} className={fieldClass} style={{ color: '#1b2134' }}>
                    <option value="">بدون دسته‌بندی</option>
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
                  </select>
                </div>
              </>
            )}

            {tab === 'participants' && (
              <>
                <div className={fieldBoxClass}>
                  <input value={participantForm.name} onChange={(e) => setParticipantForm((p) => ({ ...p, name: e.target.value }))} placeholder="نام فرد" className={fieldClass} style={{ color: '#1b2134' }} />
                </div>
                <div className={fieldBoxClass}>
                  <input value={participantForm.role} onChange={(e) => setParticipantForm((p) => ({ ...p, role: e.target.value }))} placeholder="سمت" className={fieldClass} style={{ color: '#1b2134' }} />
                </div>
                <div className={fieldBoxClass}>
                  <input value={participantForm.company} onChange={(e) => setParticipantForm((p) => ({ ...p, company: e.target.value }))} placeholder="شرکت / سازمان" className={fieldClass} style={{ color: '#1b2134' }} />
                </div>
                <div className={fieldBoxClass}>
                  <select value={participantForm.category} onChange={(e) => setParticipantForm((p) => ({ ...p, category: e.target.value as CategoryId }))} className={fieldClass} style={{ color: '#1b2134' }}>
                    <option value="">بدون دسته‌بندی</option>
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
                  </select>
                </div>
              </>
            )}

            <div className="mt-3 flex gap-2">
              <button onClick={closeForm} className="flex-1 rounded-full py-2.5 font-bold text-[11.5px]" style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}>
                انصراف
              </button>
              <button onClick={save} className="flex-[2] rounded-full py-2.5 font-bold text-xs" style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}>
                ذخیره
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
