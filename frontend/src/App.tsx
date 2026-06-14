import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider, useApp } from '@/context/AppContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { ToastProvider } from '@/components/ui/Toast'

// Public Marketing Pages
const Home         = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })))
const Features     = lazy(() => import('@/pages/Features').then(m => ({ default: m.Features })))
const Pricing      = lazy(() => import('@/pages/Pricing').then(m => ({ default: m.Pricing })))
const HelpCenter   = lazy(() => import('@/pages/HelpCenter').then(m => ({ default: m.HelpCenter })))
const SecurityDocs = lazy(() => import('@/pages/SecurityDocs').then(m => ({ default: m.SecurityDocs })))
const Affiliate    = lazy(() => import('@/pages/Affiliate').then(m => ({ default: m.Affiliate })))

// Authentication
const Login        = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })))
const Register     = lazy(() => import('@/pages/Register').then(m => ({ default: m.Register })))
const Onboarding   = lazy(() => import('@/pages/Onboarding').then(m => ({ default: m.Onboarding })))

// Protected Dashboard Console Pages
const Dashboard    = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Markets      = lazy(() => import('@/pages/Markets').then(m => ({ default: m.Markets })))
const Assets       = lazy(() => import('@/pages/Assets').then(m => ({ default: m.Assets })))
const Watchlists   = lazy(() => import('@/pages/Watchlists').then(m => ({ default: m.Watchlists })))
const Alerts       = lazy(() => import('@/pages/Alerts').then(m => ({ default: m.Alerts })))
const AIInsights   = lazy(() => import('@/pages/AIInsights').then(m => ({ default: m.AIInsights })))
const Users        = lazy(() => import('@/pages/Users').then(m => ({ default: m.Users })))
const System       = lazy(() => import('@/pages/System').then(m => ({ default: m.System })))
const Admin        = lazy(() => import('@/pages/Admin').then(m => ({ default: m.Admin })))

// Settings & SaaS Workspace Pages
const Settings     = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })))
const Billing      = lazy(() => import('@/pages/Billing').then(m => ({ default: m.Billing })))
const Organizations = lazy(() => import('@/pages/Organizations').then(m => ({ default: m.Organizations })))
const DeveloperKeys = lazy(() => import('@/pages/DeveloperKeys').then(m => ({ default: m.DeveloperKeys })))

const NotFound     = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-0)]">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-8 h-8">
          <div className="w-8 h-8 border-2 border-[var(--border-2)] border-t-[var(--accent)] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] opacity-60" />
          </div>
        </div>
        <p className="text-[12px] text-[var(--text-3)] font-medium tracking-wide">Loading…</p>
      </div>
    </div>
  )
}

function RootIndex() {
  const { token } = useApp()
  return token ? <Dashboard /> : <Home />
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Marketing */}
            <Route path="/features" element={<Suspense fallback={<PageLoader />}><Features /></Suspense>} />
            <Route path="/pricing"  element={<Suspense fallback={<PageLoader />}><Pricing /></Suspense>} />
            <Route path="/support"  element={<Suspense fallback={<PageLoader />}><HelpCenter /></Suspense>} />
            <Route path="/security" element={<Suspense fallback={<PageLoader />}><SecurityDocs /></Suspense>} />
            <Route path="/affiliate" element={<Suspense fallback={<PageLoader />}><Affiliate /></Suspense>} />

            {/* Authentication */}
            <Route path="/login"    element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
            <Route path="/register" element={<Suspense fallback={<PageLoader />}><Register /></Suspense>} />

            {/* Console App Wrapper */}
            <Route element={<AppLayout />}>
              <Route index              element={<Suspense fallback={<PageLoader />}><RootIndex /></Suspense>} />
              <Route path="/onboarding" element={<Suspense fallback={<PageLoader />}><Onboarding /></Suspense>} />
              <Route path="/markets"    element={<Suspense fallback={<PageLoader />}><Markets /></Suspense>} />
              <Route path="/assets"     element={<Suspense fallback={<PageLoader />}><Assets /></Suspense>} />
              <Route path="/watchlists" element={<Suspense fallback={<PageLoader />}><Watchlists /></Suspense>} />
              <Route path="/alerts"     element={<Suspense fallback={<PageLoader />}><Alerts /></Suspense>} />
              <Route path="/ai"         element={<Suspense fallback={<PageLoader />}><AIInsights /></Suspense>} />
              <Route path="/users"      element={<Suspense fallback={<PageLoader />}><Users /></Suspense>} />
              <Route path="/system"     element={<Suspense fallback={<PageLoader />}><System /></Suspense>} />
              <Route path="/admin"      element={<Suspense fallback={<PageLoader />}><Admin /></Suspense>} />
              
              {/* SaaS & Settings */}
              <Route path="/settings"           element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
              <Route path="/settings/billing"   element={<Suspense fallback={<PageLoader />}><Billing /></Suspense>} />
              <Route path="/settings/teams"     element={<Suspense fallback={<PageLoader />}><Organizations /></Suspense>} />
              <Route path="/settings/developer" element={<Suspense fallback={<PageLoader />}><DeveloperKeys /></Suspense>} />
            </Route>

            <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  )
}
