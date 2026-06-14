import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, Eye, EyeOff, ArrowRight, TrendingUp, Cpu, Gauge, Shield, Activity, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { usersApi } from '@/lib/api'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password required')
})
type Form = z.infer<typeof schema>

const INPUT_CLS = cn(
  'w-full h-11 bg-[var(--bg-input)] border border-[var(--border-2)]',
  'hover:border-[var(--border-3)] hover:bg-[var(--bg-3)]',
  'focus:border-[var(--accent)] focus:outline-none focus:shadow-[var(--shadow-accent)] focus:bg-[var(--bg-input)]',
  'rounded-xl px-4 text-[14px] text-[var(--text-1)] placeholder:text-[var(--text-3)]',
  'transition-all duration-150 font-[inherit]'
)

const STATS = [
  { value: '6 APIs', label: 'Data Sources', icon: TrendingUp, color: 'text-[var(--accent-bright)]', bg: 'bg-[var(--accent-subtle)]' },
  { value: 'LLaMA 3.3', label: 'AI Engine', icon: Cpu, color: 'text-[var(--ai-bright)]', bg: 'bg-[var(--ai-subtle)]' },
  { value: '<50ms', label: 'Latency', icon: Gauge, color: 'text-[var(--success-bright)]', bg: 'bg-[var(--success-subtle)]' },
]

const METRICS = [
  { label: 'Uptime SLA', value: '99.99%', color: 'text-[var(--success-bright)]' },
  { label: 'Circuit breakers', value: 'Active', color: 'text-[var(--accent-bright)]' },
  { label: 'AI Endpoints', value: '11', color: 'text-[var(--ai-bright)]' },
]

export function Login() {
  const navigate = useNavigate()
  const { setCurrentUser, setToken } = useApp()
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: Form) => {
    try {
      const r = await usersApi.login(data)
      if (r.token) setToken(r.token)
      if (r.user) setCurrentUser(r.user)
      navigate('/')
    } catch {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg-0)]">

      {/* ── Left Panel — Brand visualization ── */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden border-r border-[var(--border-2)]">
        {/* Background */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-[var(--accent)] opacity-[0.06] blur-[120px] pointer-events-none animate-[meshPulse_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[var(--ai)] opacity-[0.05] blur-[100px] pointer-events-none animate-[meshPulse_14s_ease-in-out_infinite_reverse]" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-muted)] border border-[rgba(37,99,235,0.4)] flex items-center justify-center shadow-[var(--shadow-accent)]">
            <Zap className="w-4.5 h-4.5 text-[var(--accent-bright)]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[16px] font-bold text-[var(--text-1)] tracking-tight">Global-Fi</span>
            <span className="text-[16px] font-bold text-[var(--accent-bright)] tracking-tight">Ultra</span>
          </div>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10"
        >
          <h2 className="text-4xl font-black text-white leading-[1.15] tracking-[-0.03em] mb-5">
            Real-time financial<br />intelligence at your<br />
            <span className="text-gradient-blue">fingertips</span>
          </h2>
          <p className="text-base text-[var(--text-3)] leading-relaxed mb-10 max-w-[380px]">
            Monitor stocks, crypto, and forex in real-time. Get AI-powered insights
            from Groq LLaMA. All in one premium dashboard.
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="card p-4"
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', s.bg)}>
                  <s.icon className={cn('w-4 h-4', s.color)} />
                </div>
                <p className={cn('text-base font-bold num leading-none', s.color)}>{s.value}</p>
                <p className="text-xs text-[var(--text-3)] mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Live metrics strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-1 p-3 rounded-xl bg-[var(--bg-2)] border border-[var(--border-2)]"
          >
            <Activity className="w-3.5 h-3.5 text-[var(--success-bright)] shrink-0" />
            <span className="text-xs text-[var(--text-3)] mr-2">Live</span>
            {METRICS.map((m, i) => (
              <React.Fragment key={m.label}>
                <span className="text-xs text-[var(--text-3)]">{m.label}:</span>
                <span className={cn('text-xs font-bold', m.color)}>{m.value}</span>
                {i < METRICS.length - 1 && <span className="text-[var(--border-3)] mx-1.5">·</span>}
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex items-center gap-4"
        >
          <Shield className="w-3.5 h-3.5 text-[var(--text-4)]" />
          <p className="text-xs text-[var(--text-4)]">
            SOC 2 compliant · End-to-end encrypted · © 2026 Global-Fi Ultra
          </p>
        </motion.div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[380px]"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-muted)] border border-[rgba(37,99,235,0.3)] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[var(--accent-bright)]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] font-bold text-[var(--text-1)]">Global-Fi</span>
              <span className="text-[15px] font-bold text-[var(--accent-bright)]">Ultra</span>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-[var(--text-1)] tracking-tight mb-1.5">Welcome back</h1>
            <p className="text-sm text-[var(--text-3)]">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-2)] tracking-wide uppercase">
                Email address
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="you@company.com"
                autoComplete="email"
                className={INPUT_CLS}
              />
              {errors.email && (
                <p className="text-xs text-[var(--danger-bright)] flex items-center gap-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[var(--text-2)] tracking-wide uppercase">
                  Password
                </label>
                <button type="button" className="text-xs text-[var(--accent-bright)] hover:text-[var(--accent-hover)] transition-colors font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={cn(INPUT_CLS, 'pr-11')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors p-0.5"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[var(--danger-bright)]">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full mt-2"
              style={{ height: '44px', fontSize: '14px' }}
              iconRight={!isSubmitting ? <ArrowRight className="h-4 w-4" /> : undefined}
            >
              Sign in to Console
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-1 h-px bg-[var(--border-2)]" />
            <span className="px-3 text-xs text-[var(--text-4)]">or</span>
            <div className="flex-1 h-px bg-[var(--border-2)]" />
          </div>

          {/* Guest access */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-[var(--border-2)] bg-[var(--bg-2)] hover:bg-[var(--bg-3)] hover:border-[var(--border-3)] text-sm font-medium text-[var(--text-2)] hover:text-[var(--text-1)] transition-all"
          >
            <Sparkles className="w-4 h-4 text-[var(--ai-bright)]" />
            Browse as guest
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-[var(--text-3)] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--accent-bright)] hover:text-[var(--accent-hover)] font-semibold transition-colors">
              Create one free →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
