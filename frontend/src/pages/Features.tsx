import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Shield, Cpu, RefreshCw, BarChart2, Radio, ArrowRight, Check, Globe, Lock, Layers, Activity, ChevronRight } from 'lucide-react'
import { PublicNav } from '@/components/common/PublicNav'
import { PublicFooter } from '@/components/common/PublicFooter'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { cn } from '@/lib/utils'

/* ── Features data ── */
const FEATURES = [
  {
    id: 'websocket',
    icon: Radio,
    label: 'REAL-TIME CONNECTIVITY',
    labelColor: 'text-[var(--accent-bright)]',
    labelBg: 'bg-[var(--accent-subtle)]',
    title: 'WebSocket Streaming Engine',
    desc: 'Connect once and receive live price ticks without polling. Our persistent socket layer pushes market data directly to your client the moment it changes.',
    points: [
      'Price change events with configurable sensitivity thresholds',
      'Circuit breaker state change broadcasts',
      'Dynamic watchlist room join/leave without reconnecting',
      'AI chat streaming with real-time token delivery',
    ],
    code: `const socket = io('wss://api.globalfi.ultra');

socket.emit('join-live-stream', {
  userId: 'u_xyz123',
  assets: ['AAPL', 'BTC', 'EUR/USD']
});

socket.on('financial-data-update', (data) => {
  // Fires every ~50ms per subscribed asset
  console.log(data.symbol, data.price);
});

socket.on('circuit-breaker-state-change', (cb) => {
  console.log(\`\${cb.service} → \${cb.state}\`);
});`,
    flip: false,
  },
  {
    id: 'resilience',
    icon: Shield,
    label: 'ENTERPRISE RESILIENCE',
    labelColor: 'text-[var(--success-bright)]',
    labelBg: 'bg-[var(--success-subtle)]',
    title: 'Smart Cache & Circuit Breaker',
    desc: 'External API failures never reach your users. Our multi-layer resilience system detects faults in milliseconds, falls back to Redis cache, and probes for recovery.',
    points: [
      'Circuit trips automatically after configurable failure thresholds',
      'Half-Open testing cycle probes recovery without traffic flood',
      'Redis TTLs: Crypto 30s · Stocks 60s · News 5min · Economic 1hr',
      'Exponential backoff retry with jitter on API errors',
    ],
    code: `// Check circuit breaker health
GET /api/v1/status/circuit-breakers

{
  "breakers": {
    "alphavantage": {
      "state": "CLOSED",      // healthy
      "failureCount": 0,
      "lastSuccess": "2ms ago"
    },
    "coingecko": {
      "state": "HALF_OPEN",  // recovering
      "nextAttempt": "in 15s"
    },
    "fred": {
      "state": "OPEN",       // offline
      "openedAt": "14:23:01",
      "usingCache": true
    }
  }
}`,
    flip: true,
  },
  {
    id: 'ai',
    icon: Cpu,
    label: 'AI ANALYSIS',
    labelColor: 'text-[var(--ai-bright)]',
    labelBg: 'bg-[var(--ai-subtle)]',
    title: 'Groq Dual-LLM Pipeline',
    desc: 'Two models, one gateway. LLaMA 3.3-70B for complex analysis and recommendations, LLaMA 3.1-8B-Instant for high-volume simple tasks — both at >300 tokens/second.',
    points: [
      'Sentiment scoring with confidence percentages',
      'Portfolio health analysis with risk metrics',
      'Natural language explanations of price movements',
      'Context caching in Redis to prevent rate limit hits',
    ],
    code: `// AI Sentiment Analysis
POST /api/v1/ai/sentiment
{
  "text": "Fed holds rates steady. Markets rally on soft landing hope."
}

// Response
{
  "sentiment": "bullish",
  "confidence": 88,
  "drivers": ["Fed pause", "soft landing narrative"],
  "model": "llama-3.1-8b-instant",
  "latency": "94ms",
  "tokensUsed": 142,
  "cached": false
}`,
    flip: false,
  },
  {
    id: 'precision',
    icon: Activity,
    label: 'FINANCIAL PRECISION',
    labelColor: 'text-[var(--warning-bright)]',
    labelBg: 'bg-[var(--warning-subtle)]',
    title: 'Big.js Precision Math',
    desc: 'Every financial calculation uses Big.js — no floating-point drift, no rounding surprises. Your P&L calculations are accurate to the cent, every time.',
    points: [
      'Eliminates 0.1 + 0.2 = 0.30000000004 class errors',
      'Precise percentage changes on micro-cap assets',
      'Consistent cross-currency conversion accuracy',
      'Domain Value Objects: Money + Percentage classes',
    ],
    code: `import Big from 'big.js';

// Traditional JS float error:
0.1 + 0.2  // → 0.30000000000000004

// Global-Fi precision:
const price = new Big('148.90');
const change = new Big('1.25');

const newPrice = price.plus(change);  // → 150.15
const pct = change.div(price).times(100).round(4);
// → 0.8394 (exact)`,
    flip: true,
  },
]

