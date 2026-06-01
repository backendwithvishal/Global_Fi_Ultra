import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, BookMarked, Trash2, Eye, EyeOff, Tag, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { watchlistsApi } from '@/lib/api'
import type { Watchlist, CreateWatchlistFormData } from '@/types'
import { formatRelativeTime } from '@/lib/utils'
import { useApp } from '@/context/AppContext'

const createSchema = z.object({
  name:        z.string().min(1, 'Name required').max(100),
  description: z.string().max(500).optional(),
  isPublic:    z.boolean(),
  userId:      z.string().min(1, 'User ID required'),
})
type CreateForm = z.infer<typeof createSchema>

const addAssetSchema = z.object({
  symbol: z.string().min(1, 'Symbol required').max(20),
  notes:  z.string().max(200).optional(),
})
type AddAssetForm = z.infer<typeof addAssetSchema>

export function Watchlists() {
  const { toast, currentUser } = useApp()
  const [watchlists, setWatchlists]         = useState<Watchlist[]>([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState<string | null>(null)
  const [createOpen, setCreateOpen]         = useState(false)
  const [selectedWL, setSelectedWL]         = useState<Watchlist | null>(null)
  const [addAssetOpen, setAddAssetOpen]     = useState(false)
  const [deletingId, setDeletingId]         = useState<string | null>(null)

  const cf = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: '', description: '', isPublic: false as boolean, userId: currentUser?._id ?? '' },
  })
  const af = useForm<AddAssetForm>({
    resolver: zodResolver(addAssetSchema),
    defaultValues: { symbol: '', notes: '' },
  })

  const fetch = useCallback(async () => {
    try { setLoading(true); setError(null)
      const r = await watchlistsApi.list({ limit: 50 })
      setWatchlists(r.watchlists ?? [])
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleCreate = async (data: CreateForm) => {
    try {
      const wl = await watchlistsApi.create(data as CreateWatchlistFormData)
      setWatchlists((p: Watchlist[]) => [wl, ...p]); setCreateOpen(false); cf.reset()
      toast.success('Created', `"${wl.name}" is ready.`)
    } catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
  }

  const handleDelete = async (id: string, name: string) => {
    try { setDeletingId(id); await watchlistsApi.delete(id)
      setWatchlists((p: Watchlist[]) => p.filter((w: Watchlist) => w._id !== id))
      toast.success('Deleted', `"${name}" removed.`)
    } catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
    finally { setDeletingId(null) }
  }

  const handleAddAsset = async (data: AddAssetForm) => {
    if (!selectedWL) return
    try {
      const updated = await watchlistsApi.addAsset(selectedWL._id, data.symbol.toUpperCase(), data.notes)
      setWatchlists((p: Watchlist[]) => p.map((w: Watchlist) => w._id === updated._id ? updated : w))
      setSelectedWL(updated); af.reset()
      toast.success('Added', `${data.symbol.toUpperCase()} added.`)
    } catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
  }

  const handleRemoveAsset = async (wlId: string, symbol: string) => {
    try {
      const updated = await watchlistsApi.removeAsset(wlId, symbol)
      setWatchlists((p: Watchlist[]) => p.map((w: Watchlist) => w._id === updated._id ? updated : w))
      if (selectedWL?._id === wlId) setSelectedWL(updated)
      toast.success('Removed', `${symbol} removed.`)
    } catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
  }

  return (
    <div className="p-5 sm:p-6 max-w-[1400px] mx-auto page-enter">
      <PageHeader
        title="Watchlists"
        description="Track your favorite financial assets"
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Watchlist
          </Button>
        }
      />

      {error && <ErrorState message={error} onRetry={fetch} className="mb-5" />}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}><CardContent className="p-5 space-y-3">
              <Skeleton className="h-5 w-32" /><Skeleton className="h-4 w-full" />
              <div className="flex gap-2"><Skeleton className="h-5 w-14 rounded-md" /><Skeleton className="h-5 w-14 rounded-md" /></div>
            </CardContent></Card>
          ))}
        </div>
      ) : watchlists.length === 0 ? (
        <EmptyState icon={<BookMarked className="h-10 w-10" />} title="No watchlists yet"
          description="Create your first watchlist to start tracking assets."
          action={{ label: 'Create Watchlist', onClick: () => setCreateOpen(true) }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {watchlists.map((wl, i) => (
              <motion.div key={wl._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:border-border transition-colors group h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground truncate">{wl.name}</h3>
                        {wl.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{wl.description}</p>}
                      </div>
                      <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm" onClick={() => { setSelectedWL(wl); setAddAssetOpen(true) }} aria-label="Add asset">
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(wl._id, wl.name)}
                          loading={deletingId === wl._id} className="text-red-400 hover:text-red-300 hover:bg-red-500/10" aria-label="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Asset chips */}
                    <div className="flex flex-wrap gap-1.5 mb-3 flex-1 min-h-[28px]">
                      {wl.assets.slice(0, 6).map((a) => (
                        <div key={a.symbol} className="group/chip flex items-center gap-1 bg-secondary/80 hover:bg-secondary rounded-md px-2 py-0.5 text-xs font-medium text-foreground border border-border/40">
                          {a.symbol}
                          <button onClick={() => handleRemoveAsset(wl._id, a.symbol)}
                            className="opacity-0 group-hover/chip:opacity-100 transition-opacity text-muted-foreground hover:text-red-400"
                            aria-label={`Remove ${a.symbol}`}>
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ))}
                      {wl.assets.length > 6 && <span className="text-xs text-muted-foreground px-1 py-0.5">+{wl.assets.length - 6}</span>}
                      {wl.assets.length === 0 && <span className="text-xs text-muted-foreground italic">No assets yet</span>}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="muted" className="text-[10px]">{wl.assets.length} assets</Badge>
                        <Badge variant={wl.isPublic ? 'info' : 'muted'} className="text-[10px]">
                          {wl.isPublic ? <><Eye className="h-2.5 w-2.5 mr-1" />Public</> : <><EyeOff className="h-2.5 w-2.5 mr-1" />Private</>}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{formatRelativeTime(wl.updatedAt)}</span>
                    </div>

                    {wl.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        {wl.tags.map((t) => <span key={t} className="text-[10px] text-muted-foreground">#{t}</span>)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Watchlist</DialogTitle>
            <DialogDescription>Add a new watchlist to track your assets.</DialogDescription>
          </DialogHeader>
          <form onSubmit={cf.handleSubmit(handleCreate)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="wl-name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name *</label>
              <Input id="wl-name" {...cf.register('name')} placeholder="My Portfolio" error={!!cf.formState.errors.name} />
              {cf.formState.errors.name && <p className="text-xs text-red-400">{cf.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="wl-desc" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
              <Input id="wl-desc" {...cf.register('description')} placeholder="Optional…" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="wl-uid" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">User ID *</label>
              <Input id="wl-uid" {...cf.register('userId')} placeholder="MongoDB ObjectID" error={!!cf.formState.errors.userId} />
              {cf.formState.errors.userId && <p className="text-xs text-red-400">{cf.formState.errors.userId.message}</p>}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...cf.register('isPublic')} className="rounded" />
              <span className="text-sm text-foreground">Make public</span>
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" loading={cf.formState.isSubmitting}>Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add asset dialog */}
      <Dialog open={addAssetOpen} onOpenChange={setAddAssetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Asset</DialogTitle>
            <DialogDescription>Add a symbol to "{selectedWL?.name}"</DialogDescription>
          </DialogHeader>
          <form onSubmit={af.handleSubmit(handleAddAsset)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="as-sym" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Symbol *</label>
              <Input id="as-sym" {...af.register('symbol')} placeholder="AAPL, BTC…"
                onChange={(e) => af.setValue('symbol', e.target.value.toUpperCase())} error={!!af.formState.errors.symbol} />
              {af.formState.errors.symbol && <p className="text-xs text-red-400">{af.formState.errors.symbol.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="as-notes" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</label>
              <Input id="as-notes" {...af.register('notes')} placeholder="Optional…" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddAssetOpen(false)}>Cancel</Button>
              <Button type="submit" loading={af.formState.isSubmitting}>Add Asset</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
