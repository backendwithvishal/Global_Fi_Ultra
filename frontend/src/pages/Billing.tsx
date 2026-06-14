import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { CreditCard, Calendar, Check, Download, AlertCircle } from 'lucide-react'

export function Billing() {
  const { currentUser, token, setCurrentUser, toast } = useApp()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Verify checkout redirects
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const sessionId = params.get('checkout_session') || params.get('mock_session')
    const plan = params.get('plan')
    const cycle = params.get('cycle') || 'monthly'

    if (sessionId && plan && currentUser) {
      const confirmPayment = async () => {
        try {
          const res = await fetch('http://localhost:4000/api/v1/billing/confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ sessionId, planId: plan, billingCycle: cycle })
          })
          const data = await res.json()
          if (res.ok && data.user) {
            setCurrentUser(data.user)
            toast.success('Billing Upgraded!', `Your subscription was successfully changed to ${plan} tier.`)
            navigate('/settings/billing')
          }
        } catch {
          // Offline verification mockup
          const endPeriod = new Date()
          endPeriod.setMonth(endPeriod.getMonth() + 1)
          const updatedUser = {
            ...currentUser,
            subscriptionTier: plan as any,
            subscriptionStatus: 'active',
            subscriptionPeriodEnd: endPeriod.toISOString()
          }
          setCurrentUser(updatedUser)
          toast.success('Billing Upgraded (Offline)!', `Your subscription was successfully changed to ${plan} tier.`)
          navigate('/settings/billing')
        }
      }
      confirmPayment()
    }
  }, [location.search, currentUser, token, setCurrentUser, navigate, toast])

  // Load invoices list
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!token) return
      try {
        const res = await fetch('http://localhost:4000/api/v1/billing/invoices', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (data.invoices) {
          setInvoices(data.invoices)
        }
      } catch {
        // Offline mock list
        if (currentUser && currentUser.subscriptionTier !== 'Free') {
          setInvoices([
            {
              id: 'inv_mock991',
              date: new Date().toISOString().split('T')[0],
              amount: currentUser.subscriptionTier === 'Pro' ? 79 : 29,
              currency: 'USD',
              status: 'paid'
            }
          ])
        }
      }
    }
    fetchInvoices()
  }, [token, currentUser])

  const handleCancelSub = async () => {
    if (!window.confirm('Are you sure you want to cancel your paid subscription? You will lose access to premium quotas at the end of the billing period.')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:4000/api/v1/billing/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (res.ok && data.user) {
        setCurrentUser(data.user)
        toast.warning('Subscription Cancelled', 'Your subscription will not renew next month.')
      }
    } catch {
      // Offline fallback
      const updatedUser = {
        ...currentUser,
        subscriptionStatus: 'cancelled_at_period_end'
      }
      setCurrentUser(updatedUser as any)
      toast.warning('Subscription Cancelled (Offline)', 'Your subscription will not renew next month.')
    } finally {
      setLoading(false)
    }
  }

  const getTierDetails = () => {
    const tier = currentUser?.subscriptionTier || 'Free'
    const status = currentUser?.subscriptionStatus || 'active'
    const periodEnd = currentUser?.subscriptionPeriodEnd
      ? new Date(currentUser.subscriptionPeriodEnd).toLocaleDateString()
      : 'Never'

    return { tier, status, periodEnd }
  }

  const { tier, status, periodEnd } = getTierDetails()

  return (
    <div className="p-6 space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Billing & Subscription</h1>
        <p className="text-[11px] text-[var(--text-3)]">Manage organization payment configurations, pricing tiers, and invoices history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active plan card */}
        <div className="card p-6 border-[var(--border-3)] bg-gradient-to-br from-[var(--bg-2)] to-[var(--bg-3)] md:col-span-2">
          <h2 className="text-[14px] font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[var(--accent-bright)]" /> Current Subscription Details
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="p-4 rounded-lg bg-[var(--bg-1)] border border-[var(--border-2)] text-center">
              <span className="text-[10px] text-[var(--text-3)] uppercase tracking-wider font-semibold">Active Plan</span>
              <p className="text-[18px] font-bold text-[var(--accent-bright)] mt-1">{tier}</p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--bg-1)] border border-[var(--border-2)] text-center">
              <span className="text-[10px] text-[var(--text-3)] uppercase tracking-wider font-semibold">Renewal Status</span>
              <p className={`text-[13px] font-bold mt-1.5 capitalize ${
                status === 'active' ? 'text-[var(--success-bright)]' : 'text-[var(--warning-bright)]'
              }`}>{status.replace(/_/g, ' ')}</p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--bg-1)] border border-[var(--border-2)] text-center">
              <span className="text-[10px] text-[var(--text-3)] uppercase tracking-wider font-semibold">Expiration Date</span>
              <p className="text-[13px] font-bold text-white mt-1.5 flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[var(--text-3)]" /> {periodEnd}
              </p>
            </div>
          </div>

          {tier !== 'Free' && (
            <div className="flex justify-between items-center border-t border-[var(--border-2)] pt-4">
              <span className="text-[11px] text-[var(--text-3)]">Want to change your plan? <button onClick={() => navigate('/pricing')} className="text-[var(--accent-bright)] hover:underline font-semibold">Compare details</button></span>
              <button 
                onClick={handleCancelSub}
                disabled={loading || status === 'cancelled_at_period_end'}
                className="px-4 py-1.5 text-[11px] font-semibold rounded-lg bg-[var(--danger-subtle)] border border-[var(--danger-border)] hover:bg-[var(--danger-border)]/20 text-[var(--danger-bright)] transition-colors disabled:opacity-50"
              >
                {status === 'cancelled_at_period_end' ? 'Cancelled' : 'Cancel Subscription'}
              </button>
            </div>
          )}

          {tier === 'Free' && (
            <div className="p-4 rounded-lg bg-[var(--bg-1)] border border-[var(--border-1)] flex items-center justify-between">
              <span className="text-[12px] text-[var(--text-2)]">Upgrade to Starter or Pro plan to unlock unlimited socket lines and AI recommendations.</span>
              <button 
                onClick={() => navigate('/pricing')}
                className="px-4 py-2 text-[11px] font-bold rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shrink-0 transition-colors"
              >
                Upgrade Plan
              </button>
            </div>
          )}
        </div>

        {/* Quotas panel */}
        <div className="card p-6 border-[var(--border-2)]">
          <h2 className="text-[14px] font-bold text-white mb-4">Subscription Limits</h2>
          <ul className="space-y-4 text-[12px]">
            <li className="flex justify-between items-center py-2 border-b border-[var(--border-1)]">
              <span className="text-[var(--text-3)]">Custom Watchlists</span>
              <span className="font-bold text-white font-mono">{tier === 'Free' ? '1 Limit' : tier === 'Starter' ? '5 Limits' : 'Unlimited'}</span>
            </li>
            <li className="flex justify-between items-center py-2 border-b border-[var(--border-1)]">
              <span className="text-[var(--text-3)]">Live Price Alerts</span>
              <span className="font-bold text-white font-mono">{tier === 'Free' ? '1 Active' : tier === 'Starter' ? '10 Active' : '99 Active'}</span>
            </li>
            <li className="flex justify-between items-center py-2">
              <span className="text-[var(--text-3)]">AI Recommendations</span>
              <span className="font-bold text-white font-mono">{tier === 'Free' ? '3 / day' : tier === 'Starter' ? '50 / mo' : '500 / mo'}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Invoices List */}
      <div className="card p-6 border-[var(--border-2)]">
        <h2 className="text-[14px] font-bold text-white mb-4">Billing History</h2>
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-3)] flex flex-col items-center gap-2">
            <AlertCircle className="w-5 h-5" /> No invoices match this profile.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-2)] text-[var(--text-3)] pb-2">
                  <th className="py-2">Invoice Code</th>
                  <th className="py-2">Billing Date</th>
                  <th className="py-2">Total Amount</th>
                  <th className="py-2">Payment Status</th>
                  <th className="py-2 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-2)]">
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="border-b border-[var(--border-1)] hover:bg-[var(--bg-3)] transition-colors">
                    <td className="py-3 font-mono">{inv.id}</td>
                    <td className="py-3">{inv.date}</td>
                    <td className="py-3 num font-semibold text-white">${inv.amount}.00 USD</td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[var(--success-subtle)] text-[var(--success-bright)] border border-[var(--success-border)] uppercase">Paid</span>
                    </td>
                    <td className="py-3 text-right">
                      <a href="#" className="inline-flex items-center gap-1 text-[var(--accent-bright)] hover:underline font-semibold">
                        <Download className="w-3 h-3" /> PDF Receipt
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
export default Billing;
