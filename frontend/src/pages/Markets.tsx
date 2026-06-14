import React, { useState, useCallback } from 'react'
import { Loader2, TrendingUp, Search, Cpu, RefreshCw } from 'lucide-react'
import { MarketQueryForm } from '@/components/markets/MarketQueryForm'
import { MarketResultsTable } from '@/components/markets/MarketResultsTable'
import { useMarketData } from '@/hooks/useMarketData'
import { useToast } from '@/components/ui/Toast'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

export function Markets() {
  const toast = useToast()
  const [symbol, setSymbol]     = useState('IBM')
  const [crypto, setCrypto]     = useState('bitcoin,ethereum,solana')
  const [currency, setCurrency] = useState('USD')
  const [fredSeries, setFred]   = useState('GDP')
  const { data, loading, usingMock, reload } = useMarketData(false)

  const handleFetch = useCallback(async () => {
    await reload({ symbol, crypto })
    if (usingMock) toast.info('Using cached data', 'Backend offline — showing demo data.')
    else toast.success('Data fetched', `Loaded live data for ${symbol}.`)
  }, [symbol, crypto, reload, usingMock, toast])

  return (
    <div className="p-5 sm:p-8 max-w-[1400px] mx-auto page-enter animate-fade-in">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[var(--text-1)] tracking-tight">Live Markets</h1>
            {usingMock && <Badge variant="amber" dot>Demo Data</Badge>}
          </div>
          <p className="text-sm text-[var(--text-3)]">
            Fetch real-time data from 6+ financial APIs — stocks, crypto, forex, news & economic indicators
          </p>
        </div>
        {data && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFetch}
            loading={loading}
            icon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh
          </Button>
        )}
      </motion.div>

      {/* ── Query Form ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="card p-5 mb-5"
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center">
            <Search className="h-3.5 w-3.5 text-[var(--accent-bright)]" />
          </div>
          <h2 className="text-sm font-semibold text-[var(--text-1)]">Query Parameters</h2>
        </div>
        <MarketQueryForm
          symbol={symbol} crypto={crypto} currency={currency} fredSeries={fredSeries} loading={loading}
          onSymbol={setSymbol} onCrypto={setCrypto} onCurrency={setCurrency} onFred={setFred} onFetch={handleFetch}
        />
      </motion.div>

      {/* ── Loading ── */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 border-2 border-[var(--border-2)] border-t-[var(--accent)] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="h-4 w-4 text-[var(--accent-bright)]" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--text-1)]">Fetching live market data…</p>
            <p className="text-xs text-[var(--text-3)] mt-0.5">Aggregating from multiple API sources</p>
          </div>
        </motion.div>
      )}

      {/* ── Results ── */}
      {!loading && data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MarketResultsTable data={data} />
        </motion.div>
      )}

      {/* ── Empty state ── */}
      {!loading && !data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-3)] border border-[var(--border-2)] flex items-center justify-center mb-5">
            <TrendingUp className="h-8 w-8 text-[var(--text-3)]" />
          </div>
          <h3 className="text-base font-semibold text-[var(--text-1)] mb-2">Ready to fetch live data</h3>
          <p className="text-sm text-[var(--text-3)] max-w-xs mb-6">
            Configure your query parameters above and click "Fetch Live Data" to get real-time market data from all sources.
          </p>
          <Button onClick={handleFetch} loading={loading} icon={<TrendingUp className="h-4 w-4" />}>
            Fetch Live Data
          </Button>
        </motion.div>
      )}
    </div>
  )
}
