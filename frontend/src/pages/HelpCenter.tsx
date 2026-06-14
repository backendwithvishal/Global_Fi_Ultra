import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { ChevronDown, Search, Mail, MessageSquare } from 'lucide-react'

export function HelpCenter() {
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useApp()

  const faqs = [
    {
      q: 'Where does Global-Fi Ultra aggregate its data from?',
      a: 'We combine financial indicators from six primary systems: Alpha Vantage (for stocks and forex), CoinGecko (for cryptocurrency), ExchangeRate-API (for currency pairs), NewsAPI (for headlines), Finnhub (for real-time quotes), and FRED (for US Federal Reserve economic stats).'
    },
    {
      q: 'How does the pricing billing cycle work?',
      a: 'Tiers are billed monthly or annually. Annually subscriptions receive a 20% discount. Upgrades and downgrades take place immediately with pro-rated invoicing credits.'
    },
    {
      q: 'Is there a limit on API Key requests?',
      a: 'Yes, limits are enforced by subscription tiers. Free keys support up to 10 requests per minute. Pro tiers support up to 1000 requests per 15 minutes. Enterprise tiers can customize thresholds.'
    },
    {
      q: 'How does the AI Sentiment analysis compute scores?',
      a: 'We feed financial news headlines and economic date into Groq LLM inference pipelines. The models evaluate keywords, assess sentiment bias (bullish/bearish/neutral), and output confidence scoring.'
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(search.toLowerCase()) ||
    faq.a.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (subject && message) {
      setSubmitted(true)
      setSubject('')
      setMessage('')
      toast.success('Ticket Submitted!', 'Our support engineers will review your request shortly.')
    }
  }

  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Support & Help Center</h1>
          <p className="text-[13px] md:text-[15px] text-[var(--text-2)] max-w-xl mx-auto">
            Search our knowledge base or submit a support ticket directly to our engineering team.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto mt-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
            <input 
              type="text" 
              placeholder="Search knowledge base articles..." 
              className="input-premium pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-20">
          <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={idx} className="card overflow-hidden transition-colors duration-150">
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="text-[13px] font-semibold text-white">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[var(--text-3)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-[12px] text-[var(--text-2)] leading-relaxed border-t border-[var(--border-1)]">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
            {filteredFaqs.length === 0 && (
              <div className="text-center py-6 text-[var(--text-3)]">No FAQ articles match your search criteria.</div>
            )}
          </div>
        </div>

        {/* Submit Ticket */}
        <div className="card p-8 border-[var(--border-3)] max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent-bright)]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-white">Create a Support Ticket</h3>
              <p className="text-[11px] text-[var(--text-3)]">Average response time is less than 2 hours.</p>
            </div>
          </div>

          {submitted ? (
            <div className="p-5 rounded-lg bg-[var(--success-subtle)] border border-[var(--success-border)] text-center">
              <h4 className="text-[13px] font-bold text-[var(--success-bright)] mb-2">Ticket Successfully Created</h4>
              <p className="text-[11px] text-[var(--text-2)] leading-relaxed mb-4">Your ticket ID is #{Math.floor(100000 + Math.random() * 900000)}. We have notified our technical team.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="px-4 py-1.5 text-[11px] font-semibold rounded-lg bg-[var(--bg-3)] border border-[var(--border-2)] text-[var(--text-1)]"
              >
                Create Another Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="section-label mb-2 block">Ticket Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. API Key Rate Limits, WebSocket Disconnection" 
                  className="input-premium"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="section-label mb-2 block">Description of Issue</label>
                <textarea 
                  required
                  placeholder="Please specify error codes, request IDs, or account emails if applicable..." 
                  className="w-full min-h-[120px] p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-2)] focus:border-[var(--accent)] text-[var(--text-1)] text-[13px] outline-none transition-all placeholder-[var(--text-3)]"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[12px] font-bold text-white shadow-[var(--shadow-accent)] transition-all">
                Submit Support Ticket
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
