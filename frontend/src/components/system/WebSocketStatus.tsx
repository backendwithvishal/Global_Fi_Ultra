import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { useSharedWebSocket } from '@/components/layout/AppLayout'

const rowCls = 'flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-3)] border border-[var(--border-1)]'

export function WebSocketStatus() {
  const { connected, socketId, systemWarnings } = useSharedWebSocket()

  return (
    <div className="space-y-3">
      <div className={rowCls}>
        <span className="text-sm text-[var(--text-2)]">Connection</span>
        <Badge variant={connected ? 'green' : 'red'} dot>
          {connected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      {socketId && (
        <div className={rowCls}>
          <span className="text-sm text-[var(--text-2)]">Socket ID</span>
          <code className="text-xs text-[var(--text-2)] bg-[var(--bg-4)] border border-[var(--border-2)] px-2.5 py-1 rounded font-mono truncate max-w-[180px]">
            {socketId}
          </code>
        </div>
      )}

      <div className={rowCls}>
        <span className="text-sm text-[var(--text-2)]">Warnings</span>
        <Badge variant={systemWarnings.length > 0 ? 'amber' : 'green'}>
          {systemWarnings.length}
        </Badge>
      </div>
    </div>
  )
}

