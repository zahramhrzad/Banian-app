import { useState } from 'react';
import BackButton from './BackButton';

interface Session {
  id: string;
  time: string;
  hall: string;
  topic: string;
  speaker: string;
}

interface DayData {
  label: string;
  date: string;
  sessions: Session[];
}

const PROGRAM: Record<number, DayData> = {
  1: {
    label: 'روز اول',
    date: '۱۲ آذر ۱۴۰۵',
    sessions: [
      { id: '1-1', time: '۹:۰۰ - ۹:۴۵', hall: 'سالن همایش', topic: 'اصول کنترل ریسک و همبستگی رشته‌ها با پرتره، کیفیت و سرامیک', speaker: 'دکتر علیرضا محمودی' },
      { id: '1-2', time: '۱۰:۰۰ - ۱۰:۴۵', hall: 'تالار وی‌آی‌پی', topic: 'رزین ونیل‌اسکار، چاپگر، رزین نبات‌سولاف و پوشش‌های چوب و فلز', speaker: 'مهندس فرزانه' },
    ],
  },
  2: {
    label: 'روز دوم',
    date: '۱۳ آذر ۱۴۰۵',
    sessions: [
      { id: '2-1', time: '۹:۰۰ - ۹:۴۵', hall: 'سالن همایش', topic: 'پوشش‌های اپوکسی پودری تابش‌پز', speaker: 'مهندس مرتضی ابراهیمی' },
      { id: '2-2', time: '۱۰:۰۰ - ۱۰:۴۵', hall: 'سالن ب', topic: 'ارتباط صنعت با دانشگاه', speaker: 'دکتر سعید رستگار' },
      { id: '2-3', time: '۱۱:۰۰ - ۱۱:۴۵', hall: 'تالار وی‌آی‌پی', topic: 'هزار خط تولید و صنایع دستی از رنگ', speaker: 'مهندس رها زنجیر' },
      { id: '2-4', time: '۱۲:۰۰ - ۱۲:۴۵', hall: 'سالن ب', topic: 'بازیافت رزین فنولیک', speaker: 'آقای مسعود توکلی' },
    ],
  },
  3: {
    label: 'روز سوم',
    date: '۱۴ آذر ۱۴۰۵',
    sessions: [
      { id: '3-1', time: '۹:۰۰ - ۹:۴۵', hall: 'سالن همایش', topic: 'هزینه‌های صادراتی خمیر مصالح با تاکید بر تعرفه‌ها', speaker: 'دکتر میثم حسین ابراهیمی' },
      { id: '3-2', time: '۱۰:۰۰ - ۱۰:۴۵', hall: 'سالن الف', topic: 'داده‌های نمونه پودری و مزیت‌ها در صنایع کوچک و متوسط', speaker: 'مهندس نویسا کریمی' },
      { id: '3-3', time: '۱۱:۰۰ - ۱۱:۴۵', hall: 'تالار وی‌آی‌پی', topic: 'نیاز صنعت به پوشش‌های آنی', speaker: 'مهندس هانا رفیعی' },
    ],
  },
  4: {
    label: 'روز چهارم',
    date: '۱۵ آذر ۱۴۰۵',
    sessions: [
      { id: '4-1', time: '۹:۰۰ - ۹:۴۵', hall: 'سالن همایش', topic: 'آرایه‌ی پوشش‌دهی کالای گالوانیزه (اکوکل کوتینگ)', speaker: 'مهندس فرزاد بیطالبی' },
      { id: '4-2', time: '۱۰:۰۰ - ۱۰:۴۵', hall: 'سالن ب', topic: 'توسعه‌ی رزین‌های پایه آبی برای پوشش‌های فولادی با نیاز خاص', speaker: 'دکتر سمیر عبدالعالی' },
      { id: '4-3', time: '۱۱:۰۰ - ۱۱:۴۵', hall: 'تالار وی‌آی‌پی', topic: 'قوانین جدید استاندارد مواد مصرفی و مصرف در صنعت', speaker: 'مهندس سیده کبریایی' },
    ],
  },
};

