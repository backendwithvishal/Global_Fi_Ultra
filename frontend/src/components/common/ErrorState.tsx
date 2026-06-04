import React from 'react'
import { AlertTriangle, RefreshCw, WifiOff, ServerCrash } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════════════════════
   ErrorState — compact inline error card
   Used inside pages/sections when a data fetch fails.
   NOT the full-screen version — use ErrorPage for that.
═══════════════════════════════════════════════════════════════════════════ */

type ErrorKind = 'default' | 'network' | 'server' | 'empty'

const KIND_CONFIG: Record<ErrorKind, {
  Icon: React.ElementType
  defaultTitle: string
  iconBg: string
  iconColor: string
  border: string
  bg: string
}> = {
  default: {
    Icon: AlertTriangle,
    defaultTitle: 'Something went wrong',
    iconBg:    'bg-[var(--danger-subtle)]',
    iconColor: 'text-[var(--danger-bright)]',
    border:    'border-[var(--danger-border)]',
    bg:        'bg-[var(--danger-subtle)]/40',
  },
  network: {
    Icon: WifiOff,
    defaultTitle: 'No connection',
    iconBg:    'bg-[var(--warning-subtle)]',
    iconColor: 'text-[var(--warning-bright)]',
    border:    'border-[var(--warning-border)]',
    bg:        'bg-[var(--warning-subtle)]/40',
  },
  server: {
    Icon: ServerCrash,
    defaultTitle: 'Server error',
    iconBg:    'bg-[var(--danger-subtle)]',
    iconColor: 'text-[var(--danger-bright)]',
    border:    'border-[var(--danger-border)]',
    bg:        'bg-[var(--danger-subtle)]/40',
  },
  empty: {
    Icon: AlertTriangle,
    defaultTitle: 'No data available',
    iconBg:    'bg-[var(--bg-4)]',
    iconColor: 'text-[var(--text-3)]',
    border:    'border-[var(--border-2)]',
    bg:        'bg-[var(--bg-2)]',
  },
}

interface ErrorStateProps {
  /** Visual style — default | network | server | empty */
  kind?: ErrorKind
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({
  kind        = 'default',
  title,
  message,
  onRetry,
  retryLabel  = 'Try again',
  className,
}: ErrorStateProps) {
  const cfg = KIND_CONFIG[kind]

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center',
        'py-10 px-5 text-center rounded-xl border',
        cfg.bg, cfg.border,
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Left accent bar */}
      <div className={cn('absolute left-0 top-4 bottom-4 w-0.5 rounded-full', cfg.iconColor)} />

      {/* Icon */}
      <div className={cn('mb-3 p-2.5 rounded-xl', cfg.iconBg)}>
        <cfg.Icon className={cn('h-5 w-5', cfg.iconColor)} aria-hidden="true" />
      </div>

      {/* Text */}
      <p className="text-[13px] font-semibold text-[var(--text-1)] mb-1 leading-tight">
        {title ?? cfg.defaultTitle}
      </p>

      {message && (
        <p className="text-[12px] text-[var(--text-2)] max-w-xs leading-relaxed mb-4">
          {message}
        </p>
      )}

      {/* Retry CTA */}
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          icon={<RefreshCw className="h-3.5 w-3.5" />}
          className="mt-1"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
