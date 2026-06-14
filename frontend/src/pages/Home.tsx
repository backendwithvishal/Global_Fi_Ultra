import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Sparkles, TrendingUp, Shield, ArrowRight, BarChart3, Mail, MessageSquare } from 'lucide-react'

export function Home() {
  const navigate = useNavigate()
  const [newsEmail, setNewsEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [activeAsset, setActiveAsset] = useState('stocks')

  const liveMockPrices = {
    stocks: [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: 1.25, up: true },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.60, change: -0.45, up: false },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 924.10, change: 4.80, up: true }
    ],
    crypto: [
      { symbol: 'BTC', name: 'Bitcoin', price: 68420.50, change: 2.15, up: true },
      { symbol: 'ETH', name: 'Ethereum', price: 3850.80, change: 1.85, up: true },
      { symbol: 'SOL', name: 'Solana', price: 148.90, change: -1.10, up: false }
    ],
    forex: [
      { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0842, change: 0.12, up: true },
      { symbol: 'USD/JPY', name: 'US Dollar / Yen', price: 156.24, change: -0.05, up: false },
      { symbol: 'GBP/USD', name: 'Pound / US Dollar', price: 1.2735, change: 0.08, up: true }
    ]
  }

  const testimonials = [
    { name: 'Sarah Jenkins', role: 'Head of Trading, CapitalV', quote: 'Global-Fi Ultra solved our API scaling issues. Moving from raw exchange feeds to their single gateway took us two days and cut latency by 40%.' },
    { name: 'Michael Chen', role: 'CTO, CoinGrid LLC', quote: 'The AI news impact sentiment analysis endpoint is magical. It predicts volume spikes with astonishing consistency.' }
  ]

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (newsEmail) {
      setSubscribed(true)
      setNewsEmail('')
    }
  }

  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] flex flex-col font-sans">
      
      {/* ── Header / Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-2)] bg-[var(--bg-1)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] border border-[rgba(37,99,235,0.35)] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[var(--accent-bright)]" />
            </div>
            <span className="text-[15px] font-bold tracking-tight">Global-Fi <span className="text-[var(--accent-bright)]">Ultra</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[var(--text-2)]">
            <Link to="/features" className="hover:text-[var(--text-1)] transition-colors">Features</Link>
            <Link to="/pricing" className="hover:text-[var(--text-1)] transition-colors">Pricing</Link>
            <Link to="/support" className="hover:text-[var(--text-1)] transition-colors">Help Center</Link>
            <Link to="/security" className="hover:text-[var(--text-1)] transition-colors">Security</Link>
            <Link to="/affiliate" className="hover:text-[var(--text-1)] transition-colors">Affiliate</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-[13px] font-medium hover:text-[var(--text-1)] transition-colors">Sign In</Link>
            <Link 
              to="/register" 
              className="px-4 py-2 text-[12px] font-semibold rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-[var(--shadow-accent)] text-white transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 md:py-32">
          {/* Subtle grid and accent blur */}
          <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[var(--accent)]/10 blur-[120px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] border border-[rgba(37,99,235,0.2)] text-[11px] font-semibold text-[var(--accent-bright)] mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Introducing AI Market Pro
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
              Financial Intelligence Gateway, <span className="text-gradient-blue">Driven by AI.</span>
            </h1>
            
            <p className="text-[15px] md:text-[18px] text-[var(--text-2)] max-w-2xl mx-auto leading-relaxed mb-10">
              A unified SaaS pipeline delivering stocks, crypto, and forex rates with Groq-powered news sentiment parsing, circuit breakers, and sub-50ms latency.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[13px] font-bold text-white flex items-center justify-center gap-2 shadow-[var(--shadow-accent)] transition-all"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => navigate('/login')} 
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[var(--bg-3)] hover:bg-[var(--bg-4)] border border-[var(--border-2)] text-[13px] font-semibold hover:border-[var(--border-3)] transition-all"
              >
                Sign In to Console
              </button>
            </div>

            {/* Live Interactive Pricing Widget */}
            <div className="max-w-3xl mx-auto card p-6 border-[var(--border-3)] bg-[var(--bg-2)]/80 backdrop-blur-md shadow-[var(--shadow-raised)]">
              <div className="flex items-center justify-between border-b border-[var(--border-2)] pb-4 mb-5">
                <span className="text-[13px] font-semibold">Live Markets Preview</span>
                <div className="flex items-center gap-2 p-0.5 bg-[var(--bg-3)] border border-[var(--border-2)] rounded-lg">
                  {['stocks', 'crypto', 'forex'].map(type => (
                    <button
                      key={type}
                      onClick={() => setActiveAsset(type)}
                      className={`px-3 py-1 rounded text-[11px] font-medium capitalize transition-all ${
                        activeAsset === type ? 'bg-[var(--bg-5)] text-white shadow-sm' : 'text-[var(--text-3)] hover:text-[var(--text-2)]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(liveMockPrices as any)[activeAsset].map((asset: any) => (
                  <div key={asset.symbol} className="p-4 rounded-xl bg-[var(--bg-3)] border border-[var(--border-1)] flex flex-col items-start">
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-[13px] font-bold">{asset.symbol}</span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        asset.up ? 'bg-[var(--success-subtle)] text-[var(--success-bright)]' : 'bg-[var(--danger-subtle)] text-[var(--danger-bright)]'
                      }`}>
                        {asset.up ? '+' : ''}{asset.change}%
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--text-3)] mb-4">{asset.name}</span>
                    <span className="text-[18px] font-bold num text-white">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Row ── */}
        <section className="border-t border-b border-[var(--border-2)] bg-[var(--bg-1)] py-12">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold num text-white mb-2">50ms</p>
              <p className="text-[12px] text-[var(--text-3)]">Average Latency</p>
            </div>
            <div>
              <p className="text-3xl font-bold num text-white mb-2">99.99%</p>
              <p className="text-[12px] text-[var(--text-3)]">Service Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-bold num text-white mb-2">40B+</p>
              <p className="text-[12px] text-[var(--text-3)]">Events Synced</p>
            </div>
            <div>
              <p className="text-3xl font-bold num text-white mb-2">6+</p>
              <p className="text-[12px] text-[var(--text-3)]">API Feeds Unified</p>
            </div>
          </div>
        </section>

        {/* ── Key Features ── */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-white mb-16">Designed for Institutional Speed</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-6 flex flex-col items-start">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent-bright)] mb-6">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-3">AI Sentiment Pipeline</h3>
                <p className="text-[12px] text-[var(--text-2)] leading-relaxed">
                  Real-time sentiment index scores powered by Groq LLMs. Feed queries with raw financial headlines and retrieve instant trend scoring.
                </p>
              </div>

              <div className="card p-6 flex flex-col items-start">
                <div className="w-10 h-10 rounded-lg bg-[var(--success-subtle)] flex items-center justify-center text-[var(--success-bright)] mb-6">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-3">API Circuit Breaker</h3>
                <p className="text-[12px] text-[var(--text-2)] leading-relaxed">
                  Never suffer downstream timeout delays. Our gateways sense external API blocks and fallback instantly to fast Redis-cached stores.
                </p>
              </div>

              <div className="card p-6 flex flex-col items-start">
                <div className="w-10 h-10 rounded-lg bg-purple-900/20 flex items-center justify-center text-purple-400 mb-6">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-3">Real-time Sockets</h3>
                <p className="text-[12px] text-[var(--text-2)] leading-relaxed">
                  Avoid continuous endpoint polling. Join streaming socket structures to push stocks and forex movements directly to frontend apps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-20 bg-[var(--bg-1)] border-t border-[var(--border-2)]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-12">Approved by Developers Worldwide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {testimonials.map((t, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-[var(--bg-2)] border border-[var(--border-2)] flex flex-col justify-between">
                  <p className="text-[12px] text-[var(--text-2)] italic leading-relaxed mb-6">"{t.quote}"</p>
                  <div>
                    <h4 className="text-[13px] font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-[var(--text-3)]">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter Waitlist ── */}
        <section className="py-24 border-t border-[var(--border-2)]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Ahead of the Market</h2>
            <p className="text-[13px] text-[var(--text-2)] mb-8">Subscribe to receive core feature updates, waitlist details, and API documentation upgrades.</p>
            
            {subscribed ? (
              <div className="p-4 rounded-lg bg-[var(--success-subtle)] border border-[var(--success-border)] text-[var(--success-bright)] text-[13px] font-medium">
                Thank you! You have been subscribed successfully.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email address"
                  className="input-premium"
                  value={newsEmail}
                  onChange={e => setNewsEmail(e.target.value)}
                />
                <button type="submit" className="px-6 h-[36px] text-[12px] font-bold rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shrink-0 transition-colors">
                  Join Newsletter
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border-2)] bg-[var(--bg-1)] py-12 text-[12px] text-[var(--text-3)]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-[var(--text-2)] mb-4 uppercase tracking-wider text-[10px]">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="hover:text-[var(--text-1)]">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-[var(--text-1)]">Pricing</Link></li>
              <li><Link to="/integrations" className="hover:text-[var(--text-1)]">Integrations</Link></li>
              <li><Link to="/changelog" className="hover:text-[var(--text-1)]">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-2)] mb-4 uppercase tracking-wider text-[10px]">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-[var(--text-1)]">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--text-1)]">Contact Sales</Link></li>
              <li><Link to="/careers" className="hover:text-[var(--text-1)]">Careers</Link></li>
              <li><Link to="/partners" className="hover:text-[var(--text-1)]">Partners</Link></li>
              <li><Link to="/affiliate" className="hover:text-[var(--text-1)]">Affiliate Program</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-2)] mb-4 uppercase tracking-wider text-[10px]">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-[var(--text-1)]">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[var(--text-1)]">Terms & Service</Link></li>
              <li><Link to="/cookie" className="hover:text-[var(--text-1)]">Cookie Policy</Link></li>
              <li><Link to="/gdpr" className="hover:text-[var(--text-1)]">GDPR Compliance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-2)] mb-4 uppercase tracking-wider text-[10px]">Developer</h4>
            <ul className="space-y-2">
              <li><Link to="/docs" className="hover:text-[var(--text-1)]">API Reference & Docs</Link></li>
              <li><Link to="/security" className="hover:text-[var(--text-1)]">Security Docs</Link></li>
              <li><Link to="/status" className="hover:text-[var(--text-1)]">System Status</Link></li>
              <li><Link to="/support" className="hover:text-[var(--text-1)]">Support Center</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-[var(--border-1)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Global-Fi Ultra. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-[var(--text-1)] flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Contact Sales</Link>
            <Link to="/support" className="hover:text-[var(--text-1)] flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Help Ticket</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
