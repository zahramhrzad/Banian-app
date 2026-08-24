import { useMemo, useState } from 'react'
import BackButton from './BackButton'
import PageTitle from './PageTitle'

const toFa = (n: number) => String(Math.round(n)).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
const toFaDate = (ts: number) =>
  new Date(ts).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }) +
  ' - ' +
  new Date(ts).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })

export interface FeaturePricing {
  key: string
  label: string
  cost: number
}

export interface WalletTransaction {
  id: string
  company: string
  type: 'charge' | 'spend'
  amount: number
  featureKey?: string
  note?: string
  createdAt: number
  createdBy?: string
}

export const defaultFeaturePricing: FeaturePricing[] = [
  { key: 'notification', label: 'ارسال اعلان', cost: 5 },
  { key: 'invite', label: 'ارسال دعوت‌نامه', cost: 3 },
  { key: 'promotion', label: 'انتشار پروموشن', cost: 10 },
  { key: 'jobseekers', label: 'دسترسی به کارجویان', cost: 15 },
  { key: 'highlight', label: 'برجسته‌سازی غرفه', cost: 20 },
]

type Tab = 'overview' | 'wallets' | 'ledger' | 'pricing'

const tabs: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'نمای‌کلی' },
  { key: 'wallets', label: 'کیف‌پول غرفه‌داران' },
  { key: 'ledger', label: 'گردش‌حساب' },
  { key: 'pricing', label: 'تعرفه قابلیت‌ها' },
]

