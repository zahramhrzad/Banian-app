import { useState, type ReactNode } from 'react'
import BackButton from './BackButton'

// ============================================================
// مدل داده‌ی پاسخ‌های فرم کیفیت مشارکت (نسخه‌ی داخلی اپ)
// این فرم جایگزین گوگل‌فرم قبلی شده و کاملاً داخل اپ تکمیل و ذخیره می‌شود
// ============================================================

export interface QualityFormAnswers {
  companyName: string
  respondentRole: string
  strategicGoals: string[]
  strategicGoalsOtherText: string
  competitiveEdge: string
  competitiveEdgeDetail: string
  preArrangedMeetings: string
  knowledgeTransferPrograms: string[]
  trustBuildingActions: string[]
  contentFocus: string
  contractReadiness: string
  contractIncentives: string
  contractGoalType: string
  contractGoalExact: string
  contractGoalRange: string
  contractGoalQualityNote: string
  mediaPlan: string[]
  audienceInviteTools: string[]
  audienceInviteToolsOtherText: string
  socialMediaTeam: string
  postEventReportPlan: string[]
  hasTimeline: string
  roiMetrics: string[]
  followUpProcess: string
  scenario: string
  newMediaPlan: string
  biggestChallenge: string
  finalThoughts: string
  submittedAt: number
  updatedAt: number
}

export function emptyQualityFormAnswers(companyName: string): QualityFormAnswers {
  return {
    companyName,
    respondentRole: '',
    strategicGoals: [],
    strategicGoalsOtherText: '',
    competitiveEdge: '',
    competitiveEdgeDetail: '',
    preArrangedMeetings: '',
    knowledgeTransferPrograms: [],
    trustBuildingActions: [],
    contentFocus: '',
    contractReadiness: '',
    contractIncentives: '',
    contractGoalType: '',
    contractGoalExact: '',
    contractGoalRange: '',
    contractGoalQualityNote: '',
    mediaPlan: [],
    audienceInviteTools: [],
    audienceInviteToolsOtherText: '',
    socialMediaTeam: '',
    postEventReportPlan: [],
    hasTimeline: '',
    roiMetrics: [],
    followUpProcess: '',
    scenario: '',
    newMediaPlan: '',
    biggestChallenge: '',
    finalThoughts: '',
    submittedAt: 0,
    updatedAt: 0,
  }
}

type Option = { id: string; label: string }

const STRATEGIC_GOAL_OPTIONS: Option[] = [
  { id: 'new_service', label: 'معرفی سرویس/پلتفرم جدید در حوزه‌ی فینتک یا سرمایه‌گذاری' },
  { id: 'brand_position', label: 'ارتقای جایگاه برند در میان رقبا و بازار هدف' },
  { id: 'new_partner', label: 'جذب سرمایه‌گذار یا شریک تجاری جدید' },
  { id: 'bank_contract', label: 'انعقاد قرارداد همکاری با بانک‌ها/صندوق‌های سرمایه‌گذاری' },
  { id: 'knowledge_transfer', label: 'انتقال دانش و آموزش مخاطبان در مورد زیرساخت‌های دیجیتال' },
  { id: 'trust_renew', label: 'اعتمادسازی و تجدید روابط' },
  { id: 'other', label: 'سایر' },
]

const COMPETITIVE_EDGE_OPTIONS: Option[] = [
  { id: 'promoted', label: 'بله و مشخصاً روی آن تبلیغ می‌کنیم' },
  { id: 'unclear', label: 'تا حدودی اما شفاف نیست' },
  { id: 'none', label: 'مزیت مشخصی نسبت به رقبا نداریم' },
]

const PRE_ARRANGED_MEETINGS_OPTIONS: Option[] = [
  { id: 'many', label: 'بله، بیش از ۵ جلسه از پیش هماهنگ کردیم' },
  { id: 'some', label: 'بله، بین ۲ تا ۴ جلسه' },
  { id: 'none', label: 'هیچ جلسه‌ای از پیش‌هماهنگی ندارم و فقط در انتظار ملاقات‌های اتفاقی در غرفه خواهم بود' },
]

const KNOWLEDGE_TRANSFER_OPTIONS: Option[] = [
  { id: 'webinar', label: 'برگزاری وبینار/سمینار تخصصی در غرفه یا سالن کنفرانس' },
  { id: 'whitepaper', label: 'ارائه‌ی وایت‌پیپر، گزارش تحلیلی یا کیس‌استادی مکتوب' },
  { id: 'live_demo', label: 'ارائه‌ی دموی زنده از پلتفرم یا سیستم معاملاتی' },
  { id: 'consulting', label: 'مشاوره‌ی رایگان یک‌به‌یک با کارشناسان ارشد' },
  { id: 'none', label: 'هیچ برنامه‌ای برای انتقال دانش ندارم' },
]

const TRUST_BUILDING_OPTIONS: Option[] = [
  { id: 'credentials', label: 'نمایش نمادهای اعتباری (مجوزها، گواهی‌های امنیتی، همکاری با نهادهای رسمی)' },
  { id: 'references', label: 'ارائه‌ی معرفی‌نامه یا رضایت‌نامه از مشتریان قبلی یا شرکای معتبر' },
  { id: 'transparency', label: 'شفاف‌سازی کامل هزینه‌ها، ریسک‌ها و فرآیندها روی بروشور' },
  { id: 'exec_presence', label: 'حضور مدیران ارشد برای پاسخگویی شفاف' },
  { id: 'none', label: 'هیچ اقدام خاصی برای اعتمادسازی ندارم' },
]

