import { useState } from 'react';
import BackButton from './BackButton';

type BoothStatus = 'requested' | 'accepted' | 'done';

interface AppointmentItem {
  id: string;
  type: 'booth' | 'panel';
  title: string;
  sub: string;
  status: BoothStatus | 'saved';
  time?: string; // فقط برای panel، برای مرتب‌سازی زمانی
  noteBefore: string;
  noteAfter: string;
}

const boothStatusLabel: Record<BoothStatus, string> = {
  requested: 'درخواست‌شده',
  accepted: 'تایید‌شده',
  done: 'انجام‌شده',
};

const boothStatusColor: Record<BoothStatus, string> = {
  requested: '#be9c77',
  accepted: '#7d9a86',
  done: '#9b9baf',
};

const initialData: AppointmentItem[] = [
  {
    id: 'a1',
    type: 'booth',
    title: 'بانک آینده',
    sub: 'سالن B - غرفه ۱۲',
    status: 'requested',
    noteBefore: '',
    noteAfter: '',
  },
  {
    id: 'a2',
    type: 'panel',
    title: 'ارتباط صنعت با دانشگاه',
    sub: 'روز دوم - سالن ب',
    status: 'saved',
    time: '۱۰:۰۰',
    noteBefore: '',
    noteAfter: '',
  },
  {
    id: 'a3',
    type: 'panel',
    title: 'بازیافت رزین فنولیک',
    sub: 'روز دوم - سالن ب',
    status: 'saved',
    time: '۱۲:۰۰',
    noteBefore: '',
    noteAfter: '',
  },
];

interface MyAppointmentsProps {
  onBack: () => void;
  onOpenParticipants?: () => void;
  onOpenPanels?: () => void;
}

