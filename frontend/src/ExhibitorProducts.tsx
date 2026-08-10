import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'

export type CategoryId = 'bank' | 'capital' | 'insurance' | 'infra'

export const categories: { id: CategoryId; label: string; color: string; text: string }[] = [
  { id: 'bank', label: 'بانک، اعتبار و پرداخت', color: '#f3e8dc', text: '#8a6d4d' },
  { id: 'capital', label: 'بازار سرمایه و سرمایه‌گذاری', color: '#e3f0e0', text: '#3f6b4d' },
  { id: 'insurance', label: 'بیمه و مدیریت ریسک', color: '#dbe8f7', text: '#3d5a80' },
  { id: 'infra', label: 'زیرساخت، فناوری و نهادهای پشتیبان', color: '#eee2f2', text: '#6b4d80' },
]

const DESCRIPTION_LIMIT = 150
const NEW_LAUNCH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

export interface Product {
  id: string
  name: string
  description: string
  category: CategoryId | ''
  imageUrl: string | null
  isNewLaunch: boolean
  launchDate: number | null
  published: boolean
}

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  description: '',
  category: '',
  imageUrl: null,
  isNewLaunch: false,
  launchDate: null,
  published: false,
}

export function categoryInfo(id: CategoryId | '') {
  return categories.find((c) => c.id === id)
}

export function isLaunchBadgeActive(p: Product) {
  return p.isNewLaunch && p.launchDate !== null && Date.now() - p.launchDate < NEW_LAUNCH_WINDOW_MS
}

