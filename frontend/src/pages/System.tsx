import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Activity, Wifi, WifiOff, AlertTriangle, CheckCircle2,
  RefreshCw, Zap, Clock, Server
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { useSharedWebSocket } from '@/components/layout/AppLayout'
import { healthApi, statusApi } from '@/lib/api'
import type { HealthStatus, ReadinessStatus, CircuitBreakerStatus } from '@/types'
import { formatRelativeTime } from '@/lib/utils'
import { useApp } from '@/context/AppContext'

export function System() {
  const { toast } = useApp()
  const { connected, socketId, systemWarnings, circuitBreakerChanges, clearWarnings } = useSharedWebSocket()
  const [health, setHealth]     = useState<HealthStatus | null>(null)
  const [ready, setReady]       = useState<ReadinessStatus | null>(null)
  const [cbs, setCbs]           = useState<CircuitBreakerStatus[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true); setError(null)
      const [h, r, cb] = await Promise.allSettled([
        healthApi.check(), healthApi.readiness(), statusApi.circuitBreakers(),
      ])
      if (h.status === 'fulfilled')  setHealth(h.value)
      if (r.status === 'fulfilled')  setReady(r.value)
      if (cb.status === 'fulfilled') setCbs(cb.value.circuitBreakers ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system status')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchStatus()
    const t = setInterval(fetchStatus, 30000)
    return () => clearInterval(t)
  }, [fetchStatus])

  const statusBadge = (s: string) => {
    if (['healthy','ready','connected','enabled'].includes(s)) return 'success'
    if (s === 'degraded') return 'warning'
    return 'destructive'
  }
  const cbBadge = (s: string) => {
    if (s === 'CLOSED') return 'success'
    if (s === 'HALF_OPEN') return 'warning'
    return 'destructive'
  }
  const cbDot = (s: string) =>
    s === 'CLOSED' ? 'bg-emerald-500' : s === 'HALF_OPEN' ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="p-5 sm:p-6 max-w-[1200px] mx-auto page-enter">
      <PageHeader
        title="System Status"
        description="Real-time health monitoring and circuit breaker status"
        actions={
          <Button variant="outline" size="sm" onClick={fetchStatus} loading={loading}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
        }
      />

      {error && <ErrorState message={error} onRetry={fetchStatus} className="mb-5" />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Left column ── */}
        <div className="space-y-4">

          {/* Health */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                Health Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2.5">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : health ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold capitalize ${health.status === 'healthy' ? 'text-emerald-400' : health.status === 'degraded' ? 'text-amber-400' : 'text-red-400'}`}>
                      {health.status}
                    </span>
                    <Badge variant={statusBadge(health.status) as 'success' | 'warning' | 'destructive'}>{health.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(health.timestamp)}</p>
                  {health.features && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">AI Features</span>
                      <Badge variant={health.features.ai ? 'success' : 'muted'} className="text-[10px]">
                        {health.features.ai ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Unable to reach health endpoint</p>
              )}
            </CardContent>
          </Card>

          {/* Readiness */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-400" />
                Readiness
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-9 rounded-xl" />)}</div>
              ) : ready ? (
                <div className="space-y-2">
                  {Object.entries(ready.checks).map(([key, value]) => {
                    const s = typeof value === 'string' ? value : (value as { enabled?: boolean })?.enabled ? 'enabled' : 'disabled'
                    return (
                      <div key={key} className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/60 border border-border/40">
                        <span className="text-sm font-medium capitalize text-foreground">{key}</span>
                        <Badge variant={statusBadge(s) as 'success' | 'warning' | 'destructive' | 'muted'} className="text-[10px]">{s}</Badge>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Readiness data unavailable</p>
              )}
            </CardContent>
          </Card>

          {/* WebSocket */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                {connected
                  ? <Wifi className="h-4 w-4 text-emerald-400" />
                  : <WifiOff className="h-4 w-4 text-red-400" />
                }
                WebSocket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={connected ? 'success' : 'destructive'}>{connected ? 'Connected' : 'Disconnected'}</Badge>
              </div>
              {socketId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Socket ID</span>
                  <code className="text-xs bg-secondary/80 border border-border/40 px-2 py-1 rounded-lg font-mono truncate max-w-[130px]">
                    {socketId}
                  </code>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right column ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Circuit breakers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                Circuit Breakers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
              ) : cbs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No circuit breaker data available</p>
              ) : (
                <div className="space-y-2">
                  {cbs.map((cb) => (
                    <motion.div key={cb.service} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-secondary/30 hover:bg-secondary/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${cbDot(cb.state)} shadow-sm`} />
                        <div>
                          <p className="text-sm font-medium capitalize text-foreground">{cb.service.replace(/_/g, ' ')}</p>
                          {cb.failures > 0 && <p className="text-xs text-muted-foreground">{cb.failures} failure{cb.failures !== 1 ? 's' : ''}</p>}
                        </div>
                      </div>
                      <Badge variant={cbBadge(cb.state) as 'success' | 'warning' | 'destructive' | 'muted'}>{cb.state}</Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Warnings */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  System Warnings
                  {systemWarnings.length > 0 && (
                    <Badge variant="warning" className="text-[10px]">{systemWarnings.length}</Badge>
                  )}
                </CardTitle>
                {systemWarnings.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearWarnings} className="text-xs">Clear all</Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {systemWarnings.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  No active warnings — system running cleanly
                </div>
              ) : (
                <div className="space-y-2">
                  {systemWarnings.map((w) => (
                    <div key={w.id} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-amber-300">{w.service}</p>
                        <p className="text-xs text-amber-400/80">{w.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{formatRelativeTime(w.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* CB changes */}
          {circuitBreakerChanges.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  Recent CB Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {circuitBreakerChanges.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/60 border border-border/40">
                      <div>
                        <p className="text-xs font-medium capitalize text-foreground">{c.service.replace(/_/g, ' ')}</p>
                        <p className="text-[10px] text-muted-foreground">{formatRelativeTime(c.timestamp)}</p>
                      </div>
                      <Badge variant={cbBadge(c.state) as 'success' | 'warning' | 'destructive' | 'muted'} className="text-[10px]">{c.state}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
