import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usersApi } from '@/lib/api'
import { useApp } from '@/context/AppContext'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})
type Form = z.infer<typeof schema>

export function Login() {
  const navigate = useNavigate()
  const { setCurrentUser, setToken, toast } = useApp()
  const [showPw, setShowPw] = useState(false)

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: Form) => {
    try {
      const result = await usersApi.login(data)
      if (result.token) setToken(result.token)
      if (result.user) setCurrentUser(result.user)
      toast.success('Welcome back', `Signed in as ${result.user?.firstName ?? data.email}`)
      navigate('/')
    } catch (err) {
      toast.error('Sign in failed', err instanceof Error ? err.message : 'Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-background border-r border-border/60 flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(252_87%_67%/0.15),transparent_60%)]" />
        <div className="relative z-10 max-w-sm text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/40">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Global-Fi Ultra</span>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-foreground">
            Real-time financial intelligence
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Track stocks, crypto, forex and economic indicators. Get AI-powered insights powered by Groq LLaMA.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { label: 'Data Sources', value: '6 APIs' },
              { label: 'AI Model', value: 'LLaMA 3.3' },
              { label: 'Latency', value: '< 100ms' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
                <p className="text-base font-bold text-primary">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-lg shadow-primary/30">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Global-Fi Ultra</span>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Email
              </label>
              <Input
                id="login-email"
                type="email"
                {...form.register('email')}
                placeholder="you@example.com"
                autoComplete="email"
                error={!!form.formState.errors.email}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-400" role="alert">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-pw" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Input
                  id="login-pw"
                  type={showPw ? 'text' : 'password'}
                  {...form.register('password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  error={!!form.formState.errors.password}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-400" role="alert">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              loading={form.formState.isSubmitting}
            >
              Sign in
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>

          <div className="mt-5 space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              No account?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Create one
              </Link>
            </p>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-xs text-muted-foreground">or</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              Continue without signing in →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
