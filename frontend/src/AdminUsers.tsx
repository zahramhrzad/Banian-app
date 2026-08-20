import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'
import type { AdminAccount, AdminRole } from './AdminLogin'

const roleLabel: Record<AdminRole, string> = { super: 'مدیر کل', operator: 'اپراتور دیتا' }

const emptyForm = { username: '', password: '', displayName: '', role: 'operator' as AdminRole }

export default function AdminUsers({
  accounts,
  setAccounts,
  currentUsername,
  onLogActivity,
  onBack,
}: {
  accounts: AdminAccount[]
  setAccounts: React.Dispatch<React.SetStateAction<AdminAccount[]>>
  currentUsername: string
  onLogActivity: (text: string) => void
  onBack: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  const fieldClass = 'flex-1 border-none outline-none text-xs bg-transparent'
  const fieldBoxClass = 'flex items-center gap-2 bg-white rounded-xl px-3.5 py-3'

  const superCount = accounts.filter((a) => a.role === 'super').length

  const toggleRole = (username: string) => {
    const target = accounts.find((a) => a.username === username)
    if (!target) return
    if (target.role === 'super' && superCount <= 1) {
      alert('حداقل یک «مدیر کل» باید وجود داشته باشد. اول یک مدیر کل دیگر تعریف کنید.')
      return
    }
    const newRole: AdminRole = target.role === 'super' ? 'operator' : 'super'
    setAccounts((prev) =>
      prev.map((a) =>
        a.username === username
          ? { ...a, role: newRole, displayName: newRole === 'super' ? 'مدیر کل' : 'اپراتور دیتا' }
          : a
      )
    )
    onLogActivity(`نقش کاربر «${username}» را به «${roleLabel[newRole]}» تغییر داد`)
  }

  const removeAccount = (username: string) => {
    const target = accounts.find((a) => a.username === username)
    if (!target) return
    if (username === currentUsername) {
      alert('نمی‌توانید حساب کاربری خودتان را حذف کنید.')
      return
    }
    if (target.role === 'super' && superCount <= 1) {
      alert('حداقل یک «مدیر کل» باید وجود داشته باشد.')
      return
    }
    setAccounts((prev) => prev.filter((a) => a.username !== username))
    onLogActivity(`کاربر «${username}» را حذف کرد`)
  }

  const openNewForm = () => {
    setForm(emptyForm)
    setFormError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setFormError('')
  }

  const addAccount = () => {
    const username = form.username.trim()
    const displayName = form.displayName.trim()
    if (!username || !form.password.trim() || !displayName) {
      setFormError('همه‌ی فیلدها را پر کنید')
      return
    }
    if (accounts.some((a) => a.username.toLowerCase() === username.toLowerCase())) {
      setFormError('این نام کاربری قبلاً استفاده شده است')
      return
    }
    setAccounts((prev) => [...prev, { username, password: form.password.trim(), role: form.role, displayName }])
    onLogActivity(`ادمین جدید «${username}» (${roleLabel[form.role]}) را اضافه کرد`)
    setShowForm(false)
    setForm(emptyForm)
    setFormError('')
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
        <PageTitle>مدیریت کاربران</PageTitle>

        {!showForm && (
          <>
            <div className="flex flex-col gap-2.5 mb-4">
              {accounts.map((a) => (
                <div key={a.username} className="bg-white rounded-2xl p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10.5px] font-bold" style={{ color: '#1b2134' }}>
                        {a.displayName}
                        {a.username === currentUsername && (
                          <span className="text-[8px] mr-1.5" style={{ color: '#9b9baf' }}>(خودتان)</span>
                        )}
                      </div>
                      <div className="text-[8.5px] mt-0.5" dir="ltr" style={{ color: '#9b9baf', textAlign: 'right' }}>{a.username}</div>
                    </div>
                    <span
                      className="text-[7.5px] font-bold px-2 py-1 rounded-md flex-shrink-0"
                      style={{ background: a.role === 'super' ? 'rgba(190,156,119,0.18)' : 'rgba(125,154,134,0.15)', color: a.role === 'super' ? '#8a6d4d' : '#3f6b4d' }}
                    >
                      {roleLabel[a.role]}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-3 mt-2.5">
                    <button
                      onClick={() => toggleRole(a.username)}
                      className="text-[9px] underline"
                      style={{ color: '#be9c77', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      تغییر نقش
                    </button>
                    <button
                      onClick={() => removeAccount(a.username)}
                      className="text-[9px] underline"
                      style={{ color: '#c76b5f', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={openNewForm}
              className="w-full rounded-xl py-3 text-[11px] font-bold"
              style={{ border: '1.5px dashed rgba(190,156,119,0.5)', color: '#be9c77', background: 'transparent', cursor: 'pointer' }}
            >
              + افزودن ادمین جدید
            </button>
          </>
        )}

        {showForm && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[11px] font-bold mb-1" style={{ color: '#e8cfa8' }}>افزودن ادمین جدید</div>

            <div className={fieldBoxClass}>
              <input
                value={form.displayName}
                onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
                placeholder="نام نمایشی (مثلاً: اپراتور نمایشگاه)"
                className={fieldClass}
                style={{ color: '#1b2134' }}
              />
            </div>
            <div className={fieldBoxClass}>
              <input
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                placeholder="نام کاربری"
                dir="ltr"
                className={fieldClass}
                style={{ color: '#1b2134' }}
              />
            </div>
            <div className={fieldBoxClass}>
              <input
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="رمز عبور"
                dir="ltr"
                className={fieldClass}
                style={{ color: '#1b2134' }}
              />
            </div>
            <div className={fieldBoxClass}>
              <select
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as AdminRole }))}
                className={fieldClass}
                style={{ color: '#1b2134' }}
              >
                <option value="operator">نقش: اپراتور دیتا</option>
                <option value="super">نقش: مدیر کل</option>
              </select>
            </div>

            {formError && (
              <div className="text-[9.5px] px-3 py-2 rounded-lg" style={{ background: 'rgba(217,83,79,0.1)', color: '#d9534f', border: '1px solid rgba(217,83,79,0.3)' }}>
                {formError}
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <button onClick={closeForm} className="flex-1 rounded-full py-2.5 font-bold text-[11.5px]" style={{ background: 'rgba(255,255,255,0.1)', color: '#e8cfa8', border: 'none', cursor: 'pointer' }}>انصراف</button>
              <button onClick={addAccount} className="flex-[2] rounded-full py-2.5 font-bold text-xs" style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}>افزودن</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
