import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Shield, Cpu, RefreshCw, BarChart2, Radio, ArrowRight } from 'lucide-react'

export function Features() {
  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Core API Capabilities</h1>
          <p className="text-[13px] md:text-[15px] text-[var(--text-2)] leading-relaxed">
            Global-Fi Ultra unifies six financial API systems into a single sub-50ms JSON endpoint.
          </p>
        </div>

        {/* Feature Sections */}
        <div className="space-y-24 mb-24">
          
          {/* Section 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--accent-bright)] mb-4">
                <Radio className="w-4 h-4" /> REAL-TIME CONNECTIVITY
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">WebSocket Stream Engine</h2>
              <p className="text-[12px] text-[var(--text-2)] leading-relaxed mb-6">
                Connect your client dashboards once and stream currency fluctuations and stock ticks without running polling routines. Filter parameters let you select exactly what tickers you want to monitor, saving client processing cycles.
              </p>
              <ul className="space-y-2.5 text-[12px] text-[var(--text-3)]">
                <li className="flex items-center gap-2">✓ Push notifications of price changes</li>
                <li className="flex items-center gap-2">✓ Broadcast of tripped circuit breakers</li>
                <li className="flex items-center gap-2">✓ Dynamic watchlists join/leave rooms</li>
              </ul>
            </div>
            <div className="card p-6 bg-[var(--bg-2)] border-[var(--border-3)]">
              <pre className="text-[11px] text-[var(--text-2)] font-mono leading-relaxed bg-[var(--bg-3)] p-4 rounded-lg overflow-x-auto">
{`const socket = io('ws://api.globalfi.ultra');

socket.emit('join-live-stream', {
  assets: ['AAPL', 'BTC', 'EUR/USD']
});

socket.on('financial-data-update', (data) => {
  console.log('Live Tick:', data);
});`}
              </pre>
            </div>
          </div>

          {/* Section 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="order-last md:order-first card p-6 bg-[var(--bg-2)] border-[var(--border-3)]">
              <pre className="text-[11px] text-[var(--text-2)] font-mono leading-relaxed bg-[var(--bg-3)] p-4 rounded-lg overflow-x-auto">
{`{
  "status": "circuit-breakers",
  "breakers": {
    "alphavantage": { "state": "CLOSED" },
    "coingecko": { "state": "HALF_OPEN" },
    "fred": { "state": "CLOSED" }
  }
}`}
              </pre>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--success-bright)] mb-4">
                <Shield className="w-4 h-4" /> ENTERPRISE RESILIENCE
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Smart Cache & Circuit Breaker</h2>
              <p className="text-[12px] text-[var(--text-2)] leading-relaxed mb-6">
                External rate restrictions or data server dropouts will never freeze your portal. Our smart cache holds data structures using customizable time-to-live settings (Crypto: 30s, News: 10m). When downstreams fail, our circuit breakers redirect requests to fallback arrays instantly.
              </p>
              <ul className="space-y-2.5 text-[12px] text-[var(--text-3)]">
                <li className="flex items-center gap-2">✓ Circuit auto-trips on repeated connection timeouts</li>
                <li className="flex items-center gap-2">✓ Half-Open testing cycle checks for connection recovery</li>
                <li className="flex items-center gap-2">✓ Redis integration eliminates duplicative database hits</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-400 mb-4">
                <Cpu className="w-4 h-4" /> AI ANALYSIS
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Groq Dual-LLM Pipeline</h2>
              <p className="text-[12px] text-[var(--text-2)] leading-relaxed mb-6">
                Parse news indices, verify historical changes, and get portfolio health analysis using ultra-fast Groq LLMs. Our gateway implements a smart routing module: 70B parameters Versatile model for detailed recommendations, and 8B parameters Instant model for simple summaries.
              </p>
              <ul className="space-y-2.5 text-[12px] text-[var(--text-3)]">
                <li className="flex items-center gap-2">✓ Average generation speed of 450 tokens/second</li>
                <li className="flex items-center gap-2">✓ Natural language summary of index movements</li>
                <li className="flex items-center gap-2">✓ Context caching in Redis to prevent API limits</li>
              </ul>
            </div>
            <div className="card p-6 bg-[var(--bg-2)] border-[var(--border-3)] flex flex-col gap-4">
              <div className="p-4 rounded-lg bg-[var(--bg-3)] border border-[var(--border-1)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--ai)]" />
                  <span className="text-[12px] font-bold text-white">Sentiment Summary</span>
                </div>
                <p className="text-[11px] text-[var(--text-2)] leading-relaxed">
                  "Federal interest rates remain flat. Markets predict a 65% probability of a rate cut by September, driving bullish stock moves."
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[var(--text-3)] px-1">
                <span>Model: Llama 3.3 (70B)</span>
                <span>Latency: 120ms</span>
              </div>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="card p-8 text-center bg-gradient-to-br from-[var(--bg-2)] to-[var(--bg-3)] border-[var(--border-3)]">
          <h3 className="text-xl font-bold text-white mb-3">Ready to build your next financial platform?</h3>
          <p className="text-[13px] text-[var(--text-2)] mb-6 max-w-lg mx-auto">Create a developer profile, generate secure API keys, and start queries in less than five minutes.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[12px] font-bold text-white shadow-[var(--shadow-accent)] transition-all">
            Get Developer Token <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  )
}
