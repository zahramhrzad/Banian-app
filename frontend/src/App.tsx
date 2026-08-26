import { useState, useEffect, useRef } from 'react'
import Splash from './Splash'
import UserTypeSelect from './UserTypeSelect'
import VisitPriority from './VisitPriority'
import VisitGoal from './VisitGoal'
import MobileLogin from './MobileLogin'
import ExhibitorLogin, { demoExhibitorCodes } from './ExhibitorLogin'
import ExhibitorProducts, { type Product, type CategoryId } from './ExhibitorProducts'
import ExhibitorPanels, { type PanelSession } from './ExhibitorPanels'
import ExhibitorAgreements, { type Agreement } from './ExhibitorAgreements'
import ExhibitorPromotions, { type ExhibitorPromotion, computeStatus as computePromotionStatus } from './ExhibitorPromotions'
import ExhibitorInvites, { type SentInvite } from './ExhibitorInvites'
import ExhibitorAppointments, { type MeetingRequest } from './ExhibitorAppointments'
import ExhibitorReport from './ExhibitorReport'
import ExhibitorScan, { type ScanLog } from './ExhibitorScan'
import ExhibitorBoothQr from './ExhibitorBoothQr'
import VisitorBoothScan from './VisitorBoothScan'
import AdminLogin, { type AdminRole, type AdminAccount, defaultAdminAccounts } from './AdminLogin'
import AdminDashboard, { type ActivityLogEntry } from './AdminDashboard'
import AdminRegistrants from './AdminRegistrants'
import AdminDataEntry from './AdminDataEntry'
import AdminPromotions from './AdminPromotions'
import AdminUsers from './AdminUsers'
import AdminPromotionRequests from './AdminPromotionRequests'
import AdminExhibitors, { type ExhibitorAccount } from './AdminExhibitors'
import AdminNotifications, { type AdminNotificationEntry } from './AdminNotifications'
import ExhibitorNotifications, { type ExhibitorNotificationEntry } from './ExhibitorNotifications'
import AdminScans from './AdminScans'
import AdminQualityForm from './AdminQualityForm'
import ExhibitorQualityForm, { type QualityFormAnswers } from './ExhibitorQualityForm'
import ExhibitorDashboard from './ExhibitorDashboard'
import ExhibitorNotificationsInbox, { type ExhibitorInboxNotif } from './ExhibitorNotificationsInbox'
import OtpVerify from './OtpVerify'
import Registration, { type RegistrationData } from './Registration'
import TicketPurchase, { type TicketPurchaseResult } from './TicketPurchase'
import PaymentGateway from './PaymentGateway'
import TicketsIssued from './TicketsIssued'
import MyTickets from './MyTickets'
import type { Ticket } from './TicketCard'
import VisitorDashboard from './VisitorDashboard'
import MapAccess from './MapAccess'
import HallMap from './HallMap'
import AdminHallPins from './AdminHallPins'
import { halls, initialBoothPinsByHall, type BoothPin } from './Hall'
import AccessInfo from './AccessInfo'
import Participants, { companiesDirectory, type Company } from './Participants'
import Panels, { findProgramSession, getSessionStartDate } from './Panels'
import MyAppointments from './MyAppointments'
import Notifications, { type VisitorNotif, initialVisitorNotifs } from './Notifications'
import Promotions from './Promotions'
import type { Promotion } from './Promotion'
import MyAccount from './MyAccount'
import CompanyProfile, { type CompanyProfileData } from './CompanyProfile'
import ExhibitorProfile from './ExhibitorProfile'
import ExhibitorJobSeekers, { type JobSeekerEntry } from './ExhibitorJobSeekers'
import AdminFinancialHub, { type FeaturePricing, type WalletTransaction, defaultFeaturePricing } from './AdminFinancialHub'

type Step =
  | 'splash'
  | 'select'
  | 'priority'
  | 'goal'
  | 'login'
  | 'otp'
  | 'registration'
  | 'ticketPurchase'
  | 'payment'
  | 'ticketsIssued'
  | 'myTickets'
  | 'dashboard'
  | 'exhibitorHome'
  | 'exhibitorQualityForm'
  | 'exhibitorProducts'
  | 'exhibitorPanels'
  | 'exhibitorAgreements'
  | 'exhibitorPromotions'
  | 'exhibitorInvites'
  | 'exhibitorAppointments'
  | 'exhibitorReport'
  | 'exhibitorScan'
  | 'exhibitorBoothQr'
  | 'exhibitorInbox'
  | 'visitorScan'
  | 'adminLogin'
  | 'adminDashboard'
  | 'adminRegistrants'
  | 'adminDataEntry'
  | 'adminPromotions'
  | 'adminPromotionRequests'
  | 'adminUsers'
  | 'adminExhibitors'
  | 'adminNotifications'
  | 'adminQualityForm'
  | 'exhibitorNotifications'
  | 'adminScans'
  | 'map'
  | 'hallMap'
  | 'adminHallPins'
  | 'access'
  | 'participants'
  | 'panels'
  | 'myAppointments'
  | 'notifications'
  | 'promotions'
  | 'myAccount'
  | 'companyProfile'
  | 'exhibitorProfileEdit'
  | 'exhibitorJobSeekers'
  | 'exhibitorNetworkScan'
  | 'adminFinancialHub'

let ticketIdCounter = 214

function generateTicketId() {
  ticketIdCounter += 1
  return `#BN-${String(ticketIdCounter).padStart(5, '0')}`
}

let notifIdCounter = 1000

function generateNotifId() {
  notifIdCounter += 1
  return `qf-${notifIdCounter}`
}

