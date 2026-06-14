import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Check, X, HelpCircle, ArrowRight, Zap, ChevronDown, Shield, Star } from 'lucide-react'
import { PublicNav } from '@/components/common/PublicNav'
import { PublicFooter } from '@/components/common/PublicFooter'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ── Plans data ── */
const PLANS = [
  {
    id: 'Free',
    name: 'Free',
    tagline: 'For exploration',
    priceMonthly: 0,
    priceYearly: 0,
    color: '',
    highlight: false,
    features: [
      'Live market data (60s cache)',
      '1 customizable watchlist',
      '1 active price alert',
      '3 AI analysis calls/day',
      'Standard dashboard',
      'Community support',
    ],
    missing: ['WebSocket streams', 'API gateway', 'FRED economic data', 'Team workspace', 'Audit logs'],
    cta: 'Get Started Free',
  },
  {
    id: 'Starter',
    name: 'Starter',
    tagline: 'For active traders',
    priceMonthly: 29,
    priceYearly: 290,
    color: '',
    highlight: false,
    features: [
      'Real-time WebSocket streams',
      '5 customizable watchlists',
      '10 active price alerts',
      '50 AI analyses/month',
      'Advanced charts & filters',
      'Priority email notifications',
    ],
    missing: ['API gateway', 'FRED economic data', 'Team workspace', 'Audit logs'],
    cta: 'Start Starter Trial',
  },
  {
    id: 'Pro',
    name: 'Pro',
    tagline: 'For professionals',
    priceMonthly: 79,
    priceYearly: 790,
    color: 'accent',
    highlight: true,
    features: [
      'Unlimited watchlists & alerts',
      '500 AI analyses/month',
      'FRED economic data access',
      'API developer gateway (1 key)',
      'Team workspace (up to 3)',
      'Priority Slack support',
    ],
    missing: ['Audit logs', 'Custom feeds', 'SSO/SAML'],
    cta: 'Start Pro Trial',
  },
  {
    id: 'Enterprise',
    name: 'Enterprise',
    tagline: 'For trading orgs',
    priceMonthly: 299,
    priceYearly: 2990,
    color: 'ai',
    highlight: false,
    features: [
      'Custom sub-millisecond feeds',
      'Unlimited AI analysis',
      'SSO/SAML authentication',
      'Full audit logs & history',
      'Unlimited API keys',
      '24/7 dedicated manager',
    ],
    missing: [],
    cta: 'Contact Sales',
  },
]

/* ── Comparison features ── */
const COMPARISON = [
  { feature: 'Live Market Data', free: true, starter: true, pro: true, enterprise: true },
  { feature: 'WebSocket Streaming', free: false, starter: true, pro: true, enterprise: true },
  { feature: 'Watchlists', free: '1', starter: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Price Alerts', free: '1', starter: '10', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'AI Analysis Calls', free: '3/day', starter: '50/mo', pro: '500/mo', enterprise: 'Unlimited' },
  { feature: 'FRED Economic Data', free: false, starter: false, pro: true, enterprise: true },
  { feature: 'Developer API Keys', free: false, starter: false, pro: '1 key', enterprise: 'Unlimited' },
  { feature: 'Team Workspace', free: false, starter: false, pro: '3 members', enterprise: 'Unlimited' },
  { feature: 'SSO / SAML Auth', free: false, starter: false, pro: false, enterprise: true },
  { feature: 'Audit Logs', free: false, starter: false, pro: false, enterprise: true },
  { feature: 'SLA Uptime', free: '99.5%', starter: '99.9%', pro: '99.95%', enterprise: '99.99%' },
  { feature: 'Support', free: 'Community', starter: 'Email', pro: 'Priority Slack', enterprise: 'Dedicated 24/7' },
]

/* ── FAQ ── */
const FAQ = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes. Upgrade or downgrade instantly from the billing settings. When you upgrade, you\'ll be charged a prorated amount for the remaining billing period.'
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'Every paid plan comes with a 14-day free trial. No credit card required to start. You\'ll only be charged after the trial ends if you choose to continue.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), ACH bank transfers for Enterprise customers, and wire transfers for annual contracts over $10,000.'
  },
  {
    q: 'Do you offer discounts for startups or nonprofits?',
    a: 'Yes! We offer 40% discounts for verified startups under 2 years old, 60% for nonprofits, and 50% for academic institutions. Contact sales@globalfi.ultra with documentation.'
  },
]

function CheckCell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-4 h-4 text-[var(--success-bright)] mx-auto" />
  if (value === false) return <X className="w-4 h-4 text-[var(--border-3)] mx-auto" />
  return <span className="text-xs font-semibold text-[var(--text-2)]">{value}</span>
}

