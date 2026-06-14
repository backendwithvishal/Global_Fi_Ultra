import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Info, HelpCircle, Book, Calendar, Shield, Cpu, RefreshCw, Send, CheckCircle, ExternalLink } from 'lucide-react'

// ─── ABOUT PAGE ───
export function About() {
  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Mission</h1>
          <p className="text-[13px] md:text-[15px] text-[var(--text-2)] leading-relaxed">
            We build low-latency gateways that connect developers and active traders directly to financial market intelligence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-6 border-[var(--border-2)]">
            <h3 className="text-[15px] font-bold text-white mb-2">Decoupled Unification</h3>
            <p className="text-[12px] text-[var(--text-3)] leading-relaxed">
              Managing redundant API providers is inefficient. We pipeline stock quotes, economic stats, and crypto updates into one single cached schema.
            </p>
          </div>
          <div className="card p-6 border-[var(--border-2)]">
            <h3 className="text-[15px] font-bold text-white mb-2">Driven by Inference</h3>
            <p className="text-[12px] text-[var(--text-3)] leading-relaxed">
              We leverage sub-100ms LLM calls to translate news streams into immediate sentiment triggers, equipping developers with real-time trading logic.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CONTACT PAGE ───
export function Contact() {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)
  const { toast } = useApp()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && msg) {
      setSent(true)
      toast.success('Message Sent!', 'Our growth team will contact you shortly.')
    }
  }

  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-xl mx-auto card p-8 border-[var(--border-3)]">
        <h1 className="text-2xl font-bold text-white mb-2">Contact Sales & Support</h1>
        <p className="text-[11px] text-[var(--text-3)] mb-6">Have an enterprise inquiry? Fill out the contact form below.</p>
        
        {sent ? (
          <div className="p-4 rounded-lg bg-[var(--success-subtle)] border border-[var(--success-border)] text-[var(--success-bright)] text-center text-[12px] font-semibold">
            Thank you, your message has been sent successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="section-label mb-2 block">Name</label>
              <input type="text" required className="input-premium" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="section-label mb-2 block">Message Details</label>
              <textarea required className="w-full min-h-[100px] p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-2)] text-white text-[13px] outline-none" value={msg} onChange={e => setMsg(e.target.value)} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-white text-[12px] font-bold shadow-[var(--shadow-accent)] flex items-center justify-center gap-1.5">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── BLOG PAGE ───
export function Blog() {
  const posts = [
    { title: 'Optimizing Redis TTLs for Forex Data', date: 'June 10, 2026', read: '5 min read', desc: 'How we leverage multi-tiered cache lifetimes to reduce downstream API fees by 85%.' },
    { title: 'Inference Benchmarks: Llama-3 8B vs 70B', date: 'May 28, 2026', read: '8 min read', desc: 'Evaluating tokens-per-second performance metrics on Groq hardware stacks.' }
  ]
  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-white mb-8">Engineering Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, idx) => (
            <div key={idx} className="card p-6 border-[var(--border-2)] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[var(--text-3)] font-mono uppercase">{post.date} • {post.read}</span>
                <h3 className="text-[16px] font-bold text-white mt-2 mb-3">{post.title}</h3>
                <p className="text-[12px] text-[var(--text-3)] leading-relaxed mb-6">{post.desc}</p>
              </div>
              <a href="#" className="text-[12px] text-[var(--accent-bright)] hover:underline font-semibold flex items-center gap-1">Read Article →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CHANGELOG ───
export function Changelog() {
  const updates = [
    { ver: 'v1.2.0', date: 'June 2026', title: 'Workspace Multi-Tenancy & Teams', changes: ['Organization scopes added to watchlists and alerts', 'Role-based membership permissions introduced', 'Stripe mock invoices and payment checkout redirection'] },
    { ver: 'v1.1.0', date: 'May 2026', title: 'Groq LLM Integration', changes: ['Dual-model prompt parsing structure', 'Cache configurations for LLM outputs', 'Async RabbitMQ messaging queue integrations'] }
  ]
  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-white mb-8">Product Changelog</h1>
        <div className="space-y-8">
          {updates.map((up, idx) => (
            <div key={idx} className="border-l-2 border-[var(--border-3)] pl-6 space-y-3 relative">
              <span className="absolute left-[-6px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent-bright)] text-[10px] font-bold font-mono">{up.ver}</span>
                <span className="text-[11px] text-[var(--text-3)] font-mono">{up.date}</span>
              </div>
              <h3 className="text-[15px] font-bold text-white">{up.title}</h3>
              <ul className="space-y-1 text-[12px] text-[var(--text-2)] list-disc pl-4">
                {up.changes.map((c, cIdx) => <li key={cIdx}>{c}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── DOCUMENTATION ───
export function Documentation() {
  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h4 className="section-label">Getting Started</h4>
          <ul className="space-y-2 text-[12px] text-[var(--text-3)] font-medium">
            <li><a href="#intro" className="text-[var(--accent-bright)]">Quick Start Guide</a></li>
            <li><a href="#auth" className="hover:text-[var(--text-1)]">Authentication Headers</a></li>
            <li><a href="#cache" className="hover:text-[var(--text-1)]">Cache TTL Definitions</a></li>
          </ul>
        </div>
        <div className="md:col-span-3 space-y-8">
          <h1 className="text-3xl font-bold text-white">Developer Documentation</h1>
          <section id="intro" className="card p-6 border-[var(--border-2)] space-y-4">
            <h3 className="text-[15px] font-bold text-white">Quick Start</h3>
            <p className="text-[12px] text-[var(--text-2)] leading-relaxed">
              To query live quotes, send a GET request containing your access token inside the headers context. Responses default to cached Redis payloads.
            </p>
            <pre className="p-3 bg-[var(--bg-3)] border border-[var(--border-1)] rounded-lg font-mono text-[11px] text-[var(--text-3)]">
              GET /api/v1/financial/cached?symbol=AAPL
            </pre>
          </section>
        </div>
      </div>
    </div>
  )
}

// ─── INTEGRATIONS ───
export function Integrations() {
  const integrationsList = [
    { name: 'Stripe Billing', status: 'Connected', desc: 'SaaS subscription credit card captures and invoicing.' },
    { name: 'Slack Alerts', status: 'Available', desc: 'Push price alarms and alarms triggers to channels.' },
    { name: 'Discord Webhooks', status: 'Available', desc: 'Forward AI sentiment evaluations to team servers.' }
  ]
  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-white mb-8">Platform Integrations</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrationsList.map((int, idx) => (
            <div key={idx} className="card p-5 border-[var(--border-2)] flex flex-col justify-between bg-[var(--bg-2)]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-bold text-white">{int.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    int.status === 'Connected' ? 'bg-[var(--success-subtle)] text-[var(--success-bright)]' : 'bg-[var(--bg-4)] text-[var(--text-3)]'
                  }`}>{int.status}</span>
                </div>
                <p className="text-[11px] text-[var(--text-3)] leading-relaxed mb-6">{int.desc}</p>
              </div>
              <button className="w-full py-1.5 text-[11px] font-bold rounded bg-[var(--bg-3)] border border-[var(--border-3)] hover:text-white transition-colors">Configure</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CAREERS ───
export function Careers() {
  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">Careers at Global-Fi</h1>
          <p className="text-[13px] text-[var(--text-2)]">We are looking for builders to scale financial endpoints latency.</p>
        </div>
        <div className="space-y-4">
          <div className="card p-5 border-[var(--border-2)] flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-bold text-white">Staff Backend Engineer</h3>
              <p className="text-[11px] text-[var(--text-3)] mt-1">Remote • Node.js, Redis, Concurrency Architectures</p>
            </div>
            <button className="px-4 py-1.5 rounded-lg bg-[var(--bg-4)] border border-[var(--border-3)] text-[11px] font-bold text-white">Apply Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PARTNERS ───
export function Partners() {
  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-xl mx-auto card p-8 border-[var(--border-3)] text-center space-y-6">
        <h1 className="text-2xl font-bold text-white">Partner Program</h1>
        <p className="text-[12px] text-[var(--text-2)] leading-relaxed">
          Incorporate our unified financial data schemas inside your user interfaces or applications. We offer discount commissions and co-marketing capabilities.
        </p>
        <button className="w-full py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[12px] font-bold rounded-lg transition-colors">
          Apply as Integration Partner
        </button>
      </div>
    </div>
  )
}

// ─── STATUS PAGE ───
export function StatusPage() {
  const statusMeters = [
    { name: 'Core Financial API Gateway', uptime: '100% Online', type: 'success' },
    { name: 'WebSockets Live Streams Server', uptime: '100% Online', type: 'success' },
    { name: 'AI Sentiment Inference Engine', uptime: '100% Online', type: 'success' }
  ]
  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="card p-5 border-[var(--success-border)] bg-[var(--success-subtle)] text-center text-[13px] font-bold text-[var(--success-bright)]">
          ✓ All Systems Operational (Uptime: 99.998%)
        </div>
        <div className="card p-6 border-[var(--border-2)] space-y-4">
          <h3 className="text-[14px] font-bold text-white mb-2">Systems Health</h3>
          <div className="space-y-3">
            {statusMeters.map((meter, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-[var(--border-1)] text-[12px]">
                <span className="text-[var(--text-2)]">{meter.name}</span>
                <span className="flex items-center gap-1.5 text-[var(--success-bright)] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success-bright)] animate-pulse" /> {meter.uptime}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── COMPLIANCE PAGES (Unified Policy Component) ───
export function CompliancePolicy({ type }: { type: 'privacy' | 'terms' | 'cookie' | 'gdpr' }) {
  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cookie: 'Cookie Usage Policy',
    gdpr: 'GDPR Data compliance'
  }

  const { currentUser, token, logout, toast } = useApp()
  const [deleting, setDeleting] = useState(false)

  const handleGDPRForgetMe = async () => {
    if (!currentUser || !window.confirm('WARNING: Clicking this will permanently delete your user profile (GDPR Hard Delete). This action cannot be undone.')) {
      return
    }
    setDeleting(true)
    try {
      const res = await fetch(`http://localhost:4000/api/v1/users/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-GDPR-Hard-Delete': 'true' // Trigger hard delete in UserService if header exists
        }
      })
      if (res.ok) {
        toast.success('Profile Deleted', 'Your profile and data have been permanently removed under GDPR rules.')
        logout()
      }
    } catch {
      toast.error('GDPR Request Failed', 'Could not process GDPR delete request offline.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto card p-8 border-[var(--border-2)] space-y-6">
        <h1 className="text-2xl font-bold text-white border-b border-[var(--border-2)] pb-4">{titles[type]}</h1>
        
        <p className="text-[12px] text-[var(--text-2)] leading-relaxed">
          Last updated: February 11, 2026. Global-Fi Ultra enforces strict data isolation protocols. This compliance document outlines data handling parameters in compliance with regulatory framework guidelines.
        </p>

        {type === 'gdpr' && currentUser && (
          <div className="p-4 rounded-lg bg-[var(--danger-subtle)] border border-[var(--danger-border)] space-y-4">
            <h4 className="text-[13px] font-bold text-[var(--danger-bright)]">GDPR Forget-Me-Right Action</h4>
            <p className="text-[11px] text-[var(--text-2)]">You have the right to request permanent deletion of all your watchlists, alerts, and authentication history from our databases.</p>
            <button 
              onClick={handleGDPRForgetMe}
              disabled={deleting}
              className="px-4 py-2 text-[11px] font-bold rounded-lg bg-[var(--danger)] hover:bg-red-700 text-white transition-colors"
            >
              {deleting ? 'Removing Data...' : 'Permanently Delete My Profile'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
