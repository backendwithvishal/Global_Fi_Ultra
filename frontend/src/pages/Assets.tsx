import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, BarChart3, Trash2, TrendingUp } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { assetsApi } from '@/lib/api'
import type { FinancialAsset, AssetType } from '@/types'
import { formatCurrency, formatRelativeTime, getAssetTypeBadgeColor, getAssetTypeIcon } from '@/lib/utils'
import { useApp } from '@/context/AppContext'

const schema = z.object({
  symbol:   z.string().min(1, 'Required').max(20),
  name:     z.string().min(1, 'Required').max(100),
  type:     z.enum(['stock', 'crypto', 'forex', 'commodity', 'index']),
  currency: z.string(),
})
type Form = z.infer<typeof schema>

export function Assets() {
  const { toast } = useApp()
  const [assets, setAssets]           = useState<FinancialAsset[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [search, setSearch]           = useState('')
  const [typeFilter, setTypeFilter]   = useState('all')
  const [createOpen, setCreateOpen]   = useState(false)
  const [deletingSymbol, setDeleting] = useState<string | null>(null)
  const [fetchingLive, setFetchLive]  = useState<string | null>(null)

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { symbol: '', name: '', type: 'stock', currency: 'USD' },
  })

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true); setError(null)
      const r = await assetsApi.list({ search: search || undefined, type: typeFilter !== 'all' ? typeFilter : undefined, limit: 50 })
      setAssets(r.assets ?? [])
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed') }
    finally { setLoading(false) }
  }, [search, typeFilter])

  useEffect(() => { fetchAssets() }, [fetchAssets])

  const handleCreate = async (data: Form) => {
    try {
      const a = await assetsApi.create({ ...data, symbol: data.symbol.toUpperCase() })
      setAssets((p) => [a, ...p]); setCreateOpen(false); form.reset()
      toast.success('Asset added', `${a.symbol} is now tracked.`)
    } catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
  }

  const handleDelete = async (symbol: string) => {
    try {
      setDeleting(symbol)
      await assetsApi.delete(symbol)
      setAssets((p) => p.filter((a) => a.symbol !== symbol))
      toast.success('Deleted', `${symbol} removed.`)
    } catch (err) { toast.error('Delete failed', err instanceof Error ? err.message : 'Unknown') }
    finally { setDeleting(null) }
  }

  const handleFetchLive = async (symbol: string) => {
    try {
      setFetchLive(symbol)
      const r = await assetsApi.getLive(symbol)
      if (r.assetInfo) setAssets((p) => p.map((a) => a.symbol === symbol ? { ...a, ...r.assetInfo } : a))
      toast.success('Updated', `${symbol} price refreshed.`)
    } catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
    finally { setFetchLive(null) }
  }

  return (
    <div className="p-5 sm:p-6 max-w-[1200px] mx-auto page-enter">
      <PageHeader
        title="Financial Assets"
        description="Manage tracked financial instruments"
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Asset
          </Button>
        }
      />

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets…" className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            {['all', 'stock', 'crypto', 'forex', 'commodity', 'index'].map((t) => (
              <SelectItem key={t} value={t}>{t === 'all' ? 'All types' : t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <ErrorState message={error} onRetry={fetchAssets} className="mb-5" />}

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i}><CardContent className="p-4 flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-40" /></div>
              <Skeleton className="h-6 w-16 rounded-md" />
            </CardContent></Card>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <EmptyState icon={<BarChart3 className="h-10 w-10" />} title="No assets found"
          description={search ? `No assets match "${search}"` : 'Add your first financial asset.'}
          action={!search ? { label: 'Add Asset', onClick: () => setCreateOpen(true) } : undefined} />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {assets.map((asset, i) => (
              <motion.div key={asset._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -8 }} transition={{ delay: i * 0.025 }}>
                <Card className="hover:border-border transition-colors group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/80 text-lg shrink-0 border border-border/40">
                        {getAssetTypeIcon(asset.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-foreground">{asset.symbol}</span>
                          <span className="text-sm text-muted-foreground truncate">{asset.name}</span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${getAssetTypeBadgeColor(asset.type)}`}>{asset.type}</span>
                          {!asset.isActive && <Badge variant="muted" className="text-[10px]">Inactive</Badge>}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          {asset.currentPrice && <span className="text-sm font-semibold tabular-nums text-foreground">{formatCurrency(asset.currentPrice, asset.currency)}</span>}
                          {asset.metadata?.exchange && <span className="text-xs text-muted-foreground">{asset.metadata.exchange}</span>}
                          {asset.lastUpdated && <span className="text-xs text-muted-foreground">Updated {formatRelativeTime(asset.lastUpdated)}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleFetchLive(asset.symbol)}
                          loading={fetchingLive === asset.symbol} aria-label={`Refresh ${asset.symbol}`}>
                          <TrendingUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(asset.symbol)}
                          loading={deletingSymbol === asset.symbol}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10" aria-label={`Delete ${asset.symbol}`}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Financial Asset</DialogTitle>
            <DialogDescription>Track a new financial instrument.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="a-sym" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Symbol *</label>
                <Input id="a-sym" {...form.register('symbol')} placeholder="AAPL"
                  onChange={(e) => form.setValue('symbol', e.target.value.toUpperCase())} error={!!form.formState.errors.symbol} />
                {form.formState.errors.symbol && <p className="text-xs text-red-400">{form.formState.errors.symbol.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="a-type" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</label>
                <Select value={form.watch('type')} onValueChange={(v) => form.setValue('type', v as AssetType)}>
                  <SelectTrigger id="a-type"><SelectValue /></SelectTrigger>
                  <SelectContent>{['stock','crypto','forex','commodity','index'].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="a-name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name *</label>
              <Input id="a-name" {...form.register('name')} placeholder="Apple Inc." error={!!form.formState.errors.name} />
              {form.formState.errors.name && <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="a-cur" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Currency</label>
              <Input id="a-cur" {...form.register('currency')} placeholder="USD"
                onChange={(e) => form.setValue('currency', e.target.value.toUpperCase())} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" loading={form.formState.isSubmitting}>Add Asset</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
