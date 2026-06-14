import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Mail, Twitter, Github, Linkedin, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const FOOTER_LINKS = {
  Product: [
    { label: 'Features',      href: '/features' },
    { label: 'Pricing',       href: '/pricing' },
    { label: 'Integrations',  href: '/integrations' },
    { label: 'Changelog',     href: '/changelog' },
    { label: 'Roadmap',       href: '/blog' },
  ],
  Company: [
    { label: 'About Us',          href: '/about' },
    { label: 'Blog',              href: '/blog' },
    { label: 'Careers',           href: '/careers' },
    { label: 'Partners',          href: '/partners' },
    { label: 'Affiliate Program', href: '/affiliate' },
  ],
  Developers: [
    { label: 'API Reference',  href: '/docs' },
    { label: 'Documentation',  href: '/docs' },
    { label: 'Status Page',    href: '/status' },
    { label: 'Security',       href: '/security' },
    { label: 'Help Center',    href: '/support' },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy',    href: '/cookie' },
    { label: 'GDPR',             href: '/gdpr' },
  ],
}

const SOCIAL = [
  { icon: Twitter,  href: '#', label: 'Twitter' },
  { icon: Github,   href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail,     href: '/contact', label: 'Contact' },
]

const STATS = [
  { value: '50ms',   label: 'Avg Latency' },
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '40B+',   label: 'Events/day' },
  { value: '6+',     label: 'API Sources' },
]

export function PublicFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer className="border-t border-[var(--border-2)] bg-[var(--bg-1)] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-[var(--accent)] opacity-[0.025] blur-[120px] pointer-events-none" />

      {/* Stats bar */}
      <div className="border-b border-[var(--border-1)] py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold num text-[var(--text-1)] tracking-tight">{s.value}</p>
              <p className="text-xs text-[var(--text-3)] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-muted)] border border-[rgba(37,99,235,0.4)] flex items-center justify-center shadow-[var(--shadow-accent)]">
                <Zap className="w-4 h-4 text-[var(--accent-bright)]" />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[15px] font-bold text-[var(--text-1)]">Global-Fi</span>
                <span className="text-[15px] font-bold text-[var(--accent-bright)]">Ultra</span>
              </div>
            </Link>
            <p className="text-sm text-[var(--text-3)] leading-relaxed mb-6 max-w-[220px]">
              Real-time financial intelligence powered by AI. The unified API gateway for modern traders and developers.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-[var(--border-2)] flex items-center justify-center text-[var(--text-3)] hover:border-[var(--border-3)] hover:text-[var(--text-2)] transition-colors"
                >
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="section-label text-[var(--text-3)] mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="card p-6 mb-10 flex flex-col md:flex-row items-start md:items-center gap-5 justify-between">
          <div>
            <h4 className="text-base font-semibold text-[var(--text-1)] mb-1">Stay ahead of the market</h4>
            <p className="text-sm text-[var(--text-3)]">Weekly market insights and product updates, no spam.</p>
          </div>
          {subscribed ? (
            <div className="px-5 py-2.5 rounded-xl bg-[var(--success-subtle)] border border-[var(--success-border)] text-sm font-medium text-[var(--success-bright)] shrink-0">
              ✓ You're subscribed!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto shrink-0">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-premium h-10 w-full md:w-[220px] text-sm"
                style={{ height: '40px', fontSize: '13px' }}
              />
              <button
                type="submit"
                className="btn-primary shrink-0 gap-1.5"
                style={{ height: '40px', padding: '0 18px', fontSize: '13px' }}
              >
                Subscribe <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[var(--border-1)]">
          <p className="text-xs text-[var(--text-4)]">
            © 2026 Global-Fi Ultra, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success-bright)] animate-pulse" />
            <span className="text-xs text-[var(--text-3)]">All systems operational</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-[var(--text-4)] hover:text-[var(--text-3)] transition-colors">Privacy</Link>
            <Link to="/terms"   className="text-xs text-[var(--text-4)] hover:text-[var(--text-3)] transition-colors">Terms</Link>
            <Link to="/cookie"  className="text-xs text-[var(--text-4)] hover:text-[var(--text-3)] transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
