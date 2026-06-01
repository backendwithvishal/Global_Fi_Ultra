import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, RefreshCw, TrendingUp, Loader2, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { financialApi } from '@/lib/api'
import type { FinancialDataResponse } from '@/types'
import { formatCurrency, formatPercent, formatCompact } from '@/lib/utils'
import { useApp } from '@/context/AppContext'

const FRED = [
  { value: 'GDP',      label: 'GDP' },
  { value: 'UNRATE',   label: 'Unemployment Rate' },
  { value: 'CPIAUCSL', label: 'CPI (Inflation)' },
  { value: 'FEDFUNDS', label: 'Fed Funds Rate' },
  { value: 'DGS10',    label: '10-Year Treasury' },
]

export function Markets() {
  const { toast } = useApp()
  const [symbol, setSymbol]     = useState('IBM')
  const [crypto, setCrypto]     = useState('bitcoin,ethereum,solana')
  const [currency, setCurrency] = useState('USD')
  const [fred, setFred]         = useState('GDP')
  const [data, setData]         = useState<FinancialDataResponse | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const fetchLive = useCallback(async () => {
    try {
      setLoading(true); setError(null)
      const result = await financialApi.getLive({ symbol, crypto, currency, fredSeries: fred })
      setData(result)
      toast.success('Live data fetched', `${symbol} loaded.`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed'
      setError(msg); toast.error('Fetch failed', msg)
    } finally { setLoading(false) }
  }, [symbol, crypto, currency, fred, toast])

  const stock   = data?.data?.stock
  const cryptos = data?.data?.crypto ?? []

  return (
    <div className="p-5 sm:p-6 max-w-[1600px] mx-auto page-enter">
      <PageHeader
        title="Live Markets"
        description="Fetch real-time data from all financial APIs"
        actions={
          <Button onClick={fetchLive} loading={loading} className="gap-2">
            <Zap className="h-3.5 w-3.5" />
            Fetch Live
          </Button>
        }
      />

      {/* Query controls */}
      <Card className="mb-5">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'sym', label: 'Stock Symbol',
                el: (
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input id="sym" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      placeholder="IBM, AAPL…" className="pl-8" />
                  </div>
                ),
              },
              {
                id: 'cry', label: 'Crypto IDs',
                el: <Input id="cry" value={crypto} onChange={(e) => setCrypto(e.target.value)} placeholder="bitcoin,ethereum…" />,
              },
              {
                id: 'cur', label: 'Base Currency',
                el: <Input id="cur" value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} placeholder="USD" />,
              },
              {
                id: 'fred', label: 'FRED Series',
                el: (
                  <Select value={fred} onValueChange={setFred}>
                    <SelectTrigger id="fred"><SelectValue /></SelectTrigger>
                    <SelectContent>{FRED.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                ),
              },
            ].map(({ id, label, el }) => (
              <div key={id} className="space-y-1.5">
                <label htmlFor={id} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
                {el}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && <ErrorState message={error} onRetry={fetchLive} className="mb-5" />}

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Fetching live market data…</p>
        </div>
      )}

      {!loading && data && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={data.status === 'success' ? 'success' : data.status === 'partial' ? 'warning' : 'destructive'}>
              {data.status}
            </Badge>
            {data.metadata?.totalDuration && <Badge variant="muted">{data.metadata.totalDuration}ms</Badge>}
            {data.metadata?.apiCallsMade !== undefined && <Badge variant="muted">{data.metadata.apiCallsMade} API calls</Badge>}
            {data.metadata?.cacheHits !== undefined && <Badge variant="info">{data.metadata.cacheHits} cache hits</Badge>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Stock */}
            {stock && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      {stock.symbol}
                      {stock.name && <span className="text-muted-foreground font-normal text-xs">· {stock.name}</span>}
                    </CardTitle>
                    {stock.exchange && <Badge variant="muted">{stock.exchange}</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-3 mb-5">
                    <span className="text-4xl font-bold tabular-nums text-foreground">
                      {formatCurrency(stock.price, stock.currency ?? 'USD')}
                    </span>
                    {stock.changePercent !== undefined && (
                      <div className={`flex items-center gap-0.5 text-sm font-semibold mb-1 ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stock.changePercent >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {formatPercent(stock.changePercent)}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Open',       value: formatCurrency(stock.open) },
                      { label: 'High',       value: formatCurrency(stock.high) },
                      { label: 'Low',        value: formatCurrency(stock.low) },
                      { label: 'Prev Close', value: formatCurrency(stock.previousClose) },
                      { label: 'Volume',     value: stock.volume ? formatCompact(stock.volume) : '—' },
                      { label: 'P/E',        value: stock.pe?.toFixed(2) ?? '—' },
                    ].map((s) => (
                      <div key={s.label} className="rounded-lg bg-secondary/60 border border-border/40 p-2.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                        <p className="text-sm font-semibold tabular-nums text-foreground mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Crypto table */}
            {cryptos.length > 0 && (
              <Card>
                <CardHeader className="pb-3"><CardTitle>Crypto Prices</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" aria-label="Cryptocurrency prices">
                      <thead>
                        <tr className="border-b border-border/60">
                          {['Asset', 'Price', '24h', 'Market Cap'].map((h, i) => (
                            <th key={h} className={`py-2.5 text-xs font-medium text-muted-foreground ${i === 0 ? 'text-left px-5' : 'text-right px-4'} ${i === 3 ? 'hidden sm:table-cell' : ''}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {cryptos.map((c) => {
                          const pos = c.price_change_percentage_24h >= 0
                          return (
                            <tr key={c.id} className="border-b border-border/40 hover:bg-accent/40 transition-colors">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                  {c.image && <img src={c.image} alt={c.name} className="w-5 h-5 rounded-full" loading="lazy" />}
                                  <div>
                                    <p className="font-medium text-foreground">{c.name}</p>
                                    <p className="text-xs text-muted-foreground uppercase">{c.symbol}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums font-semibold text-foreground">{formatCurrency(c.current_price)}</td>
                              <td className="px-4 py-3 text-right">
                                <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${pos ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {pos ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                  {formatPercent(c.price_change_percentage_24h)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell tabular-nums">{formatCompact(c.market_cap)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      )}

      {!loading && !data && !error && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Ready to fetch live data</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-xs">Configure your query and click Fetch Live to get real-time market data.</p>
          <Button onClick={fetchLive} className="gap-2">
            <Zap className="h-4 w-4" />
            Fetch Live Data
          </Button>
        </div>
      )}
    </div>
  )
}