const CONTENT_FOCUS_OPTIONS: Option[] = [
  { id: 'problem', label: 'بله، کاملاً مسئله‌محور طراحی شده (مثلاً: چگونه ریسک سرمایه‌گذاری را کاهش دهیم)' },
  { id: 'mixed', label: 'تا حدی، هم معرفی شرکت و هم حل مسئله' },
  { id: 'company', label: 'نه، بیشتر معرفی شرکت و خدمات است' },
]

const CONTRACT_READINESS_OPTIONS: Option[] = [
  { id: 'signed_ready', label: 'بله، قرارداد آماده‌ی امضا دارم' },
  { id: 'mou_ready', label: 'بله، تفاهم‌نامه‌ی غیرالزام‌آور آماده دارم' },
  { id: 'preliminary', label: 'خیر، فقط بحث مقدماتی می‌کنم و بعداً پیگیری می‌کنم' },
  { id: 'not_seeking', label: 'اصلاً به دنبال قرارداد فوری نیستم' },
]

const CONTRACT_INCENTIVES_OPTIONS: Option[] = [
  { id: 'discount', label: 'تخفیف ویژه برای امضا در دوره‌ی نمایشگاه' },
  { id: 'free_consulting', label: 'ارائه‌ی خدمات مشاوره‌ی رایگان به امضاکنندگان' },
  { id: 'platform_access', label: 'جایگاه ویژه در پلتفرم یا دسترسی زودهنگام به سرویس جدید' },
  { id: 'prizes', label: 'ارائه‌ی جوایز نقدی و غیرنقدی به مخاطبین' },
  { id: 'none', label: 'هیچ مشوقی ندارم' },
]

const CONTRACT_GOAL_TYPE_OPTIONS: Option[] = [
  { id: 'exact', label: 'عدد دقیقی برای تعداد قرارداد دارم' },
  { id: 'range', label: 'محدوده‌ی تقریبی دارم' },
  { id: 'quality', label: 'هدف کمی ندارم، تمرکز بر کیفیت است' },
]

const MEDIA_PLAN_OPTIONS: Option[] = [
  { id: 'journalists', label: 'دعوت از خبرنگاران تخصصی حوزه‌ی اقتصاد/فینتک به غرفه' },
  { id: 'press_kit', label: 'ارسال کیس‌استادی یا بیانیه‌ی مطبوعاتی به رسانه‌ها' },
  { id: 'video_content', label: 'تولید محتوای ویدئویی و تصویری برای انتشار در کانال‌های خبری' },
  { id: 'none', label: 'هیچ برنامه‌ی رسانه‌ای ندارم' },
]

const AUDIENCE_INVITE_OPTIONS: Option[] = [
  { id: 'post_card', label: 'ارسال کارت دعوت از طریق پست' },
  { id: 'digital_invite', label: 'ارسال دعوت‌نامه‌ی دیجیتالی' },
  { id: 'social_invite', label: 'انتشار دعوت‌نامه در شبکه‌های اجتماعی و کانال‌ها' },
  { id: 'media_info', label: 'اطلاع‌رسانی حضور و برنامه‌ها از طریق رسانه‌های عمومی و تخصصی' },
  { id: 'none', label: 'هیچ‌کدام' },
  { id: 'other', label: 'سایر' },
]

const SOCIAL_MEDIA_TEAM_OPTIONS: Option[] = [
  { id: 'dedicated', label: 'بله، تیم مجزا برای تولید محتوای زنده (لایو/استوری) دارم' },
  { id: 'basic', label: 'بله، اما فقط عکس و پست معمولی' },
  { id: 'none', label: 'خیر، تمرکز فقط روی تعاملات حضوری است' },
]

const POST_EVENT_REPORT_OPTIONS: Option[] = [
  { id: 'video_case_study', label: 'تولید کیس‌استادی ویدئویی از موفقیت‌های نمایشگاه' },
  { id: 'article', label: 'انتشار مقاله‌ی تحلیلی در رسانه‌ها یا وبلاگ شرکت' },
  { id: 'social_photos', label: 'فقط چند عکس در شبکه‌های اجتماعی می‌گذارم' },
  { id: 'none', label: 'هیچ برنامه‌ای ندارم' },
]

const HAS_TIMELINE_OPTIONS: Option[] = [
  { id: 'detailed', label: 'بله، تقویم دقیق با مسئول مشخص دارم' },
  { id: 'general', label: 'یک برنامه‌ی کلی دارم اما دقیق نیست' },
  { id: 'none', label: 'خیر، کارها را سلیقه‌ای انجام می‌دهم' },
]

const ROI_METRICS_OPTIONS: Option[] = [
  { id: 'contracts_value', label: 'تعداد قراردادهای امضا شده و ارزش ریالی آن' },
  { id: 'leads_converted', label: 'تعداد سرنخ‌های تبدیل‌شده به مشتری در ۳ ماه آینده' },
  { id: 'social_growth', label: 'میزان افزایش فالوور/تعاملات شبکه‌های اجتماعی' },
  { id: 'booth_visits', label: 'تعداد بازدید از غرفه و کیفیت مذاکرات' },
  { id: 'brand_trust', label: 'اندازه‌گیری افزایش اعتماد برند (نظرسنجی از مشتریان)' },
  { id: 'none', label: 'هیچ شاخصی ندارم' },
]

