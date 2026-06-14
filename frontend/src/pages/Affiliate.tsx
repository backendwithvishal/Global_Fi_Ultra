import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Link2, Award, Users, DollarSign, ArrowRight } from 'lucide-react'

export function Affiliate() {
  const { currentUser, toast } = useApp()
  const [copied, setCopied] = useState(false)

  const referralLink = currentUser
    ? `http://localhost:5173/register?ref=${currentUser._id.substring(0, 8)}`
    : 'http://localhost:5173/register?ref=partner'

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('Link Copied!', 'Share this link to claim your commissions.')
    setTimeout(() => setCopied(false), 2000)
  }

  const referralStats = [
    { label: 'Total Referrals', value: '24 Users', icon: Users, color: 'text-[var(--accent-bright)] bg-[var(--accent-subtle)]' },
    { label: 'Conversion Rate', value: '18.5%', icon: Award, color: 'text-[var(--success-bright)] bg-[var(--success-subtle)]' },
    { label: 'Total Earnings', value: '$120.00', icon: DollarSign, color: 'text-amber-400 bg-amber-900/10' }
  ]

  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Affiliate & Referral Program</h1>
          <p className="text-[13px] md:text-[15px] text-[var(--text-2)] max-w-xl mx-auto">
            Earn 20% recurring monthly commissions by inviting active developers and traders to the platform.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {referralStats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="card p-5 border-[var(--border-2)] flex items-center gap-4 bg-[var(--bg-2)]">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-[var(--text-3)] uppercase tracking-wider font-semibold">{stat.label}</p>
                  <p className="text-[18px] font-bold num text-white mt-1">{stat.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Share Link Card */}
        <div className="card p-8 border-[var(--border-3)] bg-gradient-to-br from-[var(--bg-2)] to-[var(--bg-3)] mb-12">
          <h3 className="text-[15px] font-bold text-white mb-3">Your Unique Partnership Link</h3>
          <p className="text-[12px] text-[var(--text-2)] leading-relaxed mb-6">
            Share this registration link on your blogs, newsletters, or developers panels. Cookies are tracked for up to 60 days.
          </p>

          <div className="flex gap-2">
            <input 
              type="text" 
              readOnly 
              className="input-premium bg-[var(--bg-input)] cursor-text select-all"
              value={referralLink}
            />
            <button 
              onClick={handleCopy}
              className="px-6 h-[36px] text-[12px] font-bold rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <Link2 className="w-3.5 h-3.5" /> {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Payout Details */}
        <div className="card p-6 border-[var(--border-2)]">
          <h3 className="text-[14px] font-bold text-white mb-4">How Payouts Work</h3>
          <ul className="space-y-4 text-[12px] text-[var(--text-2)]">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[var(--bg-3)] border border-[var(--border-2)] flex items-center justify-center text-[10px] font-bold text-[var(--accent-bright)] shrink-0 mt-0.5">1</span>
              <div>
                <strong>A user clicks your link:</strong>
                <p className="text-[11px] text-[var(--text-3)] mt-0.5">We drop a browser cookie that saves your affiliate tag for 60 calendar days.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[var(--bg-3)] border border-[var(--border-2)] flex items-center justify-center text-[10px] font-bold text-[var(--accent-bright)] shrink-0 mt-0.5">2</span>
              <div>
                <strong>They register and subscribe:</strong>
                <p className="text-[11px] text-[var(--text-3)] mt-0.5">When they upgrade from Free to Starter, Pro, or Enterprise, you earn 20% of their billing cost.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[var(--bg-3)] border border-[var(--border-2)] flex items-center justify-center text-[10px] font-bold text-[var(--accent-bright)] shrink-0 mt-0.5">3</span>
              <div>
                <strong>Monthly automatic payouts:</strong>
                <p className="text-[11px] text-[var(--text-3)] mt-0.5">Earnings accumulate and are paid automatically via PayPal or Stripe on the 15th of every month.</p>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}
