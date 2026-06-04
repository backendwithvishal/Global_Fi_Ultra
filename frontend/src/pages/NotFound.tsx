import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorPage } from '@/components/ui/ErrorPage'

/* ═══════════════════════════════════════════════════════════════════════════
   NotFound (404) — uses the shared ErrorPage component
═══════════════════════════════════════════════════════════════════════════ */

export function NotFound() {
  const navigate = useNavigate()

  return (
    <ErrorPage
      code="404"
      title="Page Not Found"
      description="The page you're looking for doesn't exist, has been moved, or never existed in the main sequence."
      backLabel="Go to Dashboard"
      onBack={() => navigate('/')}
      hideRetry={true}
    />
  )
}
