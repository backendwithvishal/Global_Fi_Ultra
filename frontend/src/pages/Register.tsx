import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, Eye, EyeOff, ArrowRight, CheckCircle2, Circle, Shield, Star, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { usersApi } from '@/lib/api'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

const schema = z.object({
  firstName: z.string().min(1, 'Required').max(50),
  lastName:  z.string().min(1, 'Required').max(50),
  email:     z.string().email('Invalid email'),
  password:  z.string().min(6, 'Minimum 6 characters'),
  confirm:   z.string().min(1, 'Required'),
}).refine(d => d.password === d.confirm, { message: "Passwords don't match", path: ['confirm'] })
type Form = z.infer<typeof schema>

const INPUT_CLS = cn(
  'w-full h-11 bg-[var(--bg-input)] border border-[var(--border-2)]',
  'hover:border-[var(--border-3)] hover:bg-[var(--bg-3)]',
  'focus:border-[var(--accent)] focus:outline-none focus:shadow-[var(--shadow-accent)] focus:bg-[var(--bg-input)]',
  'rounded-xl px-4 text-[14px] text-[var(--text-1)] placeholder:text-[var(--text-3)]',
  'transition-all duration-150 font-[inherit]'
)

const PW_RULES = [
  { label: 'At least 6 characters', test: (p: string) => p.length >= 6 },
  { label: 'Contains a number',     test: (p: string) => /\d/.test(p) },
  { label: 'Uppercase & lowercase', test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
]

const BENEFITS = [
  { icon: TrendingUp, text: 'Live market data · Stocks, Crypto, Forex' },
  { icon: Shield, text: 'Enterprise-grade security & SOC 2 compliance' },
  { icon: Star, text: 'AI-powered insights with Groq LLaMA 3.3' },
]

export function Register() {
  const navigate = useNavigate()
  const { setCurrentUser } = useApp()
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })
  const pw = watch('password') ?? ''
  const pwScore = PW_RULES.filter(r => r.test(pw)).length

  const onSubmit = async (data: Form) => {
    try {
      const user = await usersApi.create({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      })
      setCurrentUser(user)
      navigate('/onboarding')
    } catch { navigate('/') }
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg-0)]">

      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-[44%] flex-col justify-between p-12 relative overflow-hidden border-r border-[var(--border-2)] bg-[var(--bg-1)]">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.06] blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-muted)] border border-[rgba(37,99,235,0.4)] flex items-center justify-center shadow-[var(--shadow-accent)]">
            <Zap className="w-4.5 h-4.5 text-[var(--accent-bright)]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[16px] font-bold text-[var(--text-1)]">Global-Fi</span>
            <span className="text-[16px] font-bold text-[var(--accent-bright)]">Ultra</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10"
        >
          <div className="section-badge mb-5 inline-flex">Free forever · No card needed</div>
          <h2 className="text-3xl font-black text-white leading-tight tracking-tight mb-4">
            Join thousands of traders<br />
            <span className="text-gradient-blue">building with Global-Fi</span>
          </h2>
          <p className="text-sm text-[var(--text-3)] leading-relaxed mb-8">
            Get full access to live market data, AI-powered analysis, and real-time WebSocket streams — all in one unified platform.
          </p>
          <div className="space-y-3">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] border border-[rgba(37,99,235,0.2)] flex items-center justify-center shrink-0">
                  <b.icon className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
                </div>
                <span className="text-sm text-[var(--text-2)]">{b.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 text-xs text-[var(--text-4)]"
        >
          By creating an account you agree to our{' '}
          <Link to="/terms" className="text-[var(--text-3)] hover:text-[var(--accent-bright)] transition-colors">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-[var(--text-3)] hover:text-[var(--accent-bright)] transition-colors">Privacy Policy</Link>.
        </motion.p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--ai)] opacity-[0.03] blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-muted)] border border-[rgba(37,99,235,0.3)] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[var(--accent-bright)]" />
            </div>
            <span className="text-[15px] font-bold text-[var(--text-1)]">Global-Fi <span className="text-[var(--accent-bright)]">Ultra</span></span>
          </Link>

          <div className="mb-7">
            <h1 className="text-2xl font-black text-[var(--text-1)] tracking-tight mb-1.5">Create your account</h1>
            <p className="text-sm text-[var(--text-3)]">Start tracking markets in under 60 seconds</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              {(['firstName', 'lastName'] as const).map(f => (
                <div key={f} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[var(--text-2)] tracking-wide uppercase">
                    {f === 'firstName' ? 'First name' : 'Last name'}
                  </label>
                  <input
                    {...register(f)}
                    placeholder={f === 'firstName' ? 'John' : 'Doe'}
                    className={INPUT_CLS}
                  />
                  {errors[f] && <p className="text-xs text-[var(--danger-bright)]">{errors[f]?.message}</p>}
                </div>
              ))}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-2)] tracking-wide uppercase">Email address</label>
              <input type="email" {...register('email')} placeholder="you@company.com" autoComplete="email" className={INPUT_CLS} />
              {errors.email && <p className="text-xs text-[var(--danger-bright)]">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-2)] tracking-wide uppercase">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className={cn(INPUT_CLS, 'pr-11')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {pw && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                >
                  {/* Strength bar */}
                  <div className="flex gap-1 mt-2 mb-2">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className={cn(
                          'h-1 flex-1 rounded-full transition-all duration-300',
                          i < pwScore
                            ? pwScore === 1 ? 'bg-[var(--danger-bright)]'
                            : pwScore === 2 ? 'bg-[var(--warning-bright)]'
                            : 'bg-[var(--success-bright)]'
                            : 'bg-[var(--border-2)]'
                        )}
                      />
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    {PW_RULES.map(r => {
                      const ok = r.test(pw)
                      return (
                        <div key={r.label} className={cn('flex items-center gap-1.5 text-xs transition-colors', ok ? 'text-[var(--success-bright)]' : 'text-[var(--text-3)]')}>
                          {ok ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                          {r.label}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-2)] tracking-wide uppercase">Confirm password</label>
              <input type="password" {...register('confirm')} placeholder="••••••••" autoComplete="new-password" className={INPUT_CLS} />
              {errors.confirm && <p className="text-xs text-[var(--danger-bright)]">{errors.confirm.message}</p>}
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full mt-2"
              style={{ height: '44px', fontSize: '14px' }}
              iconRight={!isSubmitting ? <ArrowRight className="h-4 w-4" /> : undefined}
            >
              Create Free Account
            </Button>

            <p className="text-xs text-center text-[var(--text-4)]">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-[var(--text-3)] hover:text-[var(--accent-bright)]">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-[var(--text-3)] hover:text-[var(--accent-bright)]">Privacy Policy</Link>
            </p>
          </form>

          <div className="relative flex items-center my-6">
            <div className="flex-1 h-px bg-[var(--border-2)]" />
            <span className="px-3 text-xs text-[var(--text-4)]">already have an account?</span>
            <div className="flex-1 h-px bg-[var(--border-2)]" />
          </div>

          <Link
            to="/login"
            className="w-full h-11 flex items-center justify-center rounded-xl border border-[var(--border-2)] bg-[var(--bg-2)] hover:bg-[var(--bg-3)] hover:border-[var(--border-3)] text-sm font-semibold text-[var(--text-2)] hover:text-[var(--text-1)] transition-all"
          >
            Sign in instead →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
