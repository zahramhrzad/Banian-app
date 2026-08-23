import BackButton from './BackButton'
import { categoryLabel, type Company } from './Participants'

export interface CompanyProfileData {
  bio: string
  products: string
  website: string
  phone: string
  achievements: string
}

const glowShadow = '0 0 6px 1px rgba(190,156,119,0.5), 0 0 16px 4px rgba(190,156,119,0.3)'

interface CompanyProfileProps {
  company: Company | undefined
  companyName: string
  profile: CompanyProfileData | undefined
  isSaved: boolean
  onToggleSave: () => void
  onRequestMeeting: () => void
  onBack: () => void
}

export default function CompanyProfile({
  company,
  companyName,
  profile,
  isSaved,
  onToggleSave,
  onRequestMeeting,
  onBack,
}: CompanyProfileProps) {
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
          پروفایل غرفه
        </div>

        <div className="bg-white rounded-2xl p-4 mb-3 text-center">
          <div
            className="rounded-xl flex items-center justify-center mx-auto mb-2"
            style={{ width: '48px', height: '48px', background: '#f3e8dc' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6">
              <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
            </svg>
          </div>
          <div className="text-sm font-bold" style={{ color: '#1b2134' }}>{companyName}</div>
          {company && (
            <div className="text-[9.5px] mt-1" style={{ color: '#9b9baf' }}>
              سالن {company.hall} · {categoryLabel[company.category] || company.category}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-3.5 mb-3">
          <div className="text-[10.5px] font-bold mb-1.5" style={{ color: '#1b2134' }}>درباره‌ی شرکت</div>
          <div className="text-[10.5px] leading-relaxed" style={{ color: '#6b6b72' }}>
            {profile?.bio || 'این غرفه هنوز توضیحاتی برای پروفایل خود اضافه نکرده است.'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 mb-3">
          <div className="text-[10.5px] font-bold mb-1.5" style={{ color: '#1b2134' }}>محصولات و خدمات</div>
          <div className="text-[10.5px] leading-relaxed" style={{ color: '#6b6b72' }}>
            {profile?.products || 'اطلاعاتی ثبت نشده است.'}
          </div>
        </div>

        {profile?.achievements && (
          <div className="bg-white rounded-2xl p-3.5 mb-3">
            <div className="text-[10.5px] font-bold mb-1.5" style={{ color: '#1b2134' }}>دستاوردها و افتخارات</div>
            <div className="text-[10.5px] leading-relaxed" style={{ color: '#6b6b72' }}>{profile.achievements}</div>
          </div>
        )}

        {(profile?.website || profile?.phone) && (
          <div className="bg-white rounded-2xl p-3.5 mb-4">
            <div className="text-[10.5px] font-bold mb-1.5" style={{ color: '#1b2134' }}>اطلاعات تماس</div>
            {profile?.website && (
              <div className="text-[10.5px] mb-1" style={{ color: '#6b6b72' }}>{profile.website}</div>
            )}
            {profile?.phone && (
              <div className="text-[10.5px]" style={{ color: '#6b6b72' }}>{profile.phone}</div>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-1">
          <button
            onClick={onRequestMeeting}
            className="flex-1 rounded-full py-3 font-bold text-[10.5px]"
            style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
          >
            درخواست ملاقات
          </button>
          <button
            onClick={onToggleSave}
            className="flex-1 rounded-full py-3 font-bold text-[10.5px] flex items-center justify-center gap-1.5"
            style={{
              background: isSaved ? 'rgba(190,156,119,0.25)' : 'rgba(255,255,255,0.08)',
              color: '#e8cfa8',
              border: isSaved ? '1.5px solid #be9c77' : '1.5px solid transparent',
              boxShadow: isSaved ? glowShadow : 'none',
              cursor: 'pointer',
            }}
          >
            {isSaved ? 'ذخیره‌شده' : 'ذخیره'}
          </button>
        </div>
      </div>
    </div>
  )
}
