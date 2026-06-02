import React, { useState, createContext, useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ToastContainer } from '@/components/common/ToastContainer'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useApp } from '@/context/AppContext'
import type { FinancialDataResponse, AIMessage } from '@/types'

// ─── Shared WebSocket Context ─────────────────────────────────────────────────

interface SystemWarning {
  id: string
  service: string
  message: string
  severity: string
  timestamp: string
}

interface CircuitBreakerChange {
  id: string
  service: string
  state: string
  timestamp: string
}

export interface WebSocketContextValue {
  connected: boolean
  socketId: string | undefined
  financialData: FinancialDataResponse | null
  systemWarnings: SystemWarning[]
  circuitBreakerChanges: CircuitBreakerChange[]
  clearWarnings: () => void
  joinLiveStream: () => void
  leaveLiveStream: () => void
  aiMessages: AIMessage[]
  isAIStreaming: boolean
  sendAIChat: (message: string, sessionId?: string) => void
  stopAIStream: () => void
  clearAIMessages: () => void
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null)

export function useSharedWebSocket(): WebSocketContextValue {
  const ctx = useContext(WebSocketContext)
  if (!ctx) throw new Error('useSharedWebSocket must be used within AppLayout')
  return ctx
}

// ─── AppLayout ────────────────────────────────────────────────────────────────

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { toasts, removeToast } = useApp()

  // Single shared WebSocket — all pages consume via useSharedWebSocket()
  const ws = useWebSocket({ autoConnect: true })

  return (
    <WebSocketContext.Provider value={ws}>
      <div className="flex h-screen overflow-hidden bg-background">

        {/* Desktop sidebar */}
        <div className="hidden md:flex shrink-0">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((c) => !c)}
          />
        </div>

        {/* Mobile sidebar sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-[220px] border-r border-border/60">
            <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header
            connected={ws.connected}
            warningCount={ws.systemWarnings.length}
            onMobileMenuClick={() => setMobileOpen(true)}
          />
          <main
            className="flex-1 overflow-y-auto"
            id="main-content"
            role="main"
            aria-label="Main content"
          >
            <Outlet />
          </main>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </WebSocketContext.Provider>
  )
}