const FOLLOW_UP_OPTIONS: Option[] = [
  { id: 'fast48h', label: 'بله، طی ۴۸ ساعت اولیه، ایمیل شخصی‌سازی‌شده با محتوای ارزشمند (نه صرفاً تبلیغ)' },
  { id: 'week', label: 'بله، ظرف یک هفته' },
  { id: 'hot_only', label: 'فقط به موارد داغ پیگیری می‌کنم' },
  { id: 'none', label: 'هیچ فرآیندی ندارم' },
]

export const QUALITY_FORM_SECTION_TITLES = [
  'اطلاعات اولیه',
  'انتقال دانش و اعتمادسازی (محتوای تخصصی غرفه)',
  'برنامه‌ی انعقاد قراردادهای همکاری در زمان نمایشگاه',
  'پوشش رسانه‌ای و انعکاس فعالیت‌ها (برندینگ و اعتبارسازی)',
  'سنجش یکپارچگی زنجیره‌ی اقدامات (از قبل تا بعد)',
  'سوالات باز (تشخیص عمق برنامه‌ریزی)',
]

// متن سوالِ چهارمِ بخش «سوالات باز» در اسکرین‌شات‌های ارسالی ناقص بود؛
// این متن پیشنهادی جایگزین شده و به‌صورت اختیاری در فرم قرار گرفته — در صورت نیاز قابل ویرایش است
const FINAL_OPEN_QUESTION = 'اگر پیشنهاد یا نکته‌ی تکمیلی دیگری برای بهبود تجربه‌ی مشارکت خود در این نمایشگاه دارید، بنویسید'

function labelsOf(options: Option[], ids: string[]): string {
  if (ids.length === 0) return '—'
  return ids.map((id) => options.find((o) => o.id === id)?.label || id).join('، ')
}

// خلاصه‌ی قابل‌نمایش پاسخ‌ها برای پنل ادمین — منبع واحد سوالات و برچسب‌ها همین فایل است
export function buildAnswerSummary(a: QualityFormAnswers): { section: string; qas: { q: string; a: string }[] }[] {
  const strategicGoalsAnswer =
    labelsOf(STRATEGIC_GOAL_OPTIONS, a.strategicGoals) +
    (a.strategicGoals.includes('other') && a.strategicGoalsOtherText ? ` (سایر: ${a.strategicGoalsOtherText})` : '')

  const audienceInviteAnswer =
    labelsOf(AUDIENCE_INVITE_OPTIONS, a.audienceInviteTools) +
    (a.audienceInviteTools.includes('other') && a.audienceInviteToolsOtherText
      ? ` (سایر: ${a.audienceInviteToolsOtherText})`
      : '')

  let contractGoalAnswer = labelsOf(CONTRACT_GOAL_TYPE_OPTIONS, a.contractGoalType ? [a.contractGoalType] : [])
  if (a.contractGoalType === 'exact' && a.contractGoalExact) contractGoalAnswer += ` — عدد هدف: ${a.contractGoalExact}`
  if (a.contractGoalType === 'range' && a.contractGoalRange) contractGoalAnswer += ` — محدوده: ${a.contractGoalRange}`
  if (a.contractGoalType === 'quality' && a.contractGoalQualityNote) contractGoalAnswer += ` — توضیح: ${a.contractGoalQualityNote}`

  return [
    {
      section: QUALITY_FORM_SECTION_TITLES[0],
      qas: [
        { q: 'سمت پاسخ‌دهنده در سازمان', a: a.respondentRole || '—' },
        { q: 'هدف راهبردی از حضور در نمایشگاه (حداکثر ۲ گزینه)', a: strategicGoalsAnswer },
        {
          q: 'مزیت رقابتی ویژه نسبت به رقبا',
          a:
            labelsOf(COMPETITIVE_EDGE_OPTIONS, a.competitiveEdge ? [a.competitiveEdge] : []) +
            (a.competitiveEdgeDetail ? ` — توضیح: ${a.competitiveEdgeDetail}` : ''),
        },
        { q: 'برنامه‌ی جلسات تجاری از پیش‌هماهنگ‌شده', a: labelsOf(PRE_ARRANGED_MEETINGS_OPTIONS, a.preArrangedMeetings ? [a.preArrangedMeetings] : []) },
      ],
    },
    {
      section: QUALITY_FORM_SECTION_TITLES[1],
      qas: [
        { q: 'برنامه‌های انتقال دانش تخصصی به بازدیدکنندگان', a: labelsOf(KNOWLEDGE_TRANSFER_OPTIONS, a.knowledgeTransferPrograms) },
        { q: 'اقدامات اعتمادسازی در حوزه‌ی مالی و سرمایه‌گذاری', a: labelsOf(TRUST_BUILDING_OPTIONS, a.trustBuildingActions) },
        { q: 'تمرکز محتوای تولیدشده بر حل مسئله‌ی واقعی مخاطب', a: labelsOf(CONTENT_FOCUS_OPTIONS, a.contentFocus ? [a.contentFocus] : []) },
      ],
    },
    {
      section: QUALITY_FORM_SECTION_TITLES[2],
      qas: [
        { q: 'آمادگی قرارداد یا تفاهم‌نامه‌ی قابل امضا در نمایشگاه', a: labelsOf(CONTRACT_READINESS_OPTIONS, a.contractReadiness ? [a.contractReadiness] : []) },
        { q: 'ابزارها و مشوق‌های ترغیب به امضای قرارداد', a: labelsOf(CONTRACT_INCENTIVES_OPTIONS, a.contractIncentives ? [a.contractIncentives] : []) },
        { q: 'هدف کمی/کیفی تعداد قراردادهای همکاری', a: contractGoalAnswer },
      ],
    },
    {
      section: QUALITY_FORM_SECTION_TITLES[3],
      qas: [
        { q: 'برنامه‌ی پوشش خبری و رسانه‌ای فعالیت‌ها', a: labelsOf(MEDIA_PLAN_OPTIONS, a.mediaPlan) },
        { q: 'ابزارهای دعوت از دنبال‌کنندگان و مخاطبین', a: audienceInviteAnswer },
        { q: 'تیم محتوایی برای انعکاس لحظه‌ای در شبکه‌های اجتماعی', a: labelsOf(SOCIAL_MEDIA_TEAM_OPTIONS, a.socialMediaTeam ? [a.socialMediaTeam] : []) },
        { q: 'برنامه‌ی انتشار گزارش تصویری/تحلیلی پس از نمایشگاه', a: labelsOf(POST_EVENT_REPORT_OPTIONS, a.postEventReportPlan) },
      ],
    },
    {
      section: QUALITY_FORM_SECTION_TITLES[4],
      qas: [
        { q: 'وجود تقویم اجرایی (تایم‌لاین) از قبل تا بعد از نمایشگاه', a: labelsOf(HAS_TIMELINE_OPTIONS, a.hasTimeline ? [a.hasTimeline] : []) },
        { q: 'شاخص‌های سنجش بازگشت سرمایه‌ی نمایشگاه', a: labelsOf(ROI_METRICS_OPTIONS, a.roiMetrics) },
        { q: 'فرآیند پیگیری پس از نمایشگاه', a: labelsOf(FOLLOW_UP_OPTIONS, a.followUpProcess ? [a.followUpProcess] : []) },
      ],
    },
    {
      section: QUALITY_FORM_SECTION_TITLES[5],
      qas: [
        { q: 'سناریوی دستیابی به اهداف در نمایشگاه', a: a.scenario || '—' },
        { q: 'برنامه‌ی رسانه‌ای جدید نسبت به دوره‌های قبل', a: a.newMediaPlan || '—' },
        { q: 'بزرگ‌ترین چالش اعتمادسازی با سرمایه‌گذاران/شرکای بالقوه', a: a.biggestChallenge || '—' },
        { q: FINAL_OPEN_QUESTION, a: a.finalThoughts || '—' },
      ],
    },
  ]
}

