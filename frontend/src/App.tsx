import { useState } from 'react'
import Splash from './Splash'
import UserTypeSelect from './UserTypeSelect'
import VisitPriority from './VisitPriority'
import VisitGoal from './VisitGoal'
import MobileLogin from './MobileLogin'
import OtpVerify from './OtpVerify'
import EntryCard from './EntryCard'
import VisitorDashboard from './VisitorDashboard'
import MapAccess from './MapAccess'
import Participants from './Participants'
import Panels from './Panels'
import MyAppointments from './MyAppointments'
import Notifications from './Notifications'

type Step =
  | 'splash'
  | 'select'
  | 'priority'
  | 'goal'
  | 'login'
  | 'otp'
  | 'card'
  | 'dashboard'
  | 'map'
  | 'participants'
  | 'panels'
  | 'myAppointments'
  | 'notifications'

function App() {
  const [step, setStep] = useState<Step>('splash')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [priorityCategories, setPriorityCategories] = useState<string[]>([])
  const [visitGoals, setVisitGoals] = useState<string[]>([])
  // مشخص می‌کند دکمه‌ی برگشت در صفحه‌ی کارت ورود، به کجا برود (به otp یا به dashboard)
  const [cardOrigin, setCardOrigin] = useState<'otp' | 'dashboard'>('otp')
  void priorityCategories
  void visitGoals

  if (step === 'splash') return <Splash onNext={() => setStep('select')} />

  if (step === 'select') {
    return <UserTypeSelect onSelect={() => setStep('priority')} onBack={() => setStep('splash')} />
  }

  if (step === 'priority') {
    return (
      <VisitPriority
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
        onContinue={(selectedGoals) => {
          setVisitGoals(selectedGoals)
          setStep('login')
        }}
        onBack={() => setStep('priority')}
      />
    )
  }

  if (step === 'login') {
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
        onVerify={() => {
          setCardOrigin('otp')
          setStep('card')
        }}
        onBack={() => setStep('login')}
      />
    )
  }

  if (step === 'card') {
    return (
      <EntryCard
        name={name}
        mobile={mobile}
        onContinue={() => setStep('dashboard')}
        onBack={() => setStep(cardOrigin)}
      />
    )
  }

  if (step === 'dashboard') {
    return (
      <VisitorDashboard
        name={name}
        onOpenCard={() => {
          setCardOrigin('dashboard')
          setStep('card')
        }}
        onOpenMap={() => setStep('map')}
        onOpenParticipants={() => setStep('participants')}
        onOpenPanels={() => setStep('panels')}
        onOpenMyAppointments={() => setStep('myAppointments')}
        onOpenNotifications={() => setStep('notifications')}
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

  return <Notifications onBack={() => setStep('dashboard')} />
}

export default App