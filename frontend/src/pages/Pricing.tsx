import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Check, HelpCircle, ArrowRight } from 'lucide-react'

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [couponCode, setCouponCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [activeCoupon, setActiveCoupon] = useState('')
  const { currentUser, token, toast } = useApp()
  const navigate = useNavigate()

  const plans = [
    {
      id: 'Free',
      name: 'Free Tier',
      description: 'Ideal for basic market observation and evaluation.',
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        'Live market prices updates',
        '1 customizable watchlist',
        '1 active price alert',
        '3 AI analysis calls per day',
        'Standard dashboard visual tools'
      ]
    },
    {
      id: 'Starter',
      name: 'Starter Plan',
      description: 'For active traders requiring dedicated data streams.',
      priceMonthly: 29,
      priceYearly: 290,
      features: [
        'Real-time WebSocket market streams',
        '5 customizable watchlists',
        '10 active price alerts',
        '50 AI analyses per month',
        'Advanced visual charts & filters',
        'Priority email notifications'
      ]
    },
    {
      id: 'Pro',
      name: 'Pro Plan',
      description: 'For professionals requiring institutional precision.',
      priceMonthly: 79,
      priceYearly: 790,
      features: [
        'Unlimited watchlists & watch assets',
        '99 active price alerts',
        '500 AI analyses per month',
        'Access to FRED economic correlations',
        'Public API developer gateway (1 key)',
        'Standard team support (up to 3 members)'
      ]
    },
    {
      id: 'Enterprise',
      name: 'Enterprise Plan',
      description: 'Custom parameters for trading organizations.',
      priceMonthly: 299,
      priceYearly: 2990,
      features: [
        'Custom sub-millisecond feeds',
        'SSO/SAML team authentication routing',
        'Audit logs & detailed action histories',
        'Unlimited developer API keys',
        'Unlimited AI analysis commands',
        'Dedicated 24/7 technical manager'
      ]
    }
  ]

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    if (!couponCode) return

    try {
      const res = await fetch(`http://localhost:4000/api/v1/billing/coupons/${couponCode}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      const data = await res.json()
      if (res.ok && data.coupon) {
        setDiscountPercent(data.coupon.discountPercent)
        setActiveCoupon(couponCode.toUpperCase())
        toast.success('Coupon Applied!', `You received a ${data.coupon.discountPercent}% discount!`)
      } else {
        setCouponError(data.error || 'Invalid coupon code')
      }
    } catch {
      // Offline fallback coupons
      const fallbacks: any = { 'GLOBALFIT30': 30, 'SAASNEW': 15, 'INVESTORFREE': 100 }
      const matched = fallbacks[couponCode.toUpperCase()]
      if (matched !== undefined) {
        setDiscountPercent(matched)
        setActiveCoupon(couponCode.toUpperCase())
        toast.success('Coupon Applied (Offline)!', `You received a ${matched}% discount!`)
      } else {
        setCouponError('Invalid coupon code')
      }
    }
  }

  const handleSelectPlan = async (planId: string) => {
    if (!currentUser) {
      toast.info('Sign In Required', 'Please register or log in to select a plan.')
      navigate('/login')
      return
    }

    if (planId === 'Free') {
      toast.info('Free Plan Active', 'You are already on the Free tier.')
      return
    }

    try {
      const res = await fetch('http://localhost:4000/api/v1/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId,
          billingCycle,
          couponCode: activeCoupon
        })
      })
      const data = await res.json()
      if (res.ok && data.redirectUrl) {
        // Redirect user to the mock Stripe payment portal link
        window.location.href = data.redirectUrl
      } else {
        toast.error('Checkout Failed', data.error || 'Failed to initiate billing session')
      }
    } catch {
      // Fallback checkout mock link
      const price = billingCycle === 'yearly'
        ? plans.find(p => p.id === planId)!.priceYearly
        : plans.find(p => p.id === planId)!.priceMonthly
      const finalPrice = Math.round(price * (1 - discountPercent / 100))
      window.location.href = `http://localhost:5173/settings/billing?mock_checkout=true&plan=${planId}&cycle=${billingCycle}&price=${finalPrice}`
    }
  }

  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Pricing Plans built for Scaling</h1>
          <p className="text-[13px] md:text-[15px] text-[var(--text-2)] leading-relaxed">
            Select a plan that fits your execution frequency. Switch tiers or cancel billing subscriptions anytime.
          </p>

          {/* Cycle Toggle */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <span className={`text-[12px] font-semibold ${billingCycle === 'monthly' ? 'text-[var(--accent-bright)]' : 'text-[var(--text-3)]'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="w-10 h-6 rounded-full bg-[var(--bg-3)] border border-[var(--border-3)] relative flex items-center p-0.5 transition-colors focus:outline-none"
            >
              <div className={`w-4 h-4 rounded-full bg-[var(--accent)] transition-all ${
                billingCycle === 'yearly' ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
            <span className={`text-[12px] font-semibold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-[var(--accent-bright)]' : 'text-[var(--text-3)]'}`}>
              Yearly <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--success-subtle)] text-[var(--success-bright)]">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 items-stretch">
          {plans.map(plan => {
            const basePrice = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly
            const discount = (basePrice * discountPercent) / 100
            const finalPrice = basePrice - discount

            return (
              <div key={plan.id} className="card p-6 flex flex-col justify-between border-[var(--border-2)] hover:border-[var(--border-3)] transition-colors relative">
                {plan.id === 'Pro' && (
                  <span className="absolute top-[-10px] right-4 bg-[var(--accent)] text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                    POPULAR
                  </span>
                )}
                <div>
                  <h3 className="text-[16px] font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-[11px] text-[var(--text-3)] leading-relaxed mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-extrabold num text-white">
                      ${finalPrice.toLocaleString()}
                    </span>
                    <span className="text-[12px] text-[var(--text-3)]">
                      /{billingCycle === 'yearly' ? 'yr' : 'mo'}
                    </span>
                    {discountPercent > 0 && basePrice > 0 && (
                      <div className="text-[10px] text-[var(--success-bright)] mt-1.5 font-semibold">
                        Discount of {discountPercent}% applied! (Save ${discount.toFixed(0)})
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12px] text-[var(--text-2)]">
                        <Check className="w-3.5 h-3.5 text-[var(--accent-bright)] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-2.5 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                    plan.id === 'Pro' 
                      ? 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-[var(--shadow-accent)]'
                      : 'bg-[var(--bg-3)] hover:bg-[var(--bg-4)] border border-[var(--border-3)] hover:border-[var(--border-4)] text-[var(--text-2)] hover:text-white'
                  }`}
                >
                  {plan.id === 'Free' ? 'Current Plan' : 'Select Plan'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>

        {/* Coupons apply box */}
        <div className="card p-6 max-w-md mx-auto text-center border-[var(--border-3)] mb-16">
          <h4 className="text-[13px] font-bold text-white mb-2">Have a promotion coupon?</h4>
          <p className="text-[11px] text-[var(--text-3)] mb-4">Enter codes (e.g. GLOBALFIT30) to retrieve special subscription deals.</p>
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input 
              type="text" 
              placeholder="GLOBALFIT30" 
              className="input-premium uppercase"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
            />
            <button type="submit" className="px-4 py-1.5 text-[11px] font-bold rounded-lg bg-[var(--bg-4)] hover:bg-[var(--bg-5)] border border-[var(--border-3)] hover:border-[var(--border-4)] text-[var(--text-1)] transition-colors shrink-0">
              Apply
            </button>
          </form>
          {couponError && <p className="text-[11px] text-[var(--danger-bright)] mt-2 font-medium">{couponError}</p>}
          {activeCoupon && <p className="text-[11px] text-[var(--success-bright)] mt-2 font-medium">Active: {activeCoupon} ({discountPercent}% Off)</p>}
        </div>

      </div>
    </div>
  )
}