// ============================================================
// اجزای بصری قابل‌استفاده‌ی مجدد
// ============================================================

function SectionHeader({ title, note }: { title: string; note?: string }) {
  return (
    <div className="rounded-2xl overflow-hidden mb-3">
      <div className="px-4 py-2.5" style={{ background: '#be9c77' }}>
        <span className="text-[11px] font-bold" style={{ color: '#1b2134' }}>{title}</span>
      </div>
      {note && (
        <div className="px-4 py-2.5 text-[9px] leading-relaxed" style={{ background: 'rgba(190,156,119,0.1)', color: '#c9c7d0' }}>
          {note}
        </div>
      )}
    </div>
  )
}

function QuestionCard({
  label,
  required = true,
  hint,
  children,
  showError,
}: {
  label: string
  required?: boolean
  hint?: string
  children: ReactNode
  showError?: boolean
}) {
  return (
    <div
      className="bg-white rounded-2xl p-3.5 mb-3"
      style={showError ? { border: '1.5px solid #d9534f' } : undefined}
    >
      <div className="text-[10.5px] font-bold mb-0.5 leading-relaxed" style={{ color: '#1b2134' }}>
        {label}
        {required && <span style={{ color: '#d9534f' }}> *</span>}
      </div>
      {hint && (
        <div className="text-[8.5px] mb-2" style={{ color: '#9b9baf' }}>
          {hint}
        </div>
      )}
      <div className="mt-2">{children}</div>
      {showError && (
        <div className="text-[8.5px] mt-1.5" style={{ color: '#d9534f' }}>
          تکمیل این سوال الزامی است
        </div>
      )}
    </div>
  )
}

function OptionRow({
  label,
  selected,
  onClick,
  shape,
}: {
  label: string
  selected: boolean
  onClick: () => void
  shape: 'circle' | 'square'
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between gap-2 px-3 py-2.5 mb-1.5 cursor-pointer transition-all"
      style={{
        background: selected ? 'rgba(190,156,119,0.14)' : '#f7f5f2',
        border: `1.5px solid ${selected ? '#be9c77' : 'transparent'}`,
        borderRadius: shape === 'circle' ? '12px' : '10px',
      }}
    >
      <span className="text-[10px] font-semibold flex-1 leading-relaxed" style={{ color: '#1b2134' }}>
        {label}
      </span>
      <span
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '18px',
          height: '18px',
          border: '2px solid #be9c77',
          background: selected ? '#be9c77' : 'transparent',
          borderRadius: shape === 'circle' ? '50%' : '5px',
        }}
      >
        {selected &&
          (shape === 'circle' ? (
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1b2134' }}></span>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1b2134" strokeWidth="3.2">
              <path d="M5 13l4 4L19 7" />
            </svg>
          ))}
      </span>
    </div>
  )
}

const textFieldClass = 'bg-white rounded-xl px-3.5 py-3'
const textInputClass = 'w-full border-none outline-none text-[10.5px] bg-transparent resize-none'

function OpenTextCard({
  label,
  required = true,
  hint,
  value,
  onChange,
  multiline = true,
  placeholder,
  showError,
}: {
  label: string
  required?: boolean
  hint?: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
  showError?: boolean
}) {
  return (
    <QuestionCard label={label} required={required} hint={hint} showError={showError}>
      <div className={textFieldClass} style={showError ? { border: '1.5px solid #d9534f' } : undefined}>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'پاسخ خود را بنویسید'}
            className={textInputClass}
            style={{ color: '#1b2134', minHeight: '64px' }}
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'پاسخ خود را بنویسید'}
            className={textInputClass}
            style={{ color: '#1b2134' }}
          />
        )}
      </div>
    </QuestionCard>
  )
}

// ============================================================
// کامپوننت اصلی
// ============================================================

type MultiField =
  | 'strategicGoals'
  | 'knowledgeTransferPrograms'
  | 'trustBuildingActions'
  | 'mediaPlan'
  | 'audienceInviteTools'
  | 'postEventReportPlan'
  | 'roiMetrics'

interface Props {
  companyName: string
  initialAnswers: QualityFormAnswers | null
  onSubmit: (answers: QualityFormAnswers) => void
  onBack: () => void
}

