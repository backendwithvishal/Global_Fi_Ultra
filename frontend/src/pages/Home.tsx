import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Zap, ArrowRight, Sparkles, Shield, BarChart3, TrendingUp,
  TrendingDown, Check, ChevronDown, Play, Globe, Cpu, Radio,
  Lock, Layers, Activity, Star, Quote
} from 'lucide-react'
import { PublicNav } from '@/components/common/PublicNav'
import { PublicFooter } from '@/components/common/PublicFooter'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { cn } from '@/lib/utils'

/* ── Mock market data ── */
const MARKET_DATA = {
  stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: 1.25, up: true, sparkline: [182, 184, 183, 186, 185, 187, 188, 189] },
    { symbol: 'MSFT', name: 'Microsoft', price: 415.60, change: -0.45, up: false, sparkline: [418, 417, 416, 418, 417, 415, 416, 415] },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 924.10, change: 4.80, up: true, sparkline: [880, 890, 895, 905, 910, 915, 920, 924] },
  ],
  crypto: [
    { symbol: 'BTC', name: 'Bitcoin', price: 68420.50, change: 2.15, up: true, sparkline: [65000, 66000, 65500, 67000, 67500, 68000, 68200, 68420] },
    { symbol: 'ETH', name: 'Ethereum', price: 3850.80, change: 1.85, up: true, sparkline: [3700, 3750, 3720, 3780, 3800, 3820, 3840, 3850] },
    { symbol: 'SOL', name: 'Solana', price: 148.90, change: -1.10, up: false, sparkline: [155, 153, 151, 152, 150, 149, 148, 148] },
  ],
  forex: [
    { symbol: 'EUR/USD', name: 'Euro / Dollar', price: 1.0842, change: 0.12, up: true, sparkline: [1.08, 1.081, 1.082, 1.083, 1.082, 1.084, 1.084, 1.0842] },
    { symbol: 'GBP/USD', name: 'Pound / Dollar', price: 1.2735, change: 0.08, up: true, sparkline: [1.27, 1.271, 1.272, 1.272, 1.273, 1.273, 1.274, 1.2735] },
    { symbol: 'USD/JPY', name: 'Dollar / Yen', price: 156.24, change: -0.05, up: false, sparkline: [156.5, 156.4, 156.3, 156.35, 156.28, 156.25, 156.24, 156.24] },
  ],
}

/* ── Features bento data ── */
const FEATURES = [
  {
    icon: Radio,
    color: 'text-[var(--accent-bright)]',
    bg: 'bg-[var(--accent-subtle)]',
    title: 'WebSocket Streaming',
    desc: 'Sub-50ms live market ticks pushed to your frontend — no polling.',
    large: false,
  },
  {
    icon: Cpu,
    color: 'text-[var(--ai-bright)]',
    bg: 'bg-[var(--ai-subtle)]',
    title: 'AI-Powered Analysis',
    desc: 'Groq LLaMA 3.3 (70B) for sentiment, predictions & portfolio health scoring at 450 tokens/s.',
    large: true,
  },
  {
    icon: Shield,
    color: 'text-[var(--success-bright)]',
    bg: 'bg-[var(--success-subtle)]',
    title: 'Circuit Breaker',
    desc: 'Automatic API failure detection with Redis-cached fallback. Zero downtime.',
    large: false,
  },
  {
    icon: Globe,
    color: 'text-[var(--warning-bright)]',
    bg: 'bg-[var(--warning-subtle)]',
    title: '6 Unified API Feeds',
    desc: 'Alpha Vantage, CoinGecko, Finnhub, FRED, NewsAPI & ExchangeRate all in one clean endpoint.',
    large: false,
  },
  {
    icon: Lock,
    color: 'text-[var(--danger-bright)]',
    bg: 'bg-[var(--danger-subtle)]',
    title: 'Enterprise Security',
    desc: 'Rate limiting, JWT authentication, CORS policies, and audit logging built-in.',
    large: false,
  },
  {
    icon: Layers,
    color: 'text-[var(--accent-bright)]',
    bg: 'bg-[var(--accent-subtle)]',
    title: 'Financial Precision',
    desc: 'Big.js eliminates floating-point errors. Every cent accounted for.',
    large: false,
  },
]