function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false)
  return (
    <ScrollReveal delay={i * 60}>
      <button onClick={() => setOpen(o => !o)} className="w-full text-left">
        <div className={cn('rounded-xl border overflow-hidden transition-all', open ? 'border-[var(--border-3)] bg-[var(--bg-2)]' : 'border-[var(--border-2)] hover:border-[var(--border-3)] bg-[var(--bg-2)]')}>
          <div className="flex items-center justify-between px-6 py-4 gap-4">
            <span className="text-sm font-semibold text-[var(--text-1)]">{q}</span>
            <ChevronDown className={cn('w-4 h-4 shrink-0 text-[var(--text-3)] transition-transform duration-200', open && 'rotate-180')} />
          </div>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }} className="overflow-hidden">
                <p className="px-6 pb-5 text-sm text-[var(--text-3)] leading-relaxed">{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </ScrollReveal>
  )
}

export function Pricing() {
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [couponCode, setCouponCode] = useState('')
  const [discountPct, setDiscountPct] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [activeCoupon, setActiveCoupon] = useState('')
  const { currentUser, token, toast } = useApp()
  const navigate = useNavigate()

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    if (!couponCode) return
    try {
      const res = await fetch(`http://localhost:3000/api/v1/billing/coupons/${couponCode}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      const data = await res.json()
      if (res.ok && data.coupon) {
        setDiscountPct(data.coupon.discountPercent)
        setActiveCoupon(couponCode.toUpperCase())
        toast.success('Coupon Applied!', `${data.coupon.discountPercent}% discount applied.`)
      } else {
        setCouponError(data.error || 'Invalid coupon code')
      }
    } catch {
      const fallbacks: Record<string, number> = { 'GLOBALFIT30': 30, 'SAASNEW': 15, 'INVESTORFREE': 100 }
      const matched = fallbacks[couponCode.toUpperCase()]
      if (matched !== undefined) {
        setDiscountPct(matched)
        setActiveCoupon(couponCode.toUpperCase())
        toast.success('Coupon Applied!', `${matched}% discount applied.`)
      } else {
        setCouponError('Invalid coupon code. Try GLOBALFIT30')
      }
    }
  }

  const handleSelectPlan = async (planId: string) => {
    if (!currentUser) { toast.info('Sign in required', 'Create an account or sign in to choose a plan.'); navigate('/register'); return }
    if (planId === 'Free') { toast.info('Free Plan', 'You\'re already on the free tier.'); return }
    if (planId === 'Enterprise') { navigate('/contact'); return }
    try {
      const res = await fetch('http://localhost:3000/api/v1/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ planId, billingCycle: cycle, couponCode: activeCoupon })
      })
      const data = await res.json()
      if (res.ok && data.redirectUrl) window.location.href = data.redirectUrl
      else toast.error('Checkout Failed', data.error || 'Failed to initiate checkout')
    } catch {
      const plan = PLANS.find(p => p.id === planId)!
      const base = cycle === 'yearly' ? plan.priceYearly : plan.priceMonthly
      const final = Math.round(base * (1 - discountPct / 100))
      window.location.href = `/settings/billing?mock_checkout=true&plan=${planId}&cycle=${cycle}&price=${final}`
    }
  }

  const getPrice = (plan: typeof PLANS[0]) => {
    const base = cycle === 'yearly' ? plan.priceYearly : plan.priceMonthly
    return Math.round(base * (1 - discountPct / 100))
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav />

      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.06] blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
          <ScrollReveal>
            <span className="section-badge mb-5 inline-flex">
              <Zap className="w-3.5 h-3.5" />
              Simple Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-4 mb-5">
              Start free.<br />
              <span className="text-gradient-blue">Scale without limits.</span>
            </h1>
            <p className="text-base text-[var(--text-3)] leading-relaxed mb-8">
              No hidden fees. No vendor lock-in. Cancel anytime.
              Every plan comes with a 14-day free trial.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-[var(--bg-2)] border border-[var(--border-2)]">
              <button
                onClick={() => setCycle('monthly')}
                className={cn('px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150', cycle === 'monthly' ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text-3)] hover:text-[var(--text-2)]')}
              >
                Monthly
              </button>
              <button
                onClick={() => setCycle('yearly')}
                className={cn('flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150', cycle === 'yearly' ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text-3)] hover:text-[var(--text-2)]')}
              >
                Yearly
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--success-subtle)] border border-[var(--success-border)] text-[var(--success-bright)] font-bold">Save 20%</span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Plan cards */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {PLANS.map((plan, i) => {
              const price = getPrice(plan)
              return (
                <ScrollReveal key={plan.id} delay={i * 80} direction="up">
                  <div className={cn(
                    'rounded-2xl p-6 flex flex-col h-full relative border transition-all duration-200',
                    plan.highlight
                      ? 'bg-[var(--accent)] border-transparent shadow-[var(--shadow-accent)]'
                      : 'bg-[var(--bg-2)] border-[var(--border-2)] hover:border-[var(--border-3)]'
                  )}>
                    {plan.highlight && (
                      <div className="absolute -top-px left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-blue-400 to-violet-400" />
                    )}
                    {plan.highlight && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full bg-[var(--warning-bright)] text-[var(--bg-0)] whitespace-nowrap">
                        MOST POPULAR
                      </span>
                    )}

                    <div className="mb-5">
                      <h3 className={cn('text-lg font-bold mb-0.5', plan.highlight ? 'text-white' : 'text-[var(--text-1)]')}>{plan.name}</h3>
                      <p className={cn('text-sm', plan.highlight ? 'text-blue-200' : 'text-[var(--text-3)]')}>{plan.tagline}</p>
                    </div>

                    <div className="mb-6">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={cycle}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                        >
                          <span className={cn('text-4xl font-black num tracking-tight', plan.highlight ? 'text-white' : 'text-[var(--text-1)]')}>
                            ${price}
                          </span>
                          <span className={cn('text-sm ml-1', plan.highlight ? 'text-blue-200' : 'text-[var(--text-3)]')}>
                            /{cycle === 'yearly' ? 'yr' : 'mo'}
                          </span>
                        </motion.div>
                      </AnimatePresence>
                      {discountPct > 0 && price > 0 && (
                        <p className="text-xs text-[var(--success-bright)] mt-1 font-semibold">{discountPct}% discount applied!</p>
                      )}
                    </div>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className={cn('flex items-start gap-2 text-sm', plan.highlight ? 'text-blue-100' : 'text-[var(--text-2)]')}>
                          <Check className={cn('w-4 h-4 shrink-0 mt-0.5', plan.highlight ? 'text-white' : 'text-[var(--accent-bright)]')} />
                          {f}
                        </li>
                      ))}
                      {plan.missing.slice(0, 2).map((f) => (
                        <li key={f} className={cn('flex items-start gap-2 text-sm line-through opacity-50', plan.highlight ? 'text-blue-300' : 'text-[var(--text-3)]')}>
                          <X className="w-4 h-4 shrink-0 mt-0.5 opacity-50" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={cn(
                        'w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5',
                        plan.highlight
                          ? 'bg-white text-[var(--accent)] hover:bg-blue-50'
                          : 'bg-[var(--bg-3)] hover:bg-[var(--bg-4)] border border-[var(--border-3)] hover:border-[var(--border-4)] text-[var(--text-1)]'
                      )}
                    >
                      {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>

          {/* Coupon */}
          <ScrollReveal className="max-w-md mx-auto mb-16">
            <div className="card p-5 text-center border-[var(--border-3)]">
              <p className="text-sm font-semibold text-[var(--text-1)] mb-1">Have a promo code?</p>
              <p className="text-xs text-[var(--text-3)] mb-4">Try: <code className="bg-[var(--bg-3)] px-1.5 py-0.5 rounded text-[var(--accent-bright)]">GLOBALFIT30</code></p>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input type="text" placeholder="Enter code" className="input-premium uppercase text-sm" style={{ height: '38px' }} value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                <button type="submit" className="btn-secondary shrink-0" style={{ height: '38px', padding: '0 16px', fontSize: '13px' }}>Apply</button>
              </form>
              {couponError && <p className="text-xs text-[var(--danger-bright)] mt-2">{couponError}</p>}
              {activeCoupon && <p className="text-xs text-[var(--success-bright)] mt-2 font-semibold">✓ {activeCoupon} — {discountPct}% off applied!</p>}
            </div>
          </ScrollReveal>

          {/* Comparison table */}
          <ScrollReveal>
            <div className="card overflow-hidden mb-20">
              <div className="px-6 py-5 border-b border-[var(--border-2)]">
                <h3 className="text-lg font-bold text-[var(--text-1)]">Full feature comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border-2)]">
                      <th className="text-left px-6 py-4 text-xs font-bold text-[var(--text-3)] uppercase tracking-wider w-[35%]">Feature</th>
                      {PLANS.map(p => (
                        <th key={p.id} className={cn('px-4 py-4 text-sm font-bold text-center', p.highlight ? 'text-[var(--accent-bright)]' : 'text-[var(--text-2)]')}>{p.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, i) => (
                      <tr key={row.feature} className={cn('border-b border-[var(--border-1)] transition-colors hover:bg-[var(--bg-3)]', i % 2 === 0 ? '' : 'bg-[var(--bg-1)]/30')}>
                        <td className="px-6 py-3.5 text-sm text-[var(--text-2)]">{row.feature}</td>
                        <td className="px-4 py-3.5 text-center"><CheckCell value={row.free} /></td>
                        <td className="px-4 py-3.5 text-center"><CheckCell value={row.starter} /></td>
                        <td className="px-4 py-3.5 text-center bg-[var(--accent-subtle)]/30"><CheckCell value={row.pro} /></td>
                        <td className="px-4 py-3.5 text-center"><CheckCell value={row.enterprise} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>

          {/* Trust signals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
            {[
              { icon: Shield, title: '30-Day Money Back', desc: 'No questions asked. If you\'re not satisfied, get a full refund within 30 days.' },
              { icon: Zap, title: 'Instant Activation', desc: 'Your plan activates immediately. Start streaming market data in under 60 seconds.' },
              { icon: Star, title: '14-Day Free Trial', desc: 'Every paid plan comes with a full-featured 14-day trial. No credit card needed.' },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="card p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[var(--accent-bright)]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-1)] mb-1">{item.title}</h4>
                    <p className="text-sm text-[var(--text-3)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <ScrollReveal className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white">Billing FAQ</h2>
            </ScrollReveal>
            <div className="space-y-3">
              {FAQ.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} i={i} />)}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
