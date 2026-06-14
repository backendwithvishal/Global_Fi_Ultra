import React from 'react'
import { motion } from 'framer-motion'
import type { CircuitBreakerStatus } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { SkeletonCard } from '@/components/ui/Skeleton'

const cbBadge = (s: string | undefined): 'green' | 'red' | 'amber' =>
  s === 'CLOSED' ? 'green' : s === 'OPEN' ? 'red' : 'amber'

const cbDot = (s: string | undefined) =>
  s === 'CLOSED' ? 'bg-[var(--success-bright)] animate-pulse' : s === 'OPEN' ? 'bg-[var(--danger-bright)]' : 'bg-[var(--warning-bright)]'

export function CircuitBreakers({ cbs, loading }: { cbs: CircuitBreakerStatus[]; loading?: boolean }) {
  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {[...Array(6)].map((_, i) => <SkeletonCard key={i} rows={2} />)}
    </div>
  )

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cbs.map((cb, i) => {
        const serviceName = cb.service || (cb as any).name || 'Unknown'
        const state = cb.state || 'UNKNOWN'
        return (
          <motion.div
            key={serviceName}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[var(--bg-3)] border border-[var(--border-2)] rounded-xl p-4 hover:bg-[var(--bg-4)] hover:border-[var(--border-3)] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${cbDot(state)}`} />
                <span className="text-xs font-semibold text-[var(--text-1)] capitalize">
                  {serviceName.replace(/_/g, ' ')}
                </span>
              </div>
              <Badge variant={cbBadge(state)}>{state}</Badge>
            </div>
            {cb.failures !== undefined && cb.failures > 0 && (
              <p className="text-xs text-[var(--text-3)] font-mono">
                {cb.failures} failure{cb.failures !== 1 ? 's' : ''}
              </p>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