const emptyRegistrationData: RegistrationData = {
  fullName: '',
  age: '',
  gender: '',
  jobTitle: '',
  company: '',
  wantsJob: null,
  experience: '',
  education: '',
  achievement: '',
  skills: '',
  preferredCompanies: '',
}

const initialMeetingRequests: MeetingRequest[] = [
  {
    id: 'mr1',
    visitorName: 'سارا احمدی',
    visitorCategory: 'insurance',
    description: 'می‌خوام درباره‌ی همکاری در حوزه‌ی بیمه‌های دیجیتال صحبت کنیم',
    visitorPhone: '0912xxxxxxx',
    status: 'pending',
    agreementNotes: '',
    approvedByStaffName: '',
    approvedAt: null,
    boothCompany: 'بیمه دانا',
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'mr2',
    visitorName: 'علی رضایی',
    visitorCategory: 'capital',
    description: 'علاقه‌مند به فرصت‌های سرمایه‌گذاری مشترک هستم',
    visitorPhone: '0935xxxxxxx',
    status: 'pending',
    agreementNotes: '',
    approvedByStaffName: '',
    approvedAt: null,
    boothCompany: 'کارگزاری آگاه',
    createdAt: Date.now() - 3600000 * 3,
  },
]

function App() {
  const [step, setStep] = useState<Step>('splash')
  const [userType, setUserType] = useState<'visitor' | 'exhibitor'>('visitor')
  const [adminDisplayName, setAdminDisplayName] = useState('')
  const [adminUsername, setAdminUsername] = useState('')
  const [adminRole, setAdminRole] = useState<AdminRole>('operator')
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>(defaultAdminAccounts)
  const [adminActivityLog, setAdminActivityLog] = useState<ActivityLogEntry[]>([
    { admin: 'مدیر کل', action: 'پروموشن «تخفیف ویژه بانک آینده» را منتشر کرد', time: '۱۰ دقیقه پیش' },
    { admin: 'اپراتور دیتا', action: 'اطلاعات غرفه‌ی «کارگزاری آگاه» را ویرایش کرد', time: '۴۵ دقیقه پیش' },
    { admin: 'مدیر کل', action: 'اعلان هدفمند برای حوزه‌ی بیمه ارسال کرد', time: '۲ ساعت پیش' },
  ])
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [priorityCategories, setPriorityCategories] = useState<string[]>([])
  const [visitGoals, setVisitGoals] = useState<string[]>([])
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [newlyIssuedTickets, setNewlyIssuedTickets] = useState<Ticket[]>([])
  const [pendingTickets, setPendingTickets] = useState<TicketPurchaseResult[]>([])
  const [pendingPrice, setPendingPrice] = useState(0)
  const [savedPromotionIds, setSavedPromotionIds] = useState<Set<string>>(new Set())
  const [savedSessionIds, setSavedSessionIds] = useState<Set<string>>(new Set())
  const [exhibitorCode, setExhibitorCode] = useState('')
  const [exhibitorCompany, setExhibitorCompany] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [panels, setPanels] = useState<PanelSession[]>([])
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [exhibitorPromotions, setExhibitorPromotions] = useState<ExhibitorPromotion[]>([])
  const [inviteQuota, setInviteQuota] = useState(1000)
  const [sentInvites, setSentInvites] = useState<SentInvite[]>([])
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>(initialMeetingRequests)
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([])
  const [notificationCreditRate, setNotificationCreditRate] = useState(100)
  const [adminNotificationHistory, setAdminNotificationHistory] = useState<AdminNotificationEntry[]>([])
  const [exhibitorNotificationCredits, setExhibitorNotificationCredits] = useState(3)
  const [exhibitorNotificationHistory, setExhibitorNotificationHistory] = useState<ExhibitorNotificationEntry[]>([])
  const [visitorNotifications, setVisitorNotifications] = useState<VisitorNotif[]>(initialVisitorNotifs)
  const [qualityFormStatus, setQualityFormStatus] = useState<Record<string, boolean>>({})
  const [qualityFormAnswers, setQualityFormAnswers] = useState<Record<string, QualityFormAnswers>>({})
  const [exhibitorInboxNotifs, setExhibitorInboxNotifs] = useState<Record<string, ExhibitorInboxNotif[]>>({})
  const [lastReminderLabel, setLastReminderLabel] = useState<Record<string, string>>({})
  const [notificationPrefill, setNotificationPrefill] = useState('')
  const [companyProfiles, setCompanyProfiles] = useState<Record<string, CompanyProfileData>>({})
  const [savedCompanyNames, setSavedCompanyNames] = useState<Set<string>>(new Set(['بانک آینده']))
  const [boothPinsByHall, setBoothPinsByHall] = useState<Record<string, BoothPin[]>>(initialBoothPinsByHall)
  const [selectedHallId, setSelectedHallId] = useState('')
  const [highlightPinId, setHighlightPinId] = useState<string | undefined>(undefined)
  const [exhibitorJobSeekerAccess, setExhibitorJobSeekerAccess] = useState<Record<string, boolean>>({})
  const [viewingCompany, setViewingCompany] = useState('')
  const [featurePricing, setFeaturePricing] = useState<FeaturePricing[]>(defaultFeaturePricing)
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([])
  const [adminExhibitorAccounts, setAdminExhibitorAccounts] = useState<ExhibitorAccount[]>([])
  void visitGoals

  // لیست یکتای غرفه‌داران از روی کدهای دمو + غرفه‌دارانی که ادمین اضافه کرده
  const companyList = Array.from(
    new Set([...Object.values(demoExhibitorCodes), ...adminExhibitorAccounts.map((a) => a.companyName)])
  )

  const extraExhibitorCodes = Object.fromEntries(adminExhibitorAccounts.map((a) => [a.code, a.companyName]))

  const mergedCompanies: Company[] = [
    ...companiesDirectory,
    ...adminExhibitorAccounts
      .filter((a) => !companiesDirectory.some((c) => c.name === a.companyName))
      .map((a) => ({ id: a.code, name: a.companyName, hall: a.hall, category: a.category, popularity: 0 })),
  ]

  const emptyCompanyProfile: CompanyProfileData = { bio: '', products: '', website: '', phone: '', achievements: '' }

  const togglePromotionSave = (id: string) => {
    setSavedPromotionIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSaveSession = (id: string) => {
    setSavedSessionIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // پروموشن‌هایی که واقعاً باید به بازدیدکننده نشان داده شوند: فقط آن‌هایی که غرفه‌دار ثبت کرده،
  // مدیریت تایید کرده (requestStatus === 'approved') و همین الان طبق تاریخ شروع/پایان واقعی‌شان «فعال» هستند.
  // قبلاً این بخش هیچ‌وقت به exhibitorPromotions وصل نبود و همیشه فقط initialPromotions (۳ مورد ثابت نمایشی) را نشان می‌داد.
  const visitorPromotions: Promotion[] = exhibitorPromotions
    .filter((p) => p.requestStatus === 'approved' && computePromotionStatus(p) === 'active')
    .map((p) => ({
      id: p.id,
      company: p.companyName,
      title: p.title,
      desc: p.desc,
      category: p.category,
      backgroundImage: p.backgroundImage || undefined,
    }))

  const openCompanyProfile = (company: string) => {
    setViewingCompany(company)
    setStep('companyProfile')
  }

  const openHall = (hallId: string, pinId?: string) => {
    setSelectedHallId(hallId)
    setHighlightPinId(pinId)
    setStep('hallMap')
  }

  const openPromotionCompany = (company: string) => {
    openCompanyProfile(company)
  }

  const saveCompanyProfile = (company: string, patch: Partial<CompanyProfileData>) => {
    setCompanyProfiles((prev) => ({
      ...prev,
      [company]: { ...emptyCompanyProfile, ...prev[company], ...patch },
    }))
  }

  const toggleSavedCompany = (company: string) => {
    setSavedCompanyNames((prev) => {
      const next = new Set(prev)
      if (next.has(company)) next.delete(company)
      else next.add(company)
      return next
    })
  }

  const activateJobSeekerAccess = () => {
    setExhibitorJobSeekerAccess((prev) => ({ ...prev, [exhibitorCompany]: true }))
  }

  const saveRegistrationData = (patch: Partial<RegistrationData>) => {
    setRegistrationData((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  const handleVisitorLogout = () => {
    setName('')
    setMobile('')
    setRegistrationData(null)
    setPriorityCategories([])
    setStep('select')
  }

  const handleExhibitorLogout = () => {
    setName('')
    setMobile('')
    setExhibitorCode('')
    setExhibitorCompany('')
    setStep('login')
  }

  const logAdminActivity = (action: string) => {
    setAdminActivityLog((prev) => [{ admin: adminDisplayName || 'مدیر', action, time: 'همین الان' }, ...prev])
  }

  const addManualCharge = (company: string, amount: number, note: string) => {
    setWalletTransactions((prev) => [
      ...prev,
      {
        id: `wt-${Date.now()}`,
        company,
        type: 'charge',
        amount,
        note,
        createdAt: Date.now(),
        createdBy: adminDisplayName,
      },
    ])
  }

  const submitQualityForm = (company: string, answers: QualityFormAnswers) => {
    setQualityFormAnswers((prev) => ({ ...prev, [company]: answers }))
    setQualityFormStatus((prev) => ({ ...prev, [company]: true }))
    setStep('exhibitorHome')
  }

  const sendQualityFormReminder = (company: string) => {
    const newNotif: ExhibitorInboxNotif = {
      id: generateNotifId(),
      title: 'یادآوری از مدیریت',
      body: 'لطفاً هرچه سریع‌تر فرم کیفیت مشارکت را تکمیل کنید',
      time: 'همین الان',
      read: false,
    }
    setExhibitorInboxNotifs((prev) => ({
      ...prev,
      [company]: [newNotif, ...(prev[company] || [])],
    }))
    setLastReminderLabel((prev) => ({ ...prev, [company]: 'همین الان' }))
  }

  const sendQualityFormReminderToAllIncomplete = () => {
    const incompleteCompanies = companyList.filter((c) => !qualityFormStatus[c])
    incompleteCompanies.forEach((company) => sendQualityFormReminder(company))
  }

  const markExhibitorInboxRead = (id: string) => {
    setExhibitorInboxNotifs((prev) => ({
      ...prev,
      [exhibitorCompany]: (prev[exhibitorCompany] || []).map((n) => (n.id === id ? { ...n, read: true } : n)),
    }))
  }

  const markAllExhibitorInboxRead = () => {
    setExhibitorInboxNotifs((prev) => ({
      ...prev,
      [exhibitorCompany]: (prev[exhibitorCompany] || []).map((n) => ({ ...n, read: true })),
    }))
  }

  const openNotificationsForPanel = (message: string) => {
    setNotificationPrefill(message)
    setStep('exhibitorNotifications')
  }

  const createMeetingRequestFromScan = (boothCompany: string) => {
    const newRequest: MeetingRequest = {
      id: `mr-${Date.now()}`,
      visitorName: name,
      visitorCategory: (priorityCategories[0] as CategoryId) || '',
      description: 'درخواست ملاقات از طریق اسکن QR غرفه',
      visitorPhone: mobile,
      status: 'pending',
      agreementNotes: '',
      approvedByStaffName: '',
      approvedAt: null,
      boothCompany,
      createdAt: Date.now(),
    }
    setMeetingRequests((prev) => [...prev, newRequest])
    setVisitorNotifications((prev) => [
      {
        id: `vn-${Date.now()}`,
        type: 'request',
        title: 'درخواست ارسال شد',
        body: `درخواست ملاقات شما برای غرفه‌ی «${boothCompany}» ارسال شد، منتظر تایید باشید`,
        time: 'همین الان',
        read: false,
      },
      ...prev,
    ])
  }

  const createMeetingRequestFromExhibitorScan = (boothCompany: string) => {
    if (boothCompany === exhibitorCompany) return

    const newRequest: MeetingRequest = {
      id: `mr-${Date.now()}`,
      visitorName: name,
      visitorCategory: (priorityCategories[0] as CategoryId) || '',
      description: `درخواست ملاقات غرفه به غرفه از سوی «${exhibitorCompany}»`,
      visitorPhone: mobile,
      status: 'pending',
      agreementNotes: '',
      approvedByStaffName: '',
      approvedAt: null,
      boothCompany,
      createdAt: Date.now(),
      requesterType: 'exhibitor',
      requesterCompany: exhibitorCompany,
    }
    setMeetingRequests((prev) => [...prev, newRequest])

    const notifToTarget: ExhibitorInboxNotif = {
      id: generateNotifId(),
      title: 'درخواست ملاقات از غرفه‌ی دیگر',
      body: `غرفه‌ی «${exhibitorCompany}» درخواست ملاقات ثبت کرد — از «قرارهای من» بررسی کنید`,
      time: 'همین الان',
      read: false,
    }
    setExhibitorInboxNotifs((prev) => ({
      ...prev,
      [boothCompany]: [notifToTarget, ...(prev[boothCompany] || [])],
    }))
  }

  const cancelMeetingRequest = (id: string) => {
    setMeetingRequests((prev) => prev.filter((r) => r.id !== id))
  }

  const notifyVisitorOnDecision = (request: MeetingRequest, approved: boolean) => {
    setVisitorNotifications((prev) => [
      {
        id: `vn-${Date.now()}`,
        type: 'approval',
        title: approved ? 'درخواست شما تایید شد' : 'درخواست شما رد شد',
        body: approved
          ? `غرفه‌ی «${request.boothCompany}» درخواست دیدار شما را تایید کرد.`
          : `غرفه‌ی «${request.boothCompany}» درخواست دیدار شما را رد کرد.`,
        time: 'همین الان',
        read: false,
      },
      ...prev,
    ])
  }

  // ================== موتور واقعیِ زمان‌بندی و تحویل اعلان‌ها ==================
  // جایگزین حالت قبلی که در آن «ارسال فوری»، «زمان‌بندی‌شده» و «یادآوری نشست» فقط ظاهرشان اعلان بود ولی
  // هیچ‌چیز واقعاً به گیرنده نمی‌رسید. چون برنامه هنوز سرور واقعی ندارد (سرور/درگاه پرداخت طبق تصمیم قبلی
  // بعداً اضافه می‌شود)، این موتور کاملاً سمت کلاینت کار می‌کند: تا وقتی همین تب باز است، در لحظه‌ی واقعی
  // مقرر (بر اساس ساعت واقعی سیستم) پیام‌ها را به اینباکس گیرنده‌ی واقعی تحویل می‌دهد.
  const toFaDigits = (n: number) => String(Math.max(0, Math.round(n))).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

  const liveRef = useRef({
    companyList,
    mergedCompanies,
    savedSessionIds,
    exhibitorPromotions,
    adminNotificationHistory,
    exhibitorNotificationHistory,
  })
  useEffect(() => {
    liveRef.current = {
      companyList,
      mergedCompanies,
      savedSessionIds,
      exhibitorPromotions,
      adminNotificationHistory,
      exhibitorNotificationHistory,
    }
  })

  const deliverAdminNotification = (entry: AdminNotificationEntry) => {
    if (entry.recipientType === 'visitor') {
      setVisitorNotifications((prev) => [
        { id: `an-${entry.id}`, type: 'announce', title: 'اطلاعیه از مدیریت نمایشگاه', body: entry.message, time: 'همین الان', read: false },
        ...prev,
      ])
      return
    }
    const { companyList: liveCompanyList, mergedCompanies: liveMergedCompanies } = liveRef.current
    const targets = liveCompanyList.filter((company) => {
      if (entry.categoryIds.length === 0) return true
      const c = liveMergedCompanies.find((mc) => mc.name === company)
      return !!c && entry.categoryIds.includes(c.category as CategoryId)
    })
    setExhibitorInboxNotifs((prev) => {
      const next = { ...prev }
      targets.forEach((company) => {
        next[company] = [
          { id: `${generateNotifId()}-${entry.id}`, title: 'اطلاعیه از مدیریت نمایشگاه', body: entry.message, time: 'همین الان', read: false },
          ...(next[company] || []),
        ]
      })
      return next
    })
  }

  const deliverExhibitorNotification = (entry: ExhibitorNotificationEntry) => {
    setVisitorNotifications((prev) => [
      { id: `en-${entry.id}`, type: 'announce', title: 'اطلاعیه از یک غرفه', body: entry.message, time: 'همین الان', read: false },
      ...prev,
    ])
  }

  useEffect(() => {
    const isDue = (h: { status: string; scheduledAt: string; delivered?: boolean }, now: number) =>
      !h.delivered && (h.status === 'sent' || (h.status === 'scheduled' && !!h.scheduledAt && new Date(h.scheduledAt).getTime() <= now))

    const tick = () => {
      const now = Date.now()

      // نکته‌ی فنی مهم: تحویل واقعی (deliverAdminNotification/deliverExhibitorNotification) عمداً بیرون از
      // تابع setState فراخوانی می‌شود، نه داخل آن. چون React (به‌خصوص در StrictMode) ممکن است تابع updater
      // یک setState را برای تست خالص‌بودن، دوبار صدا بزند؛ اگر «تحویل واقعی» داخل همان updater بود، با هر
      // تیک، پیام دوبار به اینباکس گیرنده می‌رسید. برای همین ابتدا فهرست موارد سررسیده از روی liveRef (فقط
      // خواندن) محاسبه می‌شود، تحویل یک‌بار انجام می‌شود، و بعد setState فقط delivered/status را (به‌صورت
      // خالص و idempotent) به‌روز می‌کند.
      const dueAdmin = liveRef.current.adminNotificationHistory.filter((h) => isDue(h, now))
      if (dueAdmin.length > 0) {
        dueAdmin.forEach(deliverAdminNotification)
        const dueIds = new Set(dueAdmin.map((h) => h.id))
        setAdminNotificationHistory((prev) =>
          prev.map((h) => (dueIds.has(h.id) ? { ...h, delivered: true, status: 'sent' as const } : h))
        )
      }

      const dueExhibitor = liveRef.current.exhibitorNotificationHistory.filter((h) => isDue(h, now))
      if (dueExhibitor.length > 0) {
        dueExhibitor.forEach(deliverExhibitorNotification)
        const dueIds = new Set(dueExhibitor.map((h) => h.id))
        setExhibitorNotificationHistory((prev) =>
          prev.map((h) => (dueIds.has(h.id) ? { ...h, delivered: true, status: 'sent' as const } : h))
        )
      }

      // یادآوری واقعی نشست‌ها: هر نشستی که بازدیدکننده ذخیره کرده و تا ۳۰ دقیقه‌ی دیگر (یا تا ۱۰ دقیقه بعد از شروع) برگزار می‌شود
      liveRef.current.savedSessionIds.forEach((sessionId) => {
        const found = findProgramSession(sessionId)
        if (!found) return
        const start = getSessionStartDate(found.session, found.dayId)
        if (!start) return
        const diffMs = start.getTime() - now
        if (diffMs > 30 * 60 * 1000 || diffMs < -10 * 60 * 1000) return
        const notifId = `reminder-${sessionId}`
        setVisitorNotifications((prev) => {
          if (prev.some((n) => n.id === notifId)) return prev
          const body =
            diffMs > 0
              ? `نشست «${found.session.topic}» تا ${toFaDigits(diffMs / 60000)} دقیقه‌ی دیگر شروع می‌شود.`
              : `نشست «${found.session.topic}» همین حالا شروع شده است.`
          return [{ id: notifId, type: 'reminder', title: 'یادآوری نشست', body, time: 'همین الان', read: false }, ...prev]
        })
      })

      // پروموشن‌هایی که همین الان «فعال» شده‌اند (چه از قبل زمان‌بندی شده باشند، چه بلافاصله بعد از تایید مدیر)
      liveRef.current.exhibitorPromotions.forEach((p) => {
        if (p.requestStatus !== 'approved') return
        if (computePromotionStatus(p) !== 'active') return
        const notifId = `promo-live-${p.id}`
        setVisitorNotifications((prev) => {
          if (prev.some((n) => n.id === notifId)) return prev
          return [
            {
              id: notifId,
              type: 'announce',
              title: 'پروموشن جدید فعال شد',
              body: p.desc
                ? `پروموشن «${p.title}» از غرفه‌ی «${p.companyName}» فعال شد: ${p.desc}`
                : `پروموشن «${p.title}» از غرفه‌ی «${p.companyName}» فعال شد.`,
              time: 'همین الان',
              read: false,
            },
            ...prev,
          ]
        })
      })
    }

    tick()
    const interval = setInterval(tick, 4000)
    return () => clearInterval(interval)
  }, [])

  if (step === 'splash') return <Splash onNext={() => setStep('select')} />

  if (step === 'select') {
    return (
      <UserTypeSelect
        onSelect={(type) => {
          setUserType(type)
          setStep('priority')
        }}
        onAdminClick={() => setStep('adminLogin')}
        onBack={() => setStep('splash')}
      />
    )
  }

  if (step === 'adminLogin') {
    return (
      <AdminLogin
        accounts={adminAccounts}
        onSubmit={(username, role, displayName) => {
          setAdminUsername(username)
          setAdminRole(role)
          setAdminDisplayName(displayName)
          setStep('adminDashboard')
        }}
        onBack={() => setStep('select')}
      />
    )
  }

  if (step === 'adminDashboard') {
    return (
      <AdminDashboard
        displayName={adminDisplayName}
        role={adminRole}
        activityLog={adminActivityLog}
        notificationCreditRate={notificationCreditRate}
        setNotificationCreditRate={setNotificationCreditRate}
        incompleteQualityFormCount={companyList.filter((c) => !qualityFormStatus[c]).length}
        pendingPromotionRequestsCount={exhibitorPromotions.filter((p) => p.requestStatus === 'pending').length}
        onOpenRegistrants={() => setStep('adminRegistrants')}
        onOpenDataEntry={() => setStep('adminDataEntry')}
        onOpenPromotions={() => setStep('adminPromotions')}
        onOpenPromotionRequests={() => setStep('adminPromotionRequests')}
        onOpenNotifications={() => setStep('adminNotifications')}
        onOpenScans={() => setStep('adminScans')}
        onOpenQualityForm={() => setStep('adminQualityForm')}
        onOpenFinancialHub={() => setStep('adminFinancialHub')}
        onOpenUsers={() => setStep('adminUsers')}
        onOpenExhibitors={() => setStep('adminExhibitors')}
        onOpenMapPins={() => setStep('adminHallPins')}
        onLogout={() => {
          setAdminDisplayName('')
          setAdminUsername('')
          setStep('select')
        }}
      />
    )
  }

  if (step === 'adminFinancialHub') {
    return (
      <AdminFinancialHub
        companyList={companyList}
        transactions={walletTransactions}
        featurePricing={featurePricing}
        setFeaturePricing={setFeaturePricing}
        onAddManualCharge={addManualCharge}
        onBack={() => setStep('adminDashboard')}
      />
    )
  }

  if (step === 'adminHallPins') {
    return (
      <AdminHallPins
        halls={halls}
        boothPinsByHall={boothPinsByHall}
        setBoothPinsByHall={setBoothPinsByHall}
        companyNames={mergedCompanies.map((c) => c.name)}
        onBack={() => setStep('adminDashboard')}
      />
    )
  }

  if (step === 'adminUsers') {
    return (
      <AdminUsers
        accounts={adminAccounts}
        setAccounts={setAdminAccounts}
        currentUsername={adminUsername}
        onLogActivity={logAdminActivity}
        onBack={() => setStep('adminDashboard')}
      />
    )
  }

  if (step === 'adminExhibitors') {
    return (
      <AdminExhibitors
        accounts={adminExhibitorAccounts}
        setAccounts={setAdminExhibitorAccounts}
        existingCodes={demoExhibitorCodes}
        onLogActivity={logAdminActivity}
        onBack={() => setStep('adminDashboard')}
      />
    )
  }

  if (step === 'adminPromotionRequests') {
    return (
      <AdminPromotionRequests
        requests={exhibitorPromotions}
        setRequests={setExhibitorPromotions}
        onLogActivity={logAdminActivity}
        onBack={() => setStep('adminDashboard')}
      />
    )
  }

  if (step === 'adminQualityForm') {
    return (
      <AdminQualityForm
        companyList={companyList}
        qualityFormStatus={qualityFormStatus}
        qualityFormAnswers={qualityFormAnswers}
        lastReminderLabel={lastReminderLabel}
        onSendReminder={sendQualityFormReminder}
        onSendReminderToAllIncomplete={sendQualityFormReminderToAllIncomplete}
        onBack={() => setStep('adminDashboard')}
      />
    )
  }

  if (step === 'adminScans') {
    return <AdminScans meetingRequests={meetingRequests} onBack={() => setStep('adminDashboard')} />
  }

  if (step === 'adminRegistrants') {
    return <AdminRegistrants adminExhibitors={adminExhibitorAccounts} onBack={() => setStep('adminDashboard')} />
  }

  if (step === 'adminDataEntry') {
    return <AdminDataEntry onLogActivity={logAdminActivity} onBack={() => setStep('adminDashboard')} />
  }

  if (step === 'adminPromotions') {
    return <AdminPromotions onLogActivity={logAdminActivity} onBack={() => setStep('adminDashboard')} />
  }

  if (step === 'adminNotifications') {
    return (
      <AdminNotifications
        history={adminNotificationHistory}
        setHistory={setAdminNotificationHistory}
        onLogActivity={logAdminActivity}
        onBack={() => setStep('adminDashboard')}
      />
    )
  }

  if (step === 'exhibitorNotifications') {
    return (
      <ExhibitorNotifications
        credits={exhibitorNotificationCredits}
        setCredits={setExhibitorNotificationCredits}
        recipientsPerCredit={notificationCreditRate}
        history={exhibitorNotificationHistory}
        setHistory={setExhibitorNotificationHistory}
        initialMessage={notificationPrefill}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'priority') {
    return (
      <VisitPriority
        userType={userType}
        onContinue={(selectedCategories) => {
          setPriorityCategories(selectedCategories)
          setStep(userType === 'exhibitor' ? 'login' : 'goal')
        }}
        onBack={() => setStep('select')}
      />
    )
  }

  if (step === 'goal') {
    return (
      <VisitGoal
        userType={userType}
        onContinue={(selectedGoals) => {
          setVisitGoals(selectedGoals)
          setStep('login')
        }}
        onBack={() => setStep('priority')}
      />
    )
  }

  if (step === 'login') {
    if (userType === 'exhibitor') {
      return (
        <ExhibitorLogin
          extraCodes={extraExhibitorCodes}
          onSubmit={(n, m, code, company) => {
            setName(n)
            setMobile(m)
            setExhibitorCode(code)
            setExhibitorCompany(company)
            setStep('exhibitorHome')
          }}
          onBack={() => setStep('priority')}
        />
      )
    }
    return (
      <MobileLogin
        onSubmit={(n, m) => {
          setName(n)
          setMobile(m)
          setStep('otp')
        }}
        onBack={() => setStep('goal')}
      />
    )
  }

  if (step === 'otp') {
    return (
      <OtpVerify
        mobile={mobile}
        onVerify={() => setStep('registration')}
        onBack={() => setStep('login')}
      />
    )
  }

  if (step === 'registration') {
    return (
      <Registration
        onComplete={(regData) => {
          setRegistrationData(regData)
          setStep('dashboard')
        }}
        onBack={() => setStep('otp')}
      />
    )
  }

  if (step === 'ticketPurchase') {
    return (
      <TicketPurchase
        buyerName={name}
        onPaymentInitiate={(ticketResults, totalPrice) => {
          if (totalPrice === 0) {
            const issued: Ticket[] = ticketResults.map((t) => ({
              id: generateTicketId(),
              ownerName: t.name,
              date: t.date,
              status: 'active',
            }))
            setNewlyIssuedTickets(issued)
            setTickets((prev) => [...prev, ...issued])
            setStep('ticketsIssued')
            return
          }
          setPendingTickets(ticketResults)
          setPendingPrice(totalPrice)
          setStep('payment')
        }}
        onBack={() => setStep('dashboard')}
      />
    )
  }

  if (step === 'payment') {
    return (
      <PaymentGateway
        totalPrice={pendingPrice}
        onBack={() => setStep('ticketPurchase')}
        onSuccess={() => {
          const issued: Ticket[] = pendingTickets.map((t) => ({
            id: generateTicketId(),
            ownerName: t.name,
            date: t.date,
            status: 'active',
          }))
          setNewlyIssuedTickets(issued)
          setTickets((prev) => [...prev, ...issued])
          setStep('ticketsIssued')
        }}
      />
    )
  }

  if (step === 'ticketsIssued') {
    return (
      <TicketsIssued
        tickets={newlyIssuedTickets}
        onContinue={() => setStep('dashboard')}
        onBack={() => setStep('payment')}
      />
    )
  }

  if (step === 'myTickets') {
    return (
      <MyTickets
        tickets={tickets}
        onBack={() => setStep('dashboard')}
        onBuyNew={() => setStep('ticketPurchase')}
      />
    )
  }

  if (step === 'dashboard') {
    return (
      <VisitorDashboard
        name={name}
        onOpenCard={() => setStep('myTickets')}
        onOpenMap={() => setStep('map')}
        onOpenAccess={() => setStep('access')}
        onOpenParticipants={() => setStep('participants')}
        onOpenPanels={() => setStep('panels')}
        onOpenMyAppointments={() => setStep('myAppointments')}
        onOpenNotifications={() => setStep('notifications')}
        onOpenBoothScan={() => setStep('visitorScan')}
        onOpenMyAccount={() => setStep('myAccount')}
        promotions={visitorPromotions}
        savedPromotionIds={savedPromotionIds}
        onTogglePromotionSave={togglePromotionSave}
        onOpenPromotionCompany={openPromotionCompany}
        onOpenPromotions={() => setStep('promotions')}
      />
    )
  }

  if (step === 'exhibitorHome') {
    return (
      <ExhibitorDashboard
        companyName={exhibitorCompany}
        activityCategories={priorityCategories}
        products={products}
        panels={panels}
        agreements={agreements}
        promotions={exhibitorPromotions}
        inviteQuota={inviteQuota}
        sentInvites={sentInvites}
        meetingRequests={meetingRequests}
        qualityFormCompleted={!!qualityFormStatus[exhibitorCompany]}
        onOpenQualityForm={() => setStep('exhibitorQualityForm')}
        inboxNotifs={exhibitorInboxNotifs[exhibitorCompany] || []}
        onOpenInbox={() => setStep('exhibitorInbox')}
        onOpenProducts={() => setStep('exhibitorProducts')}
        onOpenPanels={() => setStep('exhibitorPanels')}
        onOpenPromotions={() => setStep('exhibitorPromotions')}
        onOpenInvites={() => setStep('exhibitorInvites')}
        onOpenAppointments={() => setStep('exhibitorAppointments')}
        onOpenReport={() => setStep('exhibitorReport')}
        onOpenNetworkScan={() => setStep('exhibitorNetworkScan')}
        onOpenVisitorScan={() => setStep('exhibitorScan')}
        onOpenNotifications={() => {
          setNotificationPrefill('')
          setStep('exhibitorNotifications')
        }}
        onOpenBoothQr={() => setStep('exhibitorBoothQr')}
        onOpenProfileEdit={() => setStep('exhibitorProfileEdit')}
        onOpenJobSeekers={() => setStep('exhibitorJobSeekers')}
        onLogout={handleExhibitorLogout}
      />
    )
  }

  if (step === 'exhibitorQualityForm') {
    return (
      <ExhibitorQualityForm
        companyName={exhibitorCompany}
        initialAnswers={qualityFormAnswers[exhibitorCompany] || null}
        onSubmit={(answers) => submitQualityForm(exhibitorCompany, answers)}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'exhibitorBoothQr') {
    return <ExhibitorBoothQr companyName={exhibitorCompany} onBack={() => setStep('exhibitorHome')} />
  }

  if (step === 'exhibitorInbox') {
    return (
      <ExhibitorNotificationsInbox
        notifs={exhibitorInboxNotifs[exhibitorCompany] || []}
        onMarkRead={markExhibitorInboxRead}
        onMarkAllRead={markAllExhibitorInboxRead}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'visitorScan') {
    return (
      <VisitorBoothScan
        visitorName={name}
        visitorPhone={mobile}
        meetingRequests={meetingRequests}
        onCreateRequest={createMeetingRequestFromScan}
        onBack={() => setStep('dashboard')}
      />
    )
  }

  if (step === 'exhibitorScan') {
    return (
      <ExhibitorScan
        scanLogs={scanLogs}
        setScanLogs={setScanLogs}
        staffName={name}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'exhibitorProducts') {
    return (
      <ExhibitorProducts
        products={products}
        setProducts={setProducts}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'exhibitorPanels') {
    return (
      <ExhibitorPanels
        sessions={panels}
        setSessions={setPanels}
        onSendNotification={openNotificationsForPanel}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'exhibitorAgreements') {
    return (
      <ExhibitorAgreements
        agreements={agreements}
        setAgreements={setAgreements}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'exhibitorPromotions') {
    return (
      <ExhibitorPromotions
        companyName={exhibitorCompany}
        promotions={exhibitorPromotions}
        setPromotions={setExhibitorPromotions}
        onSendNotification={openNotificationsForPanel}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'exhibitorInvites') {
    return (
      <ExhibitorInvites
        quota={inviteQuota}
        setQuota={setInviteQuota}
        sentInvites={sentInvites}
        setSentInvites={setSentInvites}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'exhibitorAppointments') {
    return (
      <ExhibitorAppointments
        requests={meetingRequests}
        setRequests={setMeetingRequests}
        staffName={name}
        staffPhone={mobile}
        myCompanyName={exhibitorCompany}
        agreements={agreements}
        setAgreements={setAgreements}
        onOpenAgreements={() => setStep('exhibitorAgreements')}
        onNotifyVisitor={notifyVisitorOnDecision}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'exhibitorReport') {
    return (
      <ExhibitorReport
        companyName={exhibitorCompany}
        exhibitorCode={exhibitorCode}
        staffPhone={mobile}
        agreements={agreements}
        meetingRequests={meetingRequests}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'map') {
    return (
      <MapAccess
        halls={halls}
        boothPinsByHall={boothPinsByHall}
        onOpenHall={openHall}
        onBack={() => setStep('dashboard')}
      />
    )
  }

  if (step === 'hallMap') {
    const currentHall = halls.find((h) => h.id === selectedHallId)
    if (!currentHall) {
      setStep('map')
      return null
    }
    return (
      <HallMap
        hall={currentHall}
        pins={boothPinsByHall[selectedHallId] || []}
        highlightPinId={highlightPinId}
        onOpenProfile={openCompanyProfile}
        onBack={() => setStep('map')}
      />
    )
  }

  if (step === 'access') {
    return <AccessInfo onBack={() => setStep('dashboard')} />
  }

  if (step === 'participants') {
    return (
      <Participants
        companies={mergedCompanies}
        onBack={() => setStep('dashboard')}
        onOpenProfile={openCompanyProfile}
        savedCompanyNames={savedCompanyNames}
        onToggleSave={toggleSavedCompany}
      />
    )
  }

  if (step === 'panels') {
    return (
      <Panels
        onBack={() => setStep('dashboard')}
        onNavigateToMap={() => setStep('map')}
        savedIds={savedSessionIds}
        onToggleSave={toggleSaveSession}
      />
    )
  }

  if (step === 'myAppointments') {
    return (
      <MyAppointments
        visitorPhone={mobile}
        meetingRequests={meetingRequests}
        onCancelRequest={cancelMeetingRequest}
        onBack={() => setStep('dashboard')}
        onOpenParticipants={() => setStep('participants')}
        onOpenPanels={() => setStep('panels')}
      />
    )
  }

  if (step === 'promotions') {
    return (
      <Promotions
        promotions={visitorPromotions}
        savedIds={savedPromotionIds}
        onToggleSave={togglePromotionSave}
        onOpenCompany={openPromotionCompany}
        onBack={() => setStep('dashboard')}
      />
    )
  }

  if (step === 'myAccount') {
    return (
      <MyAccount
        name={name}
        mobile={mobile}
        data={registrationData || emptyRegistrationData}
        onSave={saveRegistrationData}
        meetingRequests={meetingRequests}
        savedCount={savedCompanyNames.size}
        ticketsCount={tickets.length}
        onOpenMyAppointments={() => setStep('myAppointments')}
        onBack={() => setStep('dashboard')}
        onLogout={handleVisitorLogout}
      />
    )
  }

  if (step === 'companyProfile') {
    return (
      <CompanyProfile
        company={mergedCompanies.find((c) => c.name === viewingCompany)}
        companyName={viewingCompany}
        profile={companyProfiles[viewingCompany]}
        isSaved={savedCompanyNames.has(viewingCompany)}
        onToggleSave={() => toggleSavedCompany(viewingCompany)}
        onRequestMeeting={() => {
          createMeetingRequestFromScan(viewingCompany)
          setStep('dashboard')
        }}
        onBack={() => setStep('dashboard')}
      />
    )
  }

  if (step === 'exhibitorProfileEdit') {
    return (
      <ExhibitorProfile
        companyName={exhibitorCompany}
        company={mergedCompanies.find((c) => c.name === exhibitorCompany)}
        profile={companyProfiles[exhibitorCompany] || emptyCompanyProfile}
        onSave={(patch) => saveCompanyProfile(exhibitorCompany, patch)}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'exhibitorJobSeekers') {
    const liveEntry: JobSeekerEntry | null =
      registrationData && registrationData.wantsJob
        ? {
            id: 'live-visitor',
            name: registrationData.fullName || 'بازدیدکننده',
            jobTitle: registrationData.jobTitle || '—',
            experience: registrationData.experience || '—',
            education: registrationData.education || '—',
            skills: registrationData.skills || '—',
            preferredCompanies: registrationData.preferredCompanies || '—',
          }
        : null
    return (
      <ExhibitorJobSeekers
        hasAccess={!!exhibitorJobSeekerAccess[exhibitorCompany]}
        onActivateAccess={activateJobSeekerAccess}
        liveEntry={liveEntry}
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  if (step === 'exhibitorNetworkScan') {
    return (
      <VisitorBoothScan
        visitorName={name}
        visitorPhone={mobile}
        meetingRequests={meetingRequests}
        onCreateRequest={createMeetingRequestFromExhibitorScan}
        blockedCompanyName={exhibitorCompany}
        title="قرار ملاقات با غرفه‌های دیگر"
        subtitle="با اسکن QR غرفه‌ی موردنظر، درخواست ملاقات غرفه به غرفه ثبت می‌شود"
        onBack={() => setStep('exhibitorHome')}
      />
    )
  }

  return (
    <Notifications
      notifs={visitorNotifications}
      setNotifs={setVisitorNotifications}
      onBack={() => setStep('dashboard')}
    />
  )
}

export default App