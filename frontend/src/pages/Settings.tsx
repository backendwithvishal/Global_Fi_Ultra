import React from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Monitor, Shield, Zap, Bell, Globe, Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { PageHeader } from '@/components/common/PageHeader'
import { useApp } from '@/context/AppContext'
import type { Theme } from '@/types'
import { useTheme } from '@/hooks/useTheme'
import { useNavigate } from 'react-router-dom'

const themes: { value: Theme; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'light',  label: 'Light',  icon: Sun,     desc: 'Clean white interface' },
  { value: 'dark',   label: 'Dark',   icon: Moon,    desc: 'Easy on the eyes' },
  { value: 'system', label: 'System', icon: Monitor, desc: 'Follows OS setting' },
]

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.22 } } }

export function Settings() {
  const { currentUser, logout } = useApp()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="p-5 sm:p-6 max-w-[800px] mx-auto page-enter">
      <PageHeader title="Settings" description="Manage your preferences and account" />

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">

        {/* ── Appearance ── */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-400" />
                Appearance
              </CardTitle>
              <CardDescription>Choose how Global-Fi Ultra looks to you</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Theme</p>
              <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Theme">
                {themes.map(({ value, label, icon: Icon, desc }) => (
                  <button key={value} onClick={() => setTheme(value)} role="radio" aria-checked={theme === value}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      theme === value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/60 hover:border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
                    }`}>
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                    <span className="text-[10px] font-normal opacity-60">{desc}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Account ── */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                Account
              </CardTitle>
              <CardDescription>Your profile and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/40 border border-border/40">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 text-primary font-bold text-lg shrink-0 border border-primary/20">
                      {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{currentUser.firstName} {currentUser.lastName}</p>
                      <p className="text-sm text-muted-foreground truncate">{currentUser.email}</p>
                    </div>
                    <Badge variant={currentUser.isActive ? 'success' : 'destructive'}>
                      {currentUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    {[
                      { label: 'Default Currency', value: currentUser.preferences?.defaultCurrency ?? 'USD' },
                      { label: 'Default Stock',    value: currentUser.preferences?.defaultStockSymbol ?? 'IBM' },
                      { label: 'Default Crypto',   value: currentUser.preferences?.defaultCryptoIds ?? 'bitcoin,ethereum' },
                      { label: 'User ID',          value: `…${currentUser._id.slice(-8)}` },
                    ].map((row) => (
                      <div key={row.label}>
                        <p className="text-xs text-muted-foreground">{row.label}</p>
                        <p className="font-medium mt-0.5 text-foreground truncate">{row.value}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                      <Bell className="h-3.5 w-3.5" />Notifications
                    </p>
                    {[
                      { id: 'email-notif',     label: 'Email notifications',      desc: 'Receive price alerts via email', checked: currentUser.preferences?.notifications?.email ?? true },
                      { id: 'ws-notif',        label: 'WebSocket notifications',  desc: 'Real-time in-app alerts',        checked: currentUser.preferences?.notifications?.websocket ?? true },
                    ].map((n) => (
                      <div key={n.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/40">
                        <div>
                          <p className="text-sm font-medium text-foreground">{n.label}</p>
                          <p className="text-xs text-muted-foreground">{n.desc}</p>
                        </div>
                        <Switch checked={n.checked} aria-label={n.label} disabled />
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <Button variant="destructive" size="sm" onClick={logout}>Sign out</Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">Sign in to manage your account settings.</p>
                  <div className="flex items-center justify-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate('/register')}>Create account</Button>
                    <Button size="sm" onClick={() => navigate('/login')}>Sign in</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── API Config ── */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                API Configuration
              </CardTitle>
              <CardDescription>Backend connection details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {[
                  { label: 'API Base URL',       value: '/api/v1' },
                  { label: 'WebSocket',           value: 'ws://localhost:4000' },
                  { label: 'API Version',         value: '1.0.0' },
                  { label: 'Global Rate Limit',   value: '100 req / 15 min' },
                  { label: 'AI Rate Limit',       value: '10 req / 1 min' },
                  { label: 'Auth Rate Limit',     value: '5 req / 15 min' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <code className="text-xs bg-secondary/80 border border-border/40 px-2 py-1 rounded-lg font-mono">{row.value}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── External APIs ── */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-400" />
                External Data Sources
              </CardTitle>
              <CardDescription>APIs powering the financial data engine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Alpha Vantage',    type: 'Stocks',      cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                  { name: 'CoinGecko',        type: 'Crypto',      cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                  { name: 'ExchangeRate API', type: 'Forex',       cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                  { name: 'NewsAPI',          type: 'News',        cls: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
                  { name: 'FRED',             type: 'Economic',    cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                  { name: 'Finnhub',          type: 'Market News', cls: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
                ].map((api) => (
                  <div key={api.name} className="flex flex-col gap-1.5 p-3 rounded-xl border border-border/60 bg-secondary/30 hover:bg-secondary/60 transition-colors">
                    <span className="text-xs font-semibold text-foreground">{api.name}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border w-fit ${api.cls}`}>{api.type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
