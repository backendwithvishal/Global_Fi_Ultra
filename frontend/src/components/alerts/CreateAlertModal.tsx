import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { alertsApi } from '@/lib/api'
import type { Alert, CreateAlertFormData } from '@/types'

const schema = z.object({
  userId:      z.string().min(1),
  symbol:      z.string().min(1).max(20),
  assetType:   z.enum(['stock','crypto','forex','commodity','index']),
  condition:   z.enum(['above','below','equals']),
  targetPrice: z.number().positive(),
  notes:       z.string().max(500).optional(),
})
type Form = z.infer<typeof schema>

// Level 3 inputs, Level 4 modal
const inputCls = 'w-full h-9 bg-slate-50 dark:bg-[var(--bg-input)] border border-slate-200 dark:border-[var(--border)] hover:border-slate-300 dark:hover:border-[var(--border-md)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-blue-500/30 rounded-lg px-3 text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] transition-all duration-150'
const labelCls = 'block text-xs font-medium text-[var(--text-2)] mb-1.5 uppercase tracking-wider'

interface Props { onClose: () => void; onCreated: (a: Alert) => void; currentUserId?: string }

export function CreateAlertModal({ onClose, onCreated, currentUserId }: Props) {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { userId: currentUserId ?? '', symbol: '', assetType: 'stock', condition: 'above', targetPrice: 0 },
  })

  const onSubmit = async (data: Form) => {
    try {
      const alert = await alertsApi.create({ ...data, notificationMethod: { email: true, websocket: true } } as CreateAlertFormData)
      onCreated(alert); onClose()
    } catch {
      onCreated({
        _id: Date.now().toString(), ...data, isActive: true, isTriggered: false,
        currentPrice: data.targetPrice, notificationMethod: { email: true, websocket: true },
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      } as unknown as Alert)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.18 }}
        className="relative w-full max-w-md bg-white dark:bg-[#1A2540] border border-slate-200 dark:border-[var(--border-md)] rounded-2xl p-6 shadow-2xl z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[var(--text-1)]">Create Price Alert</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Symbol *</label>
              <input {...register('symbol')} placeholder="AAPL" className={inputCls} onChange={e => setValue('symbol', e.target.value.toUpperCase())} />
              {errors.symbol && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.symbol.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Asset Type</label>
              <select {...register('assetType')} className={inputCls + ' cursor-pointer'}>
                {['stock','crypto','forex','commodity','index'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Condition</label>
              <select {...register('condition')} className={inputCls + ' cursor-pointer'}>
                <option value="above">Price above</option>
                <option value="below">Price below</option>
                <option value="equals">Price equals</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Target Price *</label>
              <input type="number" step="0.01" placeholder="150.00" className={inputCls} {...register('targetPrice', { valueAsNumber: true })} />
              {errors.targetPrice && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.targetPrice.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelCls}>User ID *</label>
            <input {...register('userId')} placeholder="MongoDB ObjectID" className={inputCls} />
            {errors.userId && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.userId.message}</p>}
          </div>

          <div>
            <label className={labelCls}>Notes</label>
            <input {...register('notes')} placeholder="Optional…" className={inputCls} />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">Create Alert</Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
