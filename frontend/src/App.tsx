import { useState } from 'react'
import Splash from './Splash'
import UserTypeSelect from './UserTypeSelect'
import VisitPriority from './VisitPriority'
import VisitGoal from './VisitGoal'
import MobileLogin from './MobileLogin'
import ExhibitorLogin, { demoExhibitorCodes } from './ExhibitorLogin'
import ExhibitorProducts, { type Product, type CategoryId } from './ExhibitorProducts'
import ExhibitorPanels, { type PanelSession } from './ExhibitorPanels'
import ExhibitorAgreements, { type Agreement } from './ExhibitorAgreements'
import ExhibitorPromotions, { type ExhibitorPromotion } from './ExhibitorPromotions'
import ExhibitorInvites, { type SentInvite } from './ExhibitorInvites'
import ExhibitorAppointments, { type MeetingRequest } from './ExhibitorAppointments'
import ExhibitorReport from './ExhibitorReport'
import ExhibitorScan, { type ScanLog } from './ExhibitorScan'
import ExhibitorBoothQr from './ExhibitorBoothQr'
import VisitorBoothScan from './VisitorBoothScan'
import AdminLogin, { type AdminRole } from './AdminLogin'
import AdminDashboard, { type ActivityLogEntry } from './AdminDashboard'
import AdminRegistrants from './AdminRegistrants'
import AdminDataEntry from './AdminDataEntry'
import AdminPromotions from './AdminPromotions'
import AdminNotifications, { type AdminNotificationEntry } from './AdminNotifications'
import ExhibitorNotifications, { type ExhibitorNotificationEntry } from './ExhibitorNotifications'
import AdminScans from './AdminScans'
import AdminQualityForm from './AdminQualityForm'
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
import AccessInfo from './AccessInfo'
import Participants, { companiesDirectory } from './Participants'
import Panels from './Panels'
import MyAppointments from './MyAppointments'
import Notifications, { type VisitorNotif, initialVisitorNotifs } from './Notifications'
import Promotions from './Promotions'
import { initialPromotions } from './Promotion'
import MyAccount from './MyAccount'
import CompanyProfile, { type CompanyProfileData } from './CompanyProfile'
import ExhibitorProfile from './ExhibitorProfile'
import ExhibitorJobSeekers, { type JobSeekerEntry } from './ExhibitorJobSeekers'

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
  | 'adminNotifications'
  | 'adminQualityForm'
  | 'exhibitorNotifications'
  | 'adminScans'
  | 'map'
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

// لیست یکتای غرفه‌داران از روی کدهای دمو — در فاز اتصال Supabase از جدول companies خوانده می‌شود
const companyList = Array.from(new Set(Object.values(demoExhibitorCodes)))

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

// لینک عمومی فرم گوگل که غرفه‌داران باید پر کنند
const EXHIBITOR_FORM_URL = 'https://forms.gle/7yGXCQRpHpebMUba8'
// لینک داخلی تب پاسخ‌های همان فرم که فقط با اکانت گوگل دارای دسترسی مدیر قابل مشاهده است
const ADMIN_REPORT_URL = 'https://docs.google.com/forms/d/1HFOtCfAKnCONVk-b9Iibj7P1Kin8uDWXfXMcipHMlnU/edit#responses'

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
  const [adminRole, setAdminRole] = useState<AdminRole>('operator')
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
  const [exhibitorInboxNotifs, setExhibitorInboxNotifs] = useState<Record<string, ExhibitorInboxNotif[]>>({})
  const [lastReminderLabel, setLastReminderLabel] = useState<Record<string, string>>({})
  const [notificationPrefill, setNotificationPrefill] = useState('')
  const [companyProfiles, setCompanyProfiles] = useState<Record<string, CompanyProfileData>>({})
  const [savedCompanyNames, setSavedCompanyNames] = useState<Set<string>>(new Set(['بانک آینده']))
  const [exhibitorJobSeekerAccess, setExhibitorJobSeekerAccess] = useState<Record<string, boolean>>({})
  const [viewingCompany, setViewingCompany] = useState('')
  void visitGoals

  const emptyCompanyProfile: CompanyProfileData = { bio: '', products: '', website: '', phone: '', achievements: '' }

  const togglePromotionSave = (id: string) => {
    setSavedPromotionIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openCompanyProfile = (company: string) => {
    setViewingCompany(company)
    setStep('companyProfile')
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

  const markQualityFormDone = () => {
    setQualityFormStatus((prev) => ({ ...prev, [exhibitorCompany]: true }))
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
        onSubmit={(_username, role, displayName) => {
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
        onOpenRegistrants={() => setStep('adminRegistrants')}
        onOpenDataEntry={() => setStep('adminDataEntry')}
        onOpenPromotions={() => setStep('adminPromotions')}
        onOpenNotifications={() => setStep('adminNotifications')}
        onOpenScans={() => setStep('adminScans')}
        onOpenQualityForm={() => setStep('adminQualityForm')}
        onLogout={() => {
          setAdminDisplayName('')
          setStep('select')
        }}
      />
    )
  }

  if (step === 'adminQualityForm') {
    return (
      <AdminQualityForm
        qualityFormStatus={qualityFormStatus}
        reportUrl={ADMIN_REPORT_URL}
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
    return <AdminRegistrants onBack={() => setStep('adminDashboard')} />
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
        promotions={initialPromotions}
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
        qualityFormUrl={EXHIBITOR_FORM_URL}
        qualityFormCompleted={!!qualityFormStatus[exhibitorCompany]}
        onMarkQualityFormDone={markQualityFormDone}
        inboxNotifs={exhibitorInboxNotifs[exhibitorCompany] || []}
        onOpenInbox={() => setStep('exhibitorInbox')}
        onOpenProducts={() => setStep('exhibitorProducts')}
        onOpenPanels={() => setStep('exhibitorPanels')}
        onOpenPromotions={() => setStep('exhibitorPromotions')}
        onOpenInvites={() => setStep('exhibitorInvites')}
        onOpenAppointments={() => setStep('exhibitorAppointments')}
        onOpenReport={() => setStep('exhibitorReport')}
        onOpenScan={() => setStep('exhibitorScan')}
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
    return <MapAccess onBack={() => setStep('dashboard')} />
  }

  if (step === 'access') {
    return <AccessInfo onBack={() => setStep('dashboard')} />
  }

  if (step === 'participants') {
    return (
      <Participants
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
        promotions={initialPromotions}
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
        company={companiesDirectory.find((c) => c.name === viewingCompany)}
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
        company={companiesDirectory.find((c) => c.name === exhibitorCompany)}
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

  return (
    <Notifications
      notifs={visitorNotifications}
      setNotifs={setVisitorNotifications}
      onBack={() => setStep('dashboard')}
    />
  )
}

export default App