export default function ExhibitorProducts({
  products,
  setProducts,
  onBack,
}: {
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  onBack: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct)

  const fieldClass = 'flex items-center gap-2 bg-white rounded-xl px-3.5 py-3'
  const inputClass = 'flex-1 border-none outline-none text-xs bg-transparent'

  const openNewForm = () => {
    setForm(emptyProduct)
    setEditingId(null)
    setShowForm(true)
  }

  const openEditForm = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      imageUrl: p.imageUrl,
      isNewLaunch: p.isNewLaunch,
      launchDate: p.launchDate,
      published: p.published,
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyProduct)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm((prev) => ({ ...prev, imageUrl: url }))
  }

  const toggleNewLaunch = () => {
    setForm((prev) => ({
      ...prev,
      isNewLaunch: !prev.isNewLaunch,
      launchDate: !prev.isNewLaunch ? Date.now() : null,
    }))
  }

  const isValid = form.name.trim() !== '' && form.category !== ''

  const saveProduct = () => {
    if (!isValid) return
    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form } : p)))
    } else {
      setProducts((prev) => [...prev, { id: Date.now().toString(), ...form }])
    }
    closeForm()
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const togglePublished = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    )
  }

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
        <PageTitle>محصولات و خدمات غرفه</PageTitle>

        {!showForm && (
          <>
            {products.length === 0 && (
              <p className="text-[11px] text-center mb-4" style={{ color: '#9b9baf' }}>
                هنوز محصولی اضافه نکرده‌اید
              </p>
            )}

            <div className="flex flex-col gap-2.5 mb-4">
              {products.map((p) => {
                const cat = categoryInfo(p.category)
                const showBadge = isLaunchBadgeActive(p)
                return (
                  <div key={p.id} className="bg-white rounded-2xl p-3 flex gap-3">
                    <div
                      className="rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ width: '56px', height: '56px', background: cat?.color || '#f3e8dc' }}
                    >
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={cat?.text || '#8a6d4d'} strokeWidth="1.6">
                          <rect x="3" y="7" width="18" height="13" rx="2" />
                          <path d="M8 7V5a4 4 0 018 0v2" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold truncate" style={{ color: '#1b2134' }}>
                          {p.name}
                        </span>
                        {showBadge && (
                          <span
                            className="text-[8px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
                            style={{ background: '#e3f0e0', color: '#3f6b4d' }}
                          >
                            رونمایی جدید
                          </span>
                        )}
                      </div>
                      {cat && (
                        <span
                          className="inline-block text-[8.5px] font-bold px-1.5 py-0.5 rounded-md mt-1"
                          style={{ background: cat.color, color: cat.text }}
                        >
                          {cat.label}
                        </span>
                      )}
                      <p className="text-[9.5px] mt-1.5 leading-relaxed" style={{ color: '#9b9baf' }}>
                        {p.description || 'بدون توضیحات'}
                      </p>

                      <div className="flex items-center justify-between mt-2.5">
                        <button
                          onClick={() => togglePublished(p.id)}
                          className="text-[8.5px] font-bold px-2 py-1 rounded-md"
                          style={{
                            background: p.published ? '#e3f0e0' : 'rgba(155,155,175,0.15)',
                            color: p.published ? '#3f6b4d' : '#9b9baf',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          {p.published ? '● منتشر شده' : '○ پیش‌نویس'}
                        </button>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => openEditForm(p)}
                            className="text-[9.5px] underline"
                            style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="text-[9.5px] underline"
                            style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={openNewForm}
              className="w-full rounded-xl py-3 text-[11px] font-bold"
              style={{ border: '1.5px dashed rgba(190,156,119,0.5)', color: '#be9c77', background: 'transparent', cursor: 'pointer' }}
            >
              + افزودن محصول جدید
            </button>
          </>
        )}

        {showForm && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[11px] font-bold mb-1" style={{ color: '#e8cfa8' }}>
              {editingId ? 'ویرایش محصول' : 'افزودن محصول جدید'}
            </div>

            <div className={fieldClass}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a4 4 0 018 0v2" />
              </svg>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="نام محصول یا خدمت"
                className={inputClass}
                style={{ color: '#1b2134' }}
              />
            </div>

            <div className={fieldClass}>
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as CategoryId }))}
                className={inputClass}
                style={{ color: '#1b2134' }}
              >
                <option value="">دسته‌بندی را انتخاب کنید</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-xl px-3.5 py-3">
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value.slice(0, DESCRIPTION_LIMIT) }))
                }
                placeholder="توضیحات کوتاه"
                className="w-full border-none outline-none text-xs bg-transparent resize-none"
                style={{ color: '#1b2134', minHeight: '52px' }}
              />
              <div className="text-left text-[9px] mt-1" style={{ color: '#9b9baf' }}>
                {form.description.length}/{DESCRIPTION_LIMIT}
              </div>
            </div>

            <label
              className="bg-white rounded-xl px-3.5 py-3 flex items-center gap-2"
              style={{ cursor: 'pointer' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="11" r="2" />
                <path d="M21 15l-5-5-9 9" />
              </svg>
              <span className="text-xs flex-1" style={{ color: form.imageUrl ? '#1b2134' : '#9b9baf' }}>
                {form.imageUrl ? 'تصویر انتخاب شد' : 'آپلود تصویر (اختیاری)'}
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {form.imageUrl && (
              <div className="rounded-xl overflow-hidden" style={{ height: '110px' }}>
                <img src={form.imageUrl} alt="پیش‌نمایش" className="w-full h-full object-cover" />
              </div>
            )}

            <label className="flex items-center gap-2 px-1 py-1" style={{ cursor: 'pointer' }}>
              <div
                onClick={toggleNewLaunch}
                className="relative rounded-full flex-shrink-0"
                style={{ width: '32px', height: '18px', background: form.isNewLaunch ? '#be9c77' : 'rgba(255,255,255,0.15)' }}
              >
                <div
                  className="absolute rounded-full transition-all"
                  style={{
                    width: '14px',
                    height: '14px',
                    top: '2px',
                    background: '#1b2134',
                    right: form.isNewLaunch ? '16px' : '2px',
                  }}
                />
              </div>
              <span className="text-[10.5px]" style={{ color: '#e8cfa8' }}>
                این محصول به‌تازگی رونمایی شده (برچسب تا ۷ روز نمایش داده می‌شود)
              </span>
            </label>

            <div className="mt-3 flex gap-2">
              <button
                onClick={closeForm}
                className="flex-1 rounded-full py-2.5 font-bold text-[11.5px]"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}
              >
                انصراف
              </button>
              <button
                onClick={saveProduct}
                disabled={!isValid}
                className="flex-[2] rounded-full py-2.5 font-bold text-xs"
                style={{
                  background: isValid ? '#be9c77' : '#6b6375',
                  color: '#1b2134',
                  border: 'none',
                  cursor: isValid ? 'pointer' : 'not-allowed',
                }}
              >
                ذخیره
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}