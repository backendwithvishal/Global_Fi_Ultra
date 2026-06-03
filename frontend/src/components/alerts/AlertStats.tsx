import React from 'react'
import { Bell, CheckCircle2, BellOff } from 'lucide-react'
import type { Alert } from '@/types'

interface AlertStatsProps { alerts: Alert[]; activeTab: string; onTab: (t: string) => void; loading?: boolean }

export function AlertStats({ alerts, activeTab, onTab, loading }: AlertStatsProps) {
  const active    = alerts.filter(a => a.isActive && !a.isTriggered).length
  const triggered = alerts.filter(a => a.isTriggered).length
  const inactive  = alerts.filter(a => !a.isActive && !a.isTriggered).length

  const stats = [
    {
      key: 'active',    label: 'Active',    count: active,
      icon: Bell,         iconColor: 'text-emerald-600 dark:text-emerald-400',
      activeBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      key: 'triggered', label: 'Triggered', count: triggered,
      icon: CheckCircle2, iconColor: 'text-blue-600 dark:text-blue-400',
      activeBg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      key: 'inactive',  label: 'Inactive',  count: inactive,
      icon: BellOff,      iconColor: 'text-[var(--text-3)]',
      activeBg: 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-[var(--border-md)]',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {stats.map(s => (
        <button
          key={s.key}
          onClick={() => onTab(s.key)}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
            activeTab === s.key
              ? s.activeBg
              : 'bg-white dark:bg-[#131D2E] border-slate-200/80 dark:border-[var(--border)] hover:border-slate-300 dark:hover:bg-[var(--bg-raised)]'
          }`}
        >
          <s.icon className={`h-5 w-5 ${s.iconColor} shrink-0`} />
          <div className="text-left">
            <p className="text-xl font-bold text-[var(--text-1)] font-mono">{loading ? '—' : s.count}</p>
            <p className="text-xs text-[var(--text-2)]">{s.label}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