interface PanelsProps {
  onBack: () => void;
  onNavigateToMap?: (hallName: string) => void;
}

export default function Panels({ onBack, onNavigateToMap }: PanelsProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [search, setSearch] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // TODO فاز ۳: اینجا باید درخواست ذخیره به Supabase (جدول appointments یا یک جدول جدید saved_sessions) ارسال شود + نوتیف
      }
      return next;
    });
  };

  const dayData = PROGRAM[activeDay];

  const filteredSessions = dayData.sessions.filter((s) => {
    const matchesSearch =
      search.trim() === '' ||
      s.topic.includes(search.trim()) ||
      s.speaker.includes(search.trim());
    const matchesSaved = !showSavedOnly || savedIds.has(s.id);
    return matchesSearch && matchesSaved;
  });

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
          برنامه‌ی پنل‌ها
        </div>

        {/* تب‌های روز */}
        <div dir="rtl" className="flex gap-1.5 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {Object.entries(PROGRAM).map(([dayNum, data]) => {
            const isActive = Number(dayNum) === activeDay;
            return (
              <button
                key={dayNum}
                onClick={() => setActiveDay(Number(dayNum))}
                className="flex-shrink-0 rounded-xl px-3.5 py-2 text-[10px] font-bold whitespace-nowrap text-center"
                style={{
                  background: isActive ? '#be9c77' : '#ffffff18',
                  color: isActive ? '#1b2134' : '#e8cfa8',
                  minWidth: '78px',
                }}
              >
                {data.label}
                <div className="text-[9px] font-normal mt-0.5" style={{ opacity: 0.85 }}>{data.date}</div>
              </button>
            );
          })}
        </div>

        {/* جست‌وجو و فیلتر ذخیره‌شده‌ها */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 bg-white rounded-xl flex items-center gap-2 px-3 py-2.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جست‌وجوی نشست یا سخنران..."
              className="flex-1 text-xs outline-none border-none"
              style={{ color: '#1b2134' }}
            />
          </div>
          <button
            onClick={() => setShowSavedOnly((v) => !v)}
            className="flex-shrink-0 rounded-xl px-3 text-[9.5px] font-bold whitespace-nowrap"
            style={{
              background: showSavedOnly ? '#be9c77' : '#ffffff18',
              color: showSavedOnly ? '#1b2134' : '#e8cfa8',
            }}
          >
            فقط ذخیره‌شده‌ها
          </button>
        </div>

        {/* لیست نشست‌ها */}
        <div className="flex flex-col gap-2">
          {filteredSessions.length === 0 && (
            <div className="text-center py-8 text-xs" style={{ color: '#9b9baf' }}>
              نشستی پیدا نشد
            </div>
          )}
          {filteredSessions.map((session) => {
            const isSaved = savedIds.has(session.id);
            return (
              <div key={session.id} className="bg-white rounded-2xl px-3.5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-xs font-bold" style={{ color: '#1b2134' }}>{session.topic}</div>
                    <div className="text-[9.5px] mt-1" style={{ color: '#9b9baf' }}>سخنران: {session.speaker}</div>
                  </div>
                  <button
                    onClick={() => toggleSave(session.id)}
                    className="rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ width: '30px', height: '30px', background: isSaved ? '#be9c77' : '#f3e8dc' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? '#1b2134' : 'none'} stroke="#be9c77" strokeWidth="1.8">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-3 mt-2 pt-2 flex-wrap" style={{ borderTop: '1px solid #f0ede6' }}>
                  <span className="flex items-center gap-1 text-[9.5px]" style={{ color: '#9b9baf' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
                    </svg>
                    {session.time}
                  </span>
                  <span className="flex items-center gap-1 text-[9.5px]" style={{ color: '#9b9baf' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="2">
                      <path d="M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {session.hall}
                    <button
                      onClick={() => onNavigateToMap?.(session.hall)}
                      className="font-bold"
                      style={{ color: '#be9c77' }}
                    >
                      (مسیریابی)
                    </button>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}