import React, { useMemo } from 'react'
import { RefreshCw, TrendingUp, Clock, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { KPICards } from '@/components/dashboard/KPICards'
import { CryptoWidget } from '@/components/dashboard/CryptoWidget'
import { NewsWidget } from '@/components/dashboard/NewsWidget'
import { PortfolioChart } from '@/components/dashboard/PortfolioChart'
import { StockTable } from '@/components/dashboard/StockTable'
import { useMarketData } from '@/hooks/useMarketData'
import { useToast } from '@/components/ui/Toast'
import { useApp } from '@/context/AppContext'
import { motion } from 'framer-motion'

/* ─── Time-of-day greeting ─── */
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function Dashboard() {
  const toast = useToast()
  const { currentUser } = useApp()
  const { data, loading, usingMock, lastUpdated, reload } = useMarketData(true)

  const handleRefresh = async () => {
    await reload()
    if (usingMock) toast.info('Using cached data', 'Backend offline — showing demo data.')
    else toast.success('Refreshed', 'Market data updated.')
  }

  const stock   = data?.data?.stock
  const cryptos = (data?.data?.crypto ?? []) as any[]
  const news    = (data?.data?.news   ?? []) as any[]

  const firstName = currentUser?.firstName ?? 'Trader'
  const greeting  = useMemo(() => getGreeting(), [])

  const now = new Date()
  const timeStr = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(now)

  return (
    <div className="min-h-full page-enter">
      <div className="p-6 sm:p-8 max-w-[1760px] mx-auto space-y-6">

        {/* ── Premium welcome header ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-[var(--text-1)] tracking-tight">
                {greeting}, <span className="text-[var(--accent-bright)]">{firstName}</span>
              </h1>
              {usingMock && <Badge variant="amber" dot>Demo Data</Badge>}
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
              <Clock className="w-3 h-3" />
              <span>{timeStr}</span>
              {lastUpdated && (
                <>
                  <span>·</span>
                  <span>
                    Updated at {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(lastUpdated)}
                  </span>
                </>
              )}
              {!lastUpdated && !loading && <span>Loading market data…</span>}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* AI quick access */}
            <Link
              to="/ai"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--ai-border)] bg-[var(--ai-subtle)] text-xs font-semibold text-[var(--ai-bright)] hover:bg-[var(--ai-subtle)] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Insights
              <ArrowRight className="w-3 h-3" />
            </Link>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              loading={loading}
              icon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Mock data banner */}
        {usingMock && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--warning-border)] bg-[var(--warning-subtle)]"
          >
            <TrendingUp className="w-4 h-4 text-[var(--warning-bright)] shrink-0" />
            <p className="text-xs text-[var(--warning-bright)]">
              <strong>Demo mode:</strong> The backend API is offline. Displaying realistic mock data for demonstration purposes.
              {' '}<Link to="/status" className="underline font-semibold">Check system status →</Link>
            </p>
          </motion.div>
        )}

        {/* ── KPI cards ── */}
        <KPICards stock={stock} loading={loading} />

        {/* ── Portfolio chart ── */}
        <PortfolioChart loading={loading} />

        {/* ── Crypto + News ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <CryptoWidget cryptos={cryptos} loading={loading} />
          </div>
          <div>
            <NewsWidget articles={news} loading={loading} />
          </div>
        </div>

        {/* ── Stock table ── */}
        <StockTable loading={loading} />
      </div>
    </div>
  )
}
