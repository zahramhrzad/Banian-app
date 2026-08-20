import BackButton from './BackButton'
import PageTitle from './PageTitle'

export interface JobSeekerEntry {
  id: string
  name: string
  jobTitle: string
  experience: string
  education: string
  skills: string
  preferredCompanies: string
}

const mockJobSeekers: JobSeekerEntry[] = [
  {
    id: 'js1',
    name: 'آرش کریمی',
    jobTitle: 'کارشناس ارشد سرمایه‌گذاری',
    experience: '۸ سال سابقه در تحلیل بازار سرمایه',
    education: 'کارشناسی ارشد مدیریت مالی',
    skills: 'تحلیل بنیادی، مدیریت پورتفولیو',
    preferredCompanies: 'بانک آینده، کارگزاری آگاه',
  },
  {
    id: 'js2',
    name: 'سارا محمدی',
    jobTitle: 'تحلیل‌گر ریسک',
    experience: '۵ سال سابقه در حوزه‌ی بیمه',
    education: 'کارشناسی ارشد مالی',
    skills: 'مدیریت ریسک، بیمه‌گری',
    preferredCompanies: 'بیمه دانا، بیمه ایران',
  },
  {
    id: 'js3',
    name: 'محمد حسینی',
    jobTitle: 'توسعه‌دهنده فین‌تک',
    experience: '۴ سال سابقه در توسعه‌ی محصولات دیجیتال بانکی',
    education: 'کارشناسی مهندسی کامپیوتر',
    skills: 'React، Node.js، APIهای بانکی',
    preferredCompanies: 'فینوتک، شاپرک',
  },
  {
    id: 'js4',
    name: 'نگار رضایی',
    jobTitle: 'کارشناس روابط مشتریان',
    experience: '۶ سال سابقه در بانکداری خصوصی',
    education: 'کارشناسی مدیریت بازرگانی',
    skills: 'ارتباط با مشتری، فروش خدمات مالی',
    preferredCompanies: 'بانک ملت، بانک پاسارگاد',
  },
]

interface ExhibitorJobSeekersProps {
  hasAccess: boolean
  onActivateAccess: () => void
  liveEntry?: JobSeekerEntry | null
  onBack: () => void
}

export default function ExhibitorJobSeekers({
  hasAccess,
  onActivateAccess,
  liveEntry,
  onBack,
}: ExhibitorJobSeekersProps) {
  const entries = liveEntry ? [liveEntry, ...mockJobSeekers] : mockJobSeekers

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
        <PageTitle>کارجویان</PageTitle>

        {!hasAccess && (
          <div
            className="rounded-xl p-3 mb-4 text-center"
            style={{ background: 'rgba(190,156,119,0.1)', border: '1px solid rgba(190,156,119,0.3)' }}
          >
            <div className="text-[9.5px] mb-2.5 leading-relaxed" style={{ color: '#e8cfa8' }}>
              برای مشاهده‌ی رزومه‌ی کامل کارجویان (سابقه، تحصیلات، مهارت‌ها) اشتراک کارجویان را فعال کنید
            </div>
            <button
              onClick={onActivateAccess}
              className="rounded-full px-4 py-2 text-[9.5px] font-bold"
              style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
            >
              فعال‌سازی اشتراک (نسخه نمایشی)
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {entries.map((js) => (
            <div
              key={js.id}
              className="bg-white rounded-2xl p-3.5"
              style={!hasAccess ? { filter: 'blur(2.5px)', opacity: 0.6, pointerEvents: 'none', userSelect: 'none' } : undefined}
            >
              <div className="text-[11.5px] font-bold" style={{ color: '#1b2134' }}>{js.name}</div>
              <div className="text-[9.5px] mt-0.5" style={{ color: '#9b9baf' }}>
                {js.jobTitle} · {js.experience}
              </div>
              <div className="text-[9px] mt-1.5" style={{ color: '#6b6b72' }}>
                تحصیلات: {js.education}
              </div>
              <div className="text-[9px] mt-1" style={{ color: '#6b6b72' }}>
                مهارت‌ها: {js.skills}
              </div>
              <div className="text-[9px] mt-1" style={{ color: '#b3833f' }}>
                علاقه‌مند به همکاری با: {js.preferredCompanies}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-[8.5px] mt-3" style={{ color: '#9b9baf' }}>
          {entries.length} کارجو در این نمایشگاه ثبت‌نام کرده‌اند
        </div>
      </div>
    </div>
  )
}