/* ── API Stats ── */
const API_SOURCES = [
  { name: 'Alpha Vantage', type: 'Stocks & Forex', latency: '~80ms', free: '25 req/day' },
  { name: 'CoinGecko', type: 'Cryptocurrency', latency: '~60ms', free: 'Unlimited' },
  { name: 'ExchangeRate-API', type: 'Forex Pairs', latency: '~45ms', free: '1500 req/mo' },
  { name: 'NewsAPI', type: 'Financial News', latency: '~120ms', free: '100 req/day' },
  { name: 'FRED', type: 'Economic Data', latency: '~200ms', free: 'Unlimited' },
  { name: 'Finnhub', type: 'Real-Time Market', latency: '~35ms', free: '60 calls/min' },
]

export function Features() {
  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav />

      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.06] blur-[130px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
          <ScrollReveal>
            <span className="section-badge mb-5 inline-flex">
              <Layers className="w-3.5 h-3.5" />
              Platform Capabilities
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-4 mb-5">
              One API gateway.<br />
              <span className="text-gradient-blue">Infinite financial intelligence.</span>
            </h1>
            <p className="text-base text-[var(--text-3)] leading-relaxed mb-8">
              Global-Fi Ultra unifies six institutional-grade financial APIs into a single,
              sub-50ms endpoint with built-in AI, caching, and fault tolerance.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['50ms latency', 'AI-powered', '99.99% uptime', '6 API sources', 'WebSocket streams'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--bg-2)] border border-[var(--border-2)] text-[var(--text-2)]">
                  {tag}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Feature sections */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-5 space-y-24 mb-24">
          {FEATURES.map((feat, idx) => (
            <div key={feat.id} className={cn('grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center', feat.flip && 'lg:grid-flow-dense')}>
              <ScrollReveal direction={feat.flip ? 'left' : 'right'} className={feat.flip ? 'lg:col-start-2' : ''}>
                <div>
                  <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5', feat.labelBg)}>
                    <feat.icon className={cn('w-3.5 h-3.5', feat.labelColor)} />
                    <span className={feat.labelColor}>{feat.label}</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-white mb-4">{feat.title}</h2>
                  <p className="text-base text-[var(--text-3)] leading-relaxed mb-6">{feat.desc}</p>
                  <ul className="space-y-3">
                    {feat.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[var(--bg-3)] border border-[var(--border-2)] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-[var(--accent-bright)]" />
                        </div>
                        <span className="text-sm text-[var(--text-2)]">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal direction={feat.flip ? 'right' : 'left'} delay={150} className={feat.flip ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <div className="card-raised overflow-hidden" style={{ boxShadow: 'var(--shadow-float)' }}>
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-2)] bg-[var(--bg-3)]">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[var(--danger-bright)] opacity-70" />
                      <span className="w-3 h-3 rounded-full bg-[var(--warning-bright)] opacity-70" />
                      <span className="w-3 h-3 rounded-full bg-[var(--success-bright)] opacity-70" />
                    </div>
                    <span className="text-xs text-[var(--text-3)] font-mono ml-2">terminal</span>
                  </div>
                  <pre className="p-5 text-xs text-[var(--text-2)] font-mono leading-relaxed overflow-x-auto bg-[var(--bg-2)] scrollbar-none">
                    <code>{feat.code.split('\n').map((line, i) => {
                      // Syntax-color key tokens
                      const colored = line
                        .replace(/(\/\/.*)$/, '<span class="text-[var(--text-3)]">$1</span>')
                      return <span key={i} dangerouslySetInnerHTML={{ __html: colored }} className="block" />
                    })}</code>
                  </pre>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>

      {/* Data sources */}
      <section className="py-20 border-t border-[var(--border-2)] bg-[var(--bg-1)]">
        <div className="max-w-5xl mx-auto px-5">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Six APIs. One integration.</h2>
            <p className="text-base text-[var(--text-3)]">We maintain all the API relationships so you don't have to.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {API_SOURCES.map((src, i) => (
              <ScrollReveal key={src.name} delay={i * 60}>
                <div className="card p-5 flex items-start gap-4 hover:border-[var(--border-3)] transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-[var(--accent-bright)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--text-1)]">{src.name}</p>
                    <p className="text-xs text-[var(--text-3)] mb-2">{src.type}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--success-bright)] bg-[var(--success-subtle)] border border-[var(--success-border)] px-2 py-0.5 rounded-full font-semibold">{src.latency}</span>
                      <span className="text-xs text-[var(--text-3)]">Free: {src.free}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-[var(--border-2)]">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-black text-white mb-4">Ready to build?</h2>
            <p className="text-base text-[var(--text-3)] mb-8">
              Generate your API key, run the example, and stream live market data in under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-gradient gap-2" style={{ height: '48px', padding: '0 28px' }}>
                Get API Key Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/docs" className="btn-secondary" style={{ height: '48px', padding: '0 24px' }}>
                Read the docs
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
