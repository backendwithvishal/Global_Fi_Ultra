import React from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useSharedWebSocket } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'

export function SystemWarnings() {
  const { systemWarnings, clearWarnings } = useSharedWebSocket()

  return (
    <div>
      {systemWarnings.length > 0 && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[var(--text-3)] font-medium">Active Alerts</span>
          <Button variant="ghost" size="sm" className="h-7 px-2.5 text-xs text-[var(--text-2)] hover:text-[var(--text-1)]" onClick={clearWarnings}>
            Clear all
          </Button>
        </div>
      )}

      {systemWarnings.length === 0 ? (
        <div className="flex items-center justify-center gap-2 text-sm text-[var(--success-bright)] py-5 bg-[var(--success-subtle)] border border-[var(--success-border)] rounded-xl">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="font-medium">No active warnings — system running cleanly</span>
        </div>
      ) : (
        <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
          {systemWarnings.map(w => (
            <div key={w.id} className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--danger-subtle)] border border-[var(--danger-border)]">
              <AlertTriangle className="h-3.5 w-3.5 text-[var(--danger-bright)] mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[var(--text-1)] capitalize">{w.service}</p>
                  <span className="text-[10px] text-[var(--text-3)] font-mono">{new Date(w.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-[var(--text-2)] mt-0.5 leading-relaxed">{w.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

