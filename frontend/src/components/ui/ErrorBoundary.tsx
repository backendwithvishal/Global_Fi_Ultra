import React from 'react'
import { ErrorPage } from '@/components/ui/ErrorPage'

/* ═══════════════════════════════════════════════════════════════════════════
   Global-Fi Ultra — React Error Boundary
   Catches any unhandled JS runtime error thrown inside a component tree
   and renders the full-page ErrorPage instead of a blank/crashed screen.

   Usage — wrap a subtree:
     <ErrorBoundary>
       <SomeFeature />
     </ErrorBoundary>

   Usage — wrap the whole app (in main.tsx / App.tsx):
     <ErrorBoundary>
       <App />
     </ErrorBoundary>
═══════════════════════════════════════════════════════════════════════════ */

interface Props {
  children: React.ReactNode
  /** Optional custom fallback — if not provided, uses ErrorPage */
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console in dev; swap for a real error service (Sentry etc.) in prod
    console.error('[ErrorBoundary] Unhandled error:', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <ErrorPage
          code="500"
          title="System Failure"
          description={
            this.state.error?.message
              ? `Runtime error: ${this.state.error.message}`
              : 'An unexpected error occurred in the application. The component tree crashed.'
          }
          backLabel="Go Home"
          onBack={() => { window.location.href = '/' }}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}
