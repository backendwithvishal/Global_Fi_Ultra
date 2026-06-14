import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X, ChevronDown, ArrowRight, BarChart3, Shield, Cpu, Code, TrendingUp, BookOpen, Users, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Mega Menu Products ── */
const PRODUCT_ITEMS = [
  {
    icon: BarChart3,
    color: 'text-[var(--accent-bright)]',
    bg: 'bg-[var(--accent-subtle)]',
    title: 'Live Markets',
    desc: 'Real-time stocks, crypto & forex'
  },
  {
    icon: Cpu,
    color: 'text-[var(--ai-bright)]',
    bg: 'bg-[var(--ai-subtle)]',
    title: 'AI Insights',
    desc: 'Groq LLaMA powered analysis'
  },
  {
    icon: Shield,
    color: 'text-[var(--success-bright)]',
    bg: 'bg-[var(--success-subtle)]',
    title: 'Circuit Breaker',
    desc: 'Resilient multi-API gateway'
  },
  {
    icon: Code,
    color: 'text-[var(--warning-bright)]',
    bg: 'bg-[var(--warning-subtle)]',
    title: 'Developer API',
    desc: 'RESTful + WebSocket endpoints'
  },
]

const COMPANY_ITEMS = [
  { icon: Users, href: '/about', label: 'About Us' },
  { icon: BookOpen, href: '/blog', label: 'Blog' },
  { icon: TrendingUp, href: '/careers', label: 'Careers' },
  { icon: Globe, href: '/partners', label: 'Partners' },
]

interface PublicNavProps {
  transparent?: boolean
}

export function PublicNav({ transparent = false }: PublicNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(null)
  }, [pathname])

  const navBg = transparent && !scrolled && !mobileOpen
    ? 'bg-transparent border-transparent'
    : 'glass border-[var(--border-2)] shadow-[var(--shadow-sm)]'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          'border-b',
          navBg
        )}
      >
        <div className="max-w-7xl mx-auto px-5 h-[62px] flex items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="Global-Fi Ultra home">
            <div className="relative w-8 h-8 rounded-xl bg-[var(--accent-muted)] border border-[rgba(37,99,235,0.4)] flex items-center justify-center shadow-[var(--shadow-accent)] transition-transform duration-200 group-hover:scale-105">
              <Zap className="w-4 h-4 text-[var(--accent-bright)]" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[15px] font-bold tracking-tight text-[var(--text-1)]">Global-Fi</span>
              <span className="text-[15px] font-bold tracking-tight text-[var(--accent-bright)]">Ultra</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center" aria-label="Main navigation">

            {/* Products mega menu */}
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen('products')}
              onMouseLeave={() => setMegaOpen(null)}
            >
              <button
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  megaOpen === 'products'
                    ? 'bg-[var(--bg-3)] text-[var(--text-1)]'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg-3)] hover:text-[var(--text-1)]'
                )}
              >
                Products
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', megaOpen === 'products' ? 'rotate-180' : '')} />
              </button>

              <AnimatePresence>
                {megaOpen === 'products' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[440px] card-raised p-4 rounded-2xl shadow-[var(--shadow-float)]"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {PRODUCT_ITEMS.map((item) => (
                        <Link
                          key={item.title}
                          to="/features"
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg-4)] transition-colors group"
                        >
                          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', item.bg)}>
                            <item.icon className={cn('w-4 h-4', item.color)} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-1)] group-hover:text-white transition-colors">{item.title}</p>
                            <p className="text-xs text-[var(--text-3)] mt-0.5">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-[var(--border-1)] flex items-center justify-between">
                      <span className="text-xs text-[var(--text-3)]">All features →</span>
                      <Link to="/docs" className="text-xs font-semibold text-[var(--accent-bright)] hover:text-[var(--accent-hover)]">API Docs</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink href="/pricing">Pricing</NavLink>

            {/* Company mega menu */}
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen('company')}
              onMouseLeave={() => setMegaOpen(null)}
            >
              <button
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  megaOpen === 'company'
                    ? 'bg-[var(--bg-3)] text-[var(--text-1)]'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg-3)] hover:text-[var(--text-1)]'
                )}
              >
                Company
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', megaOpen === 'company' ? 'rotate-180' : '')} />
              </button>

              <AnimatePresence>
                {megaOpen === 'company' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[200px] card-raised p-2 rounded-2xl shadow-[var(--shadow-float)]"
                  >
                    {COMPANY_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-4)] transition-colors text-sm font-medium text-[var(--text-2)] hover:text-[var(--text-1)]"
                      >
                        <item.icon className="w-4 h-4 text-[var(--text-3)]" />
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink href="/support">Docs</NavLink>
            <NavLink href="/changelog">Changelog</NavLink>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="text-sm font-medium text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="btn-gradient text-sm h-9 px-5 gap-2"
              style={{ height: '36px', fontSize: '13px', padding: '0 18px' }}
            >
              Start Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden p-2 rounded-lg text-[var(--text-2)] hover:bg-[var(--bg-3)] transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[62px] z-40 glass border-b border-[var(--border-2)] p-4 md:hidden"
          >
            <nav className="flex flex-col gap-1 mb-4" aria-label="Mobile navigation">
              {[
                { href: '/features',  label: 'Features' },
                { href: '/pricing',   label: 'Pricing' },
                { href: '/about',     label: 'About' },
                { href: '/blog',      label: 'Blog' },
                { href: '/support',   label: 'Docs & Support' },
                { href: '/changelog', label: 'Changelog' },
                { href: '/careers',   label: 'Careers' },
              ].map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="px-4 py-3 rounded-xl text-[15px] font-medium text-[var(--text-2)] hover:bg-[var(--bg-3)] hover:text-[var(--text-1)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--border-1)]">
              <Link to="/login" className="btn-secondary justify-center">Sign in</Link>
              <Link to="/register" className="btn-gradient justify-center">Get Started Free</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      {!transparent && <div className="h-[62px]" />}
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const { pathname } = useLocation()
  const active = pathname === href || pathname.startsWith(href + '/')
  return (
    <Link
      to={href}
      className={cn(
        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        active
          ? 'bg-[var(--bg-3)] text-[var(--text-1)]'
          : 'text-[var(--text-2)] hover:bg-[var(--bg-3)] hover:text-[var(--text-1)]'
      )}
    >
      {children}
    </Link>
  )
}
