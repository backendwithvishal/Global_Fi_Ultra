import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    {/* Outermost boundary — catches any crash before the router even mounts */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