/* ── Testimonials ── */
const TESTIMONIALS = [
  {
    name: 'Sarah Jenkins',
    role: 'Head of Trading',
    company: 'CapitalV Markets',
    avatar: 'SJ',
    color: 'from-blue-500 to-cyan-400',
    quote: 'Global-Fi Ultra solved our API scaling issues overnight. Moving from raw exchange feeds to their single gateway took two days and cut latency by 40%. The circuit breaker alone saved us three incidents in the first week.',
    stars: 5,
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    company: 'CoinGrid LLC',
    avatar: 'MC',
    color: 'from-violet-500 to-purple-400',
    quote: 'The AI news sentiment analysis is remarkably accurate. It predicts volume spikes with astonishing consistency. We integrated the WebSocket streams in an afternoon — the documentation is excellent.',
    stars: 5,
  },
  {
    name: 'Priya Nath',
    role: 'Quant Developer',
    company: 'Finnovate Capital',
    avatar: 'PN',
    color: 'from-emerald-500 to-teal-400',
    quote: 'We replaced five different API subscriptions with Global-Fi Ultra. Saved 60% on infrastructure costs and our team\'s time. The Redis caching strategy is brilliant — our dashboard feels instant.',
    stars: 5,
  },
]

/* ── Pricing preview ── */
const PRICING_PREVIEW = [
  {
    name: 'Free',
    price: 0,
    desc: 'Perfect for exploration',
    features: ['Live market data', '1 watchlist', '3 AI calls/day', 'Basic dashboard'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 79,
    desc: 'For serious traders',
    features: ['Real-time WebSocket streams', 'Unlimited watchlists', '500 AI analyses/mo', 'FRED economic data', 'API developer gateway'],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 299,
    desc: 'For trading organizations',
    features: ['Custom sub-ms feeds', 'SSO/SAML auth', 'Audit logs', 'Unlimited AI & API keys', '24/7 dedicated support'],
    cta: 'Contact Sales',
    highlight: false,
  },
]

/* ── FAQ ── */
const FAQ_ITEMS = [
  {
    q: 'How quickly can I start receiving live market data?',
    a: 'In under 5 minutes. Create an account, generate an API key, and make your first request. Our WebSocket connection example is copy-paste ready. The free tier requires no credit card.'
  },
  {
    q: 'What happens if one of the upstream APIs goes down?',
    a: 'Our circuit breaker pattern automatically detects failures and redirects to Redis-cached data. Stock data is cached for 60 seconds, news for 5 minutes, and economic data for an hour. You\'ll always get a response.'
  },
  {
    q: 'How does the Groq AI integration work?',
    a: 'We use a dual-model strategy: the 70B LLaMA 3.3 Versatile model for complex analysis like portfolio recommendations, and the 8B Instant model for quick tasks like sentiment scoring. Both run at 280-560 tokens/second with responses caching automatically in Redis.'
  },
  {
    q: 'Is the financial data accurate enough for trading decisions?',
    a: 'Yes. We use Big.js for all calculations to eliminate floating-point errors. Data is sourced from institutional-grade providers including Alpha Vantage, Finnhub, and the Federal Reserve\'s FRED database.'
  },
  {
    q: 'Can I self-host Global-Fi Ultra?',
    a: 'Absolutely. The complete open-source stack runs via Docker Compose. One command spins up the API server, MongoDB, Redis, and RabbitMQ. See our documentation for deployment guides.'
  },
  {
    q: 'What\'s included in the Enterprise plan?',
    a: 'Everything in Pro, plus custom sub-millisecond feed configurations, SSO/SAML team authentication, full audit log history, unlimited developer API keys, white-label options, and a dedicated technical account manager.'
  },
]

/* ── Mini Sparkline ── */
function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 64, h = 28

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={up ? 'var(--success-bright)' : 'var(--danger-bright)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── FAQ Item ── */
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <ScrollReveal delay={index * 60}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left group"
        aria-expanded={open}
      >
        <div className={cn(
          'rounded-xl border transition-all duration-200 overflow-hidden',
          open
            ? 'border-[var(--border-3)] bg-[var(--bg-2)]'
            : 'border-[var(--border-2)] bg-[var(--bg-2)] hover:border-[var(--border-3)] hover:bg-[var(--bg-3)]'
        )}>
          <div className="flex items-center justify-between px-6 py-4 gap-4">
            <span className="text-sm font-semibold text-[var(--text-1)] text-left">{q}</span>
            <ChevronDown className={cn('w-4 h-4 shrink-0 text-[var(--text-3)] transition-transform duration-200', open && 'rotate-180')} />
          </div>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-sm text-[var(--text-3)] leading-relaxed">{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </ScrollReveal>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════════════════ */

export function Home() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'stocks' | 'crypto' | 'forex'>('stocks')
  const [tickerItems] = useState(() => [...MARKET_DATA.stocks, ...MARKET_DATA.crypto, ...MARKET_DATA.forex])

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav transparent />

      {/* ═══════════════════════
          HERO SECTION
      ═══════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-[62px]">
        {/* Animated mesh background */}
        <div className="absolute inset-0 bg-grid opacity-[0.35] pointer-events-none" />
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-[var(--accent)] opacity-[0.08] blur-[140px] pointer-events-none animate-[meshPulse_10s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-[var(--ai)] opacity-[0.06] blur-[100px] pointer-events-none animate-[meshPulse_14s_ease-in-out_infinite_reverse]" />
        <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] rounded-full bg-[var(--emerald)] opacity-[0.04] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 section-badge mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Introducing AI Market Pro with Groq LLaMA 3.3</span>
            <span className="text-[var(--text-3)]">·</span>
            <span className="text-[var(--text-3)] text-[11px]">Read more →</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-hero font-black tracking-[-0.04em] text-white mb-6"
          >
            Financial Intelligence,{' '}
            <span className="text-gradient-blue">Powered by AI</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[var(--text-2)] max-w-2xl mx-auto leading-relaxed mb-10"
          >
            A unified SaaS gateway delivering real-time stocks, crypto, and forex
            with Groq-powered AI analysis, circuit breakers, and sub-50ms latency.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Link to="/register" className="btn-gradient gap-2 text-base" style={{ height: '52px', padding: '0 32px' }}>
              Start Free — No Card Needed <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary text-base"
              style={{ height: '52px', padding: '0 28px' }}
            >
              Sign In to Console
            </button>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--text-3)] mb-16"
          >
            {['No credit card required', 'Free tier forever', 'Deploy in 5 minutes', 'SOC 2 compliant'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[var(--success-bright)]" />
                {t}
              </span>
            ))}
          </motion.div>

          {/* Interactive market widget */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="card-raised max-w-3xl mx-auto overflow-hidden"
            style={{ boxShadow: 'var(--shadow-float), var(--shadow-glow-blue)' }}
          >
            {/* Widget header */}
            <div className="flex items-center justify-between border-b border-[var(--border-2)] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--accent-bright)]" />
                <span className="text-sm font-semibold">Live Market Preview</span>
                <span className="flex items-center gap-1 text-xs text-[var(--success-bright)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success-bright)] pulse-dot" />
                  Live
                </span>
              </div>
              {/* Tab switcher */}
              <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--bg-3)] border border-[var(--border-2)]">
                {(['stocks', 'crypto', 'forex'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all duration-150',
                      activeTab === tab
                        ? 'bg-[var(--accent)] text-white shadow-sm'
                        : 'text-[var(--text-3)] hover:text-[var(--text-2)]'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Asset rows */}
            <div className="divide-y divide-[var(--border-1)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {MARKET_DATA[activeTab].map((asset) => (
                    <div key={asset.symbol} className="flex items-center justify-between px-5 py-4 hover:bg-[var(--bg-3)] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold',
                          asset.up ? 'bg-[var(--success-subtle)] text-[var(--success-bright)]' : 'bg-[var(--danger-subtle)] text-[var(--danger-bright)]'
                        )}>
                          {asset.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--text-1)]">{asset.symbol}</p>
                          <p className="text-xs text-[var(--text-3)]">{asset.name}</p>
                        </div>
                      </div>
                      <Sparkline data={asset.sparkline} up={asset.up} />
                      <div className="text-right">
                        <p className="text-sm font-bold num text-[var(--text-1)]">
                          ${typeof asset.price === 'number' && asset.price > 1000
                            ? asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })
                            : asset.price.toFixed(4)
                          }
                        </p>
                        <span className={cn(
                          'inline-flex items-center gap-0.5 text-xs font-semibold',
                          asset.up ? 'text-[var(--success-bright)]' : 'text-[var(--danger-bright)]'
                        )}>
                          {asset.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {asset.up ? '+' : ''}{asset.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[var(--border-1)] flex items-center justify-between">
              <span className="text-xs text-[var(--text-3)]">Powered by Alpha Vantage · CoinGecko · Finnhub</span>
              <Link to="/markets" className="text-xs font-semibold text-[var(--accent-bright)] hover:text-[var(--accent-hover)] flex items-center gap-1">
                Full dashboard <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[var(--text-4)]">Scroll to explore</span>
          <ChevronDown className="w-4 h-4 text-[var(--text-4)] animate-bounce" />
        </motion.div>
      </section>

      {/* ═══════════════════════
          TICKER TAPE
      ═══════════════════════ */}
      <div className="border-y border-[var(--border-2)] bg-[var(--bg-1)] py-3 overflow-hidden">
        <div className="flex ticker-track whitespace-nowrap gap-8" style={{ width: 'max-content' }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0 px-4">
              <span className="text-xs font-bold text-[var(--text-2)]">{item.symbol}</span>
              <span className="text-xs num text-[var(--text-1)]">
                ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </span>
              <span className={cn('text-xs font-semibold', item.up ? 'text-[var(--success-bright)]' : 'text-[var(--danger-bright)]')}>
                {item.up ? '▲' : '▼'} {Math.abs(item.change)}%
              </span>
              <span className="text-[var(--border-3)]">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════
          STATS SECTION
      ═══════════════════════ */}
      <section className="py-20 border-b border-[var(--border-2)] bg-[var(--bg-1)]">
        <div className="max-w-5xl mx-auto px-5">
          <ScrollReveal className="text-center mb-12">
            <p className="section-label text-[var(--accent-bright)] mb-3">By the numbers</p>
            <h2 className="text-3xl font-bold text-white">Built for institutional speed</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Average Latency', suffix: 'ms', to: 50, decimals: 0 },
              { label: 'Service Uptime', suffix: '%', to: 99.99, decimals: 2 },
              { label: 'Events Synced', suffix: 'B+', to: 40, decimals: 0 },
              { label: 'API Sources', suffix: '+', to: 6, decimals: 0 },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 80} className="text-center">
                <div className="text-4xl font-black num tracking-tight text-white mb-2">
                  <AnimatedCounter to={stat.to} decimals={stat.decimals} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-[var(--text-3)]">{stat.label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════
          LOGO CLOUD
      ═══════════════════════ */}
      <section className="py-16 border-b border-[var(--border-2)]">
        <div className="max-w-5xl mx-auto px-5">
          <ScrollReveal className="text-center mb-10">
            <p className="text-sm text-[var(--text-3)]">Powering data for teams at</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
              {['CapitalV', 'CoinGrid', 'Finnovate', 'TradeAxis', 'MarketEdge', 'DataFlux'].map((logo) => (
                <div key={logo} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[var(--bg-4)] flex items-center justify-center">
                    <Zap className="w-3 h-3 text-[var(--text-3)]" />
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-3)] tracking-tight">{logo}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════
          FEATURES BENTO
      ═══════════════════════ */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-5">
          <ScrollReveal className="text-center mb-16">
            <span className="section-badge mb-4 inline-flex">
              <Layers className="w-3.5 h-3.5" />
              Core Capabilities
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white mt-4 mb-4">
              Everything you need to build<br />
              <span className="text-gradient-blue">financial applications</span>
            </h2>
            <p className="text-base text-[var(--text-3)] max-w-xl mx-auto">
              From raw market data to AI-powered insights — one platform, one integration, infinite possibilities.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((feat, i) => (
              <ScrollReveal key={feat.title} delay={i * 70} direction="up">
                <div className={cn(
                  'card-interactive p-6 h-full flex flex-col gap-4 group',
                  feat.large && 'md:col-span-2'
                )}>
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', feat.bg)}>
                    <feat.icon className={cn('w-5 h-5', feat.color)} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-sm text-[var(--text-3)] leading-relaxed">{feat.desc}</p>
                  </div>
                  {feat.large && (
                    <div className="mt-2 p-4 rounded-xl bg-[var(--bg-3)] border border-[var(--border-1)] font-mono text-xs text-[var(--text-2)] leading-relaxed">
                      <span className="text-[var(--ai-bright)]">POST</span> /api/v1/ai/sentiment<br />
                      <span className="text-[var(--text-3)]">{'{'}</span>{' '}
                      <span className="text-[var(--warning-bright)]">"text"</span>
                      <span className="text-[var(--text-3)]">:</span>{' '}
                      <span className="text-[var(--success-bright)]">"Fed rate cut expected..."</span>{' '}
                      <span className="text-[var(--text-3)]">{'}'}</span><br />
                      <br />
                      <span className="text-[var(--text-3)]">→</span>{' '}
                      <span className="text-[var(--success-bright)]">sentiment: "bullish"</span>{' '}
                      <span className="text-[var(--text-3)]">· confidence: 91%</span>
                    </div>
                  )}
                  <div className="mt-auto">
                    <Link to="/features" className="text-xs font-semibold text-[var(--accent-bright)] group-hover:text-[var(--accent-hover)] flex items-center gap-1 transition-colors">
                      Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════
          AI HIGHLIGHT
      ═══════════════════════ */}
      <section className="py-24 border-t border-[var(--border-2)] bg-[var(--bg-1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--ai)] opacity-[0.05] blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="right">
              <span className="section-badge mb-5 inline-flex" style={{ background: 'var(--ai-subtle)', borderColor: 'var(--ai-border)', color: 'var(--ai-bright)' }}>
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Analysis
              </span>
              <h2 className="text-4xl font-black tracking-tight text-white mb-5">
                Market intelligence<br />
                <span className="text-gradient-ai">at the speed of thought</span>
              </h2>
              <p className="text-base text-[var(--text-3)] leading-relaxed mb-8">
                Our Groq integration delivers 450 tokens per second — faster than you can read.
                Get sentiment analysis, price predictions, portfolio health scores, and
                natural language explanations of market movements.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Sentiment analysis of news and social signals',
                  'AI-powered price trend predictions',
                  'Personalized investment recommendations',
                  'Portfolio health scoring with actionable insights',
                  'Real-time WebSocket AI chat streaming',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--ai-subtle)] border border-[var(--ai-border)] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[var(--ai-bright)]" />
                    </div>
                    <span className="text-sm text-[var(--text-2)]">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/features" className="btn-gradient" style={{ height: '44px', padding: '0 24px', fontSize: '14px' }}>
                Explore AI Features <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>

            {/* AI Demo Widget */}
            <ScrollReveal direction="left" delay={200}>
              <div className="card-raised p-0 overflow-hidden" style={{ boxShadow: 'var(--shadow-float), var(--shadow-glow-ai)' }}>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-2)] bg-[var(--bg-3)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--ai-subtle)] border border-[var(--ai-border)] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[var(--ai-bright)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-1)]">AI Market Analyst</p>
                    <p className="text-xs text-[var(--success-bright)] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--success-bright)] pulse-dot" /> Online · Groq LLaMA 3.3
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-[var(--text-3)] bg-[var(--ai-subtle)] px-2 py-1 rounded-full border border-[var(--ai-border)] text-[var(--ai-bright)]">450 tok/s</span>
                </div>

                {/* Messages */}
                <div className="p-5 space-y-4 bg-[var(--bg-2)]">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[var(--accent)] text-white text-sm leading-relaxed">
                      What's the sentiment for NVDA right now?
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[var(--ai-subtle)] border border-[var(--ai-border)] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--ai-bright)]" />
                    </div>
                    <div className="flex-1">
                      <div className="card p-4 text-sm text-[var(--text-2)] leading-relaxed">
                        <span className="text-[var(--success-bright)] font-semibold">Bullish ↑</span> — NVDA sentiment is strongly positive. Key drivers: strong earnings beat (+23% YoY), data center demand at record highs, and positive analyst upgrades from Goldman and JPMorgan.
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-4)] overflow-hidden">
                            <div className="h-full rounded-full bg-[var(--success-bright)] w-[87%] transition-all" />
                          </div>
                          <span className="text-xs font-bold text-[var(--success-bright)]">87% confidence</span>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-4)] mt-1.5 ml-1">Groq · 120ms · llama-3.3-70b-versatile</p>
                    </div>
                  </div>

                  {/* Second user message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[var(--accent)] text-white text-sm leading-relaxed">
                      Should I increase my position?
                    </div>
                  </div>

                  {/* Typing indicator */}
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[var(--ai-subtle)] border border-[var(--ai-border)] flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--ai-bright)]" />
                    </div>
                    <div className="card px-4 py-3 flex items-center gap-1.5">
                      {[0, 0.15, 0.3].map((d, i) => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--ai-bright)] animate-bounce" style={{ animationDelay: `${d}s` }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="px-5 py-4 border-t border-[var(--border-2)] bg-[var(--bg-3)]">
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-2)]">
                    <span className="text-sm text-[var(--text-4)] flex-1">Ask about any market...</span>
                    <button className="btn-primary shrink-0" style={{ height: '28px', padding: '0 12px', fontSize: '12px' }}>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════
          TESTIMONIALS
      ═══════════════════════ */}
      <section className="py-24 border-t border-[var(--border-2)]">
        <div className="max-w-6xl mx-auto px-5">
          <ScrollReveal className="text-center mb-16">
            <span className="section-badge mb-4 inline-flex">
              <Star className="w-3.5 h-3.5" />
              Social Proof
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white mt-4 mb-4">
              Trusted by developers<br />
              <span className="text-gradient-premium">building the future of finance</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100} direction="up">
                <div className="card p-6 h-full flex flex-col gap-5 hover:border-[var(--border-3)] transition-colors">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--warning-bright)] text-[var(--warning-bright)]" />
                    ))}
                  </div>

                  <Quote className="w-8 h-8 text-[var(--border-3)] shrink-0" />

                  <p className="text-sm text-[var(--text-2)] leading-relaxed flex-1 italic">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-3 pt-2 border-t border-[var(--border-1)]">
                    <div className={cn('w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold', t.color)}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-1)]">{t.name}</p>
                      <p className="text-xs text-[var(--text-3)]">{t.role} · {t.company}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════
          PRICING PREVIEW
      ═══════════════════════ */}
      <section className="py-24 border-t border-[var(--border-2)] bg-[var(--bg-1)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-5 relative z-10">
          <ScrollReveal className="text-center mb-14">
            <span className="section-badge mb-4 inline-flex">Pricing</span>
            <h2 className="text-4xl font-black tracking-tight text-white mt-4 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-base text-[var(--text-3)]">Start free. Scale as you grow. No surprises.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {PRICING_PREVIEW.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={i * 80} direction="up">
                <div className={cn(
                  'rounded-2xl p-6 flex flex-col h-full relative',
                  plan.highlight
                    ? 'bg-[var(--accent)] text-white shadow-[var(--shadow-accent)]'
                    : 'card'
                )}>
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-[var(--warning-bright)] text-[var(--bg-0)]">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className={cn('text-lg font-bold mb-1', plan.highlight ? 'text-white' : 'text-[var(--text-1)]')}>{plan.name}</h3>
                  <p className={cn('text-sm mb-5', plan.highlight ? 'text-blue-200' : 'text-[var(--text-3)]')}>{plan.desc}</p>
                  <div className="mb-6">
                    <span className={cn('text-4xl font-black num', plan.highlight ? 'text-white' : 'text-[var(--text-1)]')}>
                      ${plan.price}
                    </span>
                    <span className={cn('text-sm', plan.highlight ? 'text-blue-200' : 'text-[var(--text-3)]')}>/mo</span>
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className={cn('flex items-start gap-2 text-sm', plan.highlight ? 'text-blue-100' : 'text-[var(--text-2)]')}>
                        <Check className={cn('w-4 h-4 shrink-0 mt-0.5', plan.highlight ? 'text-white' : 'text-[var(--accent-bright)]')} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={plan.price === 299 ? '/contact' : '/register'}
                    className={cn(
                      'w-full text-center rounded-xl py-2.5 text-sm font-bold transition-all',
                      plan.highlight
                        ? 'bg-white text-[var(--accent)] hover:bg-blue-50'
                        : 'btn-secondary justify-center'
                    )}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center">
            <Link to="/pricing" className="text-sm text-[var(--accent-bright)] hover:text-[var(--accent-hover)] flex items-center justify-center gap-1.5 font-semibold">
              Compare all plans <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════
          FAQ
      ═══════════════════════ */}
      <section className="py-24 border-t border-[var(--border-2)]">
        <div className="max-w-3xl mx-auto px-5">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-4xl font-black tracking-tight text-white mb-4">
              Frequently asked questions
            </h2>
            <p className="text-base text-[var(--text-3)]">
              Everything you need to know before getting started.
            </p>
          </ScrollReveal>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </div>
          <ScrollReveal delay={400} className="text-center mt-10">
            <p className="text-sm text-[var(--text-3)]">
              Still have questions?{' '}
              <Link to="/support" className="text-[var(--accent-bright)] hover:text-[var(--accent-hover)] font-semibold">
                Contact our team →
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════
          FINAL CTA
      ═══════════════════════ */}
      <section className="py-24 border-t border-[var(--border-2)] bg-[var(--bg-1)] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.3] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.07] blur-[120px] pointer-events-none animate-[meshPulse_8s_ease-in-out_infinite]" />

        <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 section-badge mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              Start in 5 minutes
            </div>
            <h2 className="text-display font-black tracking-tight text-white mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Ready to build the future<br />
              of <span className="text-gradient-blue">financial intelligence?</span>
            </h2>
            <p className="text-base text-[var(--text-2)] leading-relaxed mb-10 max-w-lg mx-auto">
              Join thousands of developers and traders using Global-Fi Ultra to power their applications.
              Free forever. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="btn-gradient gap-2 text-base"
                style={{ height: '56px', padding: '0 36px', fontSize: '16px' }}
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/docs"
                className="btn-secondary text-base"
                style={{ height: '56px', padding: '0 32px' }}
              >
                Read the docs
              </Link>
            </div>
            <p className="text-xs text-[var(--text-4)] mt-6">
              Free tier · No credit card · Deploy in minutes
            </p>
          </ScrollReveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
