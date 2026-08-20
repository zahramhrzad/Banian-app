import { useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'

export type AdminRole = 'super' | 'operator'

export interface AdminAccount {
  username: string
  password: string
  role: AdminRole
  displayName: string
}

// دموی تست — بعداً با احراز هویت واقعی جایگزین می‌شه
export const defaultAdminAccounts: AdminAccount[] = [
  { username: 'admin', password: 'Banian@2026', role: 'super', displayName: 'مدیر کل' },
  { username: 'operator', password: 'Data@2026', role: 'operator', displayName: 'اپراتور دیتا' },
]

export default function AdminLogin({
  accounts,
  onSubmit,
  onBack,
}: {
  accounts: AdminAccount[]
  onSubmit: (username: string, role: AdminRole, displayName: string) => void
  onBack: () => void
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)

  const isValid = username.trim() !== '' && password.trim() !== ''

  const handleSubmit = () => {
    if (!isValid) return
    const account = accounts.find((a) => a.username.toLowerCase() === username.trim().toLowerCase())
    if (!account || account.password !== password) {
      setError(true)
      return
    }
    onSubmit(account.username, account.role, account.displayName)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{ backgroundColor: '#1b2134', fontFamily: 'var(--font-fa)' }}
    >
      <BackButton onClick={onBack} />
      <div
        className="absolute rounded-full"
        style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', background: '#be9c77', opacity: 0.08, filter: 'blur(80px)' }}
      ></div>

      <div className="z-10 text-center mb-5">
        <PageTitle>ورود مدیریت نمایشگاه</PageTitle>
        <div className="text-xs" style={{ color: '#9b9baf' }}>نام کاربری و رمز عبور خود را وارد کنید</div>
      </div>

      <div className="w-full max-w-sm z-10">
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            if (error) setError(false)
          }}
          placeholder="نام کاربری"
          dir="ltr"
          className="w-full bg-white rounded-xl py-3.5 px-4 mb-4 text-sm outline-none"
          style={{ color: '#1b2134' }}
        />

        <div
          className="bg-white rounded-xl flex items-center gap-2 px-4 mb-1"
          style={{ border: error ? '1.5px solid #d9534f' : '1.5px solid transparent' }}
        >
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
            placeholder="رمز عبور"
            dir="ltr"
            className="flex-1 py-3.5 px-1 text-sm outline-none border-none"
            style={{ color: '#1b2134' }}
          />
          <button type="button" onClick={() => setShowPassword((p) => !p)} style={{ color: '#9b9baf' }}>
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.5 21.5 0 0 1 5.06-6.06M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.5 21.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                <path d="M1 1l22 22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {error && (
          <div className="text-xs mb-4 px-1" style={{ color: '#d9534f' }}>
            نام کاربری یا رمز عبور نادرست است
          </div>
        )}
        {!error && <div className="mb-4" />}

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full py-3.5 rounded-xl font-bold text-sm"
          style={{
            background: !isValid ? '#6b6375' : '#be9c77',
            color: '#1b2134',
            border: 'none',
            cursor: !isValid ? 'not-allowed' : 'pointer',
          }}
        >
          ورود به پنل مدیریت
        </button>
      </div>
    </div>
  )
}