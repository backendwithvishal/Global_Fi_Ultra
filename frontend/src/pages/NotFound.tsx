import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, BarChart3, Search, Zap } from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-0)] flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.05] blur-[120px] pointer-events-none animate-[meshPulse_8s_ease-in-out_infinite]" />

      <div className="relative z-10 text-center max-w-lg">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-2.5 mb-10"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-muted)] border border-[rgba(37,99,235,0.4)] flex items-center justify-center shadow-[var(--shadow-accent)]">
            <Zap className="w-4.5 h-4.5 text-[var(--accent-bright)]" />
          </div>
          <span className="text-base font-bold text-[var(--text-1)]">Global-Fi <span className="text-[var(--accent-bright)]">Ultra</span></span>
        </motion.div>

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative inline-block mb-6">
            <p className="text-[120px] font-black num text-gradient-blue leading-none tracking-tighter select-none" style={{ fontSize: 'clamp(80px, 15vw, 120px)' }}>
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 animate-[fadeIn_0.5s_0.6s_both]">
              <div className="w-full h-full rounded-full bg-[var(--accent)] blur-[60px] opacity-10" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
          <p className="text-base text-[var(--text-3)] leading-relaxed mb-10">
            The market data you're looking for doesn't exist or has moved.
            Let's get you back to the dashboard.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <Link to="/" className="btn-gradient gap-2 w-full sm:w-auto" style={{ height: '44px', padding: '0 24px' }}>
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/markets" className="btn-secondary gap-2 w-full sm:w-auto" style={{ height: '44px', padding: '0 24px' }}>
            <BarChart3 className="w-4 h-4" /> Live Markets
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {[
            { label: 'Features', href: '/features' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'API Docs', href: '/docs' },
            { label: 'Help Center', href: '/support' },
          ].map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm text-[var(--text-3)] hover:text-[var(--accent-bright)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
