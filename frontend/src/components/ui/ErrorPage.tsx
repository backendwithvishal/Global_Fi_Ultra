import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════════════════════
   Global-Fi Ultra — Full-page Error / 404 component
   Adapted from watermelon-ui error-3, matched to the design system:
   • bg-0 canvas, brand teal accent, mono font
   • Glitch-split animation on the error code
   • Two CTAs: go back + reload
   • Works for both 404 (NotFound page) and runtime crashes (ErrorBoundary)
═══════════════════════════════════════════════════════════════════════════ */

export interface ErrorPageProps {
  /** "404" | "500" | "503" | any short string */
  code?: string
  title?: string
  description?: string
  /** Label for the primary CTA */
  backLabel?: string
  /** Called when primary CTA is clicked — defaults to window.history.back() */
  onBack?: () => void
  /** Called when retry CTA is clicked — defaults to window.location.reload() */
  onRetry?: () => void
  /** Hide the retry button (e.g. on 404 pages) */
  hideRetry?: boolean
  className?: string
}

export function ErrorPage({
  code        = '404',
  title       = 'Connection Severed',
  description = 'The endpoint you requested has been redacted, moved, or never existed in the main sequence.',
  backLabel   = 'Go Home',
  onBack,
  onRetry,
  hideRetry   = false,
  className,
}: ErrorPageProps) {

  const handleBack  = onBack  ?? (() => { window.location.href = '/' })
  const handleRetry = onRetry ?? (() => { window.location.reload() })

  return (
    <div
      className={cn(
        'relative min-h-screen w-full overflow-hidden bg-[var(--bg-0)]',
        'font-mono selection:bg-teal-500/20',
        className
      )}
    >
      {/* ── Ambient background grid ── */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* ── Radial glow — top-left ── */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)',
        }}
      />
      {/* ── Radial glow — bottom-right ── */}
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)',
        }}
      />

      {/* ── Logo watermark ── */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--accent-muted)] border border-[rgba(37,99,235,0.3)]">
          <Zap className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[12px] font-semibold text-[var(--text-1)] tracking-tight">Global-Fi</span>
          <span className="text-[12px] font-semibold text-[var(--accent-bright)] tracking-tight">Ultra</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl space-y-8 text-center">

          {/* ── Glitch code ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block select-none"
          >
            {/* Ghost outline layer */}
            <h1
              className="text-[96px] md:text-[128px] font-black tracking-tighter text-transparent leading-none"
              style={{ WebkitTextStroke: '1.5px rgba(20,184,166,0.18)' }}
              aria-hidden="true"
            >
              {code}
            </h1>

            {/* Top-half glitch — teal */}
            <motion.h1
              aria-hidden="true"
              animate={{ x: [-3, 3, -3], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 0.18, repeat: Infinity, repeatType: 'mirror' }}
              className="absolute inset-0 text-[96px] md:text-[128px] font-black tracking-tighter text-teal-400 mix-blend-screen leading-none"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 42%, 0 42%)' }}
            >
              {code}
            </motion.h1>

            {/* Bottom-half glitch — cyan offset */}
            <motion.h1
              aria-hidden="true"
              animate={{ x: [3, -3, 3], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 0.28, repeat: Infinity, repeatType: 'mirror' }}
              className="absolute inset-0 text-[96px] md:text-[128px] font-black tracking-tighter text-cyan-400 mix-blend-screen leading-none"
              style={{ clipPath: 'polygon(0 58%, 100% 58%, 100% 100%, 0 100%)' }}
            >
              {code}
            </motion.h1>

            {/* Solid readable layer on top */}
            <h1
              className="absolute inset-0 text-[96px] md:text-[128px] font-black tracking-tighter text-[var(--text-0)] leading-none"
              aria-label={`Error ${code}`}
            >
              {code}
            </h1>
          </motion.div>

          {/* ── Info panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'border border-teal-500/15 bg-[var(--bg-1)]/60 p-6',
              'backdrop-blur-sm rounded-xl',
            )}
          >
            {/* Scan-line accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl bg-teal-500/40" />

            <div className="mb-3 flex items-center justify-center gap-2.5">
              {/* Blinking terminal cursor */}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                className="inline-block w-2 h-[1em] bg-teal-400 align-middle"
              />
              <h2 className="text-[15px] font-bold tracking-[0.18em] text-teal-400 uppercase">
                {title}
              </h2>
            </div>

            <p className="text-[13px] leading-relaxed text-[var(--text-2)]">
              {description}
            </p>

            {/* Fake terminal status line */}
            <div className="mt-4 pt-4 border-t border-[var(--border-1)] flex items-center justify-center gap-2">
              <span className="text-[10px] tracking-widest text-[var(--text-4)] uppercase font-mono">
                STATUS
              </span>
              <span className="text-[10px] text-teal-500 font-mono tracking-wide">
                ERR_{code}
              </span>
              <span className="text-[10px] tracking-widest text-[var(--text-4)] uppercase font-mono">
                ·
              </span>
              <span className="text-[10px] text-[var(--text-3)] font-mono">
                {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
              </span>
            </div>
          </motion.div>

          {/* ── CTAs ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            {/* Primary — go home */}
            <button
              onClick={handleBack}
              className={cn(
                'group relative overflow-hidden',
                'flex items-center gap-2',
                'bg-teal-500 hover:bg-teal-400',
                'text-black text-[12px] font-bold tracking-[0.14em] uppercase',
                'px-8 py-3.5 rounded-lg',
                'transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-0)]',
              )}
            >
              {/* Hover fill wipe */}
              <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 ease-in-out group-hover:translate-y-0 rounded-lg" />
              <ArrowLeft className="relative h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span className="relative">{backLabel}</span>
            </button>

            {/* Secondary — retry */}
            {!hideRetry && (
              <button
                onClick={handleRetry}
                className={cn(
                  'flex items-center gap-2',
                  'border border-teal-500/30 hover:border-teal-500/60',
                  'text-teal-400 hover:text-teal-300',
                  'text-[12px] font-bold tracking-[0.14em] uppercase',
                  'px-8 py-3.5 rounded-lg',
                  'hover:bg-teal-500/8',
                  'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-0)]',
                )}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Uplink</span>
              </button>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  )
}
