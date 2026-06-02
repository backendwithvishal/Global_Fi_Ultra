import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Shield, Trash2, BarChart3, FileText, AlertTriangle, RefreshCw, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { adminApi } from '@/lib/api'
import { formatRelativeTime } from '@/lib/utils'
import { useApp } from '@/context/AppContext'

export function Admin() {
  const { toast } = useApp()
  const [metrics, setMetrics]         = useState<{ period: string; metrics: Record<string, unknown> } | null>(null)
  const [logs, setLogs]               = useState<Record<string, unknown>[]>([])
  const [loading, setLoading]         = useState(true)
  const [clearingCache, setClearing]  = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true); setError(null)
      const [m, l] = await Promise.allSettled([adminApi.getMetrics(24), adminApi.getLogs(20)])
      if (m.status === 'fulfilled') setMetrics(m.value as { period: string; metrics: Record<string, unknown> })
      if (l.status === 'fulfilled') setLogs((l.value.logs ?? []) as Record<string, unknown>[])
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleClearCache = async () => {
    try {
      setClearing(true)
      const r = await adminApi.clearCache()
      toast.success('Cache cleared', r.message ?? 'Redis cache flushed.')
    } catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
    finally { setClearing(false) }
  }

  return (
    <div className="p-5 sm:p-6 max-w-[1200px] mx-auto page-enter">
      <PageHeader
        title="Admin Panel"
        description="System administration and monitoring"
        actions={
          <Button variant="outline" size="sm" onClick={fetchData} loading={loading}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
        }
      />

      {/* Warning */}
      <div className="mb-5 flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/8 text-sm text-amber-300">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
        <span>Admin endpoints are not yet protected by authentication. Do not expose in production.</span>
      </div>

      {error && <ErrorState message={error} onRetry={fetchData} className="mb-5" />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Actions ── */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-400" />
                Cache Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Flush all Redis cache entries. Next requests will fetch fresh data from external APIs.
              </p>
              <Button variant="destructive" size="sm" onClick={handleClearCache} loading={clearingCache} className="w-full gap-2">
                <Trash2 className="h-3.5 w-3.5" />
                Clear All Cache
              </Button>
            </CardContent>
          </Card>

          {/* Metrics */}
          {(loading || metrics) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                  Metrics (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 rounded-xl" />)}</div>
                ) : metrics ? (
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-3">Period: {metrics.period}</p>
                    {Object.entries(metrics.metrics ?? {}).slice(0, 8).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/60 border border-border/40">
                        <span className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-xs font-semibold tabular-nums text-foreground">
                          {typeof value === 'number' ? value.toLocaleString() : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Error logs ── */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-400" />
                  Recent Error Logs
                </CardTitle>
                {logs.length > 0 && <Badge variant="muted" className="text-xs">{logs.length} entries</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No error logs</p>
                  <p className="text-xs text-muted-foreground mt-0.5">System is running cleanly.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {logs.map((log, i) => {
                    const ts  = log.timestamp as string | undefined
                    const msg = log.message  as string | undefined
                    const rid = log.requestId as string | undefined
                    return (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                        className="p-3 rounded-xl border border-red-500/15 bg-red-500/5 font-mono text-xs">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <Badge variant="destructive" className="text-[10px] shrink-0">ERROR</Badge>
                          {ts && (
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />{formatRelativeTime(ts)}
                            </span>
                          )}
                        </div>
                        {msg && <p className="text-foreground/80 break-all leading-relaxed">{msg}</p>}
                        {rid && <p className="text-muted-foreground mt-1">ID: {rid}</p>}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
