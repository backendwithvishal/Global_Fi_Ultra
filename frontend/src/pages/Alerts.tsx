import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Bell, BellOff, Trash2, CheckCircle2, Clock } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { alertsApi } from '@/lib/api'
import type { Alert, AssetType, AlertCondition, CreateAlertFormData } from '@/types'
import { formatCurrency, formatRelativeTime, formatDate } from '@/lib/utils'
import { useApp } from '@/context/AppContext'

const schema = z.object({
  userId:      z.string().min(1, 'User ID required'),
  symbol:      z.string().min(1, 'Symbol required').max(20),
  assetType:   z.enum(['stock','crypto','forex','commodity','index']),
  condition:   z.enum(['above','below','equals']),
  targetPrice: z.number().positive('Must be positive'),
  notes:       z.string().max(500).optional(),
})
type Form = z.infer<typeof schema>

const condCls: Record<AlertCondition, string> = {
  above:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  below:  'bg-red-500/10 text-red-400 border-red-500/20',
  equals: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

export function Alerts() {
  const { toast, currentUser } = useApp()
  const [alerts, setAlerts]       = useState<Alert[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [createOpen, setCreate]   = useState(false)
  const [deletingId, setDeleting] = useState<string | null>(null)
  const [tab, setTab]             = useState('active')

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { userId: currentUser?._id ?? '', symbol: '', assetType: 'stock', condition: 'above', targetPrice: 0, notes: '' },
  })

  const fetchAlerts = useCallback(async () => {
    try { setLoading(true); setError(null)
      const r = await alertsApi.list({ limit: 100 })
      setAlerts(r.alerts ?? [])
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAlerts() }, [fetchAlerts])

  const handleCreate = async (data: Form) => {
    try {
      const a = await alertsApi.create({ ...data, notificationMethod: { email: true, websocket: true } } as CreateAlertFormData)
      setAlerts((p) => [a, ...p]); setCreate(false); form.reset()
      toast.success('Alert created', `${data.symbol} alert set at ${formatCurrency(data.targetPrice)}.`)
    } catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
  }

  const handleDelete = async (id: string) => {
    try { setDeleting(id); await alertsApi.delete(id); setAlerts((p) => p.filter((a) => a._id !== id)); toast.success('Deleted') }
    catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
    finally { setDeleting(null) }
  }

  const handleToggle = async (alert: Alert) => {
    try {
      const updated = alert.isActive ? await alertsApi.deactivate(alert._id) : await alertsApi.activate(alert._id)
      setAlerts((p) => p.map((a) => a._id === updated._id ? updated : a))
      toast.success(updated.isActive ? 'Activated' : 'Deactivated')
    } catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
  }

  const active    = alerts.filter((a) => a.isActive && !a.isTriggered)
  const triggered = alerts.filter((a) => a.isTriggered)
  const inactive  = alerts.filter((a) => !a.isActive && !a.isTriggered)
  const display   = tab === 'active' ? active : tab === 'triggered' ? triggered : inactive

  return (
    <div className="p-5 sm:p-6 max-w-[1200px] mx-auto page-enter">
      <PageHeader
        title="Price Alerts"
        description="Get notified when assets hit your target prices"
        actions={
          <Button size="sm" onClick={() => setCreate(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Alert
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Active',    count: active.length,    icon: Bell,         cls: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Triggered', count: triggered.length, icon: CheckCircle2, cls: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Inactive',  count: inactive.length,  icon: BellOff,      cls: 'text-muted-foreground', bg: 'bg-secondary/60 border-border/40' },
        ].map((s) => (
          <button key={s.label} onClick={() => setTab(s.label.toLowerCase())}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all hover:border-border ${tab === s.label.toLowerCase() ? s.bg : 'bg-card border-border/60'}`}>
            <s.icon className={`h-5 w-5 ${s.cls}`} />
            <div className="text-left">
              <p className="text-xl font-bold text-foreground">{loading ? '—' : s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </button>
        ))}
      </div>

      {error && <ErrorState message={error} onRetry={fetchAlerts} className="mb-5" />}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="triggered">Triggered ({triggered.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactive.length})</TabsTrigger>
        </TabsList>

        {['active','triggered','inactive'].map((tv) => (
          <TabsContent key={tv} value={tv}>
            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}><CardContent className="p-4 flex items-center justify-between">
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-40" /></div>
                    <Skeleton className="h-8 w-16 rounded-lg" />
                  </CardContent></Card>
                ))}
              </div>
            ) : display.length === 0 ? (
              <EmptyState icon={<Bell className="h-9 w-9" />} title={`No ${tv} alerts`}
                description={tv === 'active' ? 'Create an alert to get notified when prices move.' : `No ${tv} alerts found.`}
                action={tv === 'active' ? { label: 'Create Alert', onClick: () => setCreate(true) } : undefined} />
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {display.map((alert, i) => (
                    <motion.div key={alert._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }} transition={{ delay: i * 0.025 }}>
                      <Card className="hover:border-border transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`p-2 rounded-lg ${alert.isTriggered ? 'bg-blue-500/10' : alert.isActive ? 'bg-emerald-500/10' : 'bg-secondary/60'}`}>
                                {alert.isTriggered
                                  ? <CheckCircle2 className="h-4 w-4 text-blue-400" />
                                  : alert.isActive
                                  ? <Bell className="h-4 w-4 text-emerald-400" />
                                  : <BellOff className="h-4 w-4 text-muted-foreground" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sm text-foreground">{alert.symbol}</span>
                                  <Badge variant="muted" className="text-[10px]">{alert.assetType}</Badge>
                                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md border ${condCls[alert.condition]}`}>
                                    {alert.condition} {formatCurrency(alert.targetPrice)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap text-xs text-muted-foreground">
                                  {alert.currentPrice && <span>Current: {formatCurrency(alert.currentPrice)}</span>}
                                  {alert.isTriggered && alert.triggeredAt && (
                                    <span className="text-blue-400">Triggered {formatRelativeTime(alert.triggeredAt)} at {formatCurrency(alert.triggeredPrice)}</span>
                                  )}
                                  {alert.expiresAt && (
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Expires {formatDate(alert.expiresAt)}</span>
                                  )}
                                  {alert.notes && <span className="truncate max-w-[180px]">{alert.notes}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {!alert.isTriggered && (
                                <Button variant="ghost" size="icon-sm" onClick={() => handleToggle(alert)}
                                  aria-label={alert.isActive ? 'Deactivate' : 'Activate'}>
                                  {alert.isActive ? <BellOff className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                                </Button>
                              )}
                              <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(alert._id)}
                                loading={deletingId === alert._id}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10" aria-label="Delete">
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
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={createOpen} onOpenChange={setCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Price Alert</DialogTitle>
            <DialogDescription>Get notified when an asset hits your target price.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="al-sym" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Symbol *</label>
                <Input id="al-sym" {...form.register('symbol')} placeholder="AAPL"
                  onChange={(e) => form.setValue('symbol', e.target.value.toUpperCase())} error={!!form.formState.errors.symbol} />
                {form.formState.errors.symbol && <p className="text-xs text-red-400">{form.formState.errors.symbol.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="al-type" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Asset Type</label>
                <Select value={form.watch('assetType')} onValueChange={(v) => form.setValue('assetType', v as AssetType)}>
                  <SelectTrigger id="al-type"><SelectValue /></SelectTrigger>
                  <SelectContent>{['stock','crypto','forex','commodity','index'].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="al-cond" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Condition</label>
                <Select value={form.watch('condition')} onValueChange={(v) => form.setValue('condition', v as AlertCondition)}>
                  <SelectTrigger id="al-cond"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Price above</SelectItem>
                    <SelectItem value="below">Price below</SelectItem>
                    <SelectItem value="equals">Price equals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="al-price" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Target Price *</label>
                <Input id="al-price" type="number" step="0.01" placeholder="150.00"
                  {...form.register('targetPrice', { valueAsNumber: true })} error={!!form.formState.errors.targetPrice} />
                {form.formState.errors.targetPrice && <p className="text-xs text-red-400">{form.formState.errors.targetPrice.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="al-uid" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">User ID *</label>
              <Input id="al-uid" {...form.register('userId')} placeholder="MongoDB ObjectID" error={!!form.formState.errors.userId} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="al-notes" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</label>
              <Input id="al-notes" {...form.register('notes')} placeholder="Optional…" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreate(false)}>Cancel</Button>
              <Button type="submit" loading={form.formState.isSubmitting}>Create Alert</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
