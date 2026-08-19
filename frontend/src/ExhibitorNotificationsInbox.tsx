import BackButton from './BackButton'
import PageTitle from './PageTitle'

export interface ExhibitorInboxNotif {
  id: string
  title: string
  body: string
  time: string
  read: boolean
}

function NotifCard({ notif, onRead }: { notif: ExhibitorInboxNotif; onRead: (id: string) => void }) {
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
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.8">
          <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
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

export default function ExhibitorNotificationsInbox({
  notifs,
  onMarkRead,
  onMarkAllRead,
  onBack,
}: {
  notifs: ExhibitorInboxNotif[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onBack: () => void
}) {
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
            onClick={onMarkAllRead}
            className="text-[10px]"
            style={{ color: '#9b9baf', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            همه خوانده شد
          </button>
        </div>
        <PageTitle>اعلانات من</PageTitle>

        {unread.length > 0 && (
          <div className="mb-4">
            <div className="text-[11px] font-bold mb-2" style={{ color: '#be9c77' }}>جدید</div>
            <div className="flex flex-col gap-2">
              {unread.map((n) => (
                <NotifCard key={n.id} notif={n} onRead={onMarkRead} />
              ))}
            </div>
          </div>
        )}

        {read.length > 0 && (
          <div>
            <div className="text-[11px] font-bold mb-2" style={{ color: '#9b9baf' }}>قبلی</div>
            <div className="flex flex-col gap-2">
              {read.map((n) => (
                <NotifCard key={n.id} notif={n} onRead={onMarkRead} />
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
