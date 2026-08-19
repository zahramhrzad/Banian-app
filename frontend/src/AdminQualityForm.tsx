import BackButton from './BackButton'
import PageTitle from './PageTitle'
import { demoExhibitorCodes } from './ExhibitorLogin'

const toFa = (n: number) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

// لیست یکتای غرفه‌داران از روی کدهای دمو — در فاز اتصال Supabase از جدول companies خوانده می‌شود
const companyList = Array.from(new Set(Object.values(demoExhibitorCodes)))

export default function AdminQualityForm({
  qualityFormStatus,
  reportUrl,
  lastReminderLabel,
  onSendReminder,
  onSendReminderToAllIncomplete,
  onBack,
}: {
  qualityFormStatus: Record<string, boolean>
  reportUrl: string
  lastReminderLabel: Record<string, string>
  onSendReminder: (company: string) => void
  onSendReminderToAllIncomplete: () => void
  onBack: () => void
}) {
  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }
  const completedCount = companyList.filter((c) => qualityFormStatus[c]).length
  const incompleteCount = companyList.length - completedCount
  const progressPercent = companyList.length > 0 ? Math.round((completedCount / companyList.length) * 100) : 0

  // ناقص‌ها اول لیست بشن تا مدیر سریع‌تر ببینه کجا باید یادآوری بفرسته
  const sortedCompanies = [...companyList].sort(
    (a, b) => Number(!!qualityFormStatus[a]) - Number(!!qualityFormStatus[b])
  )

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

      <div className="relative z-10 mt-14">
        <PageTitle>گزارش کیفیت مشارکت</PageTitle>
        <div className="text-[10px] mb-4" style={{ color: '#9b9baf' }}>
          وضعیت تکمیل فرم کیفیت مشارکت توسط غرفه‌داران
        </div>

        <div className="rounded-2xl p-4 mb-4" style={cardStyle}>
          <div className="text-[9px] mb-3" style={{ color: '#9b9baf' }}>
            برای مشاهده‌ی پاسخ‌های تکمیلی و نمودارهای گزارش گوگل فرم (صفحه‌ی Responses)، وارد اکانت گوگل دارای دسترسی شوید و روی دکمه‌ی زیر بزنید
          </div>
          <a
            href={reportUrl}
            target="_blank"
            rel="noreferrer"
            className="block w-full rounded-xl py-3.5 text-center font-bold text-[10.5px]"
            style={{ background: '#be9c77', color: '#1b2134', textDecoration: 'none' }}
          >
            مشاهده گزارش گوگل فرم (تب جدید)
          </a>
        </div>

        <div className="rounded-2xl p-4 mb-4" style={cardStyle}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9.5px] font-bold" style={{ color: '#e8cfa8' }}>پیشرفت کلی</span>
            <span className="text-[9px]" style={{ color: '#9b9baf' }}>
              {toFa(completedCount)} از {toFa(companyList.length)} غرفه ({toFa(progressPercent)}٪)
            </span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: '6px', background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full" style={{ width: `${progressPercent}%`, background: '#be9c77' }}></div>
          </div>
        </div>

        <button
          onClick={onSendReminderToAllIncomplete}
          disabled={incompleteCount === 0}
          className="w-full rounded-xl py-3 mb-4 font-bold text-[10px]"
          style={{
            background: incompleteCount === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(190,156,119,0.15)',
            color: incompleteCount === 0 ? '#6f6e78' : '#e8cfa8',
            border: `1.5px solid ${incompleteCount === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(190,156,119,0.4)'}`,
            cursor: incompleteCount === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {incompleteCount === 0
            ? 'همه‌ی غرفه‌ها فرم را تکمیل کرده‌اند'
            : `ارسال یادآوری به همه‌ی ناقص‌ها (${toFa(incompleteCount)} غرفه)`}
        </button>

        <div className="text-[9.5px] font-bold mb-2.5" style={{ color: '#e8cfa8' }}>
          وضعیت تکمیل به تفکیک غرفه
        </div>

        <div className="flex flex-col gap-2">
          {sortedCompanies.map((company) => {
            const done = !!qualityFormStatus[company]
            const reminderLabel = lastReminderLabel[company]
            return (
              <div
                key={company}
                className="rounded-xl px-4 py-3"
                style={{ background: '#fff' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold" style={{ color: '#1b2134' }}>{company}</span>
                  <span
                    className="text-[8.5px] font-bold px-2.5 py-1 rounded-md flex-shrink-0"
                    style={{
                      background: done ? '#e3f0e0' : 'rgba(190,156,119,0.18)',
                      color: done ? '#3f6b4d' : '#8a6d4d',
                    }}
                  >
                    {done ? 'تکمیل‌شده' : 'تکمیل‌نشده'}
                  </span>
                </div>
                {!done && (
                  <div className="flex items-center justify-between gap-2 mt-2 pt-2" style={{ borderTop: '1px solid #f0ece4' }}>
                    <span className="text-[8.5px]" style={{ color: '#9b9baf' }}>
                      {reminderLabel ? `آخرین یادآوری: ${reminderLabel}` : 'هنوز یادآوری ارسال نشده'}
                    </span>
                    <button
                      onClick={() => onSendReminder(company)}
                      className="text-[8.5px] font-bold px-2.5 py-1 rounded-md flex-shrink-0"
                      style={{ background: 'rgba(190,156,119,0.15)', color: '#8a6d4d', border: '1px solid rgba(190,156,119,0.4)', cursor: 'pointer' }}
                    >
                      ارسال یادآوری
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
