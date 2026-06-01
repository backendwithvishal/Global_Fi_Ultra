import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, RefreshCw, Activity,
  DollarSign, Bitcoin, Globe, Newspaper, BarChart2,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/common/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { financialApi } from '@/lib/api'
import type { FinancialDataResponse, CryptoData, NewsArticle } from '@/types'
import { formatCurrency, formatPercent, formatRelativeTime, formatCompact, getPriceChangeColor } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useApp } from '@/context/AppContext'

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.25 } },
}

export function Dashboard() {
  const { toast } = useApp()
  const [data, setData] = useState<FinancialDataResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError(null)
      let result: FinancialDataResponse
      try { result = await financialApi.getCached() }
      catch { result = await financialApi.getLive() }
      setData(result)
      setLastUpdated(new Date())
      if (isRefresh) toast.success('Refreshed', 'Market data updated.')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load market data'
      setError(msg)
      if (isRefresh) toast.error('Refresh failed', msg)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
    const t = setInterval(() => fetchData(true), 60000)
    return () => clearInterval(t)
  }, [fetchData])

  const stock   = data?.data?.stock
  const cryptos = data?.data?.crypto ?? []
  const news    = data?.data?.news ?? []
  const forex   = data?.data?.forex
  const econ    = data?.data?.economic

  const chartData = cryptos.slice(0, 7).map((c) => ({
    name:   c.symbol.toUpperCase(),
    change: c.price_change_percentage_24h,
  }))

  return (
    <div className="p-5 sm:p-6 max-w-[1600px] mx-auto page-enter">
      <PageHeader
        title="Dashboard"
        description={lastUpdated ? `Updated ${formatRelativeTime(lastUpdated.toISOString())}` : 'Real-time financial overview'}
        actions={
          <Button variant="outline" size="sm" onClick={() => fetchData(true)} loading={refreshing}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
        }
      />

      {error && !loading && <ErrorState message={error} onRetry={() => fetchData()} className="mb-6" />}

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

        {/* ── Stock KPIs ── */}
        <motion.div variants={item}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard title={stock?.symbol ?? 'Stock'} value={stock?.price} change={stock?.changePercent}
              changeLabel="today" isCurrency loading={loading} icon={<TrendingUp className="h-4 w-4" />} accent="default" />
            <StatCard title="Open"    value={stock?.open}       isCurrency loading={loading} icon={<BarChart2 className="h-4 w-4" />} />
            <StatCard title="52W High" value={stock?.week52High} isCurrency loading={loading} icon={<TrendingUp className="h-4 w-4" />} accent="green" />
            <StatCard title="52W Low"  value={stock?.week52Low}  isCurrency loading={loading} icon={<TrendingDown className="h-4 w-4" />} accent="red" />
            <StatCard title="Volume"
              value={stock?.volume ? new Intl.NumberFormat('en-US', { notation: 'compact' }).format(stock.volume) : undefined}
              loading={loading} icon={<Activity className="h-4 w-4" />} />
          </div>
        </motion.div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Crypto table */}
          <motion.div variants={item} className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <Bitcoin className="h-4 w-4 text-amber-400" />
                  Crypto Markets
                </CardTitle>
                <Badge variant="muted">24h</Badge>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="px-5 pb-4 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-1.5"><Skeleton className="h-3.5 w-16" /><Skeleton className="h-3 w-10" /></div>
                        </div>
                        <div className="text-right space-y-1.5"><Skeleton className="h-3.5 w-20" /><Skeleton className="h-3 w-12" /></div>
                      </div>
                    ))}
                  </div>
                ) : cryptos.length === 0 ? (
                  <EmptyState icon={<Bitcoin className="h-8 w-8" />} title="No crypto data" />
                ) : (
                  <div className="divide-y divide-border/60">
                    {cryptos.slice(0, 7).map((c) => <CryptoRow key={c.id} crypto={c} />)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bar chart */}
            {!loading && chartData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>24h Change (%)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-44" aria-label="24h price change chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 12%)" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(240 5% 55%)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(240 5% 55%)' }} axisLine={false} tickLine={false} />
                        <Tooltip
                          formatter={(v) => [`${Number(v).toFixed(2)}%`, 'Change']}
                          contentStyle={{ background: 'hsl(240 10% 5.5%)', border: '1px solid hsl(240 6% 12%)', borderRadius: '10px', fontSize: '12px' }}
                          cursor={{ fill: 'hsl(240 6% 12%)' }}
                        />
                        <Bar dataKey="change" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, i) => (
                            <Cell key={i} fill={entry.change >= 0 ? 'hsl(142 71% 48%)' : 'hsl(0 72% 58%)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Right column */}
          <motion.div variants={item} className="space-y-4">
            {/* Economic */}
            {(loading || econ) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-400" />
                    Economic Indicator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-9 w-28" /><Skeleton className="h-3 w-16" /></div>
                  ) : econ ? (
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{econ.seriesId}</p>
                      <p className="text-3xl font-bold tabular-nums text-foreground">
                        {econ.value !== undefined ? `${econ.value}${econ.unit ? ` ${econ.unit}` : ''}` : '—'}
                      </p>
                      {econ.date && <p className="text-xs text-muted-foreground mt-1">As of {econ.date}</p>}
                      {econ.name && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{econ.name}</p>}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )}

            {/* News */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-purple-400" />
                  Market News
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="px-5 pb-4 space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-1.5">
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    ))}
                  </div>
                ) : news.length === 0 ? (
                  <EmptyState icon={<Newspaper className="h-7 w-7" />} title="No news" />
                ) : (
                  <div className="divide-y divide-border/60">
                    {news.slice(0, 6).map((a, i) => <NewsItem key={i} article={a} />)}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Forex */}
        {(loading || forex) && (
          <motion.div variants={item}>
            <Card>
              <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  Forex Rates
                </CardTitle>
                {forex?.base && <Badge variant="muted">Base: {forex.base}</Badge>}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-2">
                    {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
                  </div>
                ) : forex?.rates ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-2">
                    {Object.entries(forex.rates).slice(0, 20).map(([cur, rate]) => (
                      <div key={cur} className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors border border-border/40">
                        <span className="text-xs font-bold text-foreground">{cur}</span>
                        <span className="text-[10px] text-muted-foreground tabular-nums mt-0.5">
                          {typeof rate === 'number' ? rate.toFixed(3) : rate}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

function CryptoRow({ crypto }: { crypto: CryptoData }) {
  const pos = crypto.price_change_percentage_24h >= 0
  return (
    <div className="flex items-center justify-between px-5 py-3 hover:bg-accent/50 transition-colors group">
      <div className="flex items-center gap-3">
        {crypto.image ? (
          <img src={crypto.image} alt={crypto.name} className="w-7 h-7 rounded-full" loading="lazy" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">
            {crypto.symbol[0].toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">{crypto.name}</p>
          <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold tabular-nums text-foreground">{formatCurrency(crypto.current_price)}</p>
        <div className={`flex items-center justify-end gap-0.5 text-xs font-medium tabular-nums ${pos ? 'text-emerald-400' : 'text-red-400'}`}>
          {pos ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {formatPercent(crypto.price_change_percentage_24h)}
        </div>
      </div>
    </div>
  )
}

function NewsItem({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block px-5 py-3 hover:bg-accent/50 transition-colors group"
      aria-label={article.title}
    >
      <p className="text-sm font-medium leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
        {article.title}
      </p>
      <div className="flex items-center gap-2 mt-1">
        {article.source && <span className="text-xs text-muted-foreground">{article.source}</span>}
        {article.publishedAt && <span className="text-xs text-muted-foreground">· {formatRelativeTime(article.publishedAt)}</span>}
      </div>
    </a>
  )
}
