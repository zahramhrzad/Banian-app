import BackButton from './BackButton'
import PageTitle from './PageTitle'

export type NotifType = 'approval' | 'reminder' | 'announce' | 'request'

export interface VisitorNotif {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  read: boolean
}

const typeColor: Record<NotifType, string> = {
  approval: '#7d9a86',
  reminder: '#be9c77',
  announce: '#a67c9c',
  request: '#8a95c9',
}

export const initialVisitorNotifs: VisitorNotif[] = [
  {
    id: 'n1',
    type: 'approval',
    title: 'درخواست شما تایید شد',
    body: 'غرفه‌ی «بانک آینده» درخواست دیدار شما را تایید کرد.',
    time: '۲ ساعت پیش',
    read: false,
  },
  {
    id: 'n2',
    type: 'reminder',
    title: 'یادآوری نشست',
    body: 'نشست «ارتباط صنعت با دانشگاه» تا ۳۰ دقیقه‌ی دیگر شروع می‌شود.',
    time: '۴۵ دقیقه پیش',
    read: false,
  },
  {
    id: 'n3',
    type: 'announce',
    title: 'اطلاعیه نمایشگاه',
    body: 'رستوران بزرگ نمایشگاه از ساعت ۱۲ پذیرای شماست.',
    time: 'دیروز',
    read: true,
  },
  {
    id: 'n4',
    type: 'approval',
    title: 'درخواست شما رد شد',
    body: 'غرفه‌ی «بیمه دانا» در حال حاضر ظرفیت پاسخ‌گویی ندارد.',
    time: 'دیروز',
    read: true,
  },
  {
    id: 'n5',
    type: 'announce',
    title: 'اطلاعیه نمایشگاه',
    body: 'پارکینگ جنوبی امروز از ساعت ۹ صبح باز است.',
    time: '۲ روز پیش',
    read: true,
  },
]

function NotifIcon({ type }: { type: NotifType }) {
  if (type === 'approval') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={typeColor[type]} strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    )
  }
  if (type === 'reminder') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={typeColor[type]} strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    )
  }
  if (type === 'request') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={typeColor[type]} strokeWidth="1.8">
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    )
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={typeColor[type]} strokeWidth="1.8">
      <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    </svg>
  )
}

function NotifCard({ notif, onRead }: { notif: VisitorNotif; onRead: (id: string) => void }) {
  return (
    <div
      onClick={() => onRead(notif.id)}
      className="bg-white rounded-2xl px-3.5 py-3 flex gap-2.5 items-start cursor-pointer"
      style={{ boxShadow: notif.read ? 'none' : '0 0 0 1.5px #be9c77' }}
    >
      <div
        className="rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ width: '32px', height: '32px', background: '#f3e8dc' }}
      >
        <NotifIcon type={notif.type} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between gap-2">
          <span className="text-xs font-bold" style={{ color: '#1b2134' }}>{notif.title}</span>
          {!notif.read && (
            <span
              className="rounded-full flex-shrink-0"
              style={{ width: '7px', height: '7px', background: '#be9c77', marginTop: '4px' }}
            />
          )}
        </div>
        <div className="text-[10.5px] mt-0.5 leading-relaxed" style={{ color: '#6b6375' }}>
          {notif.body}
        </div>
        <div className="text-[9px] mt-1" style={{ color: '#9b9baf' }}>{notif.time}</div>
      </div>
    </div>
  )
}

function Notifications({
  notifs,
  setNotifs,
  onBack,
}: {
  notifs: VisitorNotif[]
  setNotifs: React.Dispatch<React.SetStateAction<VisitorNotif[]>>
  onBack: () => void
}) {
  const markRead = (id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unread = notifs.filter((n) => !n.read)
  const read = notifs.filter((n) => n.read)

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
       <div className="flex justify-start mb-2">
          <button
            onClick={markAllRead}
            className="text-[10px]"
            style={{ color: '#9b9baf' }}
          >
            همه خوانده شد
          </button>
        </div>
        <PageTitle>اعلان‌ها</PageTitle>

        {unread.length > 0 && (
          <div className="mb-4">
            <div className="text-[11px] font-bold mb-2" style={{ color: '#be9c77' }}>جدید</div>
            <div className="flex flex-col gap-2">
              {unread.map((n) => (
                <NotifCard key={n.id} notif={n} onRead={markRead} />
              ))}
            </div>
          </div>
        )}

        {read.length > 0 && (
          <div>
            <div className="text-[11px] font-bold mb-2" style={{ color: '#9b9baf' }}>قبلی</div>
            <div className="flex flex-col gap-2">
              {read.map((n) => (
                <NotifCard key={n.id} notif={n} onRead={markRead} />
              ))}
            </div>
          </div>
        )}

        {notifs.length === 0 && (
          <div className="text-center py-10 text-xs" style={{ color: '#9b9baf' }}>
            اعلانی وجود ندارد
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications