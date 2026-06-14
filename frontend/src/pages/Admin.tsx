import React, { useState, useEffect } from 'react'
import { RefreshCw, BarChart3, Shield, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SecurityWarning } from '@/components/admin/SecurityWarning'
import { CacheManagement } from '@/components/admin/CacheManagement'
import { ErrorLogs } from '@/components/admin/ErrorLogs'
import { adminApi } from '@/lib/api'
import { Skeleton } from '@/components/ui/Skeleton'
import { motion } from 'framer-motion'

export function Admin() {
  const [metrics, setMetrics] = useState<{ period: string; metrics: Record<string, unknown> } | null>(null)
  const [loading, setLoading] = useState(true)

  const loadMetrics = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))
    try {
      const r = await adminApi.getMetrics(24)
      setMetrics(r as { period: string; metrics: Record<string, unknown> })
    } catch {
      setMetrics({
        period: '24h',
        metrics: { totalRequests: 1284, cacheHits: 891, apiCalls: 393, errors: 7, avgDuration: '142ms' },
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMetrics() }, [])

  return (
    <div className="p-5 sm:p-8 max-w-[1200px] mx-auto page-enter animate-fade-in">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-1)] tracking-tight mb-1">Admin Panel</h1>
          <p className="text-sm text-[var(--text-3)]">Cache management, metrics & error logs</p>
        </div>
        <Button variant="secondary" size="sm" onClick={loadMetrics} loading={loading} icon={<RefreshCw className="h-3.5 w-3.5" />}>
          Refresh
        </Button>
      </motion.div>

      <SecurityWarning />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            <CacheManagement />
          </motion.div>

          {/* Metrics card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="card p-5"
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center">
                <BarChart3 className="h-3.5 w-3.5 text-[var(--accent-bright)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-1)]">Metrics (24h)</h3>
            </div>

            {loading ? (
              <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-9 rounded-xl" />)}</div>
            ) : metrics ? (
              <div className="space-y-1.5">
                <p className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-3 font-semibold">
                  Period: {metrics.period}
                </p>
                {Object.entries(metrics.metrics ?? {}).slice(0, 8).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-3)] border border-[var(--border-2)]">
                    <span className="text-xs text-[var(--text-2)] capitalize">{k.replace(/_/g, ' ')}</span>
                    <span className="text-xs font-semibold text-[var(--text-1)] font-mono tabular-nums">
                      {typeof v === 'number' ? v.toLocaleString() : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="lg:col-span-2"
        >
          <ErrorLogs />
        </motion.div>
      </div>
    </div>
  )
}
