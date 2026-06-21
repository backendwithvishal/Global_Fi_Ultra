import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import {
  ArrowRight, Send, CheckCircle, MapPin, Mail, Phone,
  Zap, Users, Globe, TrendingUp, Shield, Cpu, Sparkles,
  BookOpen, Clock, Tag, ExternalLink, Activity,
  Calendar, Code, Database, BarChart3
} from 'lucide-react'
import { PublicNav } from '@/components/common/PublicNav'
import { PublicFooter } from '@/components/common/PublicFooter'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { usersApi } from '@/lib/api'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════════════════ */
export function About() {
  const VALUES = [
    { icon: Zap, title: 'Speed First', desc: 'We obsess over latency. Every millisecond matters when trading decisions hang in the balance.', color: 'text-[var(--accent-bright)]', bg: 'bg-[var(--accent-subtle)]' },
    { icon: Shield, title: 'Data Integrity', desc: 'Big.js precision math ensures every calculation is accurate. No floating-point compromises.', color: 'text-[var(--success-bright)]', bg: 'bg-[var(--success-subtle)]' },
    { icon: Cpu, title: 'AI-Powered', desc: 'We believe AI should augment financial decision-making, not replace human judgment.', color: 'text-[var(--ai-bright)]', bg: 'bg-[var(--ai-subtle)]' },
    { icon: Globe, title: 'Open Standards', desc: 'RESTful APIs, WebSocket streams, and JSON everywhere. No proprietary lock-in.', color: 'text-[var(--warning-bright)]', bg: 'bg-[var(--warning-subtle)]' },
  ]

  const TEAM = [
    { name: 'Alex Rivera', role: 'Founder & CEO', avatar: 'AR', color: 'from-blue-500 to-cyan-400', bio: 'Former HFT engineer at Jump Trading. 12 years in market microstructure.' },
    { name: 'Mia Zhang', role: 'Head of Engineering', avatar: 'MZ', color: 'from-violet-500 to-purple-400', bio: 'Ex-Stripe infrastructure lead. Built payment systems at $50B+ scale.' },
    { name: 'David Okonkwo', role: 'Head of AI Research', avatar: 'DO', color: 'from-emerald-500 to-teal-400', bio: 'PhD Computational Finance. Former researcher at DeepMind and Two Sigma.' },
    { name: 'Sara Kim', role: 'Head of Product', avatar: 'SK', color: 'from-rose-500 to-pink-400', bio: 'Previously led product at Robinhood and Coinbase. Fintech veteran.' },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav />

      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[var(--accent)] opacity-[0.06] blur-[140px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
          <ScrollReveal>
            <span className="section-badge mb-5 inline-flex">
              <Users className="w-3.5 h-3.5" />
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-4 mb-5">
              Built by traders,<br />
              <span className="text-gradient-blue">for developers</span>
            </h1>
            <p className="text-base text-[var(--text-3)] leading-relaxed max-w-2xl mx-auto">
              We were tired of juggling six different financial API subscriptions, managing rate limits,
              and debugging floating-point errors at 3am. So we built Global-Fi Ultra — the infrastructure
              layer we always wished existed.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 border-t border-[var(--border-2)] bg-[var(--bg-1)]">
        <div className="max-w-4xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="card p-8 h-full">
                <h2 className="text-xl font-bold text-white mb-4">The Problem We Solved</h2>
                <p className="text-sm text-[var(--text-3)] leading-relaxed">
                  Managing multiple financial data APIs is a full-time job. Rate limits, inconsistent schemas,
                  upstream failures, floating-point errors, and latency spikes — every integration comes with
                  hidden costs. We consolidated everything into one resilient gateway with AI built in.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="card p-8 h-full">
                <h2 className="text-xl font-bold text-white mb-4">Our Approach</h2>
                <p className="text-sm text-[var(--text-3)] leading-relaxed">
                  Circuit breakers, Redis caching, exponential backoff, Big.js precision math, and Groq AI
                  inference — all working together behind a clean REST and WebSocket interface. Deploy in
                  Docker in 5 minutes, or call our hosted API immediately.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-5">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-3xl font-black text-white mb-3">Our Core Values</h2>
            <p className="text-base text-[var(--text-3)]">The principles that guide every decision we make.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 80}>
                <div className="card p-6 flex items-start gap-4 hover:border-[var(--border-3)] transition-colors">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', v.bg)}>
                    <v.icon className={cn('w-5 h-5', v.color)} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">{v.title}</h3>
                    <p className="text-sm text-[var(--text-3)] leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 border-t border-[var(--border-2)] bg-[var(--bg-1)]">
        <div className="max-w-5xl mx-auto px-5">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-3xl font-black text-white mb-3">The Team</h2>
            <p className="text-base text-[var(--text-3)]">Experienced fintech and infrastructure engineers.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 70}>
                <div className="card p-5 text-center flex flex-col items-center gap-3">
                  <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-lg font-bold', t.color)}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text-1)]">{t.name}</p>
                    <p className="text-xs text-[var(--accent-bright)] font-semibold mb-2">{t.role}</p>
                    <p className="text-xs text-[var(--text-3)] leading-relaxed">{t.bio}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-[var(--border-2)]">
        <div className="max-w-xl mx-auto px-5 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-white mb-4">Join us on our mission</h2>
            <p className="text-sm text-[var(--text-3)] mb-6">We're hiring exceptional engineers, researchers, and product thinkers.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/careers" className="btn-gradient gap-2" style={{ height: '44px', padding: '0 24px', fontSize: '14px' }}>
                View Open Roles <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="btn-secondary" style={{ height: '44px', padding: '0 20px' }}>Contact Us</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════════════════ */
export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', subject: 'sales', message: '' })
  const [sent, setSent] = useState(false)
  const { toast } = useApp()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.name && form.message) {
      setSent(true)
      toast.success('Message Sent!', 'Our team will get back to you within 24 hours.')
    }
  }

  const CONTACTS = [
    { icon: Mail, label: 'General', value: 'hello@globalfi.ultra' },
    { icon: Users, label: 'Sales', value: 'sales@globalfi.ultra' },
    { icon: Shield, label: 'Security', value: 'security@globalfi.ultra' },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <ScrollReveal className="text-center mb-14">
            <h1 className="text-4xl font-black text-white mb-3">Get in touch</h1>
            <p className="text-base text-[var(--text-3)]">Enterprise inquiries, partnerships, or just saying hello — we'd love to hear from you.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <div className="space-y-4">
              {CONTACTS.map((c) => (
                <ScrollReveal key={c.label}>
                  <div className="card p-5 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center shrink-0">
                      <c.icon className="w-4 h-4 text-[var(--accent-bright)]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-0.5">{c.label}</p>
                      <p className="text-sm font-medium text-[var(--text-1)]">{c.value}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
              <ScrollReveal delay={200}>
                <div className="card p-5">
                  <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-3">Response Times</p>
                  <div className="space-y-2">
                    {[
                      { tier: 'Enterprise', time: '< 2 hours' },
                      { tier: 'Pro Plan', time: '< 24 hours' },
                      { tier: 'Free Tier', time: '< 72 hours' },
                    ].map((r) => (
                      <div key={r.tier} className="flex justify-between items-center text-sm">
                        <span className="text-[var(--text-3)]">{r.tier}</span>
                        <span className="font-semibold text-[var(--success-bright)]">{r.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Form */}
            <ScrollReveal delay={100} className="lg:col-span-2">
              <div className="card p-8">
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[var(--success-subtle)] border border-[var(--success-border)] flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-[var(--success-bright)]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Message received!</h3>
                    <p className="text-sm text-[var(--text-3)]">We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSent(false)} className="btn-secondary" style={{ height: '40px', padding: '0 20px', fontSize: '13px' }}>
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-[var(--text-2)] tracking-wide uppercase">Full name *</label>
                        <input className="input-premium text-sm" style={{ height: '42px' }} placeholder="Jane Smith" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-[var(--text-2)] tracking-wide uppercase">Work email *</label>
                        <input type="email" className="input-premium text-sm" style={{ height: '42px' }} placeholder="jane@company.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[var(--text-2)] tracking-wide uppercase">Company</label>
                      <input className="input-premium text-sm" style={{ height: '42px' }} placeholder="Acme Trading Ltd." value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[var(--text-2)] tracking-wide uppercase">Topic</label>
                      <select className="input-premium text-sm" style={{ height: '42px' }} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                        <option value="sales">Enterprise Sales</option>
                        <option value="api">API & Technical</option>
                        <option value="partnership">Partnership</option>
                        <option value="billing">Billing</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[var(--text-2)] tracking-wide uppercase">Message *</label>
                      <textarea
                        required
                        rows={5}
                        className="input-premium text-sm resize-none"
                        style={{ height: 'auto', padding: '12px 14px' }}
                        placeholder="Tell us about your use case, data requirements, or anything else..."
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      />
                    </div>
                    <button type="submit" className="btn-gradient w-full gap-2" style={{ height: '44px', fontSize: '14px' }}>
                      <Send className="w-4 h-4" /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   BLOG PAGE
═══════════════════════════════════════════════════════ */
export function Blog() {
  const [activeTag, setActiveTag] = useState('All')

  const POSTS = [
    { tag: 'Engineering', title: 'Optimizing Redis TTLs for Multi-Source Financial Data', date: 'June 10, 2026', read: '5 min', desc: 'How we leverage multi-tiered cache lifetimes to reduce downstream API costs by 85% without sacrificing freshness.', featured: true, icon: Database },
    { tag: 'AI', title: 'LLaMA 3.3-70B vs 3.1-8B: Benchmarks for Financial NLP', date: 'May 28, 2026', read: '8 min', desc: 'Evaluating token-per-second performance, accuracy, and cost for real-world financial sentiment tasks.', featured: false, icon: Cpu },
    { tag: 'Engineering', title: 'WebSocket Architecture at Scale: Lessons from 40B Events', date: 'May 15, 2026', read: '11 min', desc: 'How we designed our Socket.io infrastructure to handle 40 billion market events per day without dropping a tick.', featured: false, icon: Activity },
    { tag: 'Product', title: 'Circuit Breaker Patterns in Node.js Financial APIs', date: 'April 30, 2026', read: '6 min', desc: "Building fault-tolerant services that gracefully degrade when upstream APIs fail — the patterns we use in production.", featured: false, icon: Shield },
    { tag: 'AI', title: 'Building a Real-Time Sentiment Engine with Groq Streaming', date: 'April 18, 2026', read: '9 min', desc: 'Step-by-step walkthrough of our AI streaming pipeline using Socket.io and Groq token streaming.', featured: false, icon: Sparkles },
    { tag: 'Product', title: 'From REST to Real-Time: Migrating Your Trading Dashboard', date: 'April 5, 2026', read: '7 min', desc: 'A practical guide to adding WebSocket streams to an existing REST-based financial application.', featured: false, icon: BarChart3 },
  ]

  const tags = ['All', 'Engineering', 'AI', 'Product']
  const filtered = activeTag === 'All' ? POSTS : POSTS.filter(p => p.tag === activeTag)

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <ScrollReveal className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="section-badge mb-3 inline-flex">
                  <BookOpen className="w-3.5 h-3.5" />
                  Engineering Blog
                </span>
                <h1 className="text-4xl font-black text-white mt-3">Ideas, insights,<br />and deep dives</h1>
              </div>
              {/* Tag filter */}
              <div className="flex items-center gap-2 flex-wrap">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-xs font-semibold transition-all',
                      activeTag === tag
                        ? 'bg-[var(--accent)] text-white shadow-sm'
                        : 'bg-[var(--bg-2)] border border-[var(--border-2)] text-[var(--text-3)] hover:text-[var(--text-1)]'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Featured post */}
          {filtered.find(p => p.featured) && (
            <ScrollReveal className="mb-8">
              {(() => {
                const p = filtered.find(f => f.featured)!
                return (
                  <a href="#" className="block card p-8 hover:border-[var(--border-3)] transition-colors group">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--accent-subtle)] flex items-center justify-center shrink-0">
                        <p.icon className="w-7 h-7 text-[var(--accent-bright)]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--accent-subtle)] text-[var(--accent-bright)] border border-[rgba(37,99,235,0.2)]">{p.tag}</span>
                          <span className="text-xs text-[var(--text-3)]">{p.date} · {p.read} read</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--warning-subtle)] text-[var(--warning-bright)]">Featured</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--accent-bright)] transition-colors">{p.title}</h2>
                        <p className="text-sm text-[var(--text-3)] leading-relaxed mb-4">{p.desc}</p>
                        <span className="text-sm font-semibold text-[var(--accent-bright)] flex items-center gap-1.5">
                          Read full article <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </a>
                )
              })()}
            </ScrollReveal>
          )}

          {/* Post grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.filter(p => !p.featured).map((post, i) => (
              <ScrollReveal key={post.title} delay={i * 60}>
                <a href="#" className="block card p-6 h-full flex flex-col gap-4 hover:border-[var(--border-3)] transition-colors group">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--bg-3)] text-[var(--text-3)] border border-[var(--border-2)]">{post.tag}</span>
                    <span className="text-xs text-[var(--text-4)]">{post.read} read</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-[var(--accent-bright)] transition-colors">{post.title}</h3>
                    <p className="text-sm text-[var(--text-3)] leading-relaxed">{post.desc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-1)]">
                    <span className="text-xs text-[var(--text-4)]">{post.date}</span>
                    <span className="text-xs font-semibold text-[var(--accent-bright)] flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CHANGELOG PAGE
═══════════════════════════════════════════════════════ */
export function Changelog() {
  const UPDATES = [
    {
      ver: 'v1.3.0', date: 'June 2026', title: 'Dashboard Premium Redesign',
      type: 'major',
      changes: ['Complete UI overhaul with premium design system', 'Animated stats and scroll reveals', 'Mobile-responsive sidebar with collapse', 'New AI chat widget with token streaming']
    },
    {
      ver: 'v1.2.0', date: 'May 2026', title: 'Workspace Multi-Tenancy & Teams',
      type: 'minor',
      changes: ['Organization scopes for watchlists and alerts', 'Role-based membership permissions', 'Stripe billing integration with coupon support']
    },
    {
      ver: 'v1.1.0', date: 'April 2026', title: 'Groq LLM Integration',
      type: 'minor',
      changes: ['Dual-model AI pipeline: 70B + 8B', 'Sentiment, prediction, and portfolio endpoints', 'Redis caching for LLM responses', 'WebSocket AI chat streaming']
    },
    {
      ver: 'v1.0.0', date: 'February 2026', title: 'Initial Release',
      type: 'patch',
      changes: ['6 API sources unified', 'Circuit breaker pattern', 'Redis caching layer', 'WebSocket streaming', 'Docker setup']
    },
  ]

  const TYPE_COLORS: Record<string, string> = {
    major: 'bg-[var(--accent)] text-white',
    minor: 'bg-[var(--ai-subtle)] text-[var(--ai-bright)] border border-[var(--ai-border)]',
    patch: 'bg-[var(--bg-3)] text-[var(--text-3)] border border-[var(--border-2)]',
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav />
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-5">
          <ScrollReveal className="mb-12">
            <span className="section-badge mb-4 inline-flex"><Calendar className="w-3.5 h-3.5" />Product Changelog</span>
            <h1 className="text-4xl font-black text-white mt-3">What's new</h1>
          </ScrollReveal>
          <div className="space-y-6">
            {UPDATES.map((up, i) => (
              <ScrollReveal key={up.ver} delay={i * 80}>
                <div className="card p-6 border-l-4 border-l-[var(--accent)]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full font-mono', TYPE_COLORS[up.type])}>{up.ver}</span>
                    <span className="text-xs text-[var(--text-3)]">{up.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-3">{up.title}</h3>
                  <ul className="space-y-2">
                    {up.changes.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-[var(--text-3)]">
                        <span className="text-[var(--accent-bright)] mt-0.5">+</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   DOCUMENTATION PAGE
═══════════════════════════════════════════════════════ */
export function Documentation() {
  const SECTIONS = [
    { id: 'quickstart', label: 'Quick Start' },
    { id: 'auth', label: 'Authentication' },
    { id: 'financial', label: 'Financial Data' },
    { id: 'websocket', label: 'WebSocket' },
    { id: 'ai', label: 'AI Features' },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav />
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-20 card p-4">
              <p className="section-label mb-3">Navigation</p>
              <nav className="space-y-1">
                {SECTIONS.map(s => (
                  <a key={s.id} href={`#${s.id}`} className="block px-3 py-2 rounded-lg text-sm text-[var(--text-3)] hover:bg-[var(--bg-3)] hover:text-[var(--text-1)] transition-colors">
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3 space-y-10">
            <ScrollReveal>
              <h1 className="text-4xl font-black text-white mb-3">Developer Documentation</h1>
              <p className="text-base text-[var(--text-3)]">Everything you need to integrate Global-Fi Ultra into your application.</p>
            </ScrollReveal>

            <ScrollReveal id="quickstart">
              <div className="card p-6 space-y-4">
                <h2 className="text-xl font-bold text-white">Quick Start</h2>
                <p className="text-sm text-[var(--text-3)]">Get your first live market data response in under 60 seconds.</p>
                <div className="rounded-xl bg-[var(--bg-3)] border border-[var(--border-2)] overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border-2)] bg-[var(--bg-4)]">
                    <Code className="w-3.5 h-3.5 text-[var(--text-3)]" />
                    <span className="text-xs text-[var(--text-3)] font-mono">bash</span>
                  </div>
                  <pre className="p-4 text-xs text-[var(--text-2)] font-mono overflow-x-auto">
{`# Install and run with Docker
git clone https://github.com/globalfi/ultra
cd global-fi-ultra

cp .env.example .env
# Add your API keys to .env

docker-compose up -d

# Test it
curl http://localhost:3000/health
# → {"status":"healthy","features":{"ai":true}}`}
                  </pre>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal id="financial">
              <div className="card p-6 space-y-4">
                <h2 className="text-xl font-bold text-white">Financial Data API</h2>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { method: 'GET', path: '/api/v1/financial/live', desc: 'Fresh data from all upstream APIs (~80ms)' },
                    { method: 'GET', path: '/api/v1/financial/cached', desc: 'Redis-cached data (~5ms response)' },
                    { method: 'GET', path: '/api/v1/status/circuit-breakers', desc: 'Health status of all API connections' },
                  ].map(e => (
                    <div key={e.path} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-3)] border border-[var(--border-1)]">
                      <span className={cn('text-xs font-bold px-2 py-0.5 rounded font-mono shrink-0 mt-0.5', e.method === 'GET' ? 'bg-[var(--success-subtle)] text-[var(--success-bright)]' : 'bg-[var(--accent-subtle)] text-[var(--accent-bright)]')}>{e.method}</span>
                      <span className="text-xs font-mono text-[var(--accent-bright)] flex-1">{e.path}</span>
                      <span className="text-xs text-[var(--text-3)]">{e.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   INTEGRATIONS PAGE
═══════════════════════════════════════════════════════ */
export function Integrations() {
  const ITEMS = [
    { name: 'Stripe Billing', status: 'Connected', desc: 'SaaS subscription management, invoice generation, and payment portals.', icon: '💳' },
    { name: 'Slack Alerts', status: 'Available', desc: 'Push price alerts and circuit breaker events to your team channels.', icon: '💬' },
    { name: 'Discord Webhooks', status: 'Available', desc: 'Forward AI sentiment evaluations and market events to Discord servers.', icon: '🎮' },
    { name: 'PagerDuty', status: 'Coming', desc: 'Automated incident escalation when circuit breakers trip.', icon: '🚨' },
    { name: 'Datadog', status: 'Coming', desc: 'Export metrics, latency histograms, and API health to Datadog.', icon: '📊' },
    { name: 'Grafana', status: 'Available', desc: 'Prometheus-compatible metrics endpoint for custom dashboards.', icon: '📈' },
  ]

  const STATUS_STYLES: Record<string, string> = {
    Connected: 'bg-[var(--success-subtle)] text-[var(--success-bright)] border border-[var(--success-border)]',
    Available: 'bg-[var(--accent-subtle)] text-[var(--accent-bright)] border border-[rgba(37,99,235,0.2)]',
    Coming: 'bg-[var(--bg-3)] text-[var(--text-3)] border border-[var(--border-2)]',
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav />
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <ScrollReveal className="text-center mb-14">
            <h1 className="text-4xl font-black text-white mb-3">Platform Integrations</h1>
            <p className="text-base text-[var(--text-3)]">Connect Global-Fi Ultra to the tools your team already uses.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ITEMS.map((item, i) => (
              <ScrollReveal key={item.name} delay={i * 60}>
                <div className="card p-5 flex flex-col gap-4 h-full hover:border-[var(--border-3)] transition-colors">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{item.icon}</span>
                    <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', STATUS_STYLES[item.status])}>{item.status}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[var(--text-1)] mb-1.5">{item.name}</h3>
                    <p className="text-sm text-[var(--text-3)] leading-relaxed">{item.desc}</p>
                  </div>
                  <button className="btn-secondary w-full" style={{ height: '36px', fontSize: '13px' }}>
                    {item.status === 'Coming' ? 'Notify Me' : 'Configure'}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CAREERS PAGE
═══════════════════════════════════════════════════════ */
export function Careers() {
  const ROLES = [
    { title: 'Staff Backend Engineer', dept: 'Engineering', location: 'Remote · Global', type: 'Full-time', desc: 'Node.js, Redis, distributed systems, and microservices at scale.' },
    { title: 'Senior AI/ML Engineer', dept: 'AI Research', location: 'Remote · Global', type: 'Full-time', desc: 'LLM fine-tuning, financial NLP, and streaming inference pipelines.' },
    { title: 'Frontend Engineer', dept: 'Product', location: 'Remote · Global', type: 'Full-time', desc: 'React, TypeScript, WebSocket UIs, and real-time data visualization.' },
    { title: 'DevOps / Platform Engineer', dept: 'Infrastructure', location: 'Remote · Global', type: 'Full-time', desc: 'Kubernetes, Docker, CI/CD, and cloud infrastructure at scale.' },
  ]

  const PERKS = [
    { icon: '🌍', label: 'Remote-first', desc: 'Work from anywhere in the world' },
    { icon: '💰', label: 'Equity', desc: 'Competitive equity packages' },
    { icon: '🏥', label: 'Health', desc: 'Full medical, dental, vision' },
    { icon: '📚', label: 'Learning', desc: '$2,500/year learning budget' },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-5">
          <ScrollReveal className="text-center mb-14">
            <span className="section-badge mb-4 inline-flex">We're hiring</span>
            <h1 className="text-4xl font-black text-white mt-3 mb-4">
              Build the future of<br />
              <span className="text-gradient-blue">financial intelligence</span>
            </h1>
            <p className="text-base text-[var(--text-3)] max-w-xl mx-auto">
              We're a small team of engineers, researchers, and product people building
              infrastructure that moves markets. Come join us.
            </p>
          </ScrollReveal>

          {/* Perks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {PERKS.map((p, i) => (
              <ScrollReveal key={p.label} delay={i * 60}>
                <div className="card p-4 text-center">
                  <span className="text-2xl block mb-2">{p.icon}</span>
                  <p className="text-sm font-bold text-[var(--text-1)]">{p.label}</p>
                  <p className="text-xs text-[var(--text-3)] mt-1">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Roles */}
          <ScrollReveal className="mb-6">
            <h2 className="text-xl font-bold text-white">Open Positions</h2>
          </ScrollReveal>
          <div className="space-y-3">
            {ROLES.map((role, i) => (
              <ScrollReveal key={role.title} delay={i * 60}>
                <div className="card p-5 flex items-start justify-between gap-4 hover:border-[var(--border-3)] transition-colors group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-[var(--text-1)]">{role.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-[var(--accent-bright)] font-semibold">{role.dept}</span>
                      <span className="text-xs text-[var(--text-3)]">·</span>
                      <span className="text-xs text-[var(--text-3)] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{role.location}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-3)]">{role.desc}</p>
                  </div>
                  <button className="btn-primary shrink-0" style={{ height: '36px', padding: '0 16px', fontSize: '13px' }}>
                    Apply <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400} className="mt-10 text-center">
            <p className="text-sm text-[var(--text-3)]">
              Don't see a fit?{' '}
              <Link to="/contact" className="text-[var(--accent-bright)] hover:text-[var(--accent-hover)] font-semibold">
                Send us your resume →
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PARTNERS PAGE
═══════════════════════════════════════════════════════ */
export function Partners() {
  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav />
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-5">
          <ScrollReveal className="text-center mb-12">
            <h1 className="text-4xl font-black text-white mb-4">Partner Program</h1>
            <p className="text-base text-[var(--text-3)] mb-8">
              Incorporate our unified financial data platform into your products and earn revenue-share commissions.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { title: 'Technology', desc: 'Embed live market data or AI analysis into your software products.', pct: '20% revenue share' },
              { title: 'Reseller', desc: 'Sell Global-Fi Ultra subscriptions to your existing customer base.', pct: '30% first-year revenue' },
              { title: 'Affiliate', desc: 'Refer developers and traders with your unique tracking link.', pct: '$50 per signup' },
            ].map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 80}>
                <div className="card p-6 h-full flex flex-col gap-4">
                  <h3 className="font-bold text-white">{p.title}</h3>
                  <p className="text-sm text-[var(--text-3)] flex-1">{p.desc}</p>
                  <span className="text-sm font-bold text-[var(--success-bright)]">{p.pct}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="text-center">
            <button className="btn-gradient gap-2" style={{ height: '48px', padding: '0 28px', fontSize: '15px' }}>
              Apply as Partner <ArrowRight className="w-4 h-4" />
            </button>
          </ScrollReveal>
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   STATUS PAGE
═══════════════════════════════════════════════════════ */
export function StatusPage() {
  const SERVICES = [
    { name: 'Core Financial API Gateway', status: 'operational', latency: '48ms', uptime: '100%' },
    { name: 'WebSocket Live Streaming Server', status: 'operational', latency: '12ms', uptime: '100%' },
    { name: 'AI Sentiment Inference Engine', status: 'operational', latency: '94ms', uptime: '99.9%' },
    { name: 'Redis Caching Layer', status: 'operational', latency: '2ms', uptime: '100%' },
    { name: 'MongoDB Database', status: 'operational', latency: '8ms', uptime: '99.99%' },
    { name: 'Circuit Breaker Monitoring', status: 'operational', latency: '1ms', uptime: '100%' },
  ]

  const STATUS_COLORS: Record<string, string> = {
    operational: 'text-[var(--success-bright)]',
    degraded: 'text-[var(--warning-bright)]',
    outage: 'text-[var(--danger-bright)]',
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav />
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-5">
          <ScrollReveal className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-3">System Status</h1>
            <p className="text-base text-[var(--text-3)]">Live health status for all Global-Fi Ultra services.</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="card p-5 border-[var(--success-border)] bg-[var(--success-subtle)] mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--success-subtle)] border border-[var(--success-border)] flex items-center justify-center">
                <Activity className="w-4 h-4 text-[var(--success-bright)]" />
              </div>
              <div>
                <p className="font-bold text-[var(--success-bright)]">All Systems Operational</p>
                <p className="text-xs text-[var(--success-bright)] opacity-75">Last checked: just now · Uptime: 99.998%</p>
              </div>
            </div>
          </ScrollReveal>

          <div className="card overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-[var(--border-2)]">
              <h2 className="font-bold text-[var(--text-1)]">Services</h2>
            </div>
            {SERVICES.map((svc, i) => (
              <ScrollReveal key={svc.name} delay={i * 50}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-1)] last:border-0 hover:bg-[var(--bg-3)] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={cn('w-2 h-2 rounded-full pulse-dot', svc.status === 'operational' ? 'bg-[var(--success-bright)]' : 'bg-[var(--danger-bright)]')} />
                    <span className="text-sm text-[var(--text-2)]">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <span className="text-[var(--text-3)]">{svc.latency} avg</span>
                    <span className="text-[var(--text-3)]">{svc.uptime} uptime</span>
                    <span className={cn('font-semibold capitalize', STATUS_COLORS[svc.status])}>{svc.status}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   COMPLIANCE PAGES
═══════════════════════════════════════════════════════ */
export function CompliancePolicy({ type }: { type: 'privacy' | 'terms' | 'cookie' | 'gdpr' }) {
  const { currentUser, token, logout, toast } = useApp()
  const [deleting, setDeleting] = useState(false)

  const TITLES = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cookie: 'Cookie Policy',
    gdpr: 'GDPR Data Compliance',
  }

  const handleGDPRForgetMe = async () => {
    if (!currentUser || !window.confirm('This will permanently delete your account and all data. This cannot be undone.')) return
    setDeleting(true)
    try {
      await usersApi.delete(currentUser._id, {
        headers: { 'X-GDPR-Hard-Delete': 'true' }
      })
      toast.success('Profile Deleted', 'Your data has been permanently removed.')
      logout()
    } catch {
      toast.error('Failed', 'Could not process GDPR delete request.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-1)]">
      <PublicNav />
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-5">
          <ScrollReveal className="mb-8">
            <span className="section-badge mb-4 inline-flex">Legal</span>
            <h1 className="text-3xl font-black text-white mt-3">{TITLES[type]}</h1>
            <p className="text-sm text-[var(--text-3)] mt-2">Last updated: February 11, 2026</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="card p-8 space-y-6">
              <p className="text-sm text-[var(--text-2)] leading-relaxed">
                Global-Fi Ultra enforces strict data isolation protocols. This document outlines our data
                handling practices in compliance with GDPR, CCPA, and other applicable privacy regulations.
              </p>

              {['Data Collection', 'Data Usage', 'Data Retention', 'Your Rights', 'Security Measures'].map((section) => (
                <div key={section} className="border-t border-[var(--border-1)] pt-5">
                  <h3 className="text-base font-bold text-white mb-2">{section}</h3>
                  <p className="text-sm text-[var(--text-3)] leading-relaxed">
                    We collect and process data in accordance with applicable law. Our practices are designed
                    to protect your privacy while enabling us to provide high-quality financial data services.
                    You may exercise your rights at any time by contacting privacy@globalfi.ultra.
                  </p>
                </div>
              ))}

              {type === 'gdpr' && currentUser && (
                <div className="p-5 rounded-xl bg-[var(--danger-subtle)] border border-[var(--danger-border)] space-y-4">
                  <h4 className="font-bold text-[var(--danger-bright)]">Right to Erasure (Art. 17 GDPR)</h4>
                  <p className="text-sm text-[var(--text-2)]">
                    You have the right to request permanent deletion of all your personal data,
                    watchlists, alerts, and authentication records from our systems.
                  </p>
                  <button
                    onClick={handleGDPRForgetMe}
                    disabled={deleting}
                    className="px-5 py-2.5 text-sm font-bold rounded-xl bg-[var(--danger)] hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Processing...' : 'Permanently Delete My Account & Data'}
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}
