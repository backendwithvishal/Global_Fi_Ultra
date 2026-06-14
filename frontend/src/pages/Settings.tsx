import React, { useState } from 'react'
import { Zap, Globe, Shield, Bell, LogOut, ChevronRight, User, Key, CreditCard, Code } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const API_SOURCES = [
  { name: 'Alpha Vantage', type: 'Stocks',       dot: 'bg-[var(--accent-bright)]' },
  { name: 'CoinGecko',     type: 'Crypto',        dot: 'bg-[var(--warning-bright)]' },
  { name: 'ExchangeRate',  type: 'Forex',          dot: 'bg-[var(--ai-bright)]' },
  { name: 'NewsAPI',       type: 'News',           dot: 'bg-[var(--success-bright)]' },
  { name: 'FRED',          type: 'Economic',       dot: 'bg-[var(--success-bright)]' },
  { name: 'Finnhub',       type: 'Market News',    dot: 'bg-[var(--accent-bright)]' },
]

const API_CONFIG = [
  { label: 'API Base URL',  value: 'http://localhost:3000/api/v1' },
  { label: 'WebSocket',     value: 'ws://localhost:3000' },
  { label: 'API Version',   value: '1.0.0' },
  { label: 'Global Limit',  value: '100 req / 15 min' },
  { label: 'AI Limit',      value: '10 req / 1 min' },
]

const QUICK_LINKS = [
  { label: 'Billing & Subscription', href: '/settings/billing',   icon: CreditCard },
  { label: 'Team Management',        href: '/settings/teams',     icon: User },
  { label: 'Developer API Keys',     href: '/settings/developer', icon: Code },
]

export function Settings() {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()

  return (
    <div className="p-5 sm:p-8 max-w-[860px] mx-auto page-enter animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-[var(--text-1)] tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--text-3)] mt-1">Manage your account, preferences and configuration</p>
      </motion.div>

      <div className="space-y-5">

        {/* ── Account card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-[var(--accent-bright)]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-1)]">Account</h3>
          </div>

          {currentUser ? (
            <div className="space-y-4">
              {/* User info row */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-3)] border border-[var(--border-2)]">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--ai)] text-white font-bold text-lg shrink-0">
                  {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text-1)] truncate">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-sm text-[var(--text-3)] truncate">{currentUser.email}</p>
                  {currentUser.subscriptionTier && (
                    <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-bright)] border border-[rgba(37,99,235,0.2)] uppercase tracking-wider">
                      {currentUser.subscriptionTier}
                    </span>
                  )}
                </div>
                <Badge variant={currentUser.isActive ? 'green' : 'red'} dot>
                  {currentUser.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Default Currency', value: currentUser.preferences?.defaultCurrency ?? 'USD' },
                  { label: 'Default Stock',    value: currentUser.preferences?.defaultStockSymbol ?? 'IBM' },
                ].map(r => (
                  <div key={r.label} className="p-3 rounded-xl bg-[var(--bg-3)] border border-[var(--border-2)]">
                    <p className="text-xs text-[var(--text-3)]">{r.label}</p>
                    <p className="font-semibold text-[var(--text-1)] mt-0.5">{r.value}</p>
                  </div>
                ))}
              </div>

              <Button variant="danger" size="sm" onClick={logout} icon={<LogOut className="h-3.5 w-3.5" />}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-[var(--text-2)] mb-4">Sign in to manage your account.</p>
              <div className="flex items-center justify-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => navigate('/register')}>Create Account</Button>
                <Button size="sm" onClick={() => navigate('/login')}>Sign In</Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Quick links ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-4)] flex items-center justify-center">
              <Key className="h-3.5 w-3.5 text-[var(--text-2)]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-1)]">Workspace</h3>
          </div>
          <div className="space-y-1.5">
            {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl',
                  'bg-[var(--bg-3)] border border-[var(--border-2)]',
                  'text-sm text-[var(--text-2)] hover:text-[var(--text-1)]',
                  'hover:bg-[var(--bg-4)] transition-colors group'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-[var(--text-3)]" />
                  {label}
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-[var(--text-3)] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── API config card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg bg-[var(--warning-subtle)] flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-[var(--warning-bright)]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-1)]">API Configuration</h3>
          </div>
          <div className="space-y-0.5">
            {API_CONFIG.map(r => (
              <div
                key={r.label}
                className="flex items-center justify-between py-2.5 border-b border-[var(--border-1)] last:border-0"
              >
                <span className="text-sm text-[var(--text-2)]">{r.label}</span>
                <code className="text-xs bg-[var(--bg-3)] border border-[var(--border-2)] px-2.5 py-1 rounded-lg font-mono text-[var(--accent-bright)]">
                  {r.value}
                </code>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Data sources card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg bg-[var(--success-subtle)] flex items-center justify-center">
              <Globe className="h-3.5 w-3.5 text-[var(--success-bright)]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-1)]">External Data Sources</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {API_SOURCES.map(a => (
              <div
                key={a.name}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-2)] bg-[var(--bg-3)] hover:bg-[var(--bg-4)] transition-colors"
              >
                <span className={cn('w-2 h-2 rounded-full shrink-0', a.dot)} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--text-1)] truncate">{a.name}</p>
                  <p className="text-[10px] text-[var(--text-3)] truncate">{a.type}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.25 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg bg-[var(--ai-subtle)] flex items-center justify-center">
              <Bell className="h-3.5 w-3.5 text-[var(--ai-bright)]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-1)]">Notifications</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Email Notifications', sublabel: 'Price alerts and important updates', enabled: currentUser?.preferences?.notifications?.email ?? true },
              { label: 'WebSocket Push',       sublabel: 'Real-time in-app alerts',            enabled: currentUser?.preferences?.notifications?.websocket ?? true },
            ].map(n => (
              <div
                key={n.label}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-3)] border border-[var(--border-2)]"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text-1)]">{n.label}</p>
                  <p className="text-xs text-[var(--text-3)] mt-0.5">{n.sublabel}</p>
                </div>
                <div className={cn(
                  'relative w-9 h-5 rounded-full cursor-pointer transition-colors',
                  n.enabled ? 'bg-[var(--accent)]' : 'bg-[var(--bg-5)]'
                )}>
                  <div className={cn(
                    'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all',
                    n.enabled ? 'left-4' : 'left-0.5'
                  )} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
