import React from 'react'
import { RefreshCw, Activity, Shield, Radio, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { HealthCheck } from '@/components/system/HealthCheck'
import { CircuitBreakers } from '@/components/system/CircuitBreakers'
import { WebSocketStatus } from '@/components/system/WebSocketStatus'
import { SystemWarnings } from '@/components/system/SystemWarnings'
import { useSystemStatus } from '@/hooks/useSystemStatus'
import { motion } from 'framer-motion'

export function System() {
  const { health, ready, cbs, loading, usingMock, reload } = useSystemStatus()

  const healthOk = health?.status === 'healthy'

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
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[var(--text-1)] tracking-tight">System Status</h1>
            {usingMock && <Badge variant="amber" dot>Demo</Badge>}
            {!loading && (
              <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                healthOk
                  ? 'bg-[var(--success-subtle)] text-[var(--success-bright)] border-[var(--success-border)]'
                  : 'bg-[var(--danger-subtle)] text-[var(--danger-bright)] border-[var(--danger-border)]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${healthOk ? 'bg-[var(--success-bright)] animate-pulse' : 'bg-[var(--danger-bright)]'}`} />
                {healthOk ? 'All Systems Go' : 'Degraded'}
              </div>
            )}
          </div>
          <p className="text-sm text-[var(--text-3)]">Health monitoring, WebSocket & circuit breakers</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => reload()} loading={loading} icon={<RefreshCw className="h-3.5 w-3.5" />}>
          Refresh
        </Button>
      </motion.div>

      <div className="space-y-5">

        {/* ── Health ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <HealthCheck health={health} ready={ready} loading={loading} />
        </motion.div>

        {/* ── Circuit Breakers ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg bg-[var(--warning-subtle)] flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-[var(--warning-bright)]" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--text-1)]">Circuit Breakers</h2>
          </div>
          <CircuitBreakers cbs={cbs} loading={loading} />
        </motion.div>

        {/* ── WebSocket + Warnings grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center">
                <Radio className="h-3.5 w-3.5 text-[var(--accent-bright)]" />
              </div>
              <h2 className="text-sm font-semibold text-[var(--text-1)]">WebSocket</h2>
            </div>
            <WebSocketStatus />
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg bg-[var(--danger-subtle)] flex items-center justify-center">
                <AlertTriangle className="h-3.5 w-3.5 text-[var(--danger-bright)]" />
              </div>
              <h2 className="text-sm font-semibold text-[var(--text-1)]">System Warnings</h2>
            </div>
            <SystemWarnings />
          </div>
        </motion.div>

      </div>
    </div>
  )
}
