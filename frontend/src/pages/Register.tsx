import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usersApi } from '@/lib/api'
import { useApp } from '@/context/AppContext'

const schema = z.object({
  firstName: z.string().min(1, 'Required').max(50),
  lastName:  z.string().min(1, 'Required').max(50),
  email:     z.string().email('Invalid email'),
  password:  z.string().min(6, 'Min 6 characters'),
  confirm:   z.string().min(1, 'Required'),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ['confirm'],
})
type Form = z.infer<typeof schema>

const pwRules = [
  { label: 'At least 6 characters', test: (p: string) => p.length >= 6 },
  { label: 'Contains a number',     test: (p: string) => /\d/.test(p) },
  { label: 'Contains a letter',     test: (p: string) => /[a-zA-Z]/.test(p) },
]

export function Register() {
  const navigate = useNavigate()
  const { setCurrentUser, toast } = useApp()
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirm: '' },
    mode: 'onChange',
  })

  const pw = form.watch('password')

  const onSubmit = async (data: Form) => {
    try {
      const user = await usersApi.create({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      })
      setCurrentUser(user)
      toast.success('Account created', `Welcome, ${user.firstName}!`)
      navigate('/')
    } catch (err) {
      toast.error('Registration failed', err instanceof Error ? err.message : 'Please try again')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-lg shadow-primary/30">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Global-Fi Ultra</span>
        </div>

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start tracking markets in seconds</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            {(['firstName', 'lastName'] as const).map((field) => (
              <div key={field} className="space-y-1.5">
                <label htmlFor={`reg-${field}`} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {field === 'firstName' ? 'First name' : 'Last name'}
                </label>
                <Input
                  id={`reg-${field}`}
                  {...form.register(field)}
                  placeholder={field === 'firstName' ? 'John' : 'Doe'}
                  error={!!form.formState.errors[field]}
                />
                {form.formState.errors[field] && (
                  <p className="text-xs text-red-400" role="alert">{form.formState.errors[field]?.message}</p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
            <Input
              id="reg-email"
              type="email"
              {...form.register('email')}
              placeholder="you@example.com"
              error={!!form.formState.errors.email}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-400" role="alert">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-pw" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Password</label>
            <div className="relative">
              <Input
                id="reg-pw"
                type={showPw ? 'text' : 'password'}
                {...form.register('password')}
                placeholder="••••••••"
                error={!!form.formState.errors.password}
                className="pr-10"
              />
              <button type="button" onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPw ? 'Hide' : 'Show'}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {pw && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1 pt-1">
                {pwRules.map((r) => (
                  <div key={r.label} className={`flex items-center gap-1.5 text-xs transition-colors ${r.test(pw) ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    <CheckCircle2 className={`h-3 w-3 ${r.test(pw) ? 'text-emerald-400' : 'text-muted-foreground/30'}`} />
                    {r.label}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-confirm" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Confirm password</label>
            <div className="relative">
              <Input
                id="reg-confirm"
                type={showConfirm ? 'text' : 'password'}
                {...form.register('confirm')}
                placeholder="••••••••"
                error={!!form.formState.errors.confirm}
                className="pr-10"
              />
              <button type="button" onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showConfirm ? 'Hide' : 'Show'}>
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.confirm && (
              <p className="text-xs text-red-400" role="alert">{form.formState.errors.confirm.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full gap-2" size="lg" loading={form.formState.isSubmitting}>
            Create account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
