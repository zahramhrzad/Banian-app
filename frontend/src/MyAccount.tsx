import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import type { RegistrationData, Gender } from './Registration'
import type { MeetingRequest } from './ExhibitorAppointments'

const glowShadow = '0 0 6px 1px rgba(190,156,119,0.4)'
const fieldClass = 'flex items-center gap-2 bg-white rounded-xl px-3.5 py-3'
const inputClass = 'flex-1 border-none outline-none text-xs bg-transparent'

const boothStatusLabel: Record<string, string> = {
  pending: 'درخواست‌شده',
  approved: 'تایید‌شده',
  declined: 'رد شده',
}

const boothStatusColor: Record<string, string> = {
  pending: '#be9c77',
  approved: '#7d9a86',
  declined: '#c76b5f',
}

interface MyAccountProps {
  name: string
  mobile: string
  data: RegistrationData
  onSave: (patch: Partial<RegistrationData>) => void
  meetingRequests: MeetingRequest[]
  savedCount: number
  ticketsCount: number
  onOpenMyAppointments: () => void
  onBack: () => void
  onLogout: () => void
}

export default function MyAccount({
  name,
  mobile,
  data,
  onSave,
  meetingRequests,
  savedCount,
  ticketsCount,
  onOpenMyAppointments,
  onBack,
  onLogout,
}: MyAccountProps) {
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState<RegistrationData>(data)

  const startEdit = () => {
    setDraft(data)
    setEditMode(true)
  }

  const update = (patch: Partial<RegistrationData>) => setDraft((prev) => ({ ...prev, ...patch }))

  const save = () => {
    onSave(draft)
    setEditMode(false)
  }

  const myAppointments = meetingRequests.filter((r) => r.visitorPhone === mobile)
  const initials = (name || 'بازدیدکننده').trim().slice(0, 2)

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden px-6 py-8"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={editMode ? () => setEditMode(false) : onBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="relative z-10 mt-6 flex-1 overflow-y-auto pb-4">
        <PageTitle>حساب من</PageTitle>

        <div
          className="rounded-full flex items-center justify-center mx-auto mb-2"
          style={{ width: '56px', height: '56px', background: '#be9c77' }}
        >
          <span className="text-sm font-bold" style={{ color: '#1b2134' }}>{initials}</span>
        </div>
        <div className="text-center text-xs font-bold mb-5" style={{ color: '#fff' }}>
          {name || 'بازدیدکننده'}
        </div>

        {!editMode && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(190,156,119,0.1)' }}>
                <div className="text-base font-extrabold" style={{ color: '#be9c77' }}>{savedCount}</div>
                <div className="text-[8px] mt-0.5" style={{ color: '#9b9baf' }}>ذخیره‌شده</div>
              </div>
              <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(190,156,119,0.1)' }}>
                <div className="text-base font-extrabold" style={{ color: '#be9c77' }}>{myAppointments.length}</div>
                <div className="text-[8px] mt-0.5" style={{ color: '#9b9baf' }}>قرار ملاقات</div>
              </div>
              <div className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(190,156,119,0.1)' }}>
                <div className="text-base font-extrabold" style={{ color: '#be9c77' }}>{ticketsCount}</div>
                <div className="text-[8px] mt-0.5" style={{ color: '#9b9baf' }}>بلیط</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold" style={{ color: '#be9c77' }}>خلاصه‌ی قرارهای من</span>
              <button
                onClick={onOpenMyAppointments}
                className="text-[9.5px]"
                style={{ color: '#9b9baf', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                مشاهده همه
              </button>
            </div>
            {myAppointments.length === 0 ? (
              <div className="bg-white rounded-xl px-3.5 py-3 mb-5 text-center">
                <div className="text-[10.5px]" style={{ color: '#9b9baf' }}>
                  هنوز درخواست ملاقاتی ثبت نکردی
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mb-5">
                {myAppointments.slice(0, 3).map((r) => (
                  <div key={r.id} className="bg-white rounded-xl px-3.5 py-2.5 flex items-center gap-2.5">
                    <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: '30px', height: '30px', background: '#f3e8dc' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6">
                        <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] font-bold" style={{ color: '#1b2134' }}>{r.boothCompany}</div>
                    </div>
                    <div className="text-[8.5px] font-bold" style={{ color: boothStatusColor[r.status] }}>
                      {boothStatusLabel[r.status]}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-[10px] font-bold mb-2" style={{ color: '#be9c77' }}>مشخصات پایه</div>
            <div className="bg-white rounded-2xl overflow-hidden mb-3">
              <ReadRow label="نام" value={data.fullName || '—'} />
              <ReadRow label="سن / جنسیت" value={`${data.age || '—'} / ${data.gender || '—'}`} />
              <ReadRow label="شغل" value={data.jobTitle || '—'} />
              <ReadRow label="شرکت" value={data.company || '—'} last={data.wantsJob !== true} />
              {data.wantsJob === true && (
                <ReadRow label="تمایل به فرصت شغلی" value="بله" last />
              )}
            </div>

            {data.wantsJob === true && (
              <>
                <div className="text-[10px] font-bold mb-2 flex items-center gap-1.5" style={{ color: '#be9c77' }}>
                  فرصت شغلی
                  <span className="text-[8px]" style={{ color: '#7d9a86' }}>(فقط برای شما نمایش داده می‌شود)</span>
                </div>
                <div className="bg-white rounded-2xl overflow-hidden mb-5">
                  <ReadRow label="سابقه‌ی کاری" value={data.experience || '—'} />
                  <ReadRow label="مدرک تحصیلی" value={data.education || '—'} />
                  <ReadRow label="دستاورد مهم" value={data.achievement || '—'} />
                  <ReadRow label="مهارت‌ها" value={data.skills || '—'} />
                  <ReadRow label="شرکت‌های موردعلاقه" value={data.preferredCompanies || '—'} last />
                </div>
              </>
            )}

            <button
              onClick={startEdit}
              className="w-full rounded-full py-3 font-bold text-xs mb-2.5"
              style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
            >
              ویرایش اطلاعات
            </button>
            <button
              onClick={onLogout}
              className="w-full rounded-full py-2.5 font-bold text-[11px]"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#e08b8b', border: 'none', cursor: 'pointer' }}
            >
              خروج از حساب
            </button>
          </>
        )}

        {editMode && (
          <>
            <div className="flex flex-col gap-2.5 mb-3">
              <div className={fieldClass}>
                <input
                  value={draft.fullName}
                  onChange={(e) => update({ fullName: e.target.value })}
                  placeholder="نام و نام خانوادگی"
                  className={inputClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
              <div className="flex gap-2.5">
                <div className={fieldClass + ' flex-1'}>
                  <input
                    value={draft.age}
                    onChange={(e) => update({ age: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="سن"
                    inputMode="numeric"
                    className={inputClass}
                    style={{ color: '#1b2134' }}
                  />
                </div>
                <div className={fieldClass + ' flex-1'}>
                  <select
                    value={draft.gender}
                    onChange={(e) => update({ gender: e.target.value as Gender })}
                    className={inputClass}
                    style={{ color: '#1b2134' }}
                  >
                    <option value="">جنسیت</option>
                    <option value="مرد">مرد</option>
                    <option value="زن">زن</option>
                  </select>
                </div>
              </div>
              <div className={fieldClass}>
                <input
                  value={draft.jobTitle}
                  onChange={(e) => update({ jobTitle: e.target.value })}
                  placeholder="شغل فعلی / پوزیشن"
                  className={inputClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
              <div className={fieldClass}>
                <input
                  value={draft.company}
                  onChange={(e) => update({ company: e.target.value })}
                  placeholder="نام شرکت"
                  className={inputClass}
                  style={{ color: '#1b2134' }}
                />
              </div>
            </div>

            <div className="text-[11.5px] font-semibold text-center mb-2 text-white">
              آیا تمایل به استخدام در حوزه‌ی مالی دارید؟
            </div>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => update({ wantsJob: true })}
                className="flex-1 rounded-xl py-2.5 text-xs font-bold"
                style={{
                  background: '#fff',
                  color: '#1b2134',
                  border: `1.5px solid ${draft.wantsJob === true ? '#be9c77' : 'transparent'}`,
                  boxShadow: draft.wantsJob === true ? glowShadow : 'none',
                  cursor: 'pointer',
                }}
              >
                بله، مایلم
              </button>
              <button
                onClick={() => update({ wantsJob: false })}
                className="flex-1 rounded-xl py-2.5 text-xs font-bold"
                style={{
                  background: '#fff',
                  color: '#1b2134',
                  border: `1.5px solid ${draft.wantsJob === false ? '#be9c77' : 'transparent'}`,
                  boxShadow: draft.wantsJob === false ? glowShadow : 'none',
                  cursor: 'pointer',
                }}
              >
                خیر
              </button>
            </div>

            {draft.wantsJob === true && (
              <div className="flex flex-col gap-2.5 mb-3">
                <div className={fieldClass} style={{ alignItems: 'flex-start' }}>
                  <textarea
                    value={draft.experience}
                    onChange={(e) => update({ experience: e.target.value })}
                    placeholder="سابقه‌ی کاری"
                    className={inputClass + ' resize-none'}
                    style={{ color: '#1b2134', minHeight: '40px' }}
                  />
                </div>
                <div className={fieldClass}>
                  <input
                    value={draft.education}
                    onChange={(e) => update({ education: e.target.value })}
                    placeholder="مدرک تحصیلی"
                    className={inputClass}
                    style={{ color: '#1b2134' }}
                  />
                </div>
                <div className={fieldClass}>
                  <input
                    value={draft.achievement}
                    onChange={(e) => update({ achievement: e.target.value })}
                    placeholder="دستاورد مهم"
                    className={inputClass}
                    style={{ color: '#1b2134' }}
                  />
                </div>
                <div className={fieldClass}>
                  <input
                    value={draft.skills}
                    onChange={(e) => update({ skills: e.target.value })}
                    placeholder="مهارت‌ها"
                    className={inputClass}
                    style={{ color: '#1b2134' }}
                  />
                </div>
                <div className={fieldClass} style={{ alignItems: 'flex-start' }}>
                  <textarea
                    value={draft.preferredCompanies}
                    onChange={(e) => update({ preferredCompanies: e.target.value })}
                    placeholder="مایل به همکاری با کدام شرکت‌ها یا سازمان‌ها هستید؟"
                    className={inputClass + ' resize-none'}
                    style={{ color: '#1b2134', minHeight: '40px' }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 rounded-full py-2.5 font-bold text-[11.5px]"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}
              >
                انصراف
              </button>
              <button
                onClick={save}
                className="flex-[2] rounded-full py-2.5 font-bold text-xs"
                style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
              >
                ذخیره‌ی تغییرات
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ReadRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex justify-between items-center px-3.5 py-2.5"
      style={{ borderBottom: last ? 'none' : '1px solid #f0ede6' }}
    >
      <span className="text-[10.5px]" style={{ color: '#9b9baf' }}>{label}</span>
      <span className="text-[11px] font-bold" style={{ color: '#1b2134' }}>{value}</span>
    </div>
  )
}