export default function MyAppointments({ onBack, onOpenParticipants, onOpenPanels }: MyAppointmentsProps) {
  const [items, setItems] = useState<AppointmentItem[]>(initialData);
  const [filter, setFilter] = useState<'all' | 'booth' | 'panel'>('all');
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const [draftBefore, setDraftBefore] = useState('');
  const [draftAfter, setDraftAfter] = useState('');

  const counts = {
    all: items.length,
    booth: items.filter((i) => i.type === 'booth').length,
    panel: items.filter((i) => i.type === 'panel').length,
  };

  let filtered = items.filter((i) => filter === 'all' || i.type === filter);

  // نشست‌ها (panel) بر اساس ساعت مرتب می‌شن؛ غرفه‌ها (booth) چون ساعت مشخص ندارن، همون ترتیب اولیه می‌مونن
  filtered = [...filtered].sort((a, b) => {
    if (a.type === 'panel' && b.type === 'panel') {
      return (a.time || '').localeCompare(b.time || '');
    }
    if (a.type === 'booth' && b.type === 'panel') return -1;
    if (a.type === 'panel' && b.type === 'booth') return 1;
    return 0;
  });

  const openNotes = (item: AppointmentItem) => {
    if (openNoteId === item.id) {
      setOpenNoteId(null);
      return;
    }
    setOpenNoteId(item.id);
    setDraftBefore(item.noteBefore);
    setDraftAfter(item.noteAfter);
  };

  const saveNote = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, noteBefore: draftBefore, noteAfter: draftAfter } : i))
    );
    // TODO فاز ۳: ذخیره‌ی واقعی توی جدول appointment_notes با phase مربوطه
    setOpenNoteId(null);
  };

  const cancelAppointment = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    // TODO فاز ۳: حذف/تغییر وضعیت واقعی رکورد appointments در Supabase
  };

  const statusLabel = (item: AppointmentItem) => {
    if (item.type === 'booth') return boothStatusLabel[item.status as BoothStatus];
    return 'ذخیره‌شده';
  };

  const statusColor = (item: AppointmentItem) => {
    if (item.type === 'booth') return boothStatusColor[item.status as BoothStatus];
    return '#9b9baf';
  };

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
          قرارهای من
        </div>

        {/* تب‌های نوع */}
        <div className="flex gap-1.5 mb-4">
          <button
            onClick={() => setFilter('all')}
            className="flex-1 rounded-full py-1.5 text-[11px] font-bold"
            style={{ background: filter === 'all' ? '#be9c77' : '#ffffff18', color: filter === 'all' ? '#1b2134' : '#e8cfa8' }}
          >
            همه ({counts.all})
          </button>
          <button
            onClick={() => setFilter('booth')}
            className="flex-1 rounded-full py-1.5 text-[11px] font-bold"
            style={{ background: filter === 'booth' ? '#be9c77' : '#ffffff18', color: filter === 'booth' ? '#1b2134' : '#e8cfa8' }}
          >
            غرفه‌ها ({counts.booth})
          </button>
          <button
            onClick={() => setFilter('panel')}
            className="flex-1 rounded-full py-1.5 text-[11px] font-bold"
            style={{ background: filter === 'panel' ? '#be9c77' : '#ffffff18', color: filter === 'panel' ? '#1b2134' : '#e8cfa8' }}
          >
            نشست‌ها ({counts.panel})
          </button>
        </div>

        {/* لیست یا حالت خالی */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl px-4 py-6 text-center">
            <div className="text-xs font-bold mb-1.5" style={{ color: '#1b2134' }}>
              هنوز قراری ثبت نکردی
            </div>
            <div className="text-[10.5px] mb-3.5" style={{ color: '#9b9baf' }}>
              با ذخیره‌ی شرکت‌ها یا نشست‌ها، اینجا نشون داده می‌شن
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={onOpenParticipants}
                className="rounded-lg px-3 py-1.5 text-[10px] font-bold"
                style={{ background: '#be9c77', color: '#1b2134' }}
              >
                مشارکت‌کنندگان
              </button>
              <button
                onClick={onOpenPanels}
                className="rounded-lg px-3 py-1.5 text-[10px] font-bold"
                style={{ background: '#f3e8dc', color: '#b3833f' }}
              >
                برنامه پنل‌ها
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((item) => {
              const hasAnyNote = item.noteBefore || item.noteAfter;
              const canCancel = item.type === 'booth' && item.status === 'requested';
              const isNoteOpen = openNoteId === item.id;

              return (
                <div key={item.id} className="bg-white rounded-2xl px-3.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: '34px', height: '34px', background: '#f3e8dc' }}>
                      {item.type === 'booth' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6">
                          <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="1.6">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M3 10h18" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold" style={{ color: '#1b2134' }}>{item.title}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: '#9b9baf' }}>
                        {item.type === 'panel' && item.time ? `ساعت ${item.time} - ` : ''}{item.sub}
                      </div>
                    </div>
                    <div className="text-[9.5px] font-bold" style={{ color: statusColor(item) }}>
                      {statusLabel(item)}
                    </div>
                  </div>

                  {hasAnyNote && !isNoteOpen && (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {item.noteBefore && (
                        <div className="rounded-lg px-2.5 py-1.5" style={{ background: '#f7f5f1' }}>
                          <span className="text-[9px] font-bold" style={{ color: '#b3833f' }}>قبل از دیدار: </span>
                          <span className="text-[10.5px]" style={{ color: '#5b5347' }}>{item.noteBefore}</span>
                        </div>
                      )}
                      {item.noteAfter && (
                        <div className="rounded-lg px-2.5 py-1.5" style={{ background: '#f7f5f1' }}>
                          <span className="text-[9px] font-bold" style={{ color: '#7d9a86' }}>بعد از دیدار: </span>
                          <span className="text-[10.5px]" style={{ color: '#5b5347' }}>{item.noteAfter}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: '1px solid #f0ede6' }}>
                    {canCancel ? (
                      <button
                        onClick={() => cancelAppointment(item.id)}
                        className="flex items-center gap-1 text-[10px]"
                        style={{ color: '#c76b5f' }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c76b5f" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                        لغو قرار
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      onClick={() => openNotes(item)}
                      className="flex items-center gap-1 text-[10px]"
                      style={{ color: '#b3833f' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b3833f" strokeWidth="1.8">
                        <path d="M9 3h9a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V7l4-4z" />
                        <path d="M9 3v4H5" />
                      </svg>
                      {hasAnyNote ? 'ویرایش یادداشت‌ها' : 'افزودن یادداشت'}
                    </button>
                  </div>

                  {isNoteOpen && (
                    <div className="mt-2 flex flex-col gap-1.5">
                      <div>
                        <div className="text-[9.5px] font-bold mb-1" style={{ color: '#b3833f' }}>قبل از دیدار</div>
                        <textarea
                          value={draftBefore}
                          onChange={(e) => setDraftBefore(e.target.value)}
                          placeholder="سوالی که می‌خوای بپرسی، هدف از دیدار..."
                          className="w-full text-[11px] rounded-lg p-2 outline-none resize-none"
                          style={{ border: '1px solid #e5e0d5', minHeight: '40px', fontFamily: 'inherit' }}
                        />
                      </div>
                      <div>
                        <div className="text-[9.5px] font-bold mb-1" style={{ color: '#7d9a86' }}>بعد از دیدار</div>
                        <textarea
                          value={draftAfter}
                          onChange={(e) => setDraftAfter(e.target.value)}
                          placeholder="خلاصه‌ی نتیجه، تصمیم بعدی..."
                          className="w-full text-[11px] rounded-lg p-2 outline-none resize-none"
                          style={{ border: '1px solid #e5e0d5', minHeight: '40px', fontFamily: 'inherit' }}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => saveNote(item.id)}
                          className="rounded-lg px-3 py-1 text-[10px] font-bold"
                          style={{ background: '#be9c77', color: '#1b2134' }}
                        >
                          ذخیره
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}