export default function AdminFinancialHub({
  companyList,
  transactions,
  featurePricing,
  setFeaturePricing,
  onAddManualCharge,
  onBack,
}: {
  companyList: string[]
  transactions: WalletTransaction[]
  featurePricing: FeaturePricing[]
  setFeaturePricing: React.Dispatch<React.SetStateAction<FeaturePricing[]>>
  onAddManualCharge: (company: string, amount: number, note: string) => void
  onBack: () => void
}) {
  const [tab, setTab] = useState<Tab>('overview')
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'charge' | 'spend'>('all')
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null)
  const [chargeAmount, setChargeAmount] = useState<Record<string, string>>({})
  const [chargeNote, setChargeNote] = useState<Record<string, string>>({})
  const [pricingDraft, setPricingDraft] = useState<Record<string, string>>({})

  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }

  const featureLabel = (key?: string) => featurePricing.find((f) => f.key === key)?.label || key || '—'

  const walletByCompany = useMemo(() => {
    const map: Record<string, { charged: number; spent: number; balance: number; count: number }> = {}
    for (const c of companyList) map[c] = { charged: 0, spent: 0, balance: 0, count: 0 }
    for (const t of transactions) {
      if (!map[t.company]) map[t.company] = { charged: 0, spent: 0, balance: 0, count: 0 }
      map[t.company].count += 1
      if (t.type === 'charge') {
        map[t.company].charged += t.amount
        map[t.company].balance += t.amount
      } else {
        map[t.company].spent += t.amount
        map[t.company].balance -= t.amount
      }
    }
    return map
  }, [companyList, transactions])

  const totals = useMemo(() => {
    let charged = 0
    let spent = 0
    for (const c of Object.values(walletByCompany)) {
      charged += c.charged
      spent += c.spent
    }
    const activeWallets = Object.values(walletByCompany).filter((c) => c.count > 0).length
    return { charged, spent, balance: charged - spent, activeWallets }
  }, [walletByCompany])

  const spendByFeature = useMemo(() => {
    const map: Record<string, number> = {}
    for (const t of transactions) {
      if (t.type !== 'spend') continue
      const key = t.featureKey || 'other'
      map[key] = (map[key] || 0) + t.amount
    }
    return map
  }, [transactions])
  const maxFeatureSpend = Math.max(1, ...Object.values(spendByFeature))

  const topWallets = useMemo(
    () =>
      Object.entries(walletByCompany)
        .filter(([, w]) => w.count > 0)
        .sort((a, b) => b[1].balance - a[1].balance)
        .slice(0, 5),
    [walletByCompany]
  )

  const sortedCompanies = useMemo(
    () => [...companyList].sort((a, b) => (walletByCompany[b]?.balance || 0) - (walletByCompany[a]?.balance || 0)),
    [companyList, walletByCompany]
  )

  const filteredLedger = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => b.createdAt - a.createdAt)
    if (ledgerFilter === 'all') return sorted
    return sorted.filter((t) => t.type === ledgerFilter)
  }, [transactions, ledgerFilter])

  const submitCharge = (company: string) => {
    const amount = Number(chargeAmount[company])
    if (!amount || amount <= 0) return
    onAddManualCharge(company, amount, chargeNote[company] || '')
    setChargeAmount((prev) => ({ ...prev, [company]: '' }))
    setChargeNote((prev) => ({ ...prev, [company]: '' }))
  }

  const savePricing = (key: string) => {
    const val = Number(pricingDraft[key])
    if (!val || val <= 0) return
    setFeaturePricing((prev) => prev.map((f) => (f.key === key ? { ...f, cost: val } : f)))
    setPricingDraft((prev) => ({ ...prev, [key]: '' }))
  }

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
        <PageTitle>پیشخوان مالی</PageTitle>
        <div className="text-[10px] mb-4 text-center" style={{ color: '#9b9baf' }}>
          کیف‌پول اعتباری غرفه‌داران، گردش‌حساب و تعرفه قابلیت‌های پولی
        </div>

        <div
          className="rounded-xl px-3 py-2.5 mb-4"
          style={{ background: 'rgba(190,156,119,0.08)', border: '1px solid rgba(190,156,119,0.25)' }}
        >
          <div className="text-[8.5px] leading-relaxed" style={{ color: '#c9a876' }}>
            درگاه پرداخت واقعی هنوز وصل نشده. تا آن زمان، شارژ کیف‌پول از طریق دکمه‌ی «ثبت شارژ دستی» در تب کیف‌پول غرفه‌داران ثبت می‌شود (مثلاً برای پرداخت‌های حضوری/کارت‌به‌کارت). بعد از اتصال درگاه، این بخش به‌صورت خودکار پر می‌شود.
          </div>
        </div>

        <div className="flex gap-1.5 mb-4 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-shrink-0 text-[9px] font-bold px-3 py-2 rounded-full"
              style={{
                background: tab === t.key ? '#be9c77' : 'rgba(255,255,255,0.06)',
                color: tab === t.key ? '#1b2134' : '#c9c7d0',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl p-3" style={cardStyle}>
                <div className="text-[8px]" style={{ color: '#8b8a95' }}>مجموع شارژ کل</div>
                <div className="text-base font-extrabold" style={{ color: '#7d9a86' }}>{toFa(totals.charged)}</div>
              </div>
              <div className="rounded-xl p-3" style={cardStyle}>
                <div className="text-[8px]" style={{ color: '#8b8a95' }}>مجموع مصرف کل</div>
                <div className="text-base font-extrabold" style={{ color: '#c9a15e' }}>{toFa(totals.spent)}</div>
              </div>
            </div>
            <div className="rounded-xl p-3" style={cardStyle}>
              <div className="text-[8px]" style={{ color: '#8b8a95' }}>موجودی کل باقی‌مانده غرفه‌داران</div>
              <div className="text-lg font-extrabold" style={{ color: '#be9c77' }}>{toFa(totals.balance)} اعتبار</div>
            </div>
            <div className="rounded-xl p-3" style={cardStyle}>
              <div className="text-[8px]" style={{ color: '#8b8a95' }}>غرفه‌دارانی که کیف‌پول فعال دارند</div>
              <div className="text-base font-extrabold" style={{ color: '#fff' }}>
                {toFa(totals.activeWallets)} <span className="text-[9px] font-normal" style={{ color: '#6f6e78' }}>از {toFa(companyList.length)} غرفه</span>
              </div>
            </div>

            <div className="rounded-2xl p-4" style={cardStyle}>
              <div className="text-[9.5px] font-bold mb-2.5" style={{ color: '#e8cfa8' }}>مصرف اعتبار به تفکیک قابلیت</div>
              {Object.keys(spendByFeature).length === 0 ? (
                <div className="text-[8.5px]" style={{ color: '#6f6e78' }}>هنوز مصرفی ثبت نشده است</div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {featurePricing.map((f) => {
                    const value = spendByFeature[f.key] || 0
                    if (value === 0) return null
                    return (
                      <div key={f.key} className="flex items-center gap-2">
                        <span className="text-[7.5px] flex-shrink-0" style={{ color: '#c9c7d0', width: '78px' }}>{f.label}</span>
                        <div className="flex-1 rounded overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', height: '8px' }}>
                          <div style={{ width: `${(value / maxFeatureSpend) * 100}%`, height: '100%', background: '#be9c77' }}></div>
                        </div>
                        <span className="text-[8px] font-bold flex-shrink-0" style={{ color: '#fff', width: '26px', textAlign: 'left' }}>{toFa(value)}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl p-4" style={cardStyle}>
              <div className="text-[9.5px] font-bold mb-2.5" style={{ color: '#e8cfa8' }}>غرفه‌داران با بیشترین موجودی</div>
              {topWallets.length === 0 ? (
                <div className="text-[8.5px]" style={{ color: '#6f6e78' }}>هنوز هیچ کیف‌پولی شارژ نشده است</div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {topWallets.map(([company, w]) => (
                    <div key={company} className="flex items-center justify-between text-[8.5px]">
                      <span style={{ color: '#c9c7d0' }}>{company}</span>
                      <span className="font-bold" style={{ color: '#be9c77' }}>{toFa(w.balance)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'wallets' && (
          <div className="flex flex-col gap-2">
            {sortedCompanies.length === 0 && (
              <div className="text-[9px] text-center py-6" style={{ color: '#6f6e78' }}>هنوز غرفه‌داری ثبت نشده است</div>
            )}
            {sortedCompanies.map((company) => {
              const w = walletByCompany[company] || { charged: 0, spent: 0, balance: 0, count: 0 }
              const isExpanded = expandedCompany === company
              const companyTx = transactions
                .filter((t) => t.company === company)
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 6)
              return (
                <div key={company} className="rounded-xl overflow-hidden" style={{ background: '#fff' }}>
                  <div
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => setExpandedCompany(isExpanded ? null : company)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold" style={{ color: '#1b2134' }}>{company}</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className="text-[8.5px] font-bold px-2.5 py-1 rounded-md"
                          style={{
                            background: w.balance > 0 ? '#e3f0e0' : 'rgba(190,156,119,0.18)',
                            color: w.balance > 0 ? '#3f6b4d' : '#8a6d4d',
                          }}
                        >
                          {toFa(w.balance)} اعتبار
                        </span>
                        <svg
                          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9b9baf" strokeWidth="2.2"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[8px]" style={{ color: '#9b9baf' }}>
                      <span>مجموع شارژ: {toFa(w.charged)}</span>
                      <span>مجموع مصرف: {toFa(w.spent)}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-3.5" style={{ borderTop: '1px solid #f0ece4' }} onClick={(e) => e.stopPropagation()}>
                      <div className="mt-3">
                        <div className="text-[9px] font-bold mb-1.5" style={{ color: '#8a6d4d' }}>ثبت شارژ دستی</div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            placeholder="مبلغ (اعتبار)"
                            value={chargeAmount[company] || ''}
                            onChange={(e) => setChargeAmount((prev) => ({ ...prev, [company]: e.target.value }))}
                            className="rounded-lg px-2 py-1.5 text-[9px] outline-none flex-1"
                            style={{ background: '#f7f5f2', color: '#1b2134', border: '1px solid #eee6da' }}
                          />
                          <input
                            type="text"
                            placeholder="توضیح (اختیاری)"
                            value={chargeNote[company] || ''}
                            onChange={(e) => setChargeNote((prev) => ({ ...prev, [company]: e.target.value }))}
                            className="rounded-lg px-2 py-1.5 text-[9px] outline-none flex-1"
                            style={{ background: '#f7f5f2', color: '#1b2134', border: '1px solid #eee6da' }}
                          />
                          <button
                            onClick={() => submitCharge(company)}
                            className="text-[8.5px] font-bold px-3 py-1.5 rounded-lg flex-shrink-0"
                            style={{ background: '#be9c77', color: '#1b2134', border: 'none', cursor: 'pointer' }}
                          >
                            ثبت
                          </button>
                        </div>
                      </div>

                      {companyTx.length > 0 && (
                        <div className="mt-3">
                          <div className="text-[9px] font-bold mb-1.5" style={{ color: '#8a6d4d' }}>آخرین تراکنش‌ها</div>
                          <div className="flex flex-col gap-1.5">
                            {companyTx.map((t) => (
                              <div key={t.id} className="rounded-lg px-2.5 py-2 flex items-center justify-between" style={{ background: '#f7f5f2' }}>
                                <div>
                                  <div className="text-[8.5px] font-semibold" style={{ color: '#1b2134' }}>
                                    {t.type === 'charge' ? 'شارژ' : `مصرف — ${featureLabel(t.featureKey)}`}
                                  </div>
                                  <div className="text-[7.5px] mt-0.5" style={{ color: '#9b9baf' }}>{toFaDate(t.createdAt)}</div>
                                </div>
                                <span className="text-[9px] font-bold" style={{ color: t.type === 'charge' ? '#3f6b4d' : '#c76b5f' }}>
                                  {t.type === 'charge' ? '+' : '-'}{toFa(t.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {tab === 'ledger' && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-1.5">
              {[
                { key: 'all', label: 'همه' },
                { key: 'charge', label: 'شارژها' },
                { key: 'spend', label: 'مصرف‌ها' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setLedgerFilter(f.key as typeof ledgerFilter)}
                  className="text-[8.5px] font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: ledgerFilter === f.key ? '#be9c77' : 'rgba(255,255,255,0.06)',
                    color: ledgerFilter === f.key ? '#1b2134' : '#c9c7d0',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredLedger.length === 0 ? (
              <div className="text-[9px] text-center py-6" style={{ color: '#6f6e78' }}>تراکنشی برای نمایش وجود ندارد</div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredLedger.map((t) => (
                  <div key={t.id} className="rounded-xl px-3.5 py-3" style={{ background: '#fff' }}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9.5px] font-semibold" style={{ color: '#1b2134' }}>{t.company}</span>
                      <span className="text-[9.5px] font-bold" style={{ color: t.type === 'charge' ? '#3f6b4d' : '#c76b5f' }}>
                        {t.type === 'charge' ? '+' : '-'}{toFa(t.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-[8px]" style={{ color: '#9b9baf' }}>
                        {t.type === 'charge' ? (t.note || 'شارژ کیف‌پول') : `مصرف — ${featureLabel(t.featureKey)}`}
                      </span>
                      <span className="text-[7.5px] flex-shrink-0" style={{ color: '#b7b6c0' }}>{toFaDate(t.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'pricing' && (
          <div className="flex flex-col gap-2">
            <div className="text-[8.5px] mb-1" style={{ color: '#9b9baf' }}>
              هزینه‌ی اعتباری هر قابلیت پولی را اینجا تعیین کنید. تغییرات بلافاصله روی مصرف بعدی غرفه‌داران اعمال می‌شود.
            </div>
            {featurePricing.map((f) => (
              <div key={f.key} className="rounded-xl px-3.5 py-3 flex items-center justify-between gap-2" style={{ background: '#fff' }}>
                <span className="text-[9.5px] font-semibold" style={{ color: '#1b2134' }}>{f.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold" style={{ color: '#be9c77' }}>{toFa(f.cost)} اعتبار</span>
                  <input
                    type="number"
                    placeholder="جدید"
                    value={pricingDraft[f.key] || ''}
                    onChange={(e) => setPricingDraft((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="rounded-lg px-2 py-1.5 text-[9px] outline-none w-16 text-center"
                    style={{ background: '#f7f5f2', color: '#1b2134', border: '1px solid #eee6da' }}
                  />
                  <button
                    onClick={() => savePricing(f.key)}
                    className="text-[8.5px] font-bold px-2.5 py-1.5 rounded-lg flex-shrink-0"
                    style={{ background: 'rgba(190,156,119,0.15)', color: '#8a6d4d', border: '1px solid rgba(190,156,119,0.4)', cursor: 'pointer' }}
                  >
                    ذخیره
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
