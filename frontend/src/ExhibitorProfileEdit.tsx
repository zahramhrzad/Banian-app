import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { categoryLabel, type Company } from './Participants'
import type { CompanyProfileData } from './CompanyProfile'

const fieldClass = 'bg-white rounded-xl px-3.5 py-3'
const inputClass = 'w-full border-none outline-none text-xs bg-transparent resize-none'

interface ExhibitorProfileEditProps {
  companyName: string
  company: Company | undefined
  profile: CompanyProfileData
  onSave: (patch: Partial<CompanyProfileData>) => void
  onBack: () => void
}

export default function ExhibitorProfileEdit({
  companyName,
  company,
  profile,
  onSave,
  onBack,
}: ExhibitorProfileEditProps) {
  const [draft, setDraft] = useState<CompanyProfileData>(profile)
  const [justSaved, setJustSaved] = useState(false)

  const update = (patch: Partial<CompanyProfileData>) => setDraft((prev) => ({ ...prev, ...patch }))

  const save = () => {
    onSave(draft)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 1800)
  }

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
        <PageTitle>ویرایش پروفایل غرفه</PageTitle>

        <div className="bg-white rounded-2xl p-3.5 mb-3 text-center">
          <div className="text-xs font-bold" style={{ color: '#1b2134' }}>{companyName}</div>
          {company && (
            <div className="text-[9.5px] mt-1" style={{ color: '#9b9baf' }}>
              سالن {company.hall} · {categoryLabel[company.category] || company.category}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 mb-3">
          <div>
            <div className="text-[9.5px] font-bold mb-1.5 px-0.5" style={{ color: '#e8cfa8' }}>درباره‌ی شرکت</div>
            <div className={fieldClass}>
              <textarea
                value={draft.bio}
                onChange={(e) => update({ bio: e.target.value })}
                placeholder="معرفی کوتاه شرکت، فعالیت‌ها و نقاط قوت را بنویسید"
                className={inputClass}
                style={{ color: '#1b2134', minHeight: '64px' }}
              />
            </div>
          </div>

          <div>
            <div className="text-[9.5px] font-bold mb-1.5 px-0.5" style={{ color: '#e8cfa8' }}>محصولات و خدمات کلیدی</div>
            <div className={fieldClass}>
              <textarea
                value={draft.products}
                onChange={(e) => update({ products: e.target.value })}
                placeholder="مثلاً: حساب دیجیتال، کارت اعتباری، وام آنلاین"
                className={inputClass}
                style={{ color: '#1b2134', minHeight: '48px' }}
              />
            </div>
          </div>

          <div className="flex gap-2.5">
            <div className={fieldClass + ' flex-1'}>
              <input
                value={draft.website}
                onChange={(e) => update({ website: e.target.value })}
                placeholder="وب‌سایت"
                className={inputClass}
                style={{ color: '#1b2134' }}
              />
            </div>
            <div className={fieldClass + ' flex-1'}>
              <input
                value={draft.phone}
                onChange={(e) => update({ phone: e.target.value })}
                placeholder="تلفن تماس"
                className={inputClass}
                style={{ color: '#1b2134' }}
              />
            </div>
          </div>

          <div>
            <div className="text-[9.5px] font-bold mb-1.5 px-0.5" style={{ color: '#e8cfa8' }}>دستاوردها و افتخارات</div>
            <div className={fieldClass}>
              <textarea
                value={draft.achievements}
                onChange={(e) => update({ achievements: e.target.value })}
                placeholder="مثلاً: برند برتر بانکداری دیجیتال ۱۴۰۴"
                className={inputClass}
                style={{ color: '#1b2134', minHeight: '44px' }}
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-lg px-3 py-2.5 mb-4 text-[9px] leading-relaxed"
          style={{ background: 'rgba(190,156,119,0.1)', border: '1px solid rgba(190,156,119,0.3)', color: '#e8cfa8' }}
        >
          این اطلاعات دقیقاً همانی است که بازدیدکنندگان در پروفایل غرفه‌ی شما می‌بینند
        </div>

        <button
          onClick={save}
          className="w-full rounded-full py-3 font-bold text-xs"
          style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
        >
          {justSaved ? 'ذخیره شد ✓' : 'ذخیره‌ی تغییرات'}
        </button>
      </div>
    </div>
  )
}
