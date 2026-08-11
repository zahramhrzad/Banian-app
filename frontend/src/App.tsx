import { useState } from 'react'
import Splash from './Splash'
import UserTypeSelect from './UserTypeSelect'
import VisitPriority from './VisitPriority'
import VisitGoal from './VisitGoal'
import MobileLogin from './MobileLogin'
import ExhibitorLogin from './ExhibitorLogin'
import ExhibitorProducts, { type Product } from './ExhibitorProducts'
import ExhibitorPanels, { type PanelSession } from './ExhibitorPanels'
import ExhibitorAgreements, { type Agreement } from './ExhibitorAgreements'
import ExhibitorPromotions, { type ExhibitorPromotion } from './ExhibitorPromotions'
import ExhibitorInvites, { type SentInvite } from './ExhibitorInvites'
import ExhibitorAppointments, { type MeetingRequest } from './ExhibitorAppointments'
import ExhibitorReport from './ExhibitorReport'
import ExhibitorScan, { type ScanLog } from './ExhibitorScan'
import ExhibitorDashboard from './ExhibitorDashboard'
import OtpVerify from './OtpVerify'
import Registration from './Registration'
import TicketPurchase, { type TicketPurchaseResult } from './TicketPurchase'
import PaymentGateway from './PaymentGateway'
import TicketsIssued from './TicketsIssued'
import MyTickets from './MyTickets'
import type { Ticket } from './TicketCard'
import VisitorDashboard from './VisitorDashboard'
import MapAccess from './MapAccess'
import Participants from './Participants'
import Panels from './Panels'
import MyAppointments from './MyAppointments'
import Notifications from './Notifications'
import Promotions from './Promotions'
import { initialPromotions } from './Promotion'

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
  | 'map'
  | 'participants'
  | 'panels'
  | 'myAppointments'
  | 'notifications'
  | 'promotions'

let ticketIdCounter = 214

function generateTicketId() {
  ticketIdCounter += 1
  return `#BN-${String(ticketIdCounter).padStart(5, '0')}`
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
  },
]

function App() {
  const [step, setStep] = useState<Step>('splash')
  const [userType, setUserType] = useState<'visitor' | 'exhibitor'>('visitor')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [priorityCategories, setPriorityCategories] = useState<string[]>([])
  const [visitGoals, setVisitGoals] = useState<string[]>([])
  const [registrationData, setRegistrationData] = useState<unknown>(null)
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
  void visitGoals
  void registrationData

  const togglePromotionSave = (id: string) => {
    setSavedPromotionIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openPromotionCompany = (company: string) => {
    alert('رفتن به پروفایل «' + company + '» (این صفحه هنوز ساخته نشده)')
  }

  const handleExhibitorLogout = () => {
    setName('')
    setMobile('')
    setExhibitorCode('')
    setExhibitorCompany('')
    setStep('login')
  }

  if (step === 'splash') return <Splash onNext={() => setStep('select')} />

  if (step === 'select') {
    return (
      <UserTypeSelect
        onSelect={(type) => {
          setUserType(type)
          setStep('priority')
        }}
        onBack={() => setStep('splash')}
      />
    )
  }

  if (step === 'priority') {
    return (
      <VisitPriority
        userType={userType}
        onContinue={(selectedCategories) => {
          setPriorityCategories(selectedCategories)
          setStep('goal')
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
          onBack={() => setStep('goal')}
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
          setStep('ticketPurchase')
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
        onBack={() => setStep('registration')}
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
        onOpenParticipants={() => setStep('participants')}
        onOpenPanels={() => setStep('panels')}
        onOpenMyAppointments={() => setStep('myAppointments')}
        onOpenNotifications={() => setStep('notifications')}
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
        activityCategory={priorityCategories[0] || ''}
        products={products}
        panels={panels}
        agreements={agreements}
        promotions={exhibitorPromotions}
        inviteQuota={inviteQuota}
        sentInvites={sentInvites}
        meetingRequests={meetingRequests}
        onOpenProducts={() => setStep('exhibitorProducts')}
        onOpenPanels={() => setStep('exhibitorPanels')}
        onOpenPromotions={() => setStep('exhibitorPromotions')}
        onOpenInvites={() => setStep('exhibitorInvites')}
        onOpenAppointments={() => setStep('exhibitorAppointments')}
        onOpenReport={() => setStep('exhibitorReport')}
        onOpenScan={() => setStep('exhibitorScan')}
        onLogout={handleExhibitorLogout}
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

  if (step === 'participants') {
    return <Participants onBack={() => setStep('dashboard')} />
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

  return <Notifications onBack={() => setStep('dashboard')} />
}

export default App