export default function ExhibitorQualityForm({ companyName, initialAnswers, onSubmit, onBack }: Props) {
  const [form, setForm] = useState<QualityFormAnswers>(initialAnswers || emptyQualityFormAnswers(companyName))
  const [section, setSection] = useState(0)
  const [attemptedNext, setAttemptedNext] = useState(false)
  const [justSubmitted, setJustSubmitted] = useState(false)

  const update = (patch: Partial<QualityFormAnswers>) => setForm((prev) => ({ ...prev, ...patch }))

  const toggleMulti = (field: MultiField, id: string, max?: number) => {
    setForm((prev) => {
      const current = prev[field]
      const has = current.includes(id)
      if (has) return { ...prev, [field]: current.filter((x) => x !== id) }
      if (max && current.length >= max) return prev
      return { ...prev, [field]: [...current, id] }
    })
  }

  const sectionValid = (idx: number): boolean => {
    if (idx === 0) {
      return (
        form.respondentRole.trim() !== '' &&
        form.strategicGoals.length > 0 &&
        form.competitiveEdge !== '' &&
        form.preArrangedMeetings !== ''
      )
    }
    if (idx === 1) {
      return form.knowledgeTransferPrograms.length > 0 && form.trustBuildingActions.length > 0 && form.contentFocus !== ''
    }
    if (idx === 2) {
      if (form.contractReadiness === '' || form.contractIncentives === '' || form.contractGoalType === '') return false
      if (form.contractGoalType === 'exact' && form.contractGoalExact.trim() === '') return false
      if (form.contractGoalType === 'range' && form.contractGoalRange.trim() === '') return false
      return true
    }
    if (idx === 3) {
      return (
        form.mediaPlan.length > 0 &&
        form.audienceInviteTools.length > 0 &&
        form.socialMediaTeam !== '' &&
        form.postEventReportPlan.length > 0
      )
    }
    if (idx === 4) {
      return form.hasTimeline !== '' && form.roiMetrics.length > 0 && form.followUpProcess !== ''
    }
    return form.scenario.trim() !== '' && form.newMediaPlan.trim() !== '' && form.biggestChallenge.trim() !== ''
  }

  const goNext = () => {
    if (!sectionValid(section)) {
      setAttemptedNext(true)
      return
    }
    setAttemptedNext(false)
    if (section < 5) {
      setSection(section + 1)
      window.scrollTo({ top: 0 })
    } else {
      const now = Date.now()
      onSubmit({ ...form, submittedAt: form.submittedAt || now, updatedAt: now })
      setJustSubmitted(true)
    }
  }

  const goBackStep = () => {
    if (section === 0) {
      onBack()
      return
    }
    setAttemptedNext(false)
    setSection(section - 1)
    window.scrollTo({ top: 0 })
  }

  const err = (ok: boolean) => attemptedNext && !ok

  if (justSubmitted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 py-8"
        style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
      >
        <div
          className="absolute rounded-full"
          style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
        ></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div
            className="rounded-full flex items-center justify-center mb-4"
            style={{ width: '64px', height: '64px', background: 'rgba(125,154,134,0.15)', border: '2px solid #7d9a86' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7d9a86" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-sm font-bold mb-2" style={{ color: '#fff' }}>پاسخ‌های شما با موفقیت ثبت شد</div>
          <div className="text-[10px] mb-6 leading-relaxed" style={{ color: '#9b9baf', maxWidth: '280px' }}>
            از تکمیل فرم کیفیت مشارکت سپاسگزاریم. می‌توانید هر زمان که خواستید پاسخ‌های خود را ویرایش کنید
          </div>
          <button
            onClick={onBack}
            className="rounded-full px-8 py-3 font-bold text-xs"
            style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
          >
            بازگشت به داشبورد
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden px-6 py-8"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={goBackStep} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="relative z-10 mt-14 flex-1 overflow-y-auto pb-4">
        <div className="text-sm font-bold mb-1 text-center" style={{ color: '#be9c77' }}>
          ارزیابی برنامه‌ریزی مشارکت
        </div>
        <div className="text-[9px] mb-4 text-center" style={{ color: '#9b9baf' }}>
          {companyName}
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-5">
          {QUALITY_FORM_SECTION_TITLES.map((_, i) => (
            <span
              key={i}
              className="rounded-full"
              style={{
                height: '5px',
                width: i === section ? '20px' : '5px',
                background: i <= section ? '#be9c77' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.2s',
              }}
            ></span>
          ))}
        </div>

        {section === 0 && (
          <>
            <SectionHeader
              title={`بخش ۱ از ۶ · ${QUALITY_FORM_SECTION_TITLES[0]}`}
              note="تکمیل این فرم توسط مدیرعامل و یا مسئول نمایشگاهی با اختیار تام توصیه می‌شود"
            />
            <QuestionCard label="سمت شما در سازمان چیست؟" showError={err(form.respondentRole.trim() !== '')}>
              <div className={textFieldClass} style={err(form.respondentRole.trim() !== '') ? { border: '1.5px solid #d9534f' } : undefined}>
                <input
                  value={form.respondentRole}
                  onChange={(e) => update({ respondentRole: e.target.value })}
                  placeholder="مثلاً: مدیرعامل، مسئول نمایشگاهی"
                  className={textInputClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
            </QuestionCard>

            <QuestionCard label="هدف راهبردی شما از حضور در این نمایشگاه چیست؟" hint="حداکثر ۲ گزینه" showError={err(form.strategicGoals.length > 0)}>
              {STRATEGIC_GOAL_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="square"
                  selected={form.strategicGoals.includes(o.id)}
                  onClick={() => toggleMulti('strategicGoals', o.id, 2)}
                />
              ))}
              {form.strategicGoals.includes('other') && (
                <div className={textFieldClass + ' mt-1.5'}>
                  <input
                    value={form.strategicGoalsOtherText}
                    onChange={(e) => update({ strategicGoalsOtherText: e.target.value })}
                    placeholder="توضیح گزینه‌ی سایر"
                    className={textInputClass}
                    style={{ color: '#1b2134' }}
                  />
                </div>
              )}
            </QuestionCard>

            <QuestionCard
              label="آیا برای تمایز خود از رقبا در این نمایشگاه، مزیت رقابتی ویژه‌ای را به نمایش می‌گذارید؟"
              hint="مثلاً: فناوری اختصاصی، امنیت بالاتر، کارمزد کمتر، پشتیبانی ۲۴/۷"
              showError={err(form.competitiveEdge !== '')}
            >
              {COMPETITIVE_EDGE_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="circle"
                  selected={form.competitiveEdge === o.id}
                  onClick={() => update({ competitiveEdge: o.id })}
                />
              ))}
            </QuestionCard>

            {form.competitiveEdge === 'promoted' && (
              <OpenTextCard
                label="در صورت داشتن مزیت رقابتی ویژه، لطفاً آن را ذکر کنید"
                required={false}
                value={form.competitiveEdgeDetail}
                onChange={(v) => update({ competitiveEdgeDetail: v })}
                multiline={false}
              />
            )}

            <QuestionCard
              label="آیا برنامه‌ای برای برگزاری جلسات تجاری هماهنگ‌شده از پیش با شرکت‌های بزرگ یا نهادهای سرمایه‌گذاری یا شرکای تجاری بالقوه در زمان نمایشگاه دارید؟"
              showError={err(form.preArrangedMeetings !== '')}
            >
              {PRE_ARRANGED_MEETINGS_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="circle"
                  selected={form.preArrangedMeetings === o.id}
                  onClick={() => update({ preArrangedMeetings: o.id })}
                />
              ))}
            </QuestionCard>
          </>
        )}

        {section === 1 && (
          <>
            <SectionHeader
              title={`بخش ۲ از ۶ · ${QUALITY_FORM_SECTION_TITLES[1]}`}
              note="مخاطبین این نمایشگاه عمدتاً تحصیلات مرتبط به صنایع مالی دارند لذا یکی از جذابیت‌های این نمایشگاه ارتقای سواد مالی خواهد بود"
            />
            <QuestionCard label="چه برنامه‌هایی برای انتقال دانش تخصصی به بازدیدکنندگان (مشتریان یا همکاران صنعت) دارید؟" showError={err(form.knowledgeTransferPrograms.length > 0)}>
              {KNOWLEDGE_TRANSFER_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="square"
                  selected={form.knowledgeTransferPrograms.includes(o.id)}
                  onClick={() => toggleMulti('knowledgeTransferPrograms', o.id)}
                />
              ))}
            </QuestionCard>

            <QuestionCard
              label="برای اعتمادسازی در حوزه‌ی مالی و سرمایه‌گذاری (که ذاتاً نیازمند اعتماد بالاست)، چه اقداماتی در غرفه انجام می‌دهید؟"
              showError={err(form.trustBuildingActions.length > 0)}
            >
              {TRUST_BUILDING_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="square"
                  selected={form.trustBuildingActions.includes(o.id)}
                  onClick={() => toggleMulti('trustBuildingActions', o.id)}
                />
              ))}
            </QuestionCard>

            <QuestionCard
              label="آیا محتوای تولیدشده برای نمایشگاه (بنر، ویدئو، کاتالوگ) بر حل مسئله‌ی واقعی مخاطب (نه صرفاً معرفی شرکت) متمرکز است؟"
              showError={err(form.contentFocus !== '')}
            >
              {CONTENT_FOCUS_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="circle"
                  selected={form.contentFocus === o.id}
                  onClick={() => update({ contentFocus: o.id })}
                />
              ))}
            </QuestionCard>
          </>
        )}

        {section === 2 && (
          <>
            <SectionHeader
              title={`بخش ۳ از ۶ · ${QUALITY_FORM_SECTION_TITLES[2]}`}
              note="با توجه به حضور گسترده‌ی رسانه‌های تخصصی در نمایشگاه، فرصت بسیار مناسبی برای خبرسازی از میزان مشارکت‌کنندگان قرار خواهد گرفت"
            />
            <QuestionCard
              label="آیا قرارداد استاندارد همکاری یا تفاهم‌نامه‌ی آماده دارید که در صورت توافق اولیه، در همان نمایشگاه قابل امضا باشد؟"
              showError={err(form.contractReadiness !== '')}
            >
              {CONTRACT_READINESS_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="circle"
                  selected={form.contractReadiness === o.id}
                  onClick={() => update({ contractReadiness: o.id })}
                />
              ))}
            </QuestionCard>

            <QuestionCard
              label="چه ابزارها و مشوق‌هایی برای ترغیب طرف مقابل به امضای قرارداد در زمان نمایشگاه در نظر گرفته‌اید؟"
              showError={err(form.contractIncentives !== '')}
            >
              {CONTRACT_INCENTIVES_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="circle"
                  selected={form.contractIncentives === o.id}
                  onClick={() => update({ contractIncentives: o.id })}
                />
              ))}
            </QuestionCard>

            <QuestionCard
              label="چند قرارداد همکاری (مالی، فنی یا سرمایه‌گذاری) را به‌عنوان هدف کمی برای امضا در این نمایشگاه تعیین کرده‌اید؟"
              showError={err(form.contractGoalType !== '')}
            >
              {CONTRACT_GOAL_TYPE_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="circle"
                  selected={form.contractGoalType === o.id}
                  onClick={() => update({ contractGoalType: o.id })}
                />
              ))}
            </QuestionCard>

            {form.contractGoalType === 'exact' && (
              <OpenTextCard
                label="عدد دقیق تعداد قرارداد مورد هدف را وارد کنید"
                value={form.contractGoalExact}
                onChange={(v) => update({ contractGoalExact: v })}
                multiline={false}
                placeholder="مثلاً: ۵"
                showError={err(form.contractGoalExact.trim() !== '')}
              />
            )}
            {form.contractGoalType === 'range' && (
              <OpenTextCard
                label="حداقل و حداکثر تعداد قرارداد خود را بنویسید"
                value={form.contractGoalRange}
                onChange={(v) => update({ contractGoalRange: v })}
                multiline={false}
                placeholder="مثلاً: بین ۲ تا ۵ قرارداد"
                showError={err(form.contractGoalRange.trim() !== '')}
              />
            )}
            {form.contractGoalType === 'quality' && (
              <OpenTextCard
                label="در صورت تمایل، هدف کیفی خود را توضیح دهید"
                required={false}
                value={form.contractGoalQualityNote}
                onChange={(v) => update({ contractGoalQualityNote: v })}
              />
            )}
          </>
        )}

        {section === 3 && (
          <>
            <SectionHeader
              title={`بخش ۴ از ۶ · ${QUALITY_FORM_SECTION_TITLES[3]}`}
              note="برای حضور موفق در نمایشگاه بهره‌گیری از فضای رسانه‌ای نمایشگاه موثر خواهد بود، اما اطلاع‌رسانی برنامه‌ها و دعوت از مخاطبین نمایشگاه هم الزامی است"
            />
            <QuestionCard label="چه برنامه‌ای برای پوشش خبری و رسانه‌ای فعالیت‌های خود در نمایشگاه دارید؟" showError={err(form.mediaPlan.length > 0)}>
              {MEDIA_PLAN_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="square"
                  selected={form.mediaPlan.includes(o.id)}
                  onClick={() => toggleMulti('mediaPlan', o.id)}
                />
              ))}
            </QuestionCard>

            <QuestionCard label="جهت دعوت از دنبال‌کنندگان و مخاطبین خود از چه ابزارهایی استفاده خواهید نمود؟" showError={err(form.audienceInviteTools.length > 0)}>
              {AUDIENCE_INVITE_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="square"
                  selected={form.audienceInviteTools.includes(o.id)}
                  onClick={() => toggleMulti('audienceInviteTools', o.id)}
                />
              ))}
              {form.audienceInviteTools.includes('other') && (
                <div className={textFieldClass + ' mt-1.5'}>
                  <input
                    value={form.audienceInviteToolsOtherText}
                    onChange={(e) => update({ audienceInviteToolsOtherText: e.target.value })}
                    placeholder="توضیح گزینه‌ی سایر"
                    className={textInputClass}
                    style={{ color: '#1b2134' }}
                  />
                </div>
              )}
            </QuestionCard>

            <QuestionCard
              label="آیا برای انعکاس لحظه‌ای فعالیت‌ها در شبکه‌های اجتماعی حرفه‌ای (اینستاگرام، لینکدین، ایکس/توییتر و ...) تیم محتوایی دارید؟"
              showError={err(form.socialMediaTeam !== '')}
            >
              {SOCIAL_MEDIA_TEAM_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="circle"
                  selected={form.socialMediaTeam === o.id}
                  onClick={() => update({ socialMediaTeam: o.id })}
                />
              ))}
            </QuestionCard>

            <QuestionCard
              label="پس از نمایشگاه، چه برنامه‌ای برای انتشار گزارش تصویری و تحلیلی از حضور خود (برای نشان دادن جایگاه بازار) دارید؟"
              showError={err(form.postEventReportPlan.length > 0)}
            >
              {POST_EVENT_REPORT_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="square"
                  selected={form.postEventReportPlan.includes(o.id)}
                  onClick={() => toggleMulti('postEventReportPlan', o.id)}
                />
              ))}
            </QuestionCard>
          </>
        )}

        {section === 4 && (
          <>
            <SectionHeader
              title={`بخش ۵ از ۶ · ${QUALITY_FORM_SECTION_TITLES[4]}`}
              note="جهت بهره‌گیری کامل از ابزارهای نمایشگاه، برنامه‌ریزی، تخصیص منابع و سنجش نتایج از اهمیت ویژه‌ای برخوردار می‌باشد"
            />
            <QuestionCard
              label="آیا یک تقویم اجرایی (تایم‌لاین) از ۲ ماه قبل تا ۱ ماه بعد از نمایشگاه تهیه کرده‌اید که در آن اهداف حضور مثل تعداد سرنخ‌های موردنظر، نحوه‌ی انتقال دانش، تعداد مذاکرات، نفوذ رسانه‌ای و پیگیری تفکیک‌شده باشد؟"
              showError={err(form.hasTimeline !== '')}
            >
              {HAS_TIMELINE_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="circle"
                  selected={form.hasTimeline === o.id}
                  onClick={() => update({ hasTimeline: o.id })}
                />
              ))}
            </QuestionCard>

            <QuestionCard
              label="برای سنجش بازگشت سرمایه‌ی این نمایشگاه، چه شاخص‌هایی را اندازه می‌گیرید؟"
              hint="می‌توانید چند گزینه انتخاب کنید"
              showError={err(form.roiMetrics.length > 0)}
            >
              {ROI_METRICS_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="square"
                  selected={form.roiMetrics.includes(o.id)}
                  onClick={() => toggleMulti('roiMetrics', o.id)}
                />
              ))}
            </QuestionCard>

            <QuestionCard
              label="آیا برای پیگیری پس از نمایشگاه (ارسال پیشنهادات، یادآوری جلسات و ارسال محتوای دانش‌محور) یک فرآیند مشخص دارید؟"
              showError={err(form.followUpProcess !== '')}
            >
              {FOLLOW_UP_OPTIONS.map((o) => (
                <OptionRow
                  key={o.id}
                  label={o.label}
                  shape="circle"
                  selected={form.followUpProcess === o.id}
                  onClick={() => update({ followUpProcess: o.id })}
                />
              ))}
            </QuestionCard>
          </>
        )}

        {section === 5 && (
          <>
            <SectionHeader title={`بخش ۶ از ۶ · ${QUALITY_FORM_SECTION_TITLES[5]}`} />
            <OpenTextCard
              label="لطفاً سناریوی خود را برای دستیابی به اهدافتان در این نمایشگاه به‌طور مختصر توضیح دهید"
              hint="مثال: موضوع سمینار ما «امنیت تراکنش‌های دیجیتال» است و در غرفه با شبیه‌ساز نشان می‌دهیم که چگونه کلاهبرداری را تشخیص می‌دهیم"
              value={form.scenario}
              onChange={(v) => update({ scenario: v })}
              showError={err(form.scenario.trim() !== '')}
            />
            <OpenTextCard
              label="چه برنامه‌ای برای پوشش رسانه‌ای در این دوره دارید که در دوره‌های قبل اجرا نکرده‌اید؟"
              value={form.newMediaPlan}
              onChange={(v) => update({ newMediaPlan: v })}
              showError={err(form.newMediaPlan.trim() !== '')}
            />
            <OpenTextCard
              label="بزرگ‌ترین چالش پیش‌روی شما برای اعتمادسازی در میان سرمایه‌گذاران یا شرکای بالقوه در این نمایشگاه چیست؟"
              value={form.biggestChallenge}
              onChange={(v) => update({ biggestChallenge: v })}
              showError={err(form.biggestChallenge.trim() !== '')}
            />
            <OpenTextCard
              label={FINAL_OPEN_QUESTION}
              required={false}
              value={form.finalThoughts}
              onChange={(v) => update({ finalThoughts: v })}
            />
          </>
        )}

        <div className="flex gap-2 mt-2">
          <button
            onClick={goBackStep}
            className="flex-1 rounded-full py-3 font-bold text-xs"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}
          >
            {section === 0 ? 'انصراف' : 'قبلی'}
          </button>
          <button
            onClick={goNext}
            className="flex-1 rounded-full py-3 font-bold text-xs"
            style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
          >
            {section === 5 ? 'ثبت نهایی' : 'بعدی'}
          </button>
        </div>
      </div>
    </div>
  )
